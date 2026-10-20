"""Human-readable report; no candidate answers are sent to an AI service."""
from email.message import EmailMessage
from html import escape
from .scoring import score_application

REPORT_TO = "yishu@waikwantent.com"
CONTACT_LABELS = {"name": "姓名", "phone": "电话", "email": "邮箱", "location": "所在地", "availability": "到岗时间", "experience": "相关经历"}


def report_text(payload, report):
    lines = ["伟群外贸销售招聘问卷报告", f"申请编号：{payload['submission_id']}", f"评分版本：{report['version']}", report["notice"], "", "基本信息（不计分；已同意仅用于招聘评估）"]
    lines.extend(f"{label}：{payload['contact'][key]}" for key, label in CONTACT_LABELS.items())
    for question in report["questions"]:
        lines += ["", f"第 {question['id'][1:]} 题：{question['question']}"]
        for answer in question["answers"]:
            lines += [answer["field"] + "：", answer["answer"]]
        lines.append(f"该题得分：{question['score']}/{question['max']}")
        for basis in question["basis"]:
            lines.append(f"- {basis['criterion']}：{basis['score']}/{basis['max']}。{basis['reason']}")
    lines += ["", "维度汇总"] + [f"{d['name']}：{d['score']}/{d['max']}" for d in report["dimensions"]]
    lines += [f"总分：{report['total']}/100", "整体匹配情况（仅供交流）：" + report["match"], "", "建议面试核实内容"]
    lines += ["- " + item for item in report["interview"]]
    return "\n".join(lines)


def build_message(payload, sender):
    report = score_application(payload)
    content = report_text(payload, report)
    message = EmailMessage()
    message["From"] = sender
    message["To"] = REPORT_TO
    message["Reply-To"] = payload["contact"]["email"]
    message["Subject"] = "外贸销售招聘申请 · " + payload["contact"]["name"]
    message["X-Application-ID"] = payload["submission_id"]
    message["Message-ID"] = f"<{payload['submission_id']}@careers.waikwantent.com>"
    message.set_content(content)
    message.add_alternative('<!doctype html><html lang="zh-CN"><meta charset="utf-8"><body><pre style="white-space:pre-wrap;font:15px/1.7 sans-serif">' + escape(content) + '</pre></body></html>', subtype="html")
    return message
