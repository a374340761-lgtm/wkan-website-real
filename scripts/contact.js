// ===================== Contact / Get Quote (replaceable submit hook) =====================
// IMPORTANT:
// - This file should NOT hard-bind to EmailJS / Google Sheet / backend endpoints.
// - Keep the form structure and event listener, but leave submission as a replaceable hook.
// Production: inquiry-hook.js -> Google Apps Script -> Google Sheets.

function inquirySourcePage() {
  try {
    const page = new URL(window.location.href);
    const source = new URL(page.searchParams.get('source') || document.referrer || page.href, page.origin);
    if (source.origin !== page.origin) return '';
    const clean = new URL(source.pathname, page.origin);
    ['id', 'model', 'cat', 'open'].forEach((key) => {
      if (source.searchParams.has(key)) clean.searchParams.set(key, source.searchParams.get(key));
    });
    return clean.href;
  } catch { return ''; }
}

function buildInquiryPayload(form) {
  const get = (name) => {
    const el = form.elements && form.elements[name];
    const value = el && typeof el.value === 'string' ? el.value : '';
    return String(value || '').trim();
  };

  const page = new URL(window.location.href);
  const attribution = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((key) => {
    const value = page.searchParams.get(key);
    if (value) attribution[key] = value;
  });

  let landingPage = '';
  try {
    landingPage = sessionStorage.getItem('wk_landing_page') || '';
    if (!landingPage) {
      landingPage = window.location.href;
      sessionStorage.setItem('wk_landing_page', landingPage);
    }
  } catch (err) {
    landingPage = window.location.href;
  }

  const inquiryId = (() => {
    try {
      if (window.crypto && typeof window.crypto.randomUUID === 'function') {
        return window.crypto.randomUUID();
      }
    } catch (err) {
      /* Fall through to a collision-resistant client identifier. */
    }
    return `wk-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
  })();

  return {
    inquiry_id: inquiryId,
    idempotency_key: inquiryId,
    name: get('name'),
    email: get('email'),
    product: get('product'),
    quantity: get('quantity'),
    frame_material: get('frame_material'),
    fabric_printing: get('fabric_printing'),
    target_market: get('target_market'),
    deadline: get('deadline'),
    // Preserve the source even with an Apps Script using only the existing columns.
    message: [get('message'), inquirySourcePage() ? 'Product / source page: ' + inquirySourcePage() : ''].filter(Boolean).join('\n\n'),
    source_page: inquirySourcePage(),
    page_url: window.location.href,
    landing_page: landingPage,
    referrer: document.referrer || '',
    ...attribution,
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
  const resetBtn = form.querySelector('button[type="reset"]');
  let submitting = false;
  function message(en, zh) {
    return /^\/zh(?:\/|$)/.test(window.location.pathname) ? zh : en;
  }

  function prefillProductFromUrl() {
    try {
      const value = new URL(window.location.href).searchParams.get('product');
      if (!value) return;
      const productInput = form.elements && form.elements.product;
      if (productInput && !String(productInput.value || '').trim()) {
        productInput.value = value;
      }
    } catch (err) {
      /* Product-aware quote links are optional. */
    }
  }

  prefillProductFromUrl();

  function setMsg(text, ok = true) {
    if (!msgBox) return;
    msgBox.style.display = "block";
    msgBox.textContent = text;
    msgBox.style.color = ok ? "#1b7f3a" : "#b42318";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (submitting) return;

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

      submitting = true;
      form.setAttribute('aria-busy', 'true');
      if (resetBtn) resetBtn.disabled = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = message('Sending…', '提交中…');
      }

      const payload = buildInquiryPayload(form);
      const fd = toFormData(payload);
      const result = await submitInquiry(payload, fd);

      if (result && result.ok) {
        if (successBox) successBox.style.display = "block";
        setMsg(message('Your inquiry has been received. Our team will review your requirements and contact you by email. No automatic confirmation email is sent.', '询价已收到。我们的团队会审核需求并通过邮件联系您；系统暂不发送自动确认邮件。'), true);
        document.dispatchEvent(new CustomEvent('wk:inquiry-success', {
          detail: { inquiry_id: result.inquiry_id || payload.inquiry_id }
        }));
        form.reset();
        return;
      }

      setMsg(result && result.reason === 'rejected'
        ? message('Your inquiry was not accepted. Your details are still here. Please review them or contact us by email or WhatsApp.', '询价未被接受，已保留填写内容。请核对信息，或通过邮件、WhatsApp 联系我们。')
        : message('We could not confirm receipt. Your inquiry may already have arrived. Your details are still here; please contact us by email or WhatsApp before submitting again.', '暂时无法确认收件，询价可能已经送达。已保留填写内容；再次提交前，请通过邮件或 WhatsApp 联系我们确认。'), false);
    } catch (err) {
      setMsg(message('We could not confirm receipt. Your details are still here. Please contact us by email or WhatsApp before submitting again.', '暂时无法确认收件，已保留填写内容。再次提交前，请通过邮件或 WhatsApp 联系我们确认。'), false);
    } finally {
      submitting = false;
      form.setAttribute('aria-busy', 'false');
      if (resetBtn) resetBtn.disabled = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = message('Send Inquiry', '发送询价');
      }
    }
  });
});
