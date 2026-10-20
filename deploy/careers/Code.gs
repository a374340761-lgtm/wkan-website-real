// Full replacement for the supplied Code.gs. Keeps existing sheet names and headers.
const SUMMARY_SHEET = '候选人总览';
const ANSWERS_SHEET = '逐题答案';
const SPREADSHEET_ID = '1bgItskvigsm-EnPQSivljPL1ZVz7j5R_L0BqV9J_mLA';
const SUMMARY_HEADERS = [
  'submission_id', '提交时间', '姓名', '电话', '邮箱', '所在地',
  '相关经历', '可入职时间', '总分', '分项得分',
  '评估摘要', '面试时建议核实的风险点', '内部建议',
  '需人工复核', '写入状态'
];

const ANSWER_HEADERS = [
  'submission_id', '提交时间', '候选人姓名', '题目编号', '题目',
  '候选人答案', '得分', '满分', '评分依据', '评分维度', '需人工复核'
];

function doGet() {
  return HtmlService.createHtmlOutput(
    '<!doctype html><meta charset="utf-8"><p>招聘问卷数据接收端已就绪。</p>'
  );
}

function doPost(e) {
  let payload = {};
  let submissionId = '';
  let summarySheet = null;
  let summaryRow = 0;
  let lock = null;

  try {
    payload = parsePayload_(e);
    submissionId = String(payload.submissionId || '').trim();

    validateRecruitmentPayload_(payload);
    if (String(payload.website || '').trim()) throw new Error('无效提交');
    if (!payload.candidate || !String(payload.candidate.name || '').trim()) {
      throw new Error('缺少候选人姓名');
    }
    if (!payload.candidate.phone && !payload.candidate.email) {
      throw new Error('至少需要电话或邮箱');
    }
    if (!Array.isArray(payload.answers) || payload.answers.length === 0 || payload.answers.length > 30) {
      throw new Error('答案数据格式不正确');
    }

    lock = LockService.getScriptLock();
    lock.waitLock(15000);

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    if (!ss) throw new Error('找不到关联的 Google 表格');

    summarySheet = ensureSheet_(ss, SUMMARY_SHEET, SUMMARY_HEADERS);
    const answerSheet = ensureSheet_(ss, ANSWERS_SHEET, ANSWER_HEADERS);

    const existingRow = findSubmissionRow_(summarySheet, submissionId);
    if (existingRow) {
      const existingStatus = summarySheet
        .getRange(existingRow, SUMMARY_HEADERS.length)
        .getDisplayValue();

      if (existingStatus === '已完成' && verifyAnswerRows_(answerSheet, payload)) {
        return resultPage_(true, submissionId);
      }

      summaryRow = existingRow;
    } else {
      summaryRow = summarySheet.getLastRow() + 1;
    }

    const candidate = payload.candidate;
    const assessment = payload.assessment || {};

    const summaryValues = [
      submissionId,
      safeCell_(payload.submittedAt || new Date().toISOString()),
      safeCell_(candidate.name),
      safeCell_(candidate.phone),
      safeCell_(candidate.email),
      safeCell_(candidate.location),
      safeCell_(candidate.experience),
      safeCell_(candidate.availability),
      numberOrBlank_(assessment.totalScore),
      safeCell_(assessment.categoryScores || {}),
      safeCell_(assessment.summary),
      safeCell_(assessment.riskPoints || assessment.interviewRisks),
      safeCell_(assessment.recommendation),
      assessment.needsManualReview ? '是' : '否',
      '写入中'
    ];

    summarySheet
      .getRange(summaryRow, 1, 1, SUMMARY_HEADERS.length)
      .setValues([summaryValues]);

    // 如果同一提交编号重试，先清理之前可能留下的逐题记录。
    deleteSubmissionRows_(answerSheet, submissionId);

    const answerRows = payload.answers.map(function (answer) {
      return [
        submissionId,
        safeCell_(payload.submittedAt || new Date().toISOString()),
        safeCell_(candidate.name),
        safeCell_(answer.questionId || answer.id),
        safeCell_(answer.question || answer.questionText),
        safeCell_(answer.answer),
        numberOrBlank_(answer.score),
        numberOrBlank_(answer.maxScore),
        safeCell_(answer.rationale || answer.scoringBasis),
        safeCell_(answer.category || answer.dimension),
        answer.needsManualReview ? '是' : '否'
      ];
    });

    answerSheet
      .getRange(answerSheet.getLastRow() + 1, 1, answerRows.length, ANSWER_HEADERS.length)
      .setValues(answerRows);

    // Flush both sheets, then verify all question rows before marking complete.
    SpreadsheetApp.flush();
    if (!verifyAnswerRows_(answerSheet, payload)) throw new Error('逐题记录核对失败');

    summarySheet
      .getRange(summaryRow, SUMMARY_HEADERS.length)
      .setValue('已完成');

    SpreadsheetApp.flush();
    return resultPage_(true, submissionId);

  } catch (err) {
    // No applicant answers/contact details in execution logs.
    console.error('Recruitment write failed');

    if (summarySheet && summaryRow > 0) {
      try {
        summarySheet
          .getRange(summaryRow, SUMMARY_HEADERS.length)
          .setValue('写入失败');
        SpreadsheetApp.flush();
      } catch (ignored) {}
    }

    return resultPage_(false, submissionId);

  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}

function parsePayload_(e) {
  if (e && e.parameter && e.parameter.payload) {
    return JSON.parse(e.parameter.payload);
  }

  if (e && e.postData && e.postData.contents) {
    return JSON.parse(e.postData.contents);
  }

  throw new Error('没有收到问卷数据');
}

function ensureSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  } else {
    const actual = sheet.getRange(1, 1, 1, headers.length).getDisplayValues()[0];
    if (headers.some(function (header, index) { return actual[index] !== header; })) {
      throw new Error('现有表头与接收端不一致，未修改表头');
    }
  }

  return sheet;
}

