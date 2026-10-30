# F2 背景与默认场景集成

2026-10-30。当前状态以 [F2 默认场景](F2_CURRENT_DEFAULT.md) 为准。

背景通过 F2DistantHills 的独立 WebGL 画布接入，保留来源几何与着色器，默认使用 refined 校准。F2CameraAdapter 将 SVG 相机与背景弱视差关联，山麓和地标使用最近山层投影；农田、草地和铁路保留各自运动归属。

F2Environment 解析统一昼暮夜输入，天空、山体与关键 SVG 地表共享环境。运行时覆盖加载失败、WebGL context loss、页面隐藏停绘、减少动态和卸载释放。冻结源码的来源及 SHA-256 位于 f2-evidence/provenance.json，并由 tests/unit/f2.test.ts 核对。

本次主线集成保留经用户认可的最终场景。历史脚本 scripts/f2 中的阶段比较若依赖旧截图或测量文件，应在 codex/f2-hills-integration 的对应修订上运行；最终场景取证使用 scripts/capture-f2-cottage-default.mjs。

验证范围及仍未交付的天气/全设备边界见[合入记录](f2-main-release-2026-10-30/README.md)。
