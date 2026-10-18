# 草花间歇阵风与静态光带/云雾：局部证据

本轮是轻量修改检查，完整说明见 [性能专项第 9 节](../../SCENE_PERFORMANCE_DIAGNOSIS.md#9-草花间歇阵风与低感知动效小修2026-10-15)。各一次 35 秒有窗口生产样本，DPR 1、1200×800、固定种子/默认三人，前后版本分别位于独立 4176/4177。

- `environment.json`：设备/GPU、浏览器、构建资源哈希与限制。
- `before-sample.json`、`after-sample.json`：逐帧原始间隔、动画运行检查点、长任务和简要统计；不是实际呈现帧率。
- `checks.json`：完整阵风周期、静止/重启、时段配色、减少动态/恢复、滚轮与阁楼导航检查。
- `before-afternoon.png`、`after-afternoon.png`、`after-desk.png`：实际场景画面。
- `after-night.png`：首次时段切换后的即时截图，过渡未等待；补充的 `after-night-settled.png` 为等待过渡后的画面，不删除首次记录。
- `visibility-check.json`：补充测试标签页可见性/返回检查；若环境没有真的隐藏页面，不把它当作隐藏生命周期通过。

P95 66.9 → 33.6ms；最大间隔 133.5 → 66.8ms；>50.1ms 间隔 275/764 → 6/1044。支持保留组合改动，但单次顺序采样不能给出长期改善比例，不能区分三项各自贡献，也不代表缩放、手机、内置浏览器验收。

复查脚本：`node scripts/check-scene-breeze.mjs <新的证据目录>`，先用 `npm run preview -- --outDir build/breeze-before --port 4176 --strictPort --host 127.0.0.1` 及对应 after/4177 启动。旧构建输出在 git 忽略的 build 目录，原始数值与资源哈希保留在此处。没有对 3000 服务做停止/重启操作。
