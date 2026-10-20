# 产品目录分类链接修复

用户截图的全部产品目录分类区及顶部分类入口已在中英、390/1440 两种宽度下实际点击核查，共 62 次。

复现：配件链接到 all-products.html?cat=accessories 后，旧 stripAccessoriesCatFromUrl 逻辑删除分类参数，同时分类选项被主动排除，造成回到全部产品。

修复：保留并支持 accessories 分类与下拉选项；继续使用已有 24 格配件展示和询价逻辑。目录内的产品筛选链接加入结果锚点，配件使用实际可见的 allProductsAccessoriesSection；渲染后定位，避免停在页面顶部或跳向隐藏网格。同步脚本与样式缓存版本，生成器版本一致。

62 次链接点击复测无失败（catalog-click-check.json）；最终配件锚点另以四种语言／视口组合验证，分类参数、选中项、24 张卡片及结果区域顶部位置均正确（catalog-accessories-navigation-check.json，结果区顶部 150px，避开固定导航）。架构、静态产品生成一致性、SEO 和 diff 检查通过。

所有修复在本地，未推送或部署。
