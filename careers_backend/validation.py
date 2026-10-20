import re
import uuid
from .questionnaire import QUESTIONS, VERSION

CONTACT_FIELDS = {"name": 80, "phone": 30, "email": 254, "location": 120, "availability": 120, "experience": 1200}


class InvalidApplication(ValueError):
    pass


def validate_application(data):
    if not isinstance(data, dict) or set(data) != {"version", "submission_id", "consent", "website", "contact", "answers"}:
        raise InvalidApplication("申请格式有误，请刷新问卷。")
    if data["version"] != VERSION:
        raise InvalidApplication("问卷版本已更新，请刷新后重新填写。")
    try:
        if str(uuid.UUID(data["submission_id"])) != data["submission_id"]:
            raise ValueError()
    except (ValueError, TypeError, AttributeError):
        raise InvalidApplication("申请编号有误，请刷新后重试。") from None
    if data["consent"] is not True or data["website"] != "":
        raise InvalidApplication("请确认招聘隐私说明后再提交。")
    contact = data["contact"]
    if not isinstance(contact, dict) or set(contact) != set(CONTACT_FIELDS):
        raise InvalidApplication("请填写完整联系资料。")
    for key, limit in CONTACT_FIELDS.items():
        if not isinstance(contact[key], str) or not 1 <= len(contact[key].strip()) <= limit or "\x00" in contact[key]:
            raise InvalidApplication("联系资料为空或超出长度限制。")
    if not re.fullmatch(r"[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+", contact["email"]):
        raise InvalidApplication("请填写有效邮箱。")
    if not re.fullmatch(r"[+\d() .-]{7,30}", contact["phone"]) or len(re.sub(r"\D", "", contact["phone"])) < 7:
        raise InvalidApplication("请填写有效联系电话。")
    if any("\r" in contact[k] or "\n" in contact[k] for k in ["name", "email", "phone"]):
        raise InvalidApplication("联系资料格式有误。")
    answers = data["answers"]
    if not isinstance(answers, dict) or set(answers) != {q["id"] for q in QUESTIONS}:
        raise InvalidApplication("问卷答案不完整。")
    for q in QUESTIONS:
        response = answers[q["id"]]
        if not isinstance(response, dict) or set(response) != {f["key"] for f in q["fields"]}:
            raise InvalidApplication(f"请完整填写第 {q['id'][1:]} 题。")
        for field in q["fields"]:
            value = response[field["key"]]
            options = {o["value"] for o in field.get("options", [])}
            if field["type"] == "checkboxes":
                valid = isinstance(value, list) and 1 <= len(value) <= len(options) and all(isinstance(v, str) and v in options for v in value) and len(set(value)) == len(value)
            elif field["type"] == "select":
                valid = isinstance(value, str) and value in options
            else:
                valid = isinstance(value, str) and 1 <= len(value.strip()) <= field["maxLength"] and "\x00" not in value
            if not valid:
                raise InvalidApplication(f"第 {q['id'][1:]} 题有遗漏或格式错误。")
    return data
