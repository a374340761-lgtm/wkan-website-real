# 2026规格与装箱资料全量补充

> 后续快幕秀包装复核见 `waveline-source-correction-2026-10-24.md`：Q列单位已由用户确认为毫米，保留mm原值并换算为cm；旧画册型号无法与WK-FS确认对应的包装/数量/重量已暂时清空。

来源：用户指定的 `C:/Users/User/Downloads/2026价格表`。21份Excel工作簿的全部非空工作表均已读取并建立技术资料对应；补充DOCX的三张图片均已目视核对。原文件未修改。

## 本次结果

- 从原先239行扩充为141组、802行配置，包含67个现有产品/类目数据入口和25个单独列示的系列。行数包括不同来源或配置分别保留的记录，不代表802个不同产品。
- 补充材质/尺寸/管径/壁厚、单件重量或表列容量、装箱数、箱规、整箱毛重、20GP/40HQ参考装柜量、布料尺寸/用料面积、部件分别包装等技术资料。
- 原表没有的单元格留空，不填0或推测值。存在冲突时，保留型号和可用字段，冲突字段留空并加说明。
- 同型号不同材质、不同原表或不同包装独立列示。例如方管铝架、六角铝架、铁架不混用；WK-FS不覆盖WK-HZ，WK-HO不覆盖AD-H1。
- 价格、折扣、税费、加工收费等没有进入公开规格资料；不会公开原始价格工作簿或包含价格的截图。
- 组合包装字段保留原表说明，仅在单一配置、数量及重量口径明确时另提取数量和毛重。没有从空件重量推算整箱毛重。
- 300D/600D布料及素色PU/PVC布料分别列示。原表“面积”保留为用料面积，不当作帐篷占地面积；未扩大为全产品通用防水、阻燃或抗风认证。

## 网站入口

- `/specifications-packing.html` 与 `/zh/specifications-packing.html`：完整可搜索、可展开、可直接链接的静态规格资料页。搜索关闭JavaScript时，表格仍在HTML中，可手动展开。
- 产品目录和产品中心加入原生入口。已对应的产品规格区加入跳转到本型号资料的链接。
- 现有动态详情页、类型页和16个静态产品页使用同一份技术数据；版本号同步更新，空白参数不显示破折号或假数字。
- 加入双语站点地图、canonical、hreflang和CollectionPage结构化信息；复用已有页眉、页脚和视觉样式。

## 可复核来源

- `specifications-2026-coverage.json`：每个工作表、对应组和来源行覆盖情况。
- `specifications-2026-source-map.json`：文件哈希、原工作表、原行号、补充截图来源和异常说明。
- `data/product-specifications-2026.json`：公开技术字段和逐行中英文值。

## 验证

- `check-specifications-completeness.cjs`：21工作簿覆盖、所有公开字段无价格条款、英文单元格无中文残留、缺失值为空、已知装箱数/毛重/装柜量比对、4组中英文手机/桌面搜索与跳转检查通过。
- 202个产品/页面场景检查通过；20项产品图库/筛选/询价交互通过。
- 85产品架构、16静态产品页生成一致性、158 HTML SEO检查、156站点地图落地页及214 HTML结构化数据检查通过。

本次只修改本地网站，未推送或部署；也未把页面检查等同于线上收录、排名或流量改善。

## 维护

需要重新提取时，Python需安装openpyxl与xlrd。执行：

```powershell
python scripts/sync-2026-specifications.py "C:\Users\User\Downloads\2026价格表"
python scripts/build-specifications-library.py
node scripts/build-static-product-pages.mjs
python scripts/build-page-sitemap.py
node scripts/check-specifications-completeness.cjs
```

`complete-2026-specifications.py`由同步入口调用，不能作为独立脚本直接运行。原表字段映射是显式列号；更换原表版本或列结构后应先核对映射，不能直接假定新表沿用旧列。
