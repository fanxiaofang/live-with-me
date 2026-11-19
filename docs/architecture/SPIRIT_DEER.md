# 守护灵鹿：阶段基线与维护

阶段日期：2026-11-19；基于 f3。验收基准为本次收尾前 localhost:3000 的默认实现。此次仅整理实现、依赖与资料，不改设计效果。

## 当前行为与约束

白天为静止木鹿；夜间灵体完整出现后守望约 18 秒，沿大门外弧线向右巡视，消散后以返回朝向凝聚，再返回原位。完整循环 132 秒，包含较长停留。默认为原生灵鹿、月白蓝、已通过的颈背与尾巴，取消运行时旧模型选择。

林间灵息是少量叶灵、蝶光及实际飞行轨迹，不是固定在皮肤上的丝带。凝聚完成后停留 2 秒，再用 1 秒淡出；消散前 1 秒渐入，身体消失后约 2 秒余韵，然后约 1 秒真正空窗。隐身期间改朝向，不添加实体转身动作。首次出现由 awakening 的实际进度与完成时刻驱动，不能用巡视时钟代替。

脚下花维持既有频率、样式、生命周期和出生世界坐标，衬光跟鹿移动。进入庭院编辑、路线受阻、减少动态时回原位守望并抑制灵息；白天不播放巡视。巡视与运行时前后层级不写布局存档。

## 技术与代码职责

这是骨骼驱动的真实 3D 网格：SDF 形体 → Marching Cubes → 30 控制骨架与四权重蒙皮 → Three.js WebGL → SVG 庭院内透明画布。不是一张平面贴图。静态 SVG 仅作 WebGL 失败回退。

| 入口／模块（均在 src/ 下） | 职责 |
| --- | --- |
| components/scenery/yorkshire/dressing/GateSpiritDeer.tsx | 木鹿、夜间切换、地面衬光、固定编辑边界 |
| dressing/SpiritDeer.tsx（同上目录） | 画布生命周期、30 FPS 门控、尺寸同步、暂停、失败回退 |
| dressing/spiritDeerMeshRenderer.ts | 唯一正式渲染器；近远表面、厚度响应、光丝、粒子与外围辉光 |
| dressing/spiritDeerShape3D.ts / Model.ts / Rig.ts / Surface.ts | 原生形体、拓扑、绑定和表面采样 |
| dressing/spiritDeerNeckContour.ts / TailContour.ts | 已通过的静态绑定空间微调；不改变骨架／动画 |
| dressing/spiritDeerHeadFeatures.ts / Antlers.ts | 左右角耳结构与角枝光丝 |
| dressing/spiritDeerPatrol.ts / WalkClip.ts / Timing.ts | 四足锁地、身体／颈部关系、巡视状态与时间常量 |
| features/yard-editor/deerPatrolRoute.ts | 根据真实保存的门叶与鹿位置生成弧线，检查障碍 |
| dressing/spiritDeerWoodland.ts | D 灵息的转换窗口、世界位置、历史轨迹与 sprite shader |
| dressing/spiritDeerDissolve.ts / useDeerAwakening.ts | 中途消散／凝聚粒子与初次唤醒 |
| dressing/SpiritDeerFootprints.tsx / Flowers.tsx | 脚下花；本次内容保持逐字节不变 |
| features/yard-editor/YardWorld.tsx | 运行时深度排序，暂停与路线接入；不持久化动画位置 |

正式渲染只保留 solid 形体诊断开关，默认参数即通过效果。底层形体函数中仍有旧姿态／比例参数，用于采样与结构对照测试；这不等于保留了旧模型运行入口。D 的连续采样选项仅用于轨迹回归测试，页面始终使用转换时段模式。

## 修改与验证

步态采样源由 `node --import tsx scripts/bake-spirit-deer-walk.ts` 生成；需要调整关键姿态时改源脚本，重新生成 WalkClip.json 并复核四蹄锁地与头颈稳定性，勿手改大份 JSON。

