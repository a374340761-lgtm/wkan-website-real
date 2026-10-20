# 招聘 Google Sheets 改造交付状态

日期：2026-10-20

## 已完成的本地修改

- careers.html、zh/careers.html：原有招聘介绍、13 题、共享页眉/页脚与隐私同意框保留；页首增加 VPN/Google 网络提示；隐私说明由邮件改为私人 Google Sheets。
- scripts/careers.js、careers-config.js：使用提供的 Web App URL；不再调用 Python 邮件 API。严格校验本次隐藏 iframe、origin、type、requestId、布尔 ok；成功回执前不显示成功。失败、超时保留答案，同内容重试沿用编号与时间。
- careers-submit-bridge.html、scripts/careers-submit-bridge.js：原生 form POST 唯一 payload 字段；校验 Google 嵌套 iframe 归属，受控桥接回执；不加载分析脚本。
- scripts/careers-assessment.js、data/careers-scoring-rules.json、scripts/build-careers-pages.py：保留 Python 100 分标准，完整逐题答案、依据与人工复核标记；不在候选人 UI 展示。客户端结果需人工核实，不作自动招聘决定。
- deploy/careers/apps-script-reply.gs：可直接接入当前 doPost 的回执 helper，修复 HTML 转义和 Google 嵌套层消息投递。不改表格列、不包含凭据。
- docs/CAREERS-DEPLOYMENT.md、CAREERS-SCORING.md、CAREERS-SMTP-LEGACY.md：更新当前架构和部署/测试说明；旧 SMTP 仅归档。
- .github/workflows/architecture-checks.yml：增加 JS 语法、JS/Python 评分对照与回执 HTML 测试。
- scripts/apply-google-tag-manager.py：只豁免 noindex 内部桥接页，避免收集传输页数据及违反该页 CSP。

## 测试

- 16 个浏览器场景全部通过：中英 × 390/1440 × 成功、失败、超时、伪造消息；验证原生表单 POST、完整13题与100总分、重试同ID、不显示评分、隐私同意、无横向溢出、无CSP违规。
- 100 组答案与 Python 原评分逐题/总分/维度一致。
- Apps Script 回执 helper：生成正常可执行 HTML、JSON 转义、严格布尔值及明确 target origins 测试通过。
- 原 Python 10 个测试通过（不发送真实邮件）。
- 静态生成、翻译、首页、SEO、结构化数据、架构、GTM、diff 格式检查通过。
- 真实 Apps Script 曾接收到虚构测试申请，ID：60a8f8d0-c46d-49c3-af1e-e15e6eef6df9。回包内包含 ok:true，但转义异常，消息未到候选人页；未将其当作成功或两表读回证明。

## 仍未接通/不能宣称完成的项目

- 用户已给 Apps Script 编辑器链接：https://script.google.com/u/0/home/projects/1cWFVhtrE5c6WeV-WnnkW2kU_Vh1pzjgahJ_St_aHDSnlAJCKvUvH035N/edit
- 浏览器控制尝试在 IAB 和 Chrome 打开/读取编辑器连续超时，未取得源码，未修改或更新 Google 部署。需要当前 doPost 源码或可用的已登录编辑器会话，才能把 helper 接入并更新现有部署版本。
- 私人表格读取的连接账号返回403。未改变共享或手工修改列。尚未独立核实“候选人总览”1条和“逐题答案”13条记录。
- 本地网站未推送、发布；检查生产 /careers.html 返回404。
- CSP 招聘页允许 self、script.google.com、*.googleusercontent.com 的frame/form；如果发布平台另有更严格响应头规则还需同步，meta不能放宽响应头。

当前不能向用户报告“真实线上已接通”。下一步为接入 Apps Script helper → 更新现有部署 → 虚构候选人端到端提交 → 两张私人表核对 → 发布并复核页面。


## 收到用户脚本后的补充

- 已读取用户粘贴的完整源码，并生成 deploy/careers/Code.gs 完整修正版；原表名、SPREADSHEET_ID 和15/11列结构不变。
- 原源码的 HTML 拼接正常，与先前已部署版本的转义异常不一致；存在部署版本未更新的可能。
- 替换回执以支持 Google 嵌套 iframe → 受校验同源桥接 → 候选人页面。
- 增加完整13题与编号/分值/维度总分一致性校验、完成状态缺题核对与修复、现有表头不匹配时拒绝静默修改、前导空白公式防护，所有评估强制人工复核。
- scripts/check-careers-apps-script.cjs：6组模拟验证（含8种非法请求）通过，正常1条总览/13条逐题、去重、第二表失败不报成功、重试恢复、缺题修复、既有表头保留均通过。未写真实表格。
- Google 编辑器操作仍受浏览器超时阻塞。需用户将完整修正版替换后在“管理部署”发布新版本，再继续真实端到端核对。


## 用户更新 Apps Script 部署后的真实联调

- 有效申请：4c2386a9-ebe2-4cfd-996b-3364451083a6，收到真实 Google ok:true，经本次同源桥接转发，候选人页面显示“提交成功”，表单隐藏，无评分展示。详见 careers-sheets-live.json / png。
- 无效分数申请：ea4bfebd-778c-449f-9649-f0f39c830391，真实服务返回 ok:false，候选人页面显示失败，保留完整答案并恢复重试按钮。详见 careers-sheets-live-failure.json / png。
- 本地 localhost 预览不在 Apps Script 回执目标 origin 名单中，已实测正确超时而不误报成功。该轮编号79a83d10-bbff-4b92-b03e-37356146acc1，可能已有测试记录，不要把超时等同于未写入。
- 真实联调使用本地网站代码在浏览器内路由到正式 origin，以匹配服务端回执白名单；不是对已发布网站版本的确认。
- Google Sheet 连接读取仍403。已请用户独立核对有效申请对应的总览1条与逐题13条，待答复。
- 网站仓库尚未推送或发布；Apps Script 的更新与静态网站发布是两件事。
