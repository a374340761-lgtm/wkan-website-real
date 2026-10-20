"""Versioned questionnaire and deterministic, reviewable scoring contract."""
VERSION = "2026-10-20-v1"
DIMENSIONS = {
    "long_term": ("长期发展意愿", 20),
    "expectations": ("收入预期与一线基础工作", 20),
    "learning": ("主动学习、自驱与 AI 学习应用", 15),
    "execution": ("责任心与执行力", 15),
    "teamwork": ("业务板块适配、直接汇报与协作", 10),
    "interest": ("外贸兴趣", 10),
    "product": ("主动了解公司产品", 5),
    "english": ("基础英文与岗位适配", 5),
}


def text(key, label, limit=300, hint=""):
    return {"key": key, "label": label, "type": "textarea", "maxLength": limit, "hint": hint}


def select(key, label, options):
    return {"key": key, "label": label, "type": "select", "options": [{"value": v, "label": t} for v, t in options]}


def criterion(field, label, maximum, kind="evidence", points=None):
    return {"field": field, "label": label, "max": maximum, "kind": kind, "points": points or {}}


QUESTIONS = [
    {"id": "q1", "dimension": "interest", "title": "你为什么想做外贸？目前了解了哪些工作，最想先学什么？", "hint": "不要求已有经验；按你目前的真实了解填写。", "fields": [
        text("reason", "想做外贸的原因（简述一个与你有关的原因）", 220),
        {"key": "explored", "label": "目前了解过哪些环节（可多选）", "type": "checkboxes", "options": [{"value": v, "label": t} for v, t in [("product", "产品学习"), ("research", "客户开发"), ("english", "英文沟通"), ("quote", "报价"), ("orders", "跟单与生产进度"), ("shipment", "出货和售后"), ("new", "刚开始了解")]]},
        select("learn", "最希望先学习的环节", [("product", "产品与使用场景"), ("research", "客户与市场开发"), ("english", "英文沟通"), ("quote", "报价与订单全流程"), ("unsure", "还不确定，想先了解")])],
     "rubric": [criterion("reason", "动机说明可供面试复核", 4), criterion("explored", "已了解环节的自述覆盖度（新手不作淘汰条件）", 3, "multi", {"product": 1, "research": 1, "english": 1, "quote": 1, "orders": 1, "shipment": 1, "new": 1}), criterion("learn", "能指出当前学习方向", 3, "choice", {"product": 3, "research": 3, "english": 3, "quote": 3, "unsure": 2})]},
    {"id": "q2", "dimension": "long_term", "title": "未来 3 年，你希望怎样发展？", "hint": "本题是发展意向，不是服务年限承诺；可如实写不确定之处。", "fields": [
        select("horizon", "目前希望在这一方向发展的时间", [("three_plus", "愿意稳定发展 3 年以上"), ("one_three", "先看 1–3 年的发展"), ("explore", "想先探索，再决定"), ("short", "目前只考虑短期过渡")]),
        select("goal", "对独立负责外贸全流程的目标", [("full", "希望逐步成长为能独立负责全流程的业务骨干"), ("specialist", "更想先做好一个环节，再考虑全流程"), ("unsure", "暂时不确定")]),
        text("step", "第一阶段打算做的一件事", 160), text("milestone", "怎样判断自己有进步", 160), text("review", "遇到进展慢或预期变化时，准备怎样调整", 160)],
     "rubric": [criterion("horizon", "发展时间意向", 8, "choice", {"three_plus": 8, "one_three": 5, "explore": 3, "short": 1}), criterion("goal", "全流程成长方向", 6, "choice", {"full": 6, "specialist": 4, "unsure": 2}), criterion("step", "有起步行动说明", 2), criterion("milestone", "有进步检验说明", 2), criterion("review", "有调整或复盘说明", 2)]},
    {"id": "q3", "dimension": "expectations", "title": "你如何理解前 3–6 个月可能起步较慢，以及底薪＋成交提成？", "fields": [
        select("position", "目前最接近你的想法", [("accept", "理解需要积累，愿意结合具体底薪与提成规则评估"), ("clarify", "可以考虑，需要先面谈了解收入与考核细节"), ("steady", "目前更需要短期稳定、确定的收入"), ("not_fit", "这种方式目前不适合我")]),
        text("clarify", "你希望面谈确认哪些规则？起步阶段会怎样安排学习和业务跟进？", 260, "无需提供个人收入、资产或家庭财务信息。")],
     "rubric": [criterion("position", "对积累期及薪酬结构的自述预期", 6, "choice", {"accept": 6, "clarify": 5, "steady": 2, "not_fit": 0}), criterion("clarify", "有待确认规则及起步安排的说明", 4)]},
    {"id": "q4", "dimension": "expectations", "title": "初期产品与工厂现场学习，你会怎样看待？", "hint": "可能参与检查、备货、打包等基础工作；长期主业仍是外贸销售。", "fields": [
        select("position", "最接近你的选择", [("learn_help", "愿意学产品并参与基础工作，理解它与报价、交期和售后的关系"), ("scope", "愿意参与，希望明确学习安排、分工与安全要求"), ("observe", "愿意参观学习，但希望只做办公室销售工作"), ("cannot", "目前无法参与这类现场工作")])],
     "rubric": [criterion("position", "对现场学习与基础工作的接受方式", 10, "choice", {"learn_help": 10, "scope": 9, "observe": 4, "cannot": 0})]},
    {"id": "q5", "dimension": "learning", "title": "讲一件你主动学会新技能的小事。", "hint": "学习、生活、兼职或工作经历都可以；重点是你做了什么，不要求结果出色。", "fields": [text("task", "当时需要学什么、为什么", 160), text("action", "你实际采取了什么学习或练习方法", 220), text("check", "如何检验效果，或哪里没学好、后来怎么改", 220)],
     "rubric": [criterion("task", "有真实经历背景供复核", 2), criterion("action", "有本人学习行动说明", 3), criterion("check", "有效果检验或改进说明", 3)]},
    {"id": "q6", "dimension": "learning", "title": "你用过 AI 吗？准备怎样学习并用于外贸？", "hint": "没有 AI 使用经验不扣分。可考虑市场客户研究、英文邮件、产品资料、内容制作、跟单整理和效率提升。不能盲目照搬 AI 给出的客户信息、产品参数或报价。", "fields": [
        select("experience", "AI 使用经历（本项不计分）", [("used", "用过"), ("new", "还没用过")]),
        select("approach", "更接近你的使用或学习方式", [("verify", "学会工具后做草稿，并通过官网、产品资料或负责人核实"), ("learn_verify", "没用过，愿意从一个小任务学习，并核实输出"), ("draft", "主要用来生成草稿，还需要学习核实方法"), ("copy", "倾向于直接使用 AI 输出")]),
        text("workflow", "举一个用过的场景，或准备先尝试的小任务", 180), text("verify", "这件事中哪些内容必须核实，你会找谁或用什么资料核实？", 220)],
     "rubric": [criterion("approach", "学习与核实方式", 4, "choice", {"verify": 4, "learn_verify": 4, "draft": 2, "copy": 0}), criterion("workflow", "有具体应用或学习任务", 1), criterion("verify", "有独立核实说明", 2)]},
    {"id": "q7", "dimension": "execution", "title": "客户看过报价，暂时没有下单，你会怎样跟进？", "fields": [
        select("action", "你会优先怎样做", [("needs", "了解顾虑和采购时间，提供有用信息并约定下次联系"), ("push", "每天催促尽快决定"), ("discount", "先承诺降价争取下单"), ("wait", "等客户主动回复")]),
        text("message", "写一句你下一次会发给客户的跟进内容（中文即可）", 200)],
     "rubric": [criterion("action", "客户跟进方式", 3, "choice", {"needs": 3, "push": 1, "discount": 0, "wait": 0}), criterion("message", "有可核实的实际跟进表达", 2)]},
    {"id": "q8", "dimension": "execution", "title": "发现自己发出的报价或订单有错误，你会怎样处理？", "fields": [
        select("action", "你会优先怎样做", [("own", "核对影响、及时汇报，协商纠正并确认对方收到正确版本"), ("later", "先自己改，等问题扩大再说"), ("hide", "不提错误，尽量让别人发现"), ("wait", "暂停不管，等上级问到")]),
        text("first", "如果错误可能影响价格或交期，你最先核实或说明什么？", 220)],
     "rubric": [criterion("action", "错误处理与责任承担方式", 3, "choice", {"own": 3, "later": 1, "hide": 0, "wait": 0}), criterion("first", "有影响核实或沟通内容", 2)]},
    {"id": "q9", "dimension": "execution", "title": "订单生产落后，可能赶不上交期，你会怎样推进？", "hint": "这属于销售订单跟进的一部分，岗位主要工作仍是外贸销售。", "fields": [
        {"key": "steps", "label": "你会做哪些事（可多选）", "type": "checkboxes", "options": [{"value": v, "label": t} for v, t in [("facts", "核实订单数量、已完成进度、卡点和实际交期"), ("owner", "及时联系生产、跟单等相关负责人"), ("coordinate", "协助沟通可行推进方案，确认责任人与下一节点"), ("report", "向销售负责人汇报风险、方案和需协助事项"), ("promise", "先向客户保证不会延期，再说其他事情"), ("wait", "等生产部门主动通知")]]},
        text("update", "你下一次会在什么时候、用什么信息检查进展并汇报？", 220)],
     "rubric": [criterion("steps", "核实、联系、协调与汇报的覆盖（错误承诺不加分）", 4, "multi", {"facts": 1, "owner": 1, "coordinate": 1, "report": 1, "promise": -2, "wait": -1}), criterion("update", "有后续检查与汇报说明", 1)]},
    {"id": "q10", "dimension": "teamwork", "title": "入职后直接向招聘负责人汇报；面对反馈、目标变化或意见不同，你怎样沟通？", "fields": [
        select("style", "更接近你的处理方式", [("discuss", "先确认目标与事实，提出理由和方案，约定行动及反馈节点"), ("clarify", "先听清反馈并请对方说明期望，再执行和汇报"), ("silent", "表面接受，但按自己原来的方法做"), ("avoid", "尽量避免直接沟通")]),
        text("example", "简述一次处理反馈或分歧的经历，或你会怎样应对目标变化", 240)],
     "rubric": [criterion("style", "直接汇报与协作方式", 3, "choice", {"discuss": 3, "clarify": 3, "silent": 0, "avoid": 0}), criterion("example", "有反馈、分歧或目标调整说明", 2)]},
    {"id": "q11", "dimension": "teamwork", "title": "接到没有现成流程的任务，你会如何开始？", "fields": [
        select("start", "你会优先怎样做", [("research", "先研究和拆分，做低风险尝试，遇到关键问题及时确认并汇报"), ("ask", "先请负责人把每一步都说明，再行动"), ("guess", "直接凭猜测推进，做完再说"), ("wait", "等有人建立流程")]),
        text("example", "用一个小任务说明：你先查什么、先做什么，何时需要沟通？", 240)],
     "rubric": [criterion("start", "无现成流程时的推进方式", 3, "choice", {"research": 3, "ask": 1, "guess": 0, "wait": 0}), criterion("example", "有研究、行动或沟通节点说明", 2)]},
    {"id": "q12", "dimension": "product", "title": "浏览网站，自选一个你感兴趣的产品。", "hint": "不要求已有产品知识；看你是否愿意观察。可先打开产品目录，选完返回此页继续。", "fields": [
        text("name", "产品名称（附页面链接也可以）", 240), text("need", "它解决什么需求？", 180), text("customers", "适合哪些客户或使用场景？", 180), text("question", "你还想核实哪些产品信息？", 180)],
     "rubric": [criterion("name", "指出一个产品对象", 1), criterion("need", "有需求观察说明（待核实理解）", 1), criterion("customers", "有客户或场景观察（待核实理解）", 1), criterion("question", "提出待了解的产品信息", 2)]},
    {"id": "q13", "dimension": "english", "title": "简短英文回复：客户询问 50 顶 3×3 m 帐篷的报价和下月交货。", "hint": "用基础英文各写一句：回应询问；询问印刷需求或目的地；说明先核实配置和生产时间再确认。无需复杂词汇，请独立作答，不用 AI 代写。", "fields": [text("ack", "English — acknowledge the inquiry", 240), text("ask", "English — ask for missing information", 240), text("next", "English — explain the next step", 240)],
     "rubric": [criterion("ack", "英文回应段可读性初检（语义待人工复核）", 2, "english"), criterion("ask", "英文问题段可读性初检（相关性待人工复核）", 2, "english"), criterion("next", "英文下一步段可读性初检（承诺风险待人工复核）", 1, "english")]},
]


def public_schema():
    return {"version": VERSION, "questions": [{k: v for k, v in q.items() if k not in {"dimension", "rubric"}} for q in QUESTIONS]}
