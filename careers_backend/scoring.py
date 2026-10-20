"""Explainable preliminary scoring, not an automated hiring decision.

Open answers are scored ONLY for structured evidence coverage, not truth,
writing quality or semantic correctness. Each score and limitation is reported.
No AI service is called; human review of the verbatim answers is mandatory.
"""
import re
from collections import Counter
from .questionnaire import QUESTIONS, DIMENSIONS, VERSION


def evidence_present(value, short=False):
    """Reject empty/repeated-symbol placeholders; no job-keyword matching."""
    chars = [c for c in value.strip() if c.isalnum()]
    threshold = 2 if short else 8
    return len(chars) >= threshold and len(set(chars)) >= min(4, threshold)


def english_present(value):
    words = re.findall(r"[A-Za-z]+(?:'[A-Za-z]+)?", value)
    letters = sum(c.isalpha() for c in value)
    latin = sum(c.isascii() and c.isalpha() for c in value)
    return len(words) >= 3 and len(set(w.lower() for w in words)) >= 3 and latin / max(1, letters) >= 0.8


def score_application(payload):
    totals = {key: 0 for key in DIMENSIONS}
    questions, interview = [], [
        "核实开放题经历、本人行动及结果；开放题分数仅为结构化证据完整性初评，不代表真实性或回答质量。",
        "面谈确认实际底薪、提成口径与结算条件、考核和前期收入预期，不承诺固定收入或涨薪。",
        "复核产品理解和英文三个回复段的语义、语法、客户信息完整性与交期承诺风险。",
        "核实 AI 输出的独立校验习惯；AI 或外贸经验不足均不是自动淘汰条件。",
    ]
    for q in QUESTIONS:
        answers = payload["answers"][q["id"]]
        repeated = Counter(v.strip().casefold() for v in answers.values() if isinstance(v, str) and len(v.strip()) >= 8)
        details, points = [], 0
        for c in q["rubric"]:
            value, maximum, kind = answers[c["field"]], c["max"], c["kind"]
            if kind == "choice":
                earned = c["points"].get(value, 0)
                reason = "预设选项计分，反映自述意向，需面试核实。"
            elif kind == "multi":
                earned = min(maximum, max(0, sum(c["points"].get(v, 0) for v in value)))
                reason = "按所选项目的预设分值累加，并限制在该项分值范围内。"
            else:
                repeated_text = repeated[value.strip().casefold()] > 1
                present = english_present(value) if kind == "english" else evidence_present(value, c["field"] == "name")
                earned = maximum if present and not repeated_text else 0
                if repeated_text:
                    reason = "初评：同题多个栏位原文重复，尚未提供分别可复核的说明。"
                elif not present:
                    reason = "初评：说明过短、仅重复符号或未达到基础英文表达覆盖要求；需人工阅读复核，不作淘汰结论。"
                elif kind == "english":
                    reason = "初评：此段含至少 3 个不同英文词，字母以英文为主；仅检查基础表达形式，未判定语义、语法或答题正确性。"
                else:
                    reason = "初评：已填写本栏说明，包含足够的非重复文字供面试核实；仅计结构化证据覆盖，不判定经历真实、具体性或内容优劣。"
            points += earned
            details.append({"criterion": c["label"], "score": earned, "max": maximum, "reason": reason,
                            "preliminary": kind in {"evidence", "english"}})
        maximum = sum(c["max"] for c in q["rubric"])
        totals[q["dimension"]] += points
        if points < maximum:
            interview.append(f"重点核实第 {q['id'][1:]} 题：{q['title']}（初评分 {points}/{maximum}，请依据原文追问，不据此自动淘汰）。")
        full_answers = []
        for field in q["fields"]:
            value = answers[field["key"]]
            labels = {o["value"]: o["label"] for o in field.get("options", [])}
            readable = "；".join(labels[v] for v in value) if isinstance(value, list) else labels.get(value, value)
            full_answers.append({"field": field["label"], "answer": readable})
        questions.append({"id": q["id"], "question": q["title"], "answers": full_answers,
                          "score": points, "max": maximum, "basis": details})
    priority = []
    answers = payload["answers"]
    if answers["q2"]["horizon"] == "short":
        priority.append("长期发展目标与当前短期过渡意向的差异")
    if answers["q3"]["position"] in {"steady", "not_fit"}:
        priority.append("前期收入预期与底薪加成交提成的适配")
    if answers["q4"]["position"] in {"observe", "cannot"}:
        priority.append("现场产品学习及基础工作的分工与接受程度")
    if answers["q6"]["approach"] == "copy":
        priority.append("AI 输出独立核实习惯，尤其客户信息、产品参数与报价")
    if answers["q8"]["action"] != "own" or "promise" in answers["q9"]["steps"]:
        priority.append("订单错误、交期风险的及时沟通和避免未经确认的承诺")
    if answers["q10"]["style"] in {"silent", "avoid"} or answers["q11"]["start"] in {"guess", "wait"}:
        priority.append("直接汇报、反馈及没有流程时的沟通方式")
    interview = ["优先沟通：" + issue + "（不自动作出录用或淘汰决定）。" for issue in priority] + interview
    total = sum(totals.values())
    # Descriptive interview priority, never pass/fail, acceptance or rejection.
    match = ("自述与岗位期待较接近，建议面试核实" if total >= 80 else
             "部分匹配，需针对差异进一步交流" if total >= 60 else "当前自述有较多待确认项，建议先沟通预期")
    if priority:
        match = "存在需优先核实的岗位预期或处理方式差异；总分不能替代逐项沟通。"
    return {"version": VERSION, "questions": questions, "dimensions": [
        {"name": name, "score": totals[key], "max": maximum} for key, (name, maximum) in DIMENSIONS.items()],
        "total": total, "max": 100, "match": match, "interview": interview,
        "notice": "所有开放题及英文题均为初步评估。自动分数偏重选项与资料覆盖，不是能力排名；必须由招聘负责人复核原文，不自动淘汰或录用。工作经验和 AI 使用经历本身不计分。"}
