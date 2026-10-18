# 2026-10-15 当前长帧诊断证据

本目录为当前版本独立样本，不能与历史 PRE3 / DESK 数据混合计算改善。主结论与环境边界见 [专项第 6 节](../../SCENE_PERFORMANCE_DIAGNOSIS.md#6-2026-10-15-当前版本诊断)。所有时间单位为 ms。

## 固定条件

- 运行代码起点 HEAD `60378cd`、开始时工作区干净；本轮未修改 `src/`。生产构建后使用独立端口 4175，不使用 3000 的开发构建采样。
- Windows / i7-10710U / Chromium 141.0.7390.37 / Intel UHD Graphics、ANGLE D3D11；无 CPU 降速。完整 SystemInfo、构建产物 SHA-256、采样器 SHA-256、代码状态在每个子目录的 `environment-*.json`。
- 1200×800，DPR 1/2；全新隔离 context，默认三人状态、桌前一人，布局为默认值；随机种子 15176。正常动画，不使用 stableScene。前后 state 记录可见性、hasFocus、镜头、动画、SVG 数量和默认存储。
- 有窗口与无头模式顺序执行，不并行跑测量。正式轻量基线期间未并行运行构建、类型检查、其它测试或另一采样浏览器。
- rAF 间隔是回调节奏，不能直接称显示器呈现 FPS。React 只记录根提交次数/时刻，不是提交耗时；JS 堆是 Chromium 粗略读数，不是总进程或 GPU 显存。

收尾时 4175 HTTP 200，127.0.0.1:3000 拒绝连接。初始服务枚举因权限不足未成功，不能判断 3000 离线时间/原因；本轮没有停止、重启或占用 3000。独立 4175 保留，临时浏览器均关闭。

## 文件组织

| 目录/文件 | 内容 |
| --- | --- |
| `baseline-headed-dpr1-final` | 有窗口 DPR 1，正常动画 10 场景 × 三轮 |
| `baseline-headed-dpr2` | 有窗口 DPR 2，同上 |
| `baseline-headless-dpr1` / `baseline-headless-dpr2` | 无头 DPR 1/2，各三轮；与有窗口分别解释 |
| `calibration-headed` / `calibration-headless` | 空白页与简单 HTML transform 动画各三轮，确认宿主调度差异 |
| `controls-headed-dpr1` | 八种单因素/全暂停诊断配置，各三轮，每轮全景/阁楼两个静止段；第二轮反向次序 |
| `traces-headed-dpr1` | 13 段探索 trace；统计为整段录制，阁楼等待 1 秒，不能与轻量稳态混算 |
| `traces-bounded-headed-dpr1` | 后续带 `lwm-probe-start/end` 标记的 trace，统计裁切到探针窗；阁楼静止等待 3 秒 |
| `iab-dom-only.json` | 内置浏览器加载、DOM 和画面检查；没有帧间隔/trace，不进入 Playwright 模式汇总 |
| `summary.json` / `summary.md` | 各场景的三轮中位数、范围、长帧/长任务、源文件索引；trace 另列 |
| `headed-dpr1` / `baseline-headed-dpr1` | 两次失败的早期采样器启动环境，因折叠面板入口定位失败，没有完整运行报告，排除出统计 |

早期第二次失败尝试还与类型检查短暂重叠；正式基线重新从新 context 跑满三轮，不采用该次数据。面板定位已改为真实 title `展开同住人面板`，首开详情在展开面板后测量。失败环境文件保留，不伪装成有效基线。原生窗口身份/激活工具失败及授权超时，没有取得 OS 持续前台/无遮挡证据；headed 仅证实独立窗口存在、页面可见和有焦点。

`measurements.jsonl` 是每段结束即落盘的原始检查点；同目录最终 run JSON 包含相同测量，汇总只读取 run JSON，避免重复计数。早期录制未保留采样器副本，方法差异已标注；后续目录的 `runner-source.mjs` 是启动时副本。压缩 trace 用 gzip 保存，解压后的 JSON 可导入 Chrome DevTools / Perfetto，不必覆盖原件。

## 复现

先完成生产构建，在独立终端运行预览。严格端口被占用时选择新的空闲端口并用 `--url` 指定，不终止现有服务。

```powershell
npm run build
npm run preview -- --host=127.0.0.1 --port=4175 --strictPort
```

以下命令逐个执行，不同时运行；`--out` 使用新的目录。脚本用独占写入拒绝覆盖已有环境/运行报告。

```powershell
node scripts/diagnose-scene-performance.mjs --headed=true --dpr=1 --suite=baseline --repeats=3 --out=docs/architecture/metrics/NEW-RUN/headed-dpr1
node scripts/diagnose-scene-performance.mjs --headed=true --dpr=2 --suite=baseline --repeats=3 --out=docs/architecture/metrics/NEW-RUN/headed-dpr2
node scripts/diagnose-scene-performance.mjs --headed=false --dpr=1 --suite=baseline --repeats=3 --out=docs/architecture/metrics/NEW-RUN/headless-dpr1
node scripts/diagnose-scene-performance.mjs --headed=false --dpr=2 --suite=baseline --repeats=3 --out=docs/architecture/metrics/NEW-RUN/headless-dpr2
node scripts/diagnose-scene-performance.mjs --headed=true --dpr=1 --suite=calibration --repeats=3 --out=docs/architecture/metrics/NEW-RUN/calibration-headed
node scripts/diagnose-scene-performance.mjs --headed=false --dpr=1 --suite=calibration --repeats=3 --out=docs/architecture/metrics/NEW-RUN/calibration-headless
node scripts/diagnose-scene-performance.mjs --headed=true --dpr=1 --suite=controls --repeats=3 --out=docs/architecture/metrics/NEW-RUN/controls
node scripts/diagnose-scene-performance.mjs --headed=true --dpr=1 --suite=trace --repeats=1 --variants=normal,all-css-motion-paused --out=docs/architecture/metrics/NEW-RUN/traces
node scripts/summarize-scene-diagnosis.mjs docs/architecture/metrics/NEW-RUN
```

`--inspect=true` 可在首个场景打开后留 15 秒用于原生窗口检查；原始探索 trace 曾使用该选项。截图、录屏、trace、DevTools 开窗会引入额外成本，不与轻量基线同时做。`--variants` 可以只跑指定对照；默认 controls 跑全部八项。

## 解释结果

- 有窗口空白页 P50 约 33.4ms，无头约 16.7ms。不能跨这两种模式推断优化幅度，也不能据有窗口样本宣称达到 60fps。
- >33.4ms 的计数保留作历史口径；在有窗口约 30Hz 的宿主条件下，接近 33.5ms 的舍入/调度波动不能直接视为漏掉一个 60Hz 帧。>50.1ms 的计数更适合观察该模式明显长间隔，所有原始值仍可重新分析。
- `actionCompletedMs` 是自动化开始到完成等待 dialog 的时长，不是输入到可见像素或标准 INP。首开详情的三秒段还包含预览挂载与后续动态。
- 仅 SMIL 暂停与正常接近；全部 CSS 暂停的轻量对照较稳定地接近该宿主空白页节奏。云雾单项与滤镜关闭存在轮间波动，不足以选出唯一热点。
- trace 的 FunctionCall / Paint / UpdateLayoutTree / RasterTask / GPUTask 是不同线程、可嵌套的 inclusive 时间。GPU 进程任务可能包括提交、驱动和等待，不是硬件 shader 计时；不得相加为总占比。旧探索 trace 的开销和冷栅格效应较大，以标记裁切后的记录分析具体时间窗，以无 trace 重复样本比较帧节奏。
- 暂停动画/移除滤镜只为诊断，不是产品修正。本批未删除任何认可细节，也没有性能改善或用户最终流畅性验收。
