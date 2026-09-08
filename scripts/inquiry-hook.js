// Inquiry submit hook (Google Apps Script)
// - Keeps form logic decoupled (contact.js calls window.WK_INQUIRY_SUBMIT)
// - Sends application/x-www-form-urlencoded
// - Production-safe: throws on failed request

window.WK_INQUIRY_SUBMIT = async function (payload) {
  const ENDPOINT = "https://script.google.com/macros/s/AKfycbwLKD0KmUD1fa93ZV3fUzvb1vxOWQYp1N2iJO_QPZF3FxnOSrcpGBqlAN5kFMzUXm7E/exec";

  if (!ENDPOINT) {
    throw new Error("Inquiry submit endpoint not configured");
  }

  payload = Object.assign({}, payload);

  // Required by spec
  payload.pageUrl = window.location.href;

  // Back-compat for current payload shape from contact.js
  if (payload.target_market && !payload.market) payload.market = payload.target_market;
  if (payload.submitted_at && !payload.timestamp) payload.timestamp = payload.submitted_at;

  const body = new URLSearchParams(payload);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body,
    signal: controller.signal,
  });

  const text = await res.text();

  if (!res.ok) return { ok: false, reason: 'unconfirmed' };
  let response;
  try { response = JSON.parse(text); } catch { response = null; }
  // Verify the deployed acknowledgement before release; see INQUIRY-OPERATIONS.md.
  if (response && typeof response === 'object') {
    if (response.ok === false || response.success === false || response.error ||
        ['error', 'failed', 'failure'].includes(response.result) ||
        ['error', 'failed', 'failure'].includes(response.status)) {
      return { ok: false, reason: 'rejected' };
    }
    if (response.ok === true || response.success === true ||
        response.result === 'success' || response.status === 'success') return { ok: true };
  }
  if (/^(ok|success)$/i.test(text.trim())) return { ok: true };
  return { ok: false, reason: 'unconfirmed' };
  } catch (error) {
    // A network failure can happen AFTER saving. Never retry automatically.
    return { ok: false, reason: 'unconfirmed' };
  } finally {
    clearTimeout(timeout);
  }
};