收尾检查：`node scripts/check-spirit-deer.mjs --record` 在改动前记录 17 个固定时刻；改动后 `node scripts/check-spirit-deer.mjs` 对比 PNG 哈希，并检查实际页面的正式参数、WebGL、减少动态守望及存档不变。产物在忽略目录 `build/deer-closeout/`；这套精确比较仅适合同一机器／浏览器环境，跨驱动不能当作通用像素标准。

相关自动检查：`node --import tsx --test tests/unit/spiritDeer*.test.ts`，以及 `tests/e2e/spirit-deer-{surface,patrol}.spec.ts`。巡游 E2E 用可控浏览器时钟推进真实页面状态，包含锁地生花、往返、消散空窗、编辑暂停、减少动态和日夜切换。仅按相关风险执行，勿为静态微调默认跑全套。

## 资源与历史

[当前默认效果截图](../art-direction/spirit-deer-2026-11-18/approved-runtime-2026-11-19.png) 是实际 WebGL 场景截图；[概念图与生成提示词](../art-direction/spirit-deer-2026-11-18/README.md) 全部保留；[研究与失败结论](SPIRIT_DEER_RESEARCH.md) 为唯一研究索引。概念图不等于已实现画面。

历次试验源码、原始阶段报告和模型在删除前备份至本机忽略目录 `build/deer-closeout/backup/`，含 SHA-256 清单。它们不进入产品构建、不进入提交，也不是永久备份；需要长期恢复的依据是本次 Git 提交与保留的设计结论。历轮 48 个过时生成目录已清理，共 5,814 个文件、约 510.5 MiB。仅保留当前验收截图、检查结果与本机源文件备份，不将批量中间产物提交进仓库。

## 版本与回退

本次提交为完整灵鹿阶段快照，包含必要的门口与庭院接入；其他庭院／建筑未完成工作留在工作区。应在干净工作区或独立 worktree 使用本次提交作后续基线。查找版本：`git log --oneline --grep="guardian spirit deer"`。

需要撤销整个阶段时，在干净工作区执行 `git revert <本次提交>`。需要比较单个实现时使用 `git show <本次提交>:<文件>`；不要在有其他未提交修改的工作区整库 reset/restore。布局保存格式不变，不执行用户存档迁移／删除；已有用户门栏布局继续优先，新用户默认采用已通过的入口位置。

已知边界：Marching Cubes 在极近距离仍有离散轮廓；当前厚度响应是前后表面近似，不是电影离线体积。保持现有结果，未来材质探索应独立实验、固定姿态对照、用户验收后再合入。

## 本阶段收尾验证记录

- 清理前记录原始默认渲染；清理后工作区及精确暂存的独立检出各核对 17 个固定时刻，PNG SHA-256 全部一致，涵盖守望、巡视、消散、余韵、空窗和凝聚。
- 原有 8 张概念图，以及脚下花、落脚花处理、初次唤醒和时序源文件的 SHA-256 均未变化。新增一张真实场景基线截图，明确区分实现与概念。
- 33 项灵鹿单元检查通过；独立检出的 13 项默认路线／庭院布局／门栏检查通过（其中 2 项与前述灵鹿接入测试重叠）。
- 独立检出 TypeScript 无错误，Vite 生产构建成功；表面深度和巡视交互两项浏览器检查通过，无页面异常或灵鹿降级警告，存档保持不变。
- 浏览器巡视用例改为受控时钟，并显式派发可见页面恢复事件；表面用例跟随 Vite 实际解析的 Three.js URL。独立验证关闭 HMR，避免截图及测试文件变动触发页面刷新。未改变产品的时钟、动作或视觉参数。
- 13 个过时源模块、替代模型运行资产和 7 个重复验证脚本退出正式树；16 份阶段报告合并为本说明及研究索引。备份与清理清单留在本机忽略目录。
