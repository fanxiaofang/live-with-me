# Live With Me：重构后架构审计

更新：2026-10-07（Asia/Shanghai）。审计以真实生产代码与本地验证为依据。原始审计保存在 [历史审计](docs/architecture/history/ARCHITECTURAL_AUDIT_BEFORE_REFACTOR.md)；基线 d332c394 与逐批提交见 [执行记录](docs/architecture/EXECUTION_STATUS.md)。

## 当前结论

P0–P7 已完成。配置驱动四处真实建筑 placement，镜头从实体与局部 anchor 派生；家具输入使用实际 parent CTM，人物占位和状态预览共享容量规则，生产交互使用类型化目标。原构图、家具独立关系和绘制顺序保留，11 张视觉基线未更新。

npm 工具迁移独立提交 bc501a2；2026-10-07 用户确认 Google AI Studio 可拉取运行。本地后续业务重构与该平台验证分开记录，最终平台重新拉取不被当作已经验证的结果。

平台后续报告及本地复现：柜内咖啡豆、陶杯悬停事件遗留两处旧家具 ID，registry 读取不存在条目的 name，导致 React 场景卸载。现已修正 ID、保护未知家具描述，并补齐 React 类型声明与子节点悬停回归；平台拉取修复后的实际结果待用户验证。详情见 [校准器排查](docs/architecture/AI_STUDIO_CALIBRATOR_DIAGNOSTICS.md)。

## 问题处理与真实入口

| 原问题 | 当前实现与证据 | 状态 |
| --- | --- | --- |
| 电波站存在漂移的重复实现 | ObservatoryHaven 为唯一资产，SceneEntity 使用 sceneLayout；x+200 同步设施、人物、交互区与聚焦，松树固定 | 已处理 |
| 建筑位置由内外平移叠加 | 四处建筑 placement 在 sceneLayout，资产内部只保留局部几何 | 已处理 |
| 相机数值与建筑位置脱离 | roomTargets 局部 anchor 反推原镜头；RoomInfo 无废弃 cameraTarget/zoom | 已处理 |
| Gizmo 依赖固定 0.45 | parent CTM 逆变换；三个 viewport × 三个 zoom、左墙剪切、轴向拖动与取消通过 | 已处理 |
| 人物槽位静默覆盖 | presenceAllocation 返回 slots/personToSlot/unplaced；满员面板可追踪，预览共享同一规则 | 已处理 |
| 悬停和命令使用字符串前缀 | InteractionTarget、registry、dispatcher；主要入口键盘可用 | 已处理 |
| 生产大组件混合几何、反馈、相机 | ThreeWorld 编排；主屋/defs/景观/浮层模块与功能 hooks 分责 | 已处理；主屋几何仍大 |
| 默认布局多份及存储不可信 | layoutStore 逐条验证、resolved layout 单一来源、静态 parent 表 | 已处理 |
| 重复反馈和关闭后残留 timer | TimerScope 命名期限、关闭与卸载清理、音频 dispose | 已处理 |
| 未挂载旧实现干扰修改 | 旧 YorkshireWorld、CommunicationHill、校准器、2:1 工具和无消费者资产删除 | 已处理 |
| 动画覆盖计算 transform | 定位外层与动画内层分开；Tailwind 和模块 CSS 保留 | 已处理 |

生产主链：main.tsx → App → ThreeWorld → world/render + SceneEntity → architecture / furniture。旧场景编排器、兼容人物 adapter、重复房间镜头字段不再参与。liveWithMeProjection.ts 仅保留历史 authoring 参考数据，没有生产消费者。

## 验收证据

柜内悬停修复后，类型检查、20 项纯函数测试、47 项开发浏览器回归通过；其中 11 项为原始视觉基线，包含八个视角、night、rainy、空席。三个 viewport、zoom 0.66/1.6/2.5 的家具落点误差不超过 1 CSS 像素。覆盖触摸切换、cancel/lost capture、存储失败、刷新/reset、满员提示、键盘交互、五种主题及 timer 卸载。

生产构建另行执行 preview 冒烟测试，结果以执行记录为准。Node/npm、应用依赖迁移与测试依赖加入分别记录，没有为拆模块升级应用依赖。

## 测量与剩余边界

P7 入口 JS 737.22 kB / gzip 195.46 kB，迁移基线为 806.80 / 211.22，分别减少约 8.6% / 7.5%；浮层分块按需加载。CSS 为 64.83 kB / gzip 12.32 kB。加入诊断及柜内悬停修复后入口为 739.37 kB / gzip 196.47 kB。入口仍超过 Vite 500 kB 提示阈值，主屋及矢量 defs 的首屏成本尚在，阈值没有调高以隐藏提示。

固定 1200×800、DPR=1、Windows / Chromium、React 开发模式 Profiler 的相机 12 步拖动：P6 平均提交约 72.95 ms，P7 约 2.20 ms。原始样本保存在 docs/architecture/metrics。该指标只衡量该场景的 React render duration，不等于生产帧率、浏览器绘制耗时或所有设备上的加速比。

历史审计把不同投影引用视为必须统一的数学缺陷，现已修正：手绘地面几何、家具 authoring 轴与实际输入 CTM 用途不同。本轮保留投影契约，未统一所有资产。

仍延后的工作是镜头重新取景、家具整组随动、手绘投影统一，以及测量驱动的进一步资产拆分。视觉回归限定 Windows / Chromium / DPR=1；其它平台应建立自己的字体及截图环境。当前应用没有新增服务端持久化、多人同步或全局状态库。
