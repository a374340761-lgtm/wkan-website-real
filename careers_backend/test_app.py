"""Local-only tests. Fake applicants and injected SMTP, never real mail."""
import copy
import io
import json
import smtplib
import tempfile
import unittest
import uuid
from pathlib import Path
from unittest.mock import patch, MagicMock
from .app import RecruitmentApplication, Settings, send_report
from .questionnaire import QUESTIONS, DIMENSIONS, VERSION
from .scoring import score_application
from .validation import validate_application, InvalidApplication
from .reporting import build_message


def fixture():
    answers = {}
    for q in QUESTIONS:
        response = {}
        for f in q["fields"]:
            key = f["key"]
            if f["type"] == "select":
                response[key] = f["options"][0]["value"]
            elif f["type"] == "checkboxes":
                response[key] = [o["value"] for o in f["options"] if o["value"] not in {"new", "wait", "promise"}]
            else:
                response[key] = f"我先核对资料并进行一次练习，再确认结果和下一步，记录说明 {q['id']} {key}。"
            if q["id"] == "q13":
                response[key] = {"ack": "Thank you for your inquiry about fifty canopy tents.", "ask": "Could you confirm your printing requirements and delivery destination?", "next": "I will check the configuration and production schedule before confirming delivery."}[key]
        answers[q["id"]] = response
    return {"version": VERSION, "submission_id": str(uuid.uuid4()), "consent": True, "website": "", "contact": {
        "name": "测试申请人", "phone": "+86 13800000000", "email": "applicant@example.test", "location": "测试城市", "availability": "两周内", "experience": "无外贸经验，测试用虚构资料。"}, "answers": answers}


class ScoringTests(unittest.TestCase):
    def test_weights_and_every_criterion(self):
        self.assertEqual(sum(v[1] for v in DIMENSIONS.values()), 100)
        self.assertEqual(sum(c["max"] for q in QUESTIONS for c in q["rubric"]), 100)
        full = fixture()
        report = score_application(validate_application(full))
        self.assertEqual(report["total"], 100)
        self.assertEqual(report, score_application(full))
        self.assertEqual(sum(q["score"] for q in report["questions"]), sum(d["score"] for d in report["dimensions"]))
        for q in QUESTIONS:
            for c in q["rubric"]:
                sample = copy.deepcopy(full)
                if c["kind"] in {"evidence", "english"}:
                    sample["answers"][q["id"]][c["field"]] = "？"
                    self.assertEqual(score_application(sample)["total"], 100 - c["max"])
                elif c["kind"] == "choice":
                    for value, expected in c["points"].items():
                        sample["answers"][q["id"]][c["field"]] = value
                        self.assertEqual(score_application(sample)["total"], 100 - c["max"] + expected)

    def test_no_ai_or_trade_experience_penalty(self):
        sample = fixture()
        before = score_application(sample)["total"]
        sample["answers"]["q6"]["experience"] = "new"
        sample["answers"]["q6"]["approach"] = "learn_verify"
        sample["contact"]["experience"] = "没有正式工作或外贸经验"
        self.assertEqual(score_application(sample)["total"], before)

    def test_negative_production_choices_and_repeat_placeholders(self):
        sample = fixture()
        sample["answers"]["q9"]["steps"] = ["promise", "wait"]
        self.assertEqual(score_application(sample)["questions"][8]["score"], 1)
        sample["answers"]["q5"] = {k: "这是完全相同的一段回答没有分开说明" for k in sample["answers"]["q5"]}
        self.assertEqual(score_application(sample)["questions"][4]["score"], 0)

    def test_report_complete_escaped_and_no_auto_decision(self):
        sample = fixture()
        sample["answers"]["q5"]["task"] = "<script>alert('test')</script>完整原文保留"
        message = build_message(sample, "sender@example.test")
        self.assertEqual(message["To"], "yishu@waikwantent.com")
        plain = message.get_body(preferencelist=("plain",)).get_content()
        rich = message.get_body(preferencelist=("html",)).get_content()
        for q in QUESTIONS:
            self.assertIn(q["title"], plain)
            for f in q["fields"]:
                self.assertIn(f["label"], plain)
        self.assertIn(sample["answers"]["q5"]["task"], plain)
        self.assertNotIn("<script>", rich)
        self.assertIn("不自动淘汰或录用", plain)
        self.assertIn("初评", plain)

    def test_validation(self):
        for mutate in [lambda p: p.update(consent=False), lambda p: p["contact"].update(email="bad"), lambda p: p["contact"].update(phone="abc"), lambda p: p["answers"]["q4"].update(position="forged"), lambda p: p["answers"]["q1"].update(explored=["new", "new"]), lambda p: p["contact"].update(name="Test\nBcc: injected@example.test"), lambda p: p["answers"]["q5"].update(task="x" * 2000), lambda p: p.update(website="bot")]:
            sample = fixture()
            mutate(sample)
            with self.assertRaises(InvalidApplication):
                validate_application(sample)


class ApiTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(dir=Path(__file__).parent, prefix=".careers-test-")
        self.addCleanup(self.temp.cleanup)
        self.env = {"SMTP_HOST": "smtp.example.test", "SMTP_PORT": "587", "SMTP_USERNAME": "test", "SMTP_PASSWORD": "FAKE-TEST-ONLY", "SMTP_FROM": "sender@example.test", "CAREERS_ALLOWED_ORIGINS": "https://www.waikwantent.com", "CAREERS_DB_PATH": str(Path(self.temp.name) / "receipts.sqlite3")}
        self.messages = []
        self.api = RecruitmentApplication(Settings(self.env), lambda p, s: self.messages.append(build_message(p, s.sender)))

    def call(self, api=None, body=None, method="POST", path="/api/careers/applications", origin="https://www.waikwantent.com", content_type="application/json"):
        raw = json.dumps(body if body is not None else fixture()).encode()
        env = {"PATH_INFO": path, "REQUEST_METHOD": method, "HTTP_ORIGIN": origin, "CONTENT_TYPE": content_type, "CONTENT_LENGTH": str(len(raw)), "wsgi.input": io.BytesIO(raw), "REMOTE_ADDR": "127.0.0.1"}
        result = {}
        response = (api or self.api)(env, lambda status, headers: result.update(status=int(status.split()[0]), headers=dict(headers)))
        result["body"] = json.loads(b"".join(response))
        return result

    def test_success_replay_conflict_and_private_response(self):
        sample = fixture()
        first = self.call(body=sample)
        self.assertEqual(first["status"], 200)
        self.assertEqual(first["body"], {"ok": True, "submission_id": sample["submission_id"]})
        self.call(body=sample)
        self.assertEqual(len(self.messages), 1)
        sample["contact"]["name"] = "修改后的测试姓名"
        self.assertEqual(self.call(body=sample)["status"], 409)
        raw = Path(self.env["CAREERS_DB_PATH"]).read_bytes()
        self.assertNotIn(b"applicant@example.test", raw)

    def test_unconfigured_failure_and_ambiguous_delivery(self):
        missing = RecruitmentApplication(Settings({"CAREERS_DB_PATH": self.env["CAREERS_DB_PATH"]}))
        self.assertEqual(self.call(api=missing)["status"], 503)
        self.assertFalse(self.call(api=missing, method="GET", path="/api/careers/status")["body"]["accepting_applications"])
        def fail(payload, settings):
            raise smtplib.SMTPException("FAKE secret that must not appear in response")
        failure = RecruitmentApplication(Settings(self.env), fail)
        sample = fixture()
        reply = self.call(api=failure, body=sample)
        self.assertEqual(reply["status"], 503)
        self.assertFalse(reply["body"]["ok"])
        self.assertNotIn("secret", str(reply))
        self.assertEqual(self.call(api=failure, body=sample)["status"], 409)

    def test_invalid_origin_validation_limits_and_private_paths(self):
        self.assertEqual(self.call(origin="https://unconfigured.example")["status"], 403)
        bad = fixture(); bad["consent"] = False
        self.assertEqual(self.call(body=bad)["status"], 400)
        self.assertEqual(self.call(content_type="text/plain")["status"], 415)
        self.assertEqual(self.call(body={"too_big": "x" * 70000})["status"], 413)
        static = Settings(self.env); static.serve_static = True
        api = RecruitmentApplication(static)
        self.assertEqual(self.call(api=api, method="GET", path="/careers_backend/.env.example")["status"], 404)
        for _ in range(20):
            self.call(body=bad)
        self.assertEqual(self.call()["status"], 429)

    def test_cross_origin_preflight(self):
        result = {}
        response = self.api({"PATH_INFO": "/api/careers/applications", "REQUEST_METHOD": "OPTIONS", "HTTP_ORIGIN": "https://www.waikwantent.com"}, lambda status, headers: result.update(status=status, headers=dict(headers)))
        self.assertEqual(result["status"], "204 No Content")
        self.assertEqual(b"".join(response), b"")
        self.assertEqual(result["headers"]["Access-Control-Allow-Origin"], "https://www.waikwantent.com")
        self.assertNotIn("Access-Control-Allow-Credentials", result["headers"])

    def test_real_smtp_adapter_uses_tls_fixed_recipient(self):
        smtp = MagicMock()
        smtp.send_message.return_value = {}
        with patch("careers_backend.app.smtplib.SMTP") as constructor:
            constructor.return_value.__enter__.return_value = smtp
            send_report(fixture(), Settings(self.env))
            smtp.starttls.assert_called_once()
            smtp.login.assert_called_once_with("test", "FAKE-TEST-ONLY")
            self.assertEqual(smtp.send_message.call_args.kwargs["to_addrs"], ["yishu@waikwantent.com"])


if __name__ == "__main__":
    unittest.main()
