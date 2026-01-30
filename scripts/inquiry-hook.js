// Inquiry submit hook (Google Apps Script)
// - Keeps form logic decoupled (contact.js calls window.WK_INQUIRY_SUBMIT)
// - Sends application/x-www-form-urlencoded
// - Production-safe: throws on failed request

window.WK_INQUIRY_SUBMIT = async function (payload) {
  const ENDPOINT = "https://script.google.com/macros/s/AKfycbwLKD0KmUD1fa93ZV3fUzvb1vxOWQYp1N2iJO_QPZF3FxnOSrcpGBqlAN5kFMzUXm7E/exec";

  if (!ENDPOINT) {
    throw new Error("Inquiry submit endpoint not configured");
  }

  payload = payload || {};

  // Required by spec
  payload.pageUrl = window.location.href;

  // Back-compat for current payload shape from contact.js
  if (payload.target_market && !payload.market) payload.market = payload.target_market;
  if (payload.submitted_at && !payload.timestamp) payload.timestamp = payload.submitted_at;

  const body = new URLSearchParams(payload);

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body,
  });

  const text = await res.text();

  if (!res.ok || (text && text.toLowerCase().includes("error"))) {
    throw new Error(text || "Inquiry submission failed");
  }

  // contact.js expects an object with { ok: true }
  return { ok: true, text };
};