function findSubmissionRow_(sheet, submissionId) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;

  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getDisplayValues();
  const index = ids.findIndex(function (row) {
    return row[0] === submissionId;
  });

  return index === -1 ? 0 : index + 2;
}

function deleteSubmissionRows_(sheet, submissionId) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getDisplayValues();
  const rowsToDelete = [];

  ids.forEach(function (row, index) {
    if (row[0] === submissionId) rowsToDelete.push(index + 2);
  });

  rowsToDelete.reverse().forEach(function (rowNumber) {
    sheet.deleteRow(rowNumber);
  });
}

function numberOrBlank_(value) {
  if (value === '' || value === null || value === undefined) return '';
  const number = Number(value);
  return Number.isFinite(number) ? number : '';
}

function safeCell_(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number' && Number.isFinite(value)) return value;

  let text = typeof value === 'object' ? JSON.stringify(value) : String(value);
  if (/^[\s\u0000-\u001f]*[=+\-@]/.test(text)) text = "'" + text;
  return text;
}

function validateRecruitmentPayload_(p) {
  if (!p || typeof p !== 'object' || Array.isArray(p)) throw new Error('无效请求');
  if (JSON.stringify(p).length > 100000) throw new Error('请求过大');
  if (!/^[A-Za-z0-9_-]{8,128}$/.test(String(p.submissionId || ''))) throw new Error('无效提交编号');
  if (!p.submittedAt || !Number.isFinite(Date.parse(p.submittedAt))) throw new Error('无效时间');
  if (String(p.website || '').trim()) throw new Error('无效提交');
  const c = p.candidate;
  if (!c || typeof c !== 'object') throw new Error('缺少资料');
  ['name','phone','email','location','availability','experience'].forEach(function (key) {
    if (typeof c[key] !== 'string' || !c[key].trim() || c[key].length > (key === 'experience' ? 3000 : 254)) throw new Error('无效资料');
  });
  if (!/^[+\d() .-]{7,30}$/.test(c.phone) || (c.phone.match(/\d/g) || []).length < 7) throw new Error('无效电话');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) throw new Error('无效邮箱');
  if (!Array.isArray(p.answers) || p.answers.length !== 13) throw new Error('问卷不完整');
  const plan = [
    ['外贸兴趣',10],['长期发展意愿',20],['收入预期与一线基础工作',10],
    ['收入预期与一线基础工作',10],['主动学习、自驱与 AI 学习应用',8],
    ['主动学习、自驱与 AI 学习应用',7],['责任心与执行力',5],['责任心与执行力',5],
    ['责任心与执行力',5],['业务板块适配、直接汇报与协作',5],
    ['业务板块适配、直接汇报与协作',5],['主动了解公司产品',5],['基础英文与岗位适配',5]
  ];
  const seen = {}, totals = {};
  p.answers.forEach(function (a) {
    if (!a || !/^q(?:[1-9]|1[0-3])$/.test(a.questionId) || seen[a.questionId]) throw new Error('无效题号');
    seen[a.questionId] = true;
    const definition = plan[Number(a.questionId.slice(1))-1];
    if (a.category !== definition[0] || a.maxScore !== definition[1] || !Number.isFinite(a.score) || a.score < 0 || a.score > a.maxScore) throw new Error('无效题目分值');
    ['question','answer','rationale'].forEach(function (key) {
      if (typeof a[key] !== 'string' || !a[key].trim() || a[key].length > 12000) throw new Error('缺少答案或依据');
    });
    // All scores, including choices, assist manual review only.
    a.needsManualReview = true;
    totals[a.category] = (totals[a.category] || 0) + a.score;
  });
  const assessment = p.assessment;
  if (!assessment || !assessment.categoryScores || typeof assessment.categoryScores !== 'object' || Array.isArray(assessment.categoryScores)) throw new Error('缺少评估');
  const total = Object.keys(totals).reduce(function (sum,key) { return sum + totals[key]; },0);
  if (assessment.totalScore !== total || total < 0 || total > 100 || Object.keys(assessment.categoryScores).length !== Object.keys(totals).length) throw new Error('总分不一致');
  Object.keys(totals).forEach(function (key) {
    if (assessment.categoryScores[key] !== totals[key]) throw new Error('维度分不一致');
  });
  if (!Array.isArray(assessment.riskPoints) || assessment.riskPoints.some(function (v) { return typeof v !== 'string'; })) throw new Error('缺少人工核实事项');
  ['summary','recommendation'].forEach(function (key) {
    if (typeof assessment[key] !== 'string' || !assessment[key].trim()) throw new Error('缺少评估说明');
  });
  assessment.needsManualReview = true;
}

