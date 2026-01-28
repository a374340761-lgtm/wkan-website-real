# 广西伟群帐篷制造有限公司网站

## 项目简介

这是一个为广西伟群帐篷制造有限公司设计的现代化、多语言支持的官方网站。网站采用简洁、美观、有条理的设计理念，提供完整的公司介绍、产品展示和客户服务功能。网站已达到**国际 B2B 电商标准**，具备完整的询价转化流程。

## ✨ 核心功能特性

### 🌐 多语言支持系统
- **4种语言支持**：中文（简体）、English、日本語、한국어
- **Language Gate（语言选择进入页）**：首次访问时显示全屏语言选择界面
- **自动语言记忆**：记住用户语言偏好，下次访问自动应用
- **顶部语言切换器**：随时切换语言，与 Language Gate 完全同步
- **平滑语言切换动画**：优雅的过渡效果
- **默认语言**：英语（English）为默认语言

### 🛍️ 产品中心（Signazon 级电商体验）

#### 左侧筛选系统
- **动态筛选器生成**：自动从产品数据生成筛选选项
- **分类筛选**：按产品类别（帐篷、旗帜、展示系统等）筛选
- **规格/应用筛选**：按产品规格和应用场景筛选
- **热门关键词标签**：快速筛选常用标签
- **实时筛选**：筛选结果即时更新
- **URL 状态管理**：筛选状态写入 URL，支持分享和刷新

#### 右侧产品列表
- **电商级列表视图**：Signazon 风格的产品列表展示
- **产品卡片信息**：图片、名称、描述、规格、操作按钮
- **搜索功能**：实时搜索产品（名称/关键词/规格）
- **排序功能**：
  - 最受欢迎（Popular）
  - 最新产品（Newest）
  - 名称 A-Z（Name A–Z）
- **分页功能**：自动分页，支持翻页导航
- **面包屑导航**：清晰的页面层级导航

#### 产品详情页（PDP）
- **产品详情（统一入口）**：`product-center.html?open=xxx`（可选 `&cat=...`）
- **兼容旧链接**：`product.html?id=xxx` / `product-detail.html?id=xxx` 会自动跳转到 Product Center
- **完整产品信息**：图片、名称、描述、规格、应用场景
- **标签页内容**：
  - 产品描述
  - 技术参数
  - 应用场景
  - 资料下载
- **相关产品推荐**：自动推荐同类产品
- **SEO 优化**：动态页面标题和描述

### 💬 RFQ 询价系统（一键转化）

#### 询价功能
- **一键询价按钮**：工具栏和产品列表中的 "Request a Quote"
- **智能产品选择**：
  - 优先使用购物车中的产品
  - 无购物车时显示当前筛选结果
- **自动生成询价内容**：
  - 用户信息（姓名、邮箱、公司、电话、国家）
  - 选中的产品列表（可修改数量）
  - 当前筛选条件（自动带入）
  - 用户备注信息
- **多种导出方式**：
  - 一键复制文本
  - 下载 CSV 文件
  - 发送邮件（mailto:）

#### WhatsApp / WeChat 集成
- **WhatsApp 一键发送**：
  - 直接打开 WhatsApp（网页版/App）
  - 自动预填完整 RFQ 内容
  - 双号码支持（主号 + 备用号）
  - 消息底部自动包含所有联系方式
- **WeChat 辅助面板**：
  - 微信二维码展示
  - 一键复制 WeChat ID
  - 一键打开微信 App
  - 使用说明和引导

### 🛒 购物车功能
- **添加产品到购物车**：产品列表和详情页支持
- **购物车状态管理**：localStorage 持久化存储
- **与 RFQ 集成**：询价时自动使用购物车产品

### 📧 联系表单
- **在线联系表单**：姓名、邮箱、电话、公司、消息
- **后端 API 支持**：Node.js + Express 后端服务
- **邮件发送**：使用 Nodemailer 自动发送询盘邮件
- **表单验证**：前端和后端双重验证
- **安全防护**：Helmet、CORS、Rate Limiting

### 📄 文件下载
- **PDF 下载**：产品资料和公司介绍 PDF
- **CSV 导出**：RFQ 产品列表 CSV 导出

## 🛠 技术架构

### 前端技术
- **HTML5**：语义化标签，SEO 友好
- **CSS3**：
  - CSS 变量系统
  - Flexbox / Grid 布局
  - 响应式设计
  - 动画和过渡效果
- **JavaScript（ES6+）**：
  - 模块化类设计
  - 事件驱动架构
  - LocalStorage API
  - URLSearchParams API
  - Fetch API

### 后端技术
- **Node.js** + **Express**：RESTful API 服务
- **Nodemailer**：邮件发送服务
- **express-validator**：表单验证
- **helmet**：安全防护
- **express-rate-limit**：请求限流
- **CORS**：跨域支持

### 文件结构

```
weiqun-website/
├── index.html              # 主页面（含 Language Gate）
├── products.html           # 产品列表页（筛选+列表+RFQ）
├── product.html            # 产品详情页（PDP）
├── products-*.html         # 分类页面
├── styles/
│   ├── main.css            # 主要样式文件（含所有新功能样式）
│   ├── multilang.css       # 多语言样式支持
│   └── cart.css            # 购物车样式
├── scripts/
│   ├── main.js             # 主要功能脚本
│   ├── multilang.js        # 多语言系统（含 Language Gate）
│   ├── products.js         # 产品管理（筛选/排序/分页/RFQ）
│   ├── product-detail.js   # 产品详情页逻辑
│   ├── cart.js             # 购物车功能
│   └── contact.js          # 联系表单
├── backend/
│   ├── server.js            # Express 后端服务器
│   ├── package.json        # 后端依赖
│   └── env.example         # 环境变量示例
├── images/                 # 图片资源（498+ 文件）
├── data/                   # 数据文件（价格表、PDF等）
└── README.md               # 项目说明
```

