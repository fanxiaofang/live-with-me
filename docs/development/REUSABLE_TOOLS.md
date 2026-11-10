# 可复用开发工具

在项目根目录运行。工具复用现有 Vite、Node、tsx、Playwright 与 Edge，不安装新依赖。场景资产、美术风格和项目默认布局不会因为运行这些工具而被修改。

## 已有能力入口

人物多视图、家具查看、工位接触校准和性能诊断的操作步骤、源码与验证入口集中在 [已有能力使用指南](EXISTING_CAPABILITIES.md)。先按任务找到现有入口，再决定是否需要扩展工具。

| 要做什么 | 现有入口 |
| --- | --- |
| 查看／导出人物站姿、坐姿与 NW 方向 | 左侧同住人面板 →「人物 5 视图 SVG」 |
| 检查当前装扮与草稿配色 | 自己的状态面板 →「人物装扮」→「查看完整装扮」 |
| 检查空椅、人物遮挡、桌椅关系 | 左侧同住人面板 →「检视工位椅子 (空椅 / 组合态)」 |
| 调桌面参数、接触锚点与临时房间试放 | 工位检视 →「接触校准 · 草稿」 |
| 放大书架、柜子及内部物件 | 顶栏「原木书架」；普通场景点击咖啡黑胶柜或柜内物件 |
| 诊断长帧、做局部对照与 trace | 独立生产预览 + `scripts/diagnose-scene-performance.mjs`；专项当前暂停，重启需明确要求 |

## 预览检查

```powershell
npm run dev:inspect
npm run dev:inspect -- --url http://127.0.0.1:3000/ --source src/world/scene/sceneLayout.ts
npm run dev:inspect -- --selector '#guardian-heritage-tree' --contains data-tree-species
```

默认仅 HTTP 检查，不启动或停止服务器。开发服务器通过只读 `/__lwm_dev_info` 提供项目根目录、端口与 HMR 信息；其他项目目录明确报错。生产预览没有此端点，会标注身份和 HMR 无法核实，不能当作开发服务已确认。

`--source` 比较本地文件与 Vite 实际返回的 raw 模块 SHA-256，检测旧源码；要求根目录已核实。源码新鲜度不等于浏览器已经渲染新 DOM。`--selector` 才启动独立无头 Edge，等待目标可见；可用 `--contains` 检查目标 HTML 的新标记，同时收集页面异常，不读写用户浏览器存档。

先运行 `npm run dev` 启动需要的服务，再复用它。此检查不会自动重启、杀进程或清理缓存。DOM 检查默认最长 60 秒，可用 `--timeout` 指定毫秒数。

## 定向验证

```powershell
# 只列计划：静态美术主要提示做视觉复核
npm run check:target -- --files src/components/scenery/yorkshire/vegetation/GuardianOsmanthus.tsx

# 明确选择区域与执行范围
npm run check:target -- --area yard --run
npm run check:target -- --area camera --typecheck --run
npm run check:target -- --area yard --e2e --grep '土地长宽' --run
```

不传 `--files`／`--area` 时，读取 Git 中 HEAD 以来的修改及未忽略的新文件，默认仍只列计划。当前工作区长期累积修改时，应明确提供本次文件；`--files`、`--area` 都可重复传入。

区域有 `art`、`yard`、`camera`、`layout`、`presence`、`interactions`、`tools`。路径规则生成候选单测，未知文件列在 `unknown`；它不做完整依赖推断，不自动把未知文件变成全量测试。`--typecheck` 显式加入类型检查；`--e2e` 显式加入相应浏览器测试；`--grep` 仅筛选浏览器用例。直接修改的单测也可通过 `--files` 指定。

只有 `--run` 才执行命令，遇到失败即停止；没有可执行项时保留视觉／人工复核提示。浏览器检查使用 `scripts/devtools/playwright.config.ts`，单个 Edge、单 worker、零重试、不启动第二个服务，可用 `--url` 选已有预览。默认不运行跨浏览器矩阵，也不自动更新视觉基线。

纯路径／色值调整无需反复运行类型检查。需要确认美术效果时使用 `.agents/skills/live-with-me-art/scripts/preview-asset.mjs`；同样不必每次跑全套日暮夜与交互。

## 几何计算（只输出提案）

```powershell
# 基于仓库当前默认布局，整体缩小 5%，保留脚底位置
npm run scene:geometry -- scale --entity capsule_pod --percent=-5

# 已有明确位置、比例与局部锚点的对象
npm run scene:geometry -- scale --position 950,360 --scale 1.4 --anchor 0,63 --factor 1.1

# 在草地平面旋转点，而非旋转屏幕坐标
npm run scene:geometry -- rotate --point 100,28.5 --pivot 0,0 --angle 45

# 建筑局部坐标换到场景坐标
npm run scene:geometry -- point --entity capsule_pod --local 0,63
```

`--percent` 为相对当前比例的百分比，与 `--factor` 二选一。负数建议写作 `--percent=-5`。胶囊仓、小木屋、观测台有已知局部接地点；其他对象必须明确 `--anchor`，不猜脚底。输出包含调整前后位置和比例、固定接地点以及需要复核的文件关系。

默认值来自 `sceneLayout.ts`，不包含浏览器保存的庭院偏移。要计算实际已移动对象，传 `--position` 与 `--scale` 覆盖默认值。结果不自动写回源码或存档，不能把输出的新位置再次传给以原始位置为输入的 `scaleAtGround`，否则会重复补偿。

地面旋转沿用现有 `.285` 纵向压缩。它适合地面点／围栏脚点；有高度的柱身、草叶和人物需要先旋转脚点，再加原来的竖直高度，不能把完整立面一并压扁或斜切。

## 技能入口

- `.agents/skills/live-with-me-scene-assets/SKILL.md`：资产挂载、独立／附属对象、主题、层级和旧存档接入。
- `.agents/skills/live-with-me-scene-editing/SKILL.md`：整体缩放、位置／角度、坐标与相机取景调整。
- `.agents/skills/live-with-me-art/SKILL.md`：形体、材质、配色、植物树种和视觉判断。

人物工位校准、家具查看和性能诊断的具体用法见 [已有能力使用指南](EXISTING_CAPABILITIES.md)；这些入口不启动新的通用编辑器，也不将纯美术任务扩展为性能专项。
