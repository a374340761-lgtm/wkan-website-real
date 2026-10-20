# 招聘页面与问卷交付记录 — 2026-10-20

## 已完成

- 根目录 careers.html 与 /zh/careers.html 提供中文为主的独立招聘介绍与问卷；沿用既有页眉、公司标识、导航、字体、配色与联系页脚，支持手机。
- 在现有 Footer 的 Follow Us 后加入“加入我们 / Careers”；静态入口与共享运行脚本均处理，避免重复。部分旧页面由脚本补入社交区后，会自动保持正确顺序。
- 介绍准确说明负责人海外留学、在父亲经营公司体系内负责海外销售和业务发展、团队建设期、公司员工身份和直接汇报关系。没有将负责人写成公司创始人／所有人。
- 如实说明外贸主业及全流程成长、3 年以上发展意向、初期产品／现场与基础工作、销售订单生产进度跟进、前 3–6 个月可能收入慢、底薪加成交提成面谈、食宿可选、基础英文与 AI 学习要求。没有收入或涨薪保证。
- 13 题覆盖兴趣、长期发展、薪酬预期、现场工作、真实学习经历、AI 学习和核实、客户跟进、订单错误、生产延误、反馈／汇报／变化、无流程任务、产品观察及英文回复。收集 6 项基本申请信息，不询问无关敏感信息，加入必选招聘隐私同意。
- Python 实现 8 维 100 分的透明初评、逐题完整答案、逐项分数和依据、维度汇总、总分、匹配交流提示及面试核实清单。经验年限与是否已有 AI 经验不计分；未用过 AI 的学习核实方式可得相同分数。开放题仅按独立结构化证据覆盖做初评，不调用 AI 或假称能够判断真实性、内容优劣和英文语义；所有原文保留人工复核，不自动淘汰或录用。
- SMTP 使用服务器环境变量及 TLS，报告固定发送到 yishu@waikwantent.com。候选人接口不返回分数，只有 SMTP 成功回执后返回 ok；前端还核对申请编号。不完整回执、发送失败、超时均不显示成功。
- 加入字段／来源／请求大小校验、蜜罐、基础限流、HTML 转义、回执去重；仅存私有回执元数据，不存原始申请内容。没有第三方 AI 数据请求。
- 提供 .env.example、生产 WSGI 入口、Docker 部署文件、配置文档、评分标准、CI 检查和虚构报告样例。

## 真实部署结论

读取现有生产域名 HEAD 响应，显示 Cloudflare 代理和 GitHub Pages 源站响应头；仓库 CNAME 及静态架构一致。GitHub Pages 不运行 Python 服务，现有 Google Apps Script 询价通道没有拿来接收招聘资料。Node backend 也为未接入生产的备用服务。

当前未部署独立 Python API、未配置真实 SMTP，也没有发送真实邮件。本页默认明确显示在线投递尚未开通，提交按钮禁用。接通需要支持 Python、HTTPS 及 SMTP 出站的服务、私有回执存储、真实 SMTP 环境变量，以及 scripts/careers-config.js 中的公开 API 地址；上线前需实际收件验证。

## 检查

- 10 组 Python 单元／接口测试通过：逐项评分、总分复现、经验公平性、逐题报告原文／转义、非法输入、SMTP TLS／固定收件人、来源限制、跨域预检、失败和去重。
- 24 项浏览器检查通过：中英入口、390/1440 宽度、未配置／SMTP 模拟成功／模拟失败／不完整成功回执、必填与电话邮箱及同意校验、候选人不显示分数、失败保留答案；首页／公司页／产品页 Footer 顺序及真实点击。
- 测试隔离的假邮件通道收件 4 次，真实发送 0 次；生产代码无假成功开关，生产容器不复制测试服务。
- 招聘页与题库生成一致、16 个静态产品页生成一致、85 产品架构、156 HTML SEO、154 个 sitemap 页面、211 HTML 结构化数据和 216 HTML GTM 检查通过。首页／翻译与 diff 检查通过。

## 主要文件

careers.html；zh/careers.html；data/careers-questionnaire.json；scripts/careers.js；scripts/careers-config.js；styles/careers.css；careers_backend/{questionnaire,scoring,validation,reporting,app}.py；careers_backend/.env.example；careers_backend/test_app.py；scripts/build-careers-pages.py；scripts/check-careers-browser.cjs；deploy/careers/；docs/CAREERS-DEPLOYMENT.md；docs/CAREERS-SCORING.md。

共享修改：get-quote-footer.js、bilingual-routing.js、公共资源导航样式及缓存版本、现有静态 Footer 入口、产品页生成器、两份 sitemap、Git 忽略规则和 CI 工作流。

本地执行：python -m careers_backend.app --serve-static --port 8000 ，打开 http://127.0.0.1:8000/zh/careers.html 。未配置 SMTP 时只供查看，不提交。

本次修改均在本地，未 commit、push 或部署。
