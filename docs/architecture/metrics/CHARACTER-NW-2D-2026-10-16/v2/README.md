# NW 二维候选 v2：头部后收

日期：2026-10-16。用户反馈 v1 稍有头前伸，并授权调整。

- 已实施：内置 image_gen 编辑 v1，新增 `public/character-shorthair-standing-nw-2d-candidate-v2.png`，1060×1484，透明背景。头部轻微向肩背侧收回，接顺后颈/领口。v1 原图保留，原四图/人物源/椅子未动。
- 实际差异：前伸感减弱；生成同时改变了少量帽形、袍身轮廓与阴影。提示中 3–5% 是目标，不是精确测量。没有声称像素级局部不变。
- 审阅：`http://127.0.0.1:4181/character-shorthair-standing-nw-2d-review.html`。v1 旧页另存 `*-nw-2d-review-v1.html`，v2 同时另存 `*-nw-2d-review-v2.html`。头肩及全身均保持同倍率/垂直位置，以图高 70/75/80/85% 四行袍身平均中心作近似水平对齐，v2 显示左移 9.625 源像素；不按各自头部重新居中。
- 技术验证：Windows 本机无头 Chromium，DPR 1，1100×1000 与 390×844；图片解码、透明四角、无脚本/canvas、无横向溢出及页面异常；53 项保护文件哈希不变，v1 SHA256 与此前一致。仅静态图片显示检查，不代表前台浏览器、内置浏览器或真实手机性能。本次无产品构建、帧率测试或主场景改动。
- 用户最终视觉验收：待反馈。下一步先确认头肩关系，认可后再制作独立 SVG；不把 PNG 包装为 SVG，不自动扩展其它方向/椅坐/布局。性能继续暂停，3000 未动，未提交/推送。

提示和来源：[prompt-v2.md](prompt-v2.md)。元数据与检查：[verification.json](verification.json)。可重复脚本：`scripts/review-nw-2d-v2.mjs`。对照截图：[头肩](head-comparison-v1-v2.png)、[桌面](review-desktop.png)、[390px](review-390.png)。
