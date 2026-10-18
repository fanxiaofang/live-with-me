# NW 二维站姿候选 v1，2026-10-16

**已实施：** 一张二维设定候选、原四图并排与头肩放大。**技术检查：** 下述图片/显示/保护检查通过。**用户最终视觉验收：** 待反馈。最终 SVG 尚未制作。

## 本轮方法

用户授权先做二维设定，确认造型后再制作 SVG。使用内置 `image_gen`（没有 CLI/API Key），以原四张站姿 SVG 直接渲染的参考图为输入。输入分别是[原四图总参照](reference-original-four.png)、[左侧放大](reference-left.png)、[背面放大](reference-back.png)；不使用失败的三维人物作为参考。

生成一次，未要求补齐八方向。只做经典短发 NW 中性站姿：头和身体朝左上、自然落肩/垂手、圆手、连体长袍遮脚。完整原提示见 [prompt-v1.md](prompt-v1.md)。模型与原 SVG 仍保留原样；本候选不直接作为运行时资产。

内置工具原输出保留在 `C:/Users/15176/.codex/generated_images/01a13fe7-08bb-7da2-a8d4-38803766444e/exec-07c44960-a375-4b3d-8b22-edeeb2ce921b.png`，逐字复制到项目，不覆盖原图：

- 项目候选：`public/character-shorthair-standing-nw-2d-candidate-v1.png`
- 分辨率 1060×1484，523631 bytes，四角 alpha=0，具真实透明通道。
- SHA256：`fdb50cecd7bb24841093198bd7224ddce1849448b560244abf9976b0ebe0f799`。

## 审阅材料

入口：**http://127.0.0.1:4181/character-shorthair-standing-nw-2d-review.html**。

- [原四图与候选并排](comparison-desktop.png)
- [头肩三图对照](head-shoulder-comparison.png)
- [新 NW 头肩局部](nw-head-shoulder-v1.png)
- [完整桌面页](review-desktop.png)、[390px 页](review-390.png)
- [图片透明度/显示对齐元数据](candidate-metadata.json)、[检查结果](verification.json)

原四图沿用同一 viewBox / 同一倍率。候选读取 alpha≥230 的整体轮廓范围，将其帽顶与袍底显示对齐到原背面的高 alpha 轮廓；只调整页面显示尺寸/位置，不裁改候选像素。它是近似的全身比例比较，不代表名义头圆、所有关节点或接触尺寸已精确校准。头肩图是同一候选在页面的局部放大，没有生成第二张不同人物。

## 检查与实际限制

- 53 个受保护原文件 SHA256 仍与基线一致（原四图 SVG、人物方向/比例源、原椅子/布局等），记录在 `protected-before.json`。没有运行会覆盖原四图的导出脚本。
- 参考脚本最初在 SVG 文档上创建 HTML 失败，随后空白页读取本地图片受限制；改为同源 HTML 上直接显示原 SVG 后完成。未改原文件。
- 图片 alpha/轮廓读取通过；静态页 5 张全身和 3 张头肩图均解码成功，没有 canvas/脚本、页面异常或窄屏横向溢出。完整流程在候选显示对齐到原背面后复验，不重复计通过数量。
- 环境：Windows 本机、无头 Chromium、DPR 1，1280×1000 / 390×844。390px 是桌面浏览器模拟，非真实手机。只是图片/页面功能核对，没有性能采样或自然度自动评分。
- 本轮只新增图片、静态 HTML、制作/验证脚本和文档；未改产品运行时代码，未重跑产品类型/生产构建。原 3000 及当前 4181 服务保留，没有安装软件或依赖。

脚本：`prepare-nw-2d-references.mjs` → 内置 image_gen → `inspect-nw-2d-candidate.mjs` → `build-nw-2d-review.mjs`。

视觉观察：肩部不再出现管状袖根硬接，近侧手自然垂下；但生成稿有额外渐变/软影，袖口/手位与袍身宽窄仍需与原图审阅。不能把这些变化自动当作确认需求。此次没有最终 SVG，没有 PNG 包装 SVG，没有角色替换；先依据用户反馈修正此单方向，再按认可轮廓矢量化。三维旧稿仍属未通过试稿，性能专项继续暂停，未提交/推送。
