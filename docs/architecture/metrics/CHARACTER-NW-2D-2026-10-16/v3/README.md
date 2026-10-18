# NW v3：撤回脸型和下摆阴影的附带变化

**最新处理：用户否定 v3 头部位移后的关系，v3 已撤回。** 当前无版本及原 v3 入口已恢复完整 v1 原图，没有头部位移或分层；旧 v3 单独归档为 `public/character-shorthair-standing-nw-2d-review-v3-rejected.html`。`review-nw-2d-v3.mjs` 仅重建历史页，不覆盖当前入口。v1 尚未最终认可，其原有轻微头前伸问题仍未解决。见 [withdrawal.json](withdrawal.json)。下方为历史实施和技术检查，不构成视觉通过。

2026-10-16 用户指出 v2 不应改变脸部轮廓，随后要求连同下摆阴影再调整。以 v1 为底稿重新编辑，目标是仅轻微收头并连接领口，保持原圆润脸型和柔和接地影。v2 不作为脸型、下摆或阴影基准。

**已实施：** 新增 `public/character-shorthair-standing-nw-2d-review-v3.html`，最新无版本审阅入口同步 v3。以 v1 的同一图片分层显示，头部整体向画面右侧移动 12 源像素（约原头宽 3%）；沿原脸/领口边界设置互补显示裁切，避免带走肩部。没有旋转或缩放头部，没有重画脸部曲线；袍身和软影保持原来源与位置。页面提供 v1/v3 头肩、全身，以及 v2/v3 下摆对照。

本次先用内置 image_gen 尝试编辑，但其结果仍将阴影画成厚边，并过度移动头部，因此**未采用**。原始结果归档为 `rejected-generated-attempt.png`，[提示与来源](prompt-attempt.md)。最终 v3 是 HTML/CSS 定位预览，**没有新 v3 PNG**，没有将 PNG 包装为 SVG。图片分层显示只用于确认位置，最终可编辑 SVG 仍待用户确认后制作。

**技术验证：** Windows 无头 Chromium、DPR 1，1100×1000 与 390×844；图片加载、页面无脚本/canvas、无横向溢出及页面异常检查通过。53 项保护文件、原 v1/v2 文件哈希不变。头部使用原 v1 来源、无旋转/缩放、固定显示平移，已查看头肩和下摆截图。检查结果见 [verification.json](verification.json)，脚本为 `scripts/review-nw-2d-v3.mjs`。仅静态审阅检查，无产品构建或性能测量，不代表前台浏览器、内置浏览器或真机验收。

**用户最终视觉验收：** 待审阅。下一步先确认这一个方向的头肩及软影，认可后制作独立 SVG，不扩展其它方向或坐姿。原四视图、椅子、布局和 3000 服务未改，未提交/推送。v1/v2 和其历史审阅页保留。

入口：**http://127.0.0.1:4181/character-shorthair-standing-nw-2d-review-v3.html**。

截图：[头肩](head-comparison.png)、[下摆](hem-comparison.png)、[桌面](review-desktop.png)、[390px](review-390.png)。
