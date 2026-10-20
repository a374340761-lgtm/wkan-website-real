"""Isolated local browser fixture. Fake SMTP only; not a production entry."""
import json
import os
from pathlib import Path
import sys
from wsgiref.simple_server import make_server, WSGIRequestHandler
from .app import RecruitmentApplication, Settings
from .reporting import build_message


if __name__ == "__main__":
    mode = sys.argv[1]
    if mode not in {"closed", "success", "failure"}:
        raise SystemExit("unknown fixture mode")
    path = Path(__file__).parent / f".careers-test-browser-{os.getpid()}.sqlite3"
    settings = Settings({"CAREERS_SERVE_STATIC": "1", "CAREERS_DB_PATH": str(path),
                         "SMTP_HOST": "test.invalid", "SMTP_USERNAME": "FAKE", "SMTP_PASSWORD": "FAKE-TEST-ONLY" if mode != "closed" else "",
                         "SMTP_FROM": "test@example.test"})
    accepted = []
    def fake_smtp(payload, config):
        message = build_message(payload, config.sender)
        if mode == "failure":
            raise OSError("Simulated SMTP failure, no real connection")
        accepted.append(message)
    api = RecruitmentApplication(settings, fake_smtp)
    def fixture_app(env, start):
        if env.get("PATH_INFO") == "/__test__/receipt-count":
            raw = json.dumps({"count": len(accepted)}).encode()
            start("200 OK", [("Content-Type", "application/json")])
            return [raw]
        return api(env, start)
    class QuietHandler(WSGIRequestHandler):
        def log_message(self, *args):
            pass
    with make_server("127.0.0.1", 0, fixture_app, handler_class=QuietHandler) as server:
        origin = f"http://127.0.0.1:{server.server_port}"
        settings.origins = {origin}
        print(json.dumps({"origin": origin, "db": str(path.resolve())}), flush=True)
        server.serve_forever()
