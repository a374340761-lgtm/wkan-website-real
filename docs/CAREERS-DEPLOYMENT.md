# 招聘问卷：Google Sheets 部署

## 当前状态

**最新进展：用户已更新 Apps Script 部署。真实有效申请收到 ok:true，页面显示提交成功；真实分值不一致申请收到 ok:false，页面保留答案并可重试。真实 Google 端回执链路已验证。私人表格两表行记录仍待用户核对，静态网站尚未发布。**

下方有关旧部署转义异常的记录属于修复前诊断，不代表当前版本。

当前网页使用 Google Apps Script + 私人 Google Sheets，不调用 Python 邮件接口，不发送招聘邮件。Python 保留为评分标准来源、构建与测试；旧 SMTP 部署仅归档在 CAREERS-SMTP-LEGACY.md，不能按旧说明上线。

- 页面：`/careers.html`、`/zh/careers.html`，复用网站导航、页脚、字体与样式。
- 页首说明需要打开 VPN 或使用能访问 Google 的网络；只有写入回执成功才显示提交成功。
- 接口地址位于 `scripts/careers-config.js`，仅包含公共 Web App URL，不含表格 ID、服务账号或密钥。
- 私人表格和两张工作表沿用现状，不修改共享、不预建列：候选人总览、逐题答案。
- 2026-10-20 的真实测试已发送一份虚构申请（集成测试候选人-请忽略）。部署返回的 HTML 含对应 ID 的 `ok:true`，但 HTML 转义异常，且 `window.parent.postMessage` 只发给 Google 的内部包装页；网站没有收到回执，也没有误报成功。
- 已连接的 Google Drive 账号读取表格返回 403，尚不能独立确认两张表的实际行记录。不能把响应中的 ok:true 等同于两表读回验证。
- 真实生产 `/careers.html` HEAD 当前返回 404；本地实现不代表已发布。

## 提交流程与校验

1. 网页保留 13 题、必填与同意框校验；不把个人资料放进 URL。根据用户要求，未提交草稿改用当前标签页的 sessionStorage 临时保存以支持刷新恢复；不使用持久化 localStorage。草稿最长24小时，关闭标签页后不保留，成功提交后清除；隐私同意框不恢复。
2. 依据与 Python 一致的 100 分规则生成初评，保留每题完整原文、逐项依据、分数、维度汇总、待核实事项。页面 DOM 不展示任何评估内容。
3. 本次提交创建一个同源、隐藏的 `/careers-submit-bridge.html` iframe。父页面只接受该 iframe 的消息，校验 `event.source`、同源 origin、type、requestId 与严格布尔值 ok。
4. 桥接 iframe 内用原生 form POST，将 JSON 放入唯一表单字段 `payload`，提交到指定 Apps Script。无 no-cors fetch，也不把 iframe load 当成功。
5. Google HtmlService 会再嵌套包装 iframe。桥接检查回执来源为 Google origin、来源窗口确实属于本次 Google iframe 的后代、type、当前 requestId 与严格布尔值。之后由同源桥接 iframe 向父页面转发结果。
6. 收到 ok:true 才显示“提交成功”。ok:false 或 60 秒无有效回执均显示失败，保留答案并允许重试。内容未改时沿用相同 submissionId 和 submittedAt；Apps Script 必须按 submissionId 去重，避免不确定状态重试产生重复记录。
7. 不依赖发出请求、HTTP 200、页面文字或 iframe onload 判断写入成功。

## 必须修复的 Apps Script 回执

已收到用户粘贴的原始 Code.gs，完整修正版为 `deploy/careers/Code.gs`。它保留原 SPREADSHEET_ID、两张工作表及 15/11 列表头，补充资料与分值一致性验证、完成状态下缺题修复、逐题写入核对及回执桥接。模拟 Apps Script API 测试通过，真实表格和 Google 部署尚未修改。

最简单的更新方式：打开编辑器中的原 Code.gs → 全选替换为修正版全文 → 保存 → 部署/管理部署 → 选择现有 Web App → 铅笔编辑 → 版本“新版本” → 部署。保留现有执行身份、访问设置及 URL；不新建第二个 doPost，不修改表格共享或列。

如果只需单独查看回执函数，另有 `deploy/careers/apps-script-reply.gs`：

