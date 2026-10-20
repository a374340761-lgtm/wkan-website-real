> 历史实现，当前网站招聘提交不使用 SMTP 或此 Python API。当前说明见 CAREERS-DEPLOYMENT.md。

# 招聘页面与邮件部署

## 已确认的生产架构（2026-10-20）

- 页面为静态 HTML、CSS、JavaScript，中英文入口分别位于根目录和 /zh/，主导航、联系页脚及 Follow Us 通过现有组件维护。
- 实际请求 https://www.waikwantent.com/ 的 HEAD 响应显示 Server: cloudflare，同时含 x-github-request-id、x-github-edge-region、X-Served-By 等 GitHub Pages 源站特征。CNAME 为 www.waikwantent.com，仓库来自 GitHub。GitHub Pages API 匿名请求返回 404，未据此推测不可见的分支设置。
- 仓库里的 Vercel、Netlify 配置仅描述跳转，不是 Python 部署配置；GitHub Actions 的 Python 步骤用于检查静态站点，不是长期运行的后端服务。
- 现有询价通过 Google Apps Script；backend/server.js 是备用 Node 服务，未作为生产招聘后端使用。招聘资料不会复用询价通道或发送给第三方 AI。
- GitHub Pages 不运行 Python 服务器端代码。官方说明：https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

**当前邮件没有真实接通。** 未配置真实 SMTP，未部署招聘 Python API，未向真实收件邮箱发送测试申请。页面默认明确显示未开通，提交按钮不可用。拥有本地 Python 不等于线上可运行 Python。

## 本地查看（不安装依赖，不发送真实邮件）

在仓库根目录运行：

    python -m careers_backend.app --serve-static --port 8000

浏览 http://127.0.0.1:8000/zh/careers.html 或 /careers.html。未配置 SMTP 时可浏览岗位和完整问卷，显示在线投递尚未开通，不能提交。普通静态服务器也可预览，API 检查失败会保持未开通状态。

仅运行 API：

    python -m careers_backend.app --port 8000

本地生产外服务的访问原点需要包含在 CAREERS_ALLOWED_ORIGINS 中。--serve-static 仅为开发提供受限制的公共资源服务；生产不要启用 CAREERS_SERVE_STATIC。

## 接通生产所需步骤

1. 在支持 Python 3.12、HTTPS 和 SMTP 出站访问的服务器或容器服务部署 careers_backend。确认宿主允许连接邮箱服务的 587 或 465 端口。现有静态站点无需迁移。
2. 为该服务配置一个 HTTPS 地址，例如 https://careers-api.example.com。允许来源只填实际网站原点 https://www.waikwantent.com，不能使用通配符。
3. 在服务器的私密环境变量面板配置下列 SMTP 项，参考 careers_backend/.env.example。不要在聊天、HTML、JS 或 Git 中写真实密码。本程序不自动加载 .env；本地可用 PowerShell 的环境变量，生产用宿主的 Secrets / Environment。
4. 配置持久化私有磁盘 CAREERS_DB_PATH，位于网站目录和 Git 之外。仅保存申请编号、内容摘要、发送状态和时间以防重复，不保存联系信息、答案或评分。回执保留 30 天，在下一次处理申请时清理。
5. 部署并查看 /api/careers/status，应返回 accepting_applications: true。这个状态只说明配置完整，**不证明 SMTP 账号可登录或邮箱已收到**。
6. 在测试来源下，用明确标记的虚构资料完成一次真实 SMTP 收件测试，确认 yishu@waikwantent.com 收到完整报告。此步骤由部署负责人执行；本次自动化测试没有发送真实邮件。
7. 收件测试通过后，把 scripts/careers-config.js 的 WK_CAREERS_API_BASE 设为已部署服务的 HTTPS /api/careers 地址，再发布静态站点。该文件只能含公开接口地址。

### 环境变量

| 变量 | 用途 |
|---|---|
| SMTP_HOST | 真实邮箱服务的 SMTP 主机 |
| SMTP_PORT | 通常为 587（STARTTLS）或 465（SSL） |
| SMTP_SECURITY | starttls 或 ssl，不支持明文模式 |
| SMTP_USERNAME | SMTP 登录账号 |
| SMTP_PASSWORD | 邮箱服务要求的授权码或应用专用密码 |
| SMTP_FROM | 允许由该 SMTP 账号发出的完整邮箱地址 |
| CAREERS_ALLOWED_ORIGINS | 允许的前端原点，逗号分隔；生产为 https://www.waikwantent.com |
| CAREERS_DB_PATH | 服务器私有持久化磁盘的 SQLite 路径 |

接收地址在服务端固定为 yishu@waikwantent.com，不接受浏览器提交的收件地址。应按邮箱服务要求验证发信域名及 SPF/DKIM，实际收件测试也要检查垃圾邮件文件夹。

### Linux 启动 / Docker

    pip install -r careers_backend/requirements.txt
    gunicorn --bind 0.0.0.0:8000 --workers 1 --threads 4 --timeout 90 careers_backend.app:application

容器构建（在仓库根目录）：

    docker build -f deploy/careers/Dockerfile -t waikwan-careers .

将上述环境变量通过宿主注入，并为 /var/lib/waikwan-careers 挂载私有持久化磁盘。容器以非 root 用户 uid 10001 运行，挂载目录须允许该用户读写。不要将 .env 文件放在构建上下文中；Dockerfile 只复制后端代码。生产须有 HTTPS 反向代理。

应用设有每进程每来源地址每小时 20 次 POST 的基础限制、来源白名单、64 KB 请求上限、字段白名单和蜜罐。默认只信任连接地址，不信任客户端 X-Forwarded-For；反向代理可能让多个访客共享限额，正式开放时应在可信入口配置按真实来源的全局限流。不要用开发 WSGI 服务器直接承载公网流量。

## 成功、失败和隐私行为

- 前端只有在 HTTP 成功、ok:true 且申请编号与本次一致时才显示“提交成功”；API 不向候选人返回任何得分。
- 后端在 SMTP 接受邮件后才返回成功；认证、TLS、网络或收件人拒绝等失败不会伪装成功。SMTP 接受不等于邮箱最终投递，因此上线仍需实际收件核对。
- 重复编号与相同内容已发送时返回原回执，不再次发信。处理中或发送结果不确定时不自动重发，页面提示联系负责人核实。网络失败后同一编号可能返回 409，这是防重复保护，不能通过清数据库盲目重发。
- 发送超时或失败保留页面答案，不在浏览器持久化个人信息，也不把答案放入 URL。不得把日志、邮箱报告或候选人资料提交到 Git。
- SMTP 凭据仅来自服务器环境变量。完整答案仅用于生成发给招聘负责人的报告；无第三方 AI 请求。邮件中的原文做 HTML 转义，不允许用户注入邮件头。
- 招聘负责人应限制邮件访问，对删除、更正请求及时处理，并在招聘结束后及时清理不再需要的资料。自动分数只辅助交流，不自动录用或淘汰。

## 维护与测试

    python scripts/build-careers-pages.py
    python -m unittest careers_backend.test_app -v
    node scripts/check-careers-browser.cjs

浏览器测试使用本地虚构资料和隔离的假邮件通道，覆盖未配置、成功、失败、表单校验、手机布局和 Footer 入口；绝不调用真实邮箱。题目或评分修改后更新版本，同时重新生成公开题目数据、页面和评分说明，避免旧客户端与新评分规则混用。
