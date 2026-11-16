# 六语言上线交付记录

版本：20261117-six-languages-r1 · 编码：UTF-8 · 2026-11-17

## 交付状态

本地静态发布包已完成并通过技术上线检查，尚未 commit、push 或部署。沿用德语目录、页面层级和静态镜像交付方式。

| 语言 | 路径 | HTML / hreflang | 页面及兼容路由 | 可索引页面 |
|---|---|---|---|---|
| 法语 | /fr/ | fr | 114 | 99 |
| 意大利语 | /it/ | it | 114 | 99 |
| 葡萄牙语 | /pt/ | pt-BR | 114 | 99 |
| 荷兰语 | /nl/ | nl | 114 | 99 |
| 瑞典语 | /sv/ | sv | 114 | 99 |
| 丹麦语 | /da/ | da | 114 | 99 |

共新增 684 条页面及兼容路由、594 条可索引页面；全站 sitemap 共 949 条规范 URL。语言菜单、产品名称、搜索、动态界面和询价提示已接入。招聘按德语既有范围跳转中文入口；原始 PDF 和证书继续共用。

## 验证证据

- 六语言静态检查：覆盖、UTF-8、中文残留、内部链接、HTML 语言、自引用 canonical、sitemap 与双向语言标记通过。
- 浏览器：390 与 1440 像素各六语言，共 12 组场景通过。检查首页无横向溢出、语言入口、参数与锚点保留、产品搜索、表单预填及模拟提交成功，未发现脚本异常和本站资源 404。
- 原有架构、规格库、首页静态内容、静态翻译、16 个静态产品页、德语与西语镜像、SEO、结构化数据、GTM 检查通过。
- Git diff 空白检查通过。模型及缓存保存在仓库外，部署只需 HTML、JS、JSON 和现有公共资源。
- 浏览器结果与截图：`reports/localization/`。自动化询价测试拦截生产请求，使用模拟成功回执，没有发送真实询价。

正文采用离线模型翻译，并修订导航等核心术语，保护尺寸和型号；没有经过六种语言的母语人士逐页人工审校。葡语按巴西地区标记，地区措辞仍可继续优化。技术验证不等于母语译审或法律文本审核。

## 用户自行提交和 push

请将六个语言目录、词典与脚本、修改后的现有语言页面、两份 sitemap、配置、生成器、CI 与交付文档一起提交。不要只提交新增脚本，否则语言切换与 sitemap 会不一致。

版本配置由 `scripts/six-language-config.json` 统一维护。相关浏览器资源引用已经更新为同一版本号，避免沿用旧缓存。新语言纳入 GitHub Actions 静态检查，CI 不下载翻译模型。

`.editorconfig` 约定 UTF-8 编码，`.gitattributes` 统一源码换行为 LF；本次修改的文本文件已做 UTF-8 解码和换行检查。

提交前可重跑：

```powershell
python -m pip install beautifulsoup4==4.15.0
python scripts/validate-six-language-sites.py
python scripts/validate-seo.py
node scripts/validate-architecture.mjs
node scripts/check-six-language-browser.cjs C:/path/to/playwright
```

## 重建

```powershell
python -m pip install -r scripts/requirements-localization.txt
python scripts/build-six-language-sites.py --download-models --release
```

模型和缓存默认在 `%LOCALAPPDATA%/WaiKwan/localization`（Linux 为用户缓存目录）；可用 `--workdir` 指定目录。原模型源不可用时使用固定版本镜像并验证 SHA-256。构建后的数字异常报告在 `reports/localization/*-review.json`。模型权重不提交 Git。

## push 后的线上检查

实际线上检查需等用户 push 并完成托管部署后执行：确认六个首页和典型产品页返回 200、真实语言切换、sitemap 可访问、缓存更新，以及通过获授权的测试资料确认生产收件。当前本地模拟测试不证明生产收件服务的实际可用性。
