# 最小接触校准与异形桌草样

实施范围及本轮检查见 [工作台专项第 6 节](../../ASSET_AUTHORING_CALIBRATION.md#6-2026-10-16-首版实施与单桌草样)。生产预览 4178，原 3000/4177 服务未停止或重启。

- `tool-final-1200.png`、`tool-final-390.png`：最终首版工具的实际视口截图。
- `room-final-1200.png`、`room-final-390.png`：带接触辅助线的真实房间试放。
- `sample-room-1200.png`、`sample-room-390.png`：关掉辅助线的真实房间草样。
- `sample-overview-1200.png`、`sample-overview-390.png`：同一草样的全景。
- `sample-1200.json`、`sample-390.json`：工具实际导出的未确认参数。
- 无 `final` 或 `sample` 前缀的早期截图保留：首轮 `tool-390.png` 为高于滚动容器的元素截图，顶部被截断，不能作为最终手机工具画面；后续改为实际视口截图。早期房间截图的试放栏在顶部，最终移至下方以便操作同住人面板。

本批只做功能/视觉检查，stableScene 关闭动画用于稳定画面，不作为性能结果或真实手机验证。截图控制布局的桌组 X +3、第一椅 X +1，用于证明草稿不会改写自定义 v6 存储。没有移动书架或正式修改用户布局；桌型仍待视觉反馈，未解决/验收单桌双席空间。

复查命令：先构建并启动 `build/desk-calibration` 的 4178 独立预览，再执行 `npx playwright test --config playwright.asset-study.config.ts --grep 'desk calibration draft|chair inspection preserves layout|an unoccupied workstation' --workers=1 --timeout=60000`。输出下载文件在 test-results，选定草样参数保存在本目录。