function verifyAnswerRows_(sheet, payload) {
  const last = sheet.getLastRow();
  if (last < 2) return false;
  const rows = sheet.getRange(2, 1, last-1, ANSWER_HEADERS.length).getValues().filter(function (row) {
    return String(row[0]) === payload.submissionId;
  });
  if (rows.length !== payload.answers.length) return false;
  const seen = {};
  return rows.every(function (row) {
    const id = String(row[3]);
    if (seen[id]) return false;
    seen[id] = true;
    const answer = payload.answers.find(function (a) { return a.questionId === id; });
    return !!answer && row[6] === answer.score && row[7] === answer.maxScore && String(row[9]) === answer.category && !!String(row[5]).trim() && !!String(row[8]).trim();
  });
}

function resultPage_(ok, submissionId) {
  return recruitmentReply_(submissionId, ok);
}

/** Replace ONLY the existing response HTML helper, keeping doPost's validation,
 * SPREADSHEET_ID, private workbook, headers and two-sheet save logic unchanged.
 * Call recruitmentReply_(id, true) ONLY after both writes/flush have succeeded.
 * On validation/write errors return recruitmentReply_(id, false).
 */
function recruitmentReply_(submissionId, ok) {
  var result = {
    type: 'recruitment-submit-result',
    requestId: String(submissionId || ''),
    ok: ok === true
  };
  // JSON is embedded as JS, not manually backslash-escaped HTML.
  var json = JSON.stringify(result)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
  var source = '(function(){var result=' + json + ';' +
    'var targets=["https://www.waikwantent.com","https://waikwantent.com"];' +
    'var ancestor=window.parent;' +
    'for(var depth=0;depth<8;depth++){' +
      'for(var j=0;j<targets.length;j++){ancestor.postMessage(result,targets[j]);}' +
      'if(ancestor===ancestor.parent)break;ancestor=ancestor.parent;' +
    '}})();';
  return HtmlService.createHtmlOutput(
    '<!doctype html><html><head><meta charset="utf-8"></head><body>' +
    '<p>提交处理结束，请以招聘页面的确认提示为准。</p>' +
    '<script>' + source + '</script></body></html>'
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
/* Existing doPost integration (illustration; do not add a second doPost):
 * try {
 *   ...validate e.parameter.payload...
 *   ...use SPREADSHEET_ID and save both sheets...
 *   SpreadsheetApp.flush();
 *   return recruitmentReply_(payload.submissionId, true);
 * } catch (error) {
 *   return recruitmentReply_(payload && payload.submissionId, false);
 * }
 * Keep existing submissionId deduplication. A retry uses the same ID.
 * For localhost verification only, temporarily add the exact localhost origin
 * to targets; do not enable wildcard '*' or ship localhost targets permanently.
 */
