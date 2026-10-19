# 弧形系列显示修复与便携摆摊架专题 — 2026-10-20

## 弧形系列
- 展示系统菜单新增项立即提供中英文文本，避免初始化时以空字符串显示；翻译执行后也有新项缺失文本回退。
- 更新全站HTML中共享main/multilang/products/product-detail脚本版本，防止新菜单与旧翻译、旧目录数据混用。维护的静态产品生成器同步版本。
- 浏览器验证英文/中文产品目录WK-HZ卡片使用8张实拍中的整体框架图；悬停菜单显示弧形系列/Curved Line Series。

## 新产品与位置
名称：1×1米便携铝合金摆摊架。已确认参数仅为1×1米、40毫米铝管框架；未编造高度、承重、壁厚、重量、箱规、价格或厂家型号。

- 放置于展示系统 → 1×1米便携摆摊架；新增中英独立静态专题、目录条目及HTML地图/展示集合页内链。
- 中文：/zh/products/1x1m-40mm-aluminum-market-stall.html
- 英文：/products/1x1m-40mm-aluminum-market-stall.html
- 内部目录标识 MARKET-STALL-1X1-40MM 仅用于站点产品关联，不作为已提供的厂家型号宣传。
- 提供6张用户原图：展开框架、成套布置示例、折叠收拢、部分展开、台面/连接件、可配套手提包。图片原样复制重命名，保存来源映射。
- 布画、台面和手提包的包含情况需要在报价中确认；照片中的品牌为应用示例。

图片目录：images/products/displays/market-stall-1x1-40mm/
生成源：scripts/build-static-product-pages.mjs；共享目录：scripts/products.js。

## 验证
- 4组中英/390与1440像素专题浏览器检查：6张图、可选包说明、脚本/资源/横向溢出均正常。
- 2组中英弧形列表卡片、菜单标签和新专题菜单点击验证通过。
- 85个产品架构、16个静态产品页、152个HTML/150个sitemap落地页、207个HTML的结构化数据通过；212页GTM、静态首页与翻译检查通过。
- 210个HTML的本地href/src/poster目标无缺失；6张原图校验一致；git diff --check通过。
- 浏览器证据：market-stall-curved-check-2026-10-20.json；截图market-stall-390-2026-10-20.png和market-stall-1440-2026-10-20.png。

状态：本地完成，未commit/push/部署。保留本任务之前尚未提交的全部产品照片及相关修改。
