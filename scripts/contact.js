// ===================== Contact / Get Quote (replaceable submit hook) =====================
// IMPORTANT:
// - This file should NOT hard-bind to EmailJS / Google Sheet / backend endpoints.
// - Keep the form structure and event listener, but leave submission as a replaceable hook.
// TODO: Connect to Google Sheet or Email service (via backend or Apps Script)

function buildInquiryPayload(form) {
  const get = (name) => {
    const el = form.elements && form.elements[name];
    const value = el && typeof el.value === 'string' ? el.value : '';
    return String(value || '').trim();
  };

  return {
    name: get('name'),
    email: get('email'),
    product: get('product'),
    quantity: get('quantity'),
    target_market: get('target_market'),
    message: get('message'),
    page_url: window.location.href,
    user_agent: navigator.userAgent,
    submitted_at: new Date().toISOString(),
  };
}

function toFormData(payload) {
  const fd = new FormData();
  Object.keys(payload || {}).forEach((k) => {
    const v = payload[k];
    if (v === undefined || v === null) return;
    fd.set(String(k), String(v));
  });
  return fd;
}

async function submitInquiry(payload, fd) {
  // Optional integration hook.
  // - Preferred: provide window.WK_INQUIRY_SUBMIT(payload, fd) externally.
  // - This keeps business logic replaceable and avoids hard-binding here.
  if (typeof window.WK_INQUIRY_SUBMIT === 'function') {
    return await window.WK_INQUIRY_SUBMIT(payload, fd);
  }
  return { ok: false, reason: 'hook_missing' };
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("getQuoteForm");
  if (!form) return;

  const submitBtn = document.getElementById("contactSubmitBtn");
  const successBox = document.getElementById("contactSuccess");
  const msgBox = document.getElementById("formMessage");

  function setMsg(text, ok = true) {
    if (!msgBox) return;
    msgBox.style.display = "block";
    msgBox.textContent = text;
    msgBox.style.color = ok ? "#1b7f3a" : "#b42318";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (successBox) successBox.style.display = "none";
    if (msgBox) msgBox.style.display = "none";

    try {
      // Use native constraints, but keep custom handling (form has novalidate).
      if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
        if (typeof form.reportValidity === 'function') form.reportValidity();
        return;
      }

      // Simple spam honeypot
      const honey = form.elements && form.elements['website'] ? String(form.elements['website'].value || '') : '';
      if (honey.trim()) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = (window.wkI18n && typeof window.wkI18n.t === 'function')
          ? window.wkI18n.t('inquiry_form_sending')
          : '';
      }

      const payload = buildInquiryPayload(form);
      const fd = toFormData(payload);
      const result = await submitInquiry(payload, fd);

      if (result && result.ok) {
        if (successBox) successBox.style.display = "block";
        setMsg((window.wkI18n && typeof window.wkI18n.t === 'function') ? window.wkI18n.t('inquiry_form_success') : '', true);
        form.reset();
        return;
      }

      // Not connected yet: keep UI production-ready, but do not pretend it was submitted.
      const pending = (window.wkI18n && typeof window.wkI18n.t === 'function')
        ? window.wkI18n.t('inquiry_form_unconfigured')
        : '';
      setMsg(pending, false);
    } catch (err) {
      const base = (window.wkI18n && typeof window.wkI18n.t === 'function') ? window.wkI18n.t('inquiry_form_failed') : '';
      const detail = (err && (err.message || err)) ? ` ${err.message || err}` : '';
      const msg = `${base}${detail}`.trim();
      setMsg(msg, false);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = (window.wkI18n && typeof window.wkI18n.t === 'function')
          ? window.wkI18n.t('inquiry_form_submit')
          : '';
      }
    }
  });
});
