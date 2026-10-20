/* Chinese-first recruitment questionnaire. No assessment is rendered to applicants; no applicant analytics. */
(function () {
  'use strict';
  const form = document.getElementById('careersForm');
  if (!form) return;
  const status = document.getElementById('careersStatus');
  const submit = document.getElementById('careersSubmit');
  const questions = document.getElementById('careersQuestions');
  const progress = document.getElementById('careersProgress');
  let schema, available = false, busy = false, lastContent = '', identifier = '';
  let rules;
  const endpoint = String(window.WK_CAREERS_SCRIPT_URL || '');
  const validEndpoint = /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(endpoint);
  let submittedAt = '';
  const draftKey = 'wk-careers-draft-v1';
  const draftLifetime = 24 * 60 * 60 * 1000;
  let draftReady = false;
  function saveDraft() {
    if (!draftReady || form.hidden) return;
    const note = document.getElementById('careersDraftStatus');
    try {
      const entries = [...new FormData(form)].filter(([name]) => !['consent', 'website'].includes(name));
      sessionStorage.setItem(draftKey, JSON.stringify({ version: schema.version, savedAt: Date.now(), entries,
        identifier, lastContent, submittedAt }));
      if (note) note.textContent = '草稿已保存在当前标签页，刷新可恢复。关闭标签页后不再保留，草稿最长保留 24 小时；提交成功后自动清除。';
    } catch (_) {
      if (note) note.textContent = '浏览器未能保存草稿；请暂勿刷新或关闭此页，以免丢失填写内容。';
    }
  }
  function restoreDraft() {
    try {
      const draft = JSON.parse(sessionStorage.getItem(draftKey) || 'null');
      if (!draft) return;
      if (draft.version !== schema.version || !Number.isFinite(draft.savedAt) || Date.now() - draft.savedAt > draftLifetime || !Array.isArray(draft.entries)) {
        sessionStorage.removeItem(draftKey);
        return;
      }
      const values = new Map();
      draft.entries.forEach(entry => {
        if (!Array.isArray(entry) || typeof entry[0] !== 'string' || typeof entry[1] !== 'string') return;
        if (!values.has(entry[0])) values.set(entry[0], []);
        values.get(entry[0]).push(entry[1]);
      });
      [...form.elements].forEach(input => {
        if (!input.name || ['consent', 'website'].includes(input.name)) return;
        const saved = values.get(input.name) || [];
        if (input.type === 'checkbox') input.checked = saved.includes(input.value);
        else if (saved.length) input.value = saved[0].slice(0, input.maxLength > 0 ? input.maxLength : 12000);
      });
      form.elements.consent.checked = false;
      identifier = typeof draft.identifier === 'string' ? draft.identifier : '';
      lastContent = identifier && typeof draft.lastContent === 'string' ? draft.lastContent : '';
      submittedAt = typeof draft.submittedAt === 'string' ? draft.submittedAt : '';
    } catch (_) { /* Storage may be disabled. The form still works. */ }
  }
  const node = (tag, text, attrs = {}) => {
    const el = document.createElement(tag);
    if (text) el.textContent = text;
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    return el;
  };
  function show(message, kind = 'notice') {
    status.textContent = message;
    status.dataset.state = kind;
  }
  function render() {
    schema.questions.forEach((q, index) => {
      const group = node('fieldset', '', { class: 'careers-question', id: q.id });
      group.append(node('legend', `${index + 1}. ${q.title}`));
      if (q.hint) group.append(node('p', q.hint, { class: 'careers-hint', id: q.id + '-hint' }));
      q.fields.forEach(field => {
        const id = q.id + '-' + field.key;
        const wrap = node('div', '', { class: 'careers-field' });
        if (field.type === 'checkboxes') {
          const nested = node('fieldset', '', { class: 'careers-choices', 'data-checkbox-group': id });
          nested.append(node('legend', field.label));
          field.options.forEach(option => {
            const label = node('label', '', { class: 'careers-check' });
            label.append(node('input', '', { type: 'checkbox', name: id, value: option.value }), document.createTextNode(option.label));
            nested.append(label);
          });
          wrap.append(nested);
        } else {
          wrap.append(node('label', field.label, { for: id }));
          const input = node(field.type === 'select' ? 'select' : 'textarea', '', { id, name: id, required: '', 'aria-describedby': q.id + '-hint' });
          if (!q.hint) input.removeAttribute('aria-describedby');
          if (field.type === 'select') {
            input.append(node('option', '请选择最接近真实情况的一项', { value: '' }));
            field.options.forEach(option => input.append(node('option', option.label, { value: option.value })));
          } else {
            input.maxLength = field.maxLength;
            input.rows = field.maxLength > 200 ? 3 : 2;
          }
          wrap.append(input);
        }
        if (field.hint) wrap.append(node('p', field.hint, { class: 'careers-hint' }));
        group.append(wrap);
      });
      questions.append(group);
    });
    updateProgress();
  }
  function checkboxValidation() {
    form.querySelectorAll('[data-checkbox-group]').forEach(group => {
      const first = group.querySelector('input');
      first.setCustomValidity(group.querySelector('input:checked') ? '' : '请至少选择一项。');
    });
  }
  function updateProgress() {
    form.querySelectorAll('input[required]:not([type=checkbox]), textarea[required]').forEach(input => {
      input.setCustomValidity(input.value && !input.value.trim() ? '请填写有效内容，不能只输入空格。' : '');
    });
    const phone = form.elements.phone;
    const phoneValid = /^[+\d() .-]{7,30}$/.test(phone.value) && (phone.value.match(/\d/g) || []).length >= 7;
    phone.setCustomValidity(phone.value && !phoneValid ? '请填写有效联系电话。' : '');
    if (!schema) return;
    const done = schema.questions.filter(q => q.fields.every(field => {
      const controls = [...form.querySelectorAll(`[name="${q.id}-${field.key}"]`)];
      return field.type === 'checkboxes' ? controls.some(c => c.checked) : controls[0].value.trim();
    })).length;
    progress.textContent = `已填写 ${done} / ${schema.questions.length} 题 · 建议每个简答栏用一两句话说明`;
    checkboxValidation();
    saveDraft();
  }
  function payload() {
    const contact = {};
    ['name', 'phone', 'email', 'location', 'availability', 'experience'].forEach(key => { contact[key] = form.elements[key].value.trim(); });
    const wechat = form.elements.wechat.value.trim();
    if (wechat) contact.wechat = wechat;
    const answers = {};
    schema.questions.forEach(q => {
      answers[q.id] = {};
      q.fields.forEach(field => {
        const fields = [...form.querySelectorAll(`[name="${q.id}-${field.key}"]`)];
        answers[q.id][field.key] = field.type === 'checkboxes' ? fields.filter(f => f.checked).map(f => f.value) : fields[0].value.trim();
      });
    });
    const content = JSON.stringify({ contact, answers });
    if (content !== lastContent) {
      identifier = crypto.randomUUID();
      submittedAt = new Date().toISOString();
      lastContent = content;
    }
    return { version: schema.version, submission_id: identifier, consent: form.elements.consent.checked,
      website: form.elements.website.value, submittedAt, contact, answers };
  }
  form.addEventListener('input', updateProgress);
  form.addEventListener('change', updateProgress);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy) return;
    checkboxValidation();
    if (!form.reportValidity()) return;
    if (!available) {
      show('在线投递尚未开通，申请未提交。请联系 yishu@waikwantent.com 咨询招聘。', 'unconfigured');
      return;
    }
    busy = true;
    submit.disabled = true;
    submit.textContent = '正在提交，请勿重复点击…';
    show('正在提交，等待 Google 表格写入确认，请保持网络连接…', 'pending');
    try {
      const data = payload();
      saveDraft();
      if (data.website) throw new Error('提交未成功，请检查填写内容。');
      const report = window.WK_assessCareers(data, rules);
      await postApplication(report);
      // Only a matching confirmation from this submission iframe means success.
      show('提交成功', 'success');
      try { sessionStorage.removeItem(draftKey); } catch (_) { /* No stored draft. */ }
      form.hidden = true;
      progress.hidden = true;
      status.focus({ preventScroll: true });
      status.scrollIntoView({ block: 'center' });
    } catch (error) {
      show(error.message || '提交未成功，内容已保留，请检查 VPN 和网络后重试。', 'error');
      submit.disabled = false;
      submit.textContent = '确认资料并提交申请';
      status.focus({ preventScroll: true });
      status.scrollIntoView({ block: 'center' });
    } finally {
      busy = false;
    }
  });
  function postApplication(report) {
    return new Promise((resolve, reject) => {
      const iframe = document.createElement('iframe');
      iframe.name = 'careers_' + crypto.randomUUID().replace(/-/g, '');
      iframe.hidden = true;
      iframe.title = '招聘申请提交回执';
      iframe.referrerPolicy = 'no-referrer';
      iframe.src = '/careers-submit-bridge.html?v=20261020-sheets-r2';
      let timer, sent = false;
      const cleanup = () => {clearTimeout(timer);window.removeEventListener('message',receive);iframe.remove();};
      function receive(event) {
        const value = event.data;
        if (event.source !== iframe.contentWindow || event.origin !== location.origin || !value) return;
        if (value.type === 'recruitment-bridge-ready' && !sent) {
          sent = true;
          iframe.contentWindow.postMessage({ type: 'recruitment-bridge-submit', payload: report }, location.origin);
          return;
        }
        if (value.type !== 'recruitment-submit-result' || value.requestId !== report.submissionId || typeof value.ok !== 'boolean') return;
        cleanup();
        if (value.ok === true) resolve();
        else reject(new Error('写入未成功，填写内容已保留。请检查 VPN 和网络后重试，或联系招聘负责人核实。'));
      }
      window.addEventListener('message', receive);
      timer = setTimeout(() => {cleanup();reject(new Error('提交超时，尚未收到写入确认。内容已保留，请检查 VPN 和网络；重试会沿用同一提交编号，请勿刷新页面。'));}, 60000);
      document.body.append(iframe);
    });
  }
  async function init() {
    try {
      const response = await fetch('/data/careers-questionnaire.json?v=20261020', { cache: 'no-cache' });
      if (!response.ok) throw new Error('问卷加载失败，请刷新页面。');
      schema = await response.json();
      render();
      restoreDraft();
      draftReady = true;
      updateProgress();
      const scoringResponse = await fetch('/data/careers-scoring-rules.json?v=20261020-sheets-r2', { cache: 'no-cache' });
      if (!scoringResponse.ok) throw new Error('问卷配置加载失败，请刷新。');
      rules = await scoringResponse.json();
      available = validEndpoint && rules.version === schema.version && typeof window.WK_assessCareers === 'function';
      if (available) {
        submit.disabled = false;
        submit.textContent = '确认资料并提交申请';
        show('请打开 VPN 或确保可访问 Google，填写并同意隐私说明。只有收到表格写入确认才显示提交成功。');
      } else {
        show('在线投递配置尚未就绪，当前无法提交。请联系 yishu@waikwantent.com。', 'unconfigured');
      }
    } catch (error) { show(error.message || '问卷暂时无法加载，请刷新页面。', 'error'); }
  }
  init();
})();