- 保留当前 doPost、SPREADSHEET_ID、数据验证、两表保存与自动表头逻辑，不添加第二个 doPost，不手动改列。
- 将 helper 加入原项目，成功路径在两表写入并 `SpreadsheetApp.flush()` 成功后执行 `return recruitmentReply_(payload.submissionId, true);`。
- 失败路径执行 `return recruitmentReply_(payload && payload.submissionId, false);`。若现有变量名不是 payload，使用实际解析变量名。
- helper 生成正常 HTML 与 script，不对整段 HTML 反复 JSON 转义；只对嵌入的 JSON 做 HTML 安全转义。
- helper 向各层祖先窗口的**明确网站 origin**投递回执，让同源桥接能够收到；网站仍校验其来源窗口和 requestId。无需将表格公开。
- helper 使用 `ALLOWALL`，允许网站嵌入回执页。服务必须以拥有表格权限的账号执行，允许未登录候选人调用 Web App。
- 本地真实联调时临时添加确切的 localhost origin 到 helper 的 targets；生产只保留实际网站 origin。不使用通配 targetOrigin。
- 保存后在“管理部署”里将**现有部署**更新到新版本，以保持当前 /exec URL。不只是保存编辑器代码。
- Apps Script 应将候选人输入当纯文本写入，避免 `=` 等被作为表格公式执行；对请求大小、字段、分数边界和 submissionId 去重进行服务器校验。浏览器评估可被修改，不能作为可信的服务端成绩，负责人必须复核原文。用户提供的源码已有脚本锁、同编号重试、防公式注入；修正版增加了前导空白公式防护、完整13题、总分和维度一致性校验及写入核对。仍未在真实 Google 环境读回验证。

## CSP

仓库未发现既有 CSP 限制；真实 careers 页面返回 404，无法确认未来 Cloudflare 规则。已为两个招聘页新增 meta CSP：

    frame-src 'self' https://script.google.com https://*.googleusercontent.com;
    form-action 'self' https://script.google.com https://*.googleusercontent.com

桥接页采用更严格策略：default-src 'none'; script-src 'self'; frame-src 与 form-action 仅允许上述 Google 域名；base-uri 'none'。桥接 noindex/nofollow，不加载 GTM 或分析脚本；GTM 注入工具仅对该内部传输页豁免。

如果 Cloudflare / CDN 另外设置 CSP 响应头，需要在对应 frame-src / form-action 中允许上述来源以及本站桥接 iframe；HTML meta 不能放宽更严格的响应头策略。

## 本地运行和检查

    python -m http.server 8000

打开 `http://127.0.0.1:8000/zh/careers.html`。注意按钮会提交真实 Apps Script，不要使用真实个人资料反复测试。

离线校验（不写真实表格）：

    python scripts/build-careers-pages.py --check
    node scripts/check-careers-sheets-scoring.cjs
    node scripts/check-careers-apps-script.cjs
    node scripts/check-careers-sheets-browser.cjs

浏览器脚本需安装 Playwright 和 Edge。当前脚本使用本机 Codex runtime 路径，不作为跨平台 CI 依赖。评分对照脚本只需 Node/Python 标准库，已加入 CI。

真实测试脚本 `node scripts/check-careers-sheets-live.cjs --submit-test` 会写入明确标注的虚构申请，只能在人工确认需要真实联调时运行；不在 CI 自动运行。最新有效申请回执保存在 reports/careers-sheets-live.json，真实拒绝测试保存在 reports/careers-sheets-live-failure.json。测试使用本地文件加正式 origin 路由，并不证明静态页面已经上线。

## 发布前剩余项

1. Apps Script 回执函数及现有部署已由用户更新，并通过真实成功/失败测试。
2. 发布本地网站文件，确认 `/careers.html`、`/zh/careers.html`、桥接页及相关 JS/JSON 返回 200。
3. 使用虚构候选人提交，在候选人页面确认只有提交结果，无任何分数或内部说明。
4. 用相同 submissionId 在私人“候选人总览”核对一条记录，在“逐题答案”核对 13 题、全部原文、分数及依据；确认两表 ID 一致、总分与维度相加一致。保留私人状态。
5. 验证失败和重复提交：失败不显示成功，同 ID 重试不产生重复行，部分写入不能返回 ok:true。

不需要 SMTP 环境变量或邮箱密码。当前不自动更新 Apps Script、Git 推送或生产部署。


## 微信号选填

基本申请信息增加微信号（选填），不计分，支持当前标签页草稿恢复。payload 的 candidate.wechat 单独携带该值，同时在 candidate.experience 原文末尾增加明确的“微信号：”行，使当前已部署的 Apps Script 无需更改列或重新部署也能保存。可在“候选人总览”的“相关经历”单元格末尾查看。原经历不被覆盖，后端15/11列结构不变。
