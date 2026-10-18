# NW 中性站姿：原生 SVG 与四款发型

**当前：用户已确认定稿。** 卷发第四轮、低束发第四轮、双色碎发第三轮的 NW 中性站姿发型视觉通过。[定稿快照、源与确认记录](approved/README.md)。本次只归档与标记状态，造型未修改；下方待反馈等文字为历史。

**当前第四轮：** 用户已确认第三轮双色碎发基本满足要求、低束发根正确；本轮只微调卷发短碎发与低束前发末段，见 [hair-touchup-v4](hair-touchup-v4/README.md)。已确认部分固定保留，本轮两处待反馈，前版文件与历史证据独立保存。

**当前第三轮：** 用户追加卷发密纹/短碎发、低束前发位置及碎发侧面长短问题后，已按完整四图局部修订，见 [hair-refinement-v3](hair-refinement-v3/README.md)。新造型待审阅；上一轮碎发“勉强合格但需调整”不记最终验收。下方及本目录原数据为历史，各轮证据独立保留。

**后续进展：用户已授权重做三款，第二轮重绘完成，待视觉审阅。** 新变更、技术检查与截图见 [hair-redraw-v2](hair-redraw-v2/README.md)，原失败 SVG 与源在其 `before/` 下；本目录原始资产清单/检查/截图继续代表第一轮，未覆盖。当前 public 三款 SVG 已更新，短发 SVG 保持一致。

**最新用户结论：新增长卷发、偏分低束发、双色碎发 NW 均不合格。** 三款保留为失败试稿，不是已完成造型；短发 SVG 本次也未获得额外确认，已认可的仍是 v4 二维短发。已对照原设定分析根因与逐款问题，见 [否定后的分析](HAIR_REJECTION_ANALYSIS.md)。本轮仅分析/记录，无造型修改或新增技术测试。下文为该批原始实施和技术记录。

日期：2026-10-16（Asia/Shanghai）。用户先确认 v4 经典短发二维稿，随后授权实施“先制独立 SVG，再补其余三种发型的同一 NW 方向”。本批只处理这个方向的中性站姿。

## 已实施

| 资产 | 文件 | 内容 |
| --- | --- | --- |
| 经典短发 | `public/character-shorthair-standing-nw.svg` | 按认可稿的轮廓及头肩位置重建 |
| 层叠长卷发 | `public/character-curly-standing-nw.svg` | 新增不对称背侧发体、层叠外翻发尾及近侧弯曲发束 |
| 偏分低束发 | `public/character-sidepart-standing-nw.svg` | 对应原左侧收拢方向，区分近侧与远侧发束、后颈集束及低扎发尾 |
| 双色蓬松碎发 | `public/character-shaggy-standing-nw.svg` | 浅麦金碎发层覆盖深色后颈底发，保留两层分离的轮廓 |

四个文件均为独立透明 SVG，只有路径、渐变、椭圆及矢量裁切；不含 `<image>`、PNG/base64、foreignObject 或脚本。每款约 30–31 KB；文件大小不是性能改善证据。`assets.json` 记录本次文件大小和 SHA256。

制作源：`tools/character-nw-svg/reference-contours.json` 保存从认可稿只读提取、平滑后拟合的轮廓；`tools/character-nw-svg/hair.mjs` 是单独的 NW 发片几何。`scripts/build-character-nw-svg.mjs` 统一输出身体、脸部底形、头部位置、帽子与软影，仅切换发片。头部保持认可稿的 `translate(10.875,0)`，不加旋转或缩放。原四视图组件、旧 NW=背面契约、四款发型源、椅子与布局全部保留，新资产标识为 `NW-eight-view`。

没有引入 image_gen、模型、Blender、运行时渲染器或新依赖。`extract-nw-vector-reference.mjs` 仅以浏览器 canvas 读取原图，提取几何/透明度并渲染旧发型参考；没有裁改、重绘或覆盖输入 PNG。底部软影从原透明度等值轮廓分段重建；初轮曲线控制柄在下摆转角过冲形成凸出的深色块，已限制控制柄长度并复验。源位图噪声/纹理没有机械转成大量碎片，SVG 明暗较简洁，因此不是像素级复制。

审阅入口：**http://127.0.0.1:4181/character-standing-nw-svg-review.html**。用户原先打开的 `/character-shorthair-standing-nw-2d-review.html` 同步此页；认可稿固定入口 `/character-shorthair-standing-nw-2d-review-v4.html` 保留。页面提供认可稿/短发 SVG 的头肩及全身同倍率对照、四发型并排及下载，以及可展开的“原左侧 / 新 NW / 原背面”关系。

## 本轮技术验证

- Windows 本机无头 Chromium，DPR 1，1200×1000 与 390×844；四张 SVG 解析/解码通过、透明四角、无位图/脚本，页面无异常及横向溢出。仅静态制作与显示检查，不等于前台浏览器、内置浏览器或真实手机的性能/视觉证据。
- 四款共用同一脸部底形和头部变换；身体、帽子与软影由生成器共用。53 项原文件保护哈希不变；v1 输入原图的 SHA256 与认可前一致。验证了本轮实际输出，未计入历史测试次数。
- 与认可 v4 合成稿在原生 1060×1484 下对照：不透明轮廓交并比约 **99.43%**；可见脸部交并比约 **97.78%**；脸部左外缘平均偏差约 **0.71 源像素**、最大 **2 源像素**。软影半透明区域 alpha 平均差约 **5.72/255**。这些数据用于检查矢量重建是否明显走样，不代表用户视觉通过。原图光栅边缘、软透明与平滑曲线存在近似差异。
- 相关 `.mjs` 语法、原生 SVG DOM 及文档 whitespace 检查；本批未改产品 TS/React 调用链，没有重跑产品构建/全量回归，没有性能采样。最终结果见 [verification.json](verification.json)。

## 用户视觉与下一步

**用户最终视觉验收：** v4 二维短发造型已通过；本次独立 SVG 转换及另外三种发型的 NW 均待审阅。没有自动继承原四视图或位图的验收。

下一步先对照确认短发 SVG 的脸型、头肩位置及软影，再按各发型轮廓/遮挡反馈逐款收尾。运行时换色/部件参数、房间角色接入、坐姿以及其它七方向均未实施；不得将这一批站姿直接套到椅子上。性能继续暂停，第三阶段未启动，3000 服务未改，未提交/推送。

截图：[短发头肩](short-head-comparison.png)、[短发全身](short-full-comparison.png)、[四款发型](four-hairstyles.png)、[发型方向参照](hair-direction-references.png)、[桌面](review-desktop.png)、[390px](review-390.png)。

重新生成（在项目根目录）：`node scripts/build-character-nw-svg.mjs`。显示与保护核对：`node scripts/review-character-nw-svg.mjs`。一般调整只改矢量轮廓/发片，不需要重新提取认可原图。
