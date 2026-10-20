"""WSGI recruitment API. Run locally: python -m careers_backend.app --serve-static.

Production entry: careers_backend.app:application (Gunicorn behind HTTPS).
Only a positive SMTP receipt produces an ok response. No real credentials or
candidate answers are written to repository files, application logs or a DB.
"""
import argparse
from contextlib import contextmanager
import hashlib
import json
import mimetypes
import os
from pathlib import Path
import re
import smtplib
import sqlite3
import ssl
import threading
import time
from urllib.parse import unquote
from wsgiref.simple_server import make_server
from .questionnaire import VERSION
from .validation import validate_application, InvalidApplication
from .reporting import build_message, REPORT_TO

ROOT = Path(__file__).resolve().parent.parent
MAX_BODY = 65536


class Settings:
    def __init__(self, environ=None):
        env = os.environ if environ is None else environ
        self.host = env.get("SMTP_HOST", "")
        self.port = env.get("SMTP_PORT", "587")
        self.user = env.get("SMTP_USERNAME", "")
        self.password = env.get("SMTP_PASSWORD", "")
        self.sender = env.get("SMTP_FROM", "")
        self.security = env.get("SMTP_SECURITY", "starttls")
        self.origins = {v.strip().rstrip("/") for v in env.get("CAREERS_ALLOWED_ORIGINS", "https://www.waikwantent.com").split(",") if v.strip()}
        self.db_path = env.get("CAREERS_DB_PATH", str(Path.home() / ".waikwan-careers" / "receipts.sqlite3"))
        self.serve_static = env.get("CAREERS_SERVE_STATIC") == "1"

    @property
    def configured(self):
        return bool(self.host and self.user and self.password and
                    re.fullmatch(r"[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+", self.sender) and
                    self.security in {"starttls", "ssl"} and self.port.isdigit() and
                    1 <= int(self.port) <= 65535 and self.origins and "*" not in self.origins)


def send_report(payload, settings):
    message = build_message(payload, settings.sender)
    smtp_class = smtplib.SMTP_SSL if settings.security == "ssl" else smtplib.SMTP
    kwargs = {"timeout": 12}
    if settings.security == "ssl":
        kwargs["context"] = ssl.create_default_context()
    with smtp_class(settings.host, int(settings.port), **kwargs) as smtp:
        if settings.security == "starttls":
            smtp.ehlo()
            smtp.starttls(context=ssl.create_default_context())
            smtp.ehlo()
        smtp.login(settings.user, settings.password)
        refused = smtp.send_message(message, from_addr=settings.sender, to_addrs=[REPORT_TO])
        if refused:
            raise smtplib.SMTPRecipientsRefused(refused)


class Receipts:
    """Idempotency metadata only; no contact details, answers or reports."""
    def __init__(self, path):
        self.path = Path(path)

    @contextmanager
    def connect(self):
        self.path.parent.mkdir(parents=True, exist_ok=True)
        connection = sqlite3.connect(self.path, timeout=10)
        connection.execute("CREATE TABLE IF NOT EXISTS receipts (id TEXT PRIMARY KEY, digest TEXT NOT NULL, state TEXT NOT NULL, created REAL NOT NULL)")
        try:
            with connection:
                yield connection
        finally:
            connection.close()

    def claim(self, identifier, digest):
        with self.connect() as db:
            db.execute("BEGIN IMMEDIATE")
            db.execute("DELETE FROM receipts WHERE created < ?", (time.time() - 30 * 86400,))
            row = db.execute("SELECT digest,state FROM receipts WHERE id=?", (identifier,)).fetchone()
            if row:
                return row[1] if row[0] == digest else "conflict"
            db.execute("INSERT INTO receipts VALUES (?,?,?,?)", (identifier, digest, "pending", time.time()))
            return "new"

    def mark(self, identifier, state):
        with self.connect() as db:
            db.execute("UPDATE receipts SET state=? WHERE id=?", (state, identifier))


