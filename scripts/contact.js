// ===================== Contact Form -> Google Sheets (Apps Script) =====================

// ✅ 这里必须是 Apps Script Web App 的 /exec URL
const SHEETS_WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbzBZ5unnSti-8W0isH-J9s_5Y95A8miiF773amFt_oNM4lzsgov_QmIG0kcq3e7XaZ5/exec";

function buildFormData(form) {
  const fd = new FormData(form);

  // 补充系统字段（这些在你的 Apps Script HEADERS 里有）
  fd.set("time", new Date().toISOString());
  fd.set("page_url", window.location.href);
  fd.set("user_agent", navigator.userAgent);

  return fd;
}

async function postToGoogleSheet(fd) {
  // no-cors 下前端读不到返回值，但写入是 OK 的
  await fetch(SHEETS_WEBAPP_URL, {
    method: "POST",
    mode: "no-cors",
    body: fd,
  });
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
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      const fd = buildFormData(form);

      // ✅ 调试：确认这里能看到 name/email/product 都有值
      console.log("FINAL PAYLOAD:", Object.fromEntries(fd.entries()));

      await postToGoogleSheet(fd);

      if (successBox) successBox.style.display = "block";
      setMsg("✅ Sent successfully. We will reply within 24 hours.", true);

      form.reset();
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to send. " + (err.message || err), false);
      alert("❌ Failed to send. " + (err.message || err));
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Inquiry";
      }
    }
  });
});
