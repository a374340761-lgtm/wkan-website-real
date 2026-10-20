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