## 🚀 快速开始

### 1. 本地运行前端

直接在浏览器中打开 `index.html` 文件即可预览网站。

或使用本地服务器：
```bash
# Python 3
python -m http.server 3000

# Node.js (需要安装 http-server)
npx http-server -p 3000
```

### 2. 启动后端服务（可选）

```bash
cd backend
npm install
# 复制 env.example 为 .env 并配置邮箱信息
cp env.example .env
# 编辑 .env 文件，填入你的邮箱配置
npm start
```

后端服务将在 `http://localhost:3000` 运行。
http://localhost:3000
### 3. 配置说明

#### 邮箱配置（后端）
编辑 `backend/.env` 文件：
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

#### WhatsApp 号码（前端）
编辑 `scripts/products.js` 中的 `setupWhatsApp()` 方法：
```javascript
this.whatsAppPrimary = '8618378781011';   // 主号
this.whatsAppSecondary = '8613824540280'; // 备用号
```

#### WeChat 信息（前端）
1. 准备微信二维码图片：`images/wechat-qr.png`
2. 编辑 `products.html` 中的 WeChat ID：
```html
<span id="wechatIdText">massifmyth</span>
```

## 📋 功能清单

### ✅ 已实现功能

- [x] **多语言支持**（4种语言，英语默认）
- [x] **Language Gate**（语言选择进入页）
- [x] **产品列表页重构**（左侧筛选 + 右侧列表）
- [x] **动态筛选器**（自动生成筛选选项）
- [x] **实时搜索**（产品名称/关键词/规格）
- [x] **排序功能**（Popular/New/Name A-Z）
- [x] **分页功能**（自动分页导航）
- [x] **URL 状态管理**（筛选状态写入 URL，可分享）
- [x] **产品详情页**（PDP，独立页面）
- [x] **RFQ 询价系统**（一键询价）
- [x] **WhatsApp 集成**（一键发送）
- [x] **WeChat 集成**（二维码+复制ID）
- [x] **购物车功能**（添加/管理产品）
- [x] **联系表单**（后端 API 支持）
- [x] **PDF 下载**（产品资料）
- [x] **CSV 导出**（RFQ 产品列表）
- [x] **响应式设计**（移动端适配）
- [x] **SEO 优化**（动态标题/描述）

### 🔜 可选升级功能

- [ ] 根据国家自动切换 WhatsApp/WeChat 优先级
- [ ] RFQ 提交后自动生成专业报价模板（Excel/PDF）
- [ ] 首页浮动 WhatsApp 按钮
- [ ] 根据 IP 自动推荐语言（但不强制）
- [ ] Language Gate 动画/品牌视频
- [ ] 独立 RFQ 页面（支持保存草稿）

## 🎯 使用指南

### 添加新产品

1. 编辑 `scripts/products.js`
2. 在 `products` 数组中添加新产品对象：
```javascript
{
    id: 999,
    category: 'tents',  // 分类
    name: '产品名称',
    nameEn: 'Product Name',
    nameJa: '製品名',
    nameKo: '제품명',
    description: '产品描述',
    descriptionEn: 'Product Description',
    // ... 其他语言描述
    specs: ['规格1', '规格2'],
    specsEn: ['Spec 1', 'Spec 2'],
    // ... 其他语言规格
    image: 'product-image.jpg',
    price: '询价'
}
```

### 修改翻译内容

1. 编辑 `scripts/multilang.js`
2. 在 `translations` 对象中修改对应语言的键值
3. 确保所有语言的键值对应

### 更新筛选选项

筛选选项会自动从产品数据生成，无需手动配置。如需调整：
1. 修改产品的 `specs` 数组
2. 系统会自动提取并生成筛选选项

### 自定义样式

1. 主要样式：`styles/main.css`
2. 多语言样式：`styles/multilang.css`
3. 购物车样式：`styles/cart.css`
4. 使用 CSS 变量系统，便于主题定制

## 🌐 浏览器支持

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ⚠️ IE 11（部分功能受限）

## 📞 联系方式

- **公司名称**: 广西伟群帐篷制造有限公司
- **WhatsApp（主）**: +86 183 7878 1011
- **WhatsApp（备）**: +86 138 2454 0280
- **WeChat ID**: massifmyth
- **邮箱**: wktent@vip.163.com

## 📝 更新日志

### 2024 最新更新

- ✅ **Language Gate**：首次访问语言选择界面
- ✅ **产品列表重构**：Signazon 级电商体验
- ✅ **RFQ 询价系统**：一键询价，自动生成内容
- ✅ **WhatsApp/WeChat 集成**：一键发送，双号码支持
- ✅ **URL 状态管理**：筛选状态可分享/刷新
- ✅ **产品详情页**：独立 PDP 页面，SEO 优化
- ✅ **动态筛选器**：自动生成筛选选项
- ✅ **排序和分页**：完整的列表管理功能

## 📄 许可证

本项目仅供广西伟群帐篷制造有限公司使用，保留所有权利。

---

**注意**: 这是一个专业的商业网站项目，已达到国际 B2B 电商标准。请确保在部署前完成所有内容的审核和测试。

**技术栈**: HTML5 + CSS3 + JavaScript (ES6+) + Node.js + Express

**网站级别**: ⭐⭐⭐⭐⭐ 国际 B2B 电商标准
