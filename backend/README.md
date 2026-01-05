# 伟群帐篷公司网站后端API

## 功能特性

- ✅ 联系表单提交处理
- ✅ 邮件发送（给公司和客户）
- ✅ 表单验证
- ✅ 速率限制
- ✅ 安全防护
- ✅ 错误处理

## 快速开始

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置环境变量

复制 `env.example` 为 `.env` 并填写配置：

```bash
cp env.example .env
```

编辑 `.env` 文件：

```env
# 服务器配置
PORT=3001
FRONTEND_URL=http://localhost:3000

# 邮件配置
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 3. 邮件服务配置

#### Gmail 配置
1. 启用两步验证
2. 生成应用专用密码
3. 在 `.env` 中填入邮箱和密码

#### 其他邮件服务
修改 `server.js` 中的 `transporter` 配置：

```javascript
const transporter = nodemailer.createTransporter({
    host: 'smtp.your-provider.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
```

### 4. 启动服务器

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

服务器将在 `http://localhost:3001` 启动

## API 接口

### 联系表单提交
- **URL**: `POST /api/contact`
- **Content-Type**: `application/json`

**请求体**:
```json
{
    "name": "张三",
    "email": "zhangsan@example.com",
    "phone": "13800138000",
    "message": "我想了解你们的产品..."
}
```

**响应**:
```json
{
    "success": true,
    "message": "消息发送成功！我们将在24小时内与您联系。"
}
```

### 健康检查
- **URL**: `GET /api/health`
- **响应**: 服务器状态信息

## 部署

### 使用 PM2 部署

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start server.js --name weiqun-api

# 查看状态
pm2 status

# 查看日志
pm2 logs weiqun-api
```

### 使用 Docker 部署

创建 `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

构建和运行：

```bash
docker build -t weiqun-api .
docker run -p 3001:3001 --env-file .env weiqun-api
```

## 安全特性

- **Helmet**: 设置安全 HTTP 头
- **CORS**: 跨域请求控制
- **Rate Limiting**: 防止暴力攻击
- **Input Validation**: 输入验证和清理
- **Error Handling**: 统一错误处理

## 监控和日志

建议使用以下工具进行监控：

- **PM2**: 进程管理
- **Winston**: 日志记录
- **New Relic**: 应用性能监控

## 故障排除

### 常见问题

1. **邮件发送失败**
   - 检查邮箱配置
   - 确认应用专用密码正确
   - 检查网络连接

2. **CORS 错误**
   - 检查 `FRONTEND_URL` 配置
   - 确认前端域名正确

3. **端口占用**
   - 修改 `PORT` 环境变量
   - 或使用 `lsof -ti:3001 | xargs kill -9` 释放端口

## 联系支持

如有问题，请联系开发团队。
