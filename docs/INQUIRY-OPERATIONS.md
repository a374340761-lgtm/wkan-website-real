# 询价链路运行契约

生产页面当前使用以下链路：

`contact-us.html` → `scripts/contact.js` → `scripts/inquiry-hook.js` → Google Apps Script

`backend/server.js` 是未接入当前页面的备用实现。除非同时更换 `WK_INQUIRY_SUBMIT` 适配器并完成收件测试，否则不要将它描述为生产询价后端。

## 请求契约

浏览器为每次用户提交生成 `inquiry_id`，并将同一个值作为 `idempotency_key`。服务端应：

1. 校验必填字段、长度和允许的字段类型；蜜罐检查不能只依赖浏览器。
2. 以 `idempotency_key` 去重。相同键的重复请求必须返回第一次持久化结果，不能创建第二条线索。
3. 先持久化询价，再返回成功。销售通知属于持久化后的独立步骤。
4. 成功时返回 JSON：`{"ok":true,"inquiry_id":"..."}`。
5. 明确拒绝时返回非 2xx，或 JSON：`{"ok":false,"error":"...","inquiry_id":"..."}`。

为兼容当前已部署的 Apps Script，前端暂时继续接受纯文本 `ok` 或 `success`。新服务应使用 JSON 回执。

## 前端状态

- `ok`：服务端明确确认成功，页面清空表单并触发 `wk:inquiry-success`。
- `rejected`：服务端明确拒绝，页面保留内容。
- `unconfirmed`：超时、网络错误、非成功 HTTP 或无法识别的响应。由于请求可能已被服务端保存，前端不会自动重试。

## 发布检查

- 使用测试端点覆盖成功、拒绝、超时和重复 `idempotency_key`。
- 测试数据不得发送到真实销售通知渠道。
- 核对持久化记录中的 `inquiry_id`、时间、来源页和主要表单字段。
- 确认通知失败不会把已经保存的询价返回为提交失败。
- 记录 Apps Script 的发布版本、负责人、数据访问权限和备份恢复方式。