class RecruitmentApplication:
    def __init__(self, settings=None, sender=send_report):
        self.settings = settings or Settings()
        self.sender = sender
        self.receipts = Receipts(self.settings.db_path)
        self.rate_lock = threading.Lock()
        self.requests = {}

    def response(self, start, code, body, origin=""):
        raw = b"" if code == 204 else json.dumps(body, ensure_ascii=False).encode("utf-8")
        headers = [("Content-Type", "application/json; charset=utf-8"), ("Content-Length", str(len(raw))),
                   ("Cache-Control", "no-store"), ("X-Content-Type-Options", "nosniff"), ("Vary", "Origin")]
        if origin in self.settings.origins:
            headers += [("Access-Control-Allow-Origin", origin), ("Access-Control-Allow-Methods", "GET, POST, OPTIONS"),
                        ("Access-Control-Allow-Headers", "Content-Type")]
        start(f"{code} " + {200: "OK", 204: "No Content", 400: "Bad Request", 403: "Forbidden", 404: "Not Found", 405: "Method Not Allowed", 409: "Conflict", 413: "Payload Too Large", 415: "Unsupported Media Type", 429: "Too Many Requests", 500: "Internal Server Error", 503: "Service Unavailable"}[code], headers)
        return [raw]

    def __call__(self, environ, start):
        origin = environ.get("HTTP_ORIGIN", "").rstrip("/")
        try:
            return self.handle(environ, start, origin)
        except Exception:
            # Deliberately no exception/body logging: candidates' details are private.
            return self.response(start, 500, {"ok": False, "error": "提交暂时无法确认，请保留答案并联系招聘负责人，不要连续重复提交。"}, origin)

    def handle(self, env, start, origin):
        path, method = env.get("PATH_INFO", ""), env.get("REQUEST_METHOD", "GET")
        if path.startswith("/api/careers/"):
            if origin and origin not in self.settings.origins:
                return self.response(start, 403, {"ok": False, "error": "来源未授权。"})
            if method == "OPTIONS":
                return self.response(start, 204, {}, origin)
            if path == "/api/careers/status" and method == "GET":
                return self.response(start, 200, {"version": VERSION, "accepting_applications": self.settings.configured}, origin)
            if path != "/api/careers/applications":
                return self.response(start, 404, {"ok": False, "error": "接口不存在。"}, origin)
            if method != "POST":
                return self.response(start, 405, {"ok": False, "error": "请使用提交表单。"}, origin)
            if origin not in self.settings.origins:
                return self.response(start, 403, {"ok": False, "error": "来源未授权。"})
            if not self.settings.configured:
                return self.response(start, 503, {"ok": False, "error": "在线投递尚未开通，未提交申请。请联系招聘负责人。"}, origin)
            if env.get("CONTENT_TYPE", "").split(";")[0].strip() != "application/json":
                return self.response(start, 415, {"ok": False, "error": "表单格式错误。"}, origin)
            try:
                length = int(env.get("CONTENT_LENGTH", "0"))
            except ValueError:
                length = 0
            if not 0 < length <= MAX_BODY:
                return self.response(start, 413, {"ok": False, "error": "申请内容过长或为空。"}, origin)
            now = time.time()
            ip = env.get("REMOTE_ADDR", "unknown")  # Do not trust a client-supplied X-Forwarded-For.
            with self.rate_lock:
                self.requests = {key: stamps for key, stamps in self.requests.items() if stamps and stamps[-1] > now - 3600}
                stamps = [t for t in self.requests.get(ip, []) if t > now - 3600]
                if len(stamps) >= 20:
                    return self.response(start, 429, {"ok": False, "error": "提交过于频繁，请稍后再试。"}, origin)
                self.requests[ip] = stamps + [now]
            try:
                payload = validate_application(json.loads(env["wsgi.input"].read(length)))
            except (InvalidApplication, json.JSONDecodeError, UnicodeDecodeError) as error:
                message = str(error) if isinstance(error, InvalidApplication) else "申请格式错误。"
                return self.response(start, 400, {"ok": False, "error": message}, origin)
            identifier = payload["submission_id"]
            digest = hashlib.sha256(json.dumps(payload, sort_keys=True, ensure_ascii=False).encode()).hexdigest()
            state = self.receipts.claim(identifier, digest)
            if state == "sent":
                return self.response(start, 200, {"ok": True, "submission_id": identifier}, origin)
            if state != "new":
                return self.response(start, 409, {"ok": False, "error": "该次提交正在处理或收件状态待确认，请联系负责人核实后再提交。"}, origin)
            try:
                self.sender(payload, self.settings)
            except Exception:
                # A network failure after SMTP DATA can be ambiguous; don't resend automatically.
                self.receipts.mark(identifier, "unconfirmed")
                return self.response(start, 503, {"ok": False, "error": "邮件发送未能确认，页面未标记提交成功。请保留答案并联系负责人核实，不要连续重复提交。"}, origin)
            self.receipts.mark(identifier, "sent")
            return self.response(start, 200, {"ok": True, "submission_id": identifier}, origin)
        if self.settings.serve_static and method == "GET":
            return self.static(path, start)
        return self.response(start, 404, {"ok": False, "error": "接口不存在。"}, origin)

    def static(self, path, start):
        relative = unquote(path).lstrip("/") or "careers.html"
        target = (ROOT / relative).resolve()
        allowed = target.is_relative_to(ROOT) and not any(part.startswith(".") for part in Path(relative).parts)
        allowed = allowed and (Path(relative).parts[0] in {"styles", "scripts", "images", "data", "zh", "products", "collections", "news", "seo"} or (len(Path(relative).parts) == 1 and target.suffix in {".html", ".svg", ".webmanifest", ".pdf"}))
        if not allowed or not target.is_file():
            return self.response(start, 404, {"ok": False, "error": "文件不存在。"})
        raw = target.read_bytes()
        mime = mimetypes.guess_type(str(target))[0] or "application/octet-stream"
        if target.suffix in {".html", ".js", ".css", ".json"}:
            mime += "; charset=utf-8"
        start("200 OK", [("Content-Type", mime), ("Content-Length", str(len(raw))), ("X-Content-Type-Options", "nosniff")])
        return [raw]


application = RecruitmentApplication()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--serve-static", action="store_true")
    args = parser.parse_args()
    if args.serve_static:
        os.environ["CAREERS_SERVE_STATIC"] = "1"
        os.environ.setdefault("CAREERS_ALLOWED_ORIGINS", f"http://localhost:{args.port},http://127.0.0.1:{args.port}")
    print(f"Recruitment service: http://{args.host}:{args.port}/careers.html (SMTP {'configured' if Settings().configured else 'not configured; submissions disabled'})")
    with make_server(args.host, args.port, RecruitmentApplication()) as server:
        server.serve_forever()
