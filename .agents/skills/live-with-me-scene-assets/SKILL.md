---
name: live-with-me-scene-assets
description: 将 Live With Me 的原生场景资产接入实际渲染、庭院拖动、附属关系、主题与本地布局保存。用于新增或复用场景组件、拆出独立草簇／摆设、调整资产挂载和前后层级；单纯改色、轮廓或相机数值不适用。
---

# 场景资产接入

先读取本次资产的源组件与实际挂载处，区分资产制作、场景接入和已有交互。涉及原生 SVG 美术时同时遵循项目 `live-with-me-art`；参考不构成移动其他图层的授权。

## 确定归属

- 独立可移动组用稳定的 `YardId` 和完整 `YardObject`；组内阴影、动画和已有点击仍由原组件管理，不拆散为多个保存对象。附属装饰跟随主体时用现有局部锚点或 `YardAttachment`，不要同时添加一份独立偏移。
- 建筑的 `SceneEntity` 已应用布局偏移时，`YardObject positioned` 避免二次平移。其他对象保留原始定位，外层只应用其偏移；跟随父建筑的花草还需检查 `parent` 偏移。
- 已在 `WorldDefs` 中的 SVG 资产先考虑复用 `use`，确认定义没有意外包含别的物件；不要连同未请求的场景一起挂载。

## 接入位置

| 目的 | 当前入口与约束 |
|---|---|
| 新独立物件 | `src/features/yard-editor/yardLayout.ts` 的 `YARD_OBJECTS`；新 ID 自动进入 `YARD_IDS`、选择器和默认存档。需要草簇分类时看 `yardGrassObjects.ts`，不要复制普通对象注册逻辑 |
| 实际挂载 | `src/components/ThreeWorld.tsx` 与 `src/world/render/BackgroundLandscape.tsx`；查看当前资产族的位置，完整组件须处于 `YardWorld` 上下文中 |
| 地面／实体排序 | `YardWorld.tsx` 按接地点排序；土面等标记 `ground`，保持在实体下方。不要用人工 DOM 前后顺序替代已经存在的排序 |
| 建筑坐标与比例 | `src/world/scene/sceneLayout.ts`、`SceneEntity`；整体缩放参考场景编辑技能，避免单改内部 SVG 或房间人物 |
| 探索边界 | `src/world/scene/explorationBounds.ts` 与 `yardExplorationBounds`；仅对本次改变的实体包络和移动范围调整，蒸汽／气泡不参与边界 |
| 保存与历史 | `useYardEditor.ts`、`resolveYardLayout`；稳定 ID、旧存档自动补齐、拖动一次事务、撤销重做与刷新恢复 |

## 保存与交互边界

- 当前庭院数据为 `live_with_me_yard_layout_v1` 的 `{version:1,objects:{id:{dx,dy,angle,...}}}`，偏移相对默认位置。新字段应有缺省值与有限范围；不要清空旧布局或重命名已保存 ID。
- 从父建筑中拆出独立资产时，确认是否需要一次性承接旧建筑偏移，之后不再跟随。默认布局调整也需区分“改变默认基准”和“保留用户当前绝对位置”，不把两种行为混用。
- 装饰节点不拦截正常浏览点击；编辑模式使用既有命中区与手势事务。地面旋转、长度／宽度等能力只在需要时开放，不扩展全部物件的状态字段。
- 沿用对象所在层的昼暮夜／环境滤镜，新增资源 ID 按实例隔离。共享资产涉及丘陵远山时，在授权调用处使用变体，不替换共享定义。

## 复用与验证

原生独立物件可参考 `CountryPicnic.tsx` 的复用方式、`TilledGardenPlot.tsx` 的地面对象接入；这些是接入范例，不是美术外形模板。现有家具工具继续使用原家具编辑系统，不全部迁入庭院保存。

先用 `npm run dev:inspect` 确认服务与新 DOM，再用 `npm run check:target -- --files 本次文件` 查看候选检查。纯挂载看实际画面；改拖动／存档补一个相应的定向用例，已有基础验证通过后不跑完整庭院套件。[工具参数与命令](../../../docs/development/REUSABLE_TOOLS.md)；架构细节见项目 `docs/architecture/YARD_LAYOUT_EDITOR.md`。
