# NW 单方向站姿稿：本轮证据

2026-10-16，Windows 本机。用户明确选择中性站姿，只新增一个 NW 八方向试稿。

**已实施：** 独立三维制作源、固定 NW 相机、经典短发站姿透明 PNG、GLB、静态原四图对照页。**技术验证：** 下述范围通过。**用户最终视觉验收：** 待反馈。

## 查看与产物

- [新增方向图](nw-stage-desktop.png)
- [静态对照页桌面](review-desktop.png)、[390px](review-390.png)
- [制作页桌面](authoring-desktop.png)、[390px](authoring-390.png)
- [验证 JSON](verification.json)、[原文件制作前哈希](protected-before.json)

静态审阅：`http://127.0.0.1:4181/character-shorthair-standing-nw-study.html`。

独立制作页：`http://127.0.0.1:4181/character-nw-study.html`，仅该页加载 Three.js；静态审阅页不包含 JavaScript。原四视图缩略图直接读取原 SVG 文件。

PNG 为 1200×1680 RGBA，151644 bytes，角落 alpha=0，存在足量不透明人物像素，未将浅底烘入透明图。GLB v2 为 1724664 bytes，含 57 个网格与一个正交相机。GLB 保留几何/基础配色/相机，制作光照与卡通呈现在 `tools/character-nw/preview.ts`，不声称任意模型查看器会自动还原同一光照。

最终文件 SHA256：

| 新增文件 | SHA256 |
| --- | --- |
| `public/character-shorthair-standing-nw-study.png` | `c713da5d7479cf4a699799d8a5b1fe390dd49d7ddaf9f7223b7b96cbd33cbeb9` |
| `public/character-shorthair-standing-nw-study.glb` | `d22befa4007d02cc0df39b58fbc53483fedb155039c26fe454e1da084cfa7437` |

## 检查方法与结论

- `npm run lint` 最终通过。
- `node scripts/render-character-nw-study.mjs` 最终完整通过：实际 PNG 下载与透明度、GLB 格式/网格/相机、朝向、原文件哈希、桌面/390px 查看、静态页不挂三维 canvas/脚本、图片正常加载、无 page error。
- 相机投影检查：模型面朝轴 +Z，在 NDC 中前向增量 x≈−0.35355、y≈+0.06961，实际为屏幕左上；不是只给图贴 NW 标签。
- 53 个受保护旧文件 SHA256 制作前后一致，包含原四图 SVG、原人物方向/比例组件、原椅子和布局源。制作前基线详见 JSON。没有运行会覆盖旧四图的生成脚本。
- 初图发现亮度偏高和袖根接合硬角，已修正照明、袖根半径后重导出。首次静态页检查误要求 Vite 注入脚本，实际 public 静态 HTML 无脚本导致检查失败；已改成检查无制作脚本/无 canvas，并复验完整通过。这是验证条件修正，未向静态页添加脚本。
- 本轮按一个完整导出/查看流程记录，重导出不累计“通过次数”，不引用历史椅坐用例作为本轮测试。
- 未改变产品运行时代码，本轮没有重跑整个产品生产构建。public 新 PNG/GLB/HTML 会在后续正常构建时复制；独立制作入口只用于继续修改模型。

环境为无头 Chromium / SwiftShader 软件 WebGL、DPR 1，1200×1000 与 390×844；属于离线资产制作和功能截图，没有测 FPS。不是内置浏览器、前台窗口或真实手机性能验证。4181 是独立制作/审阅端口，原 3000、4180 及旧预览保留。

## 当前限制

只含经典短发、一个 NW 斜侧站姿，无骨骼绑定、坐姿、换装系统或完整八方向。名义头部/站高参照原资产，但新风格与比例仍待用户判断。主场景未使用新模型，原四图及椅子没有替换；不因生成模型而继续此前未获验收的椅坐或家具布局。性能专项保持暂停，未提交/推送。
