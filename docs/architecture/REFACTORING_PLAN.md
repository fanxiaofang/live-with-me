# Live With Me：基于当前代码的渐进式重构方案

日期：2026-10-07（Asia/Shanghai）
代码基线：`d332c394df6b7e2864ac89cb53bee2ba6ebffe1c`
范围：场景坐标、渲染入口、相机、家具编辑、人物占位、交互、状态与资源边界。

执行状态：2026-10-07，npm/AI Studio 兼容验证由用户确认通过，P0–P7 已全部验收。下文的源码行号、缺陷表和迁移步骤属于 d332c394 的历史基线；当前实现、门槛与回退点见 [EXECUTION_STATUS.md](EXECUTION_STATUS.md)，当前设计见 [DESIGN.md](../../DESIGN.md)。最终执行以用户已确认的批次边界为准。

## 1. 决策摘要

继续采用 React + TypeScript + Vite + SVG + CSS / Tailwind CSS 4 的 2.5D 场景。CSS 负责布局、浮层、响应式与动画，TypeScript 管理场景数据和转换，SVG 承载矢量资产。先解决“配置是否驱动真实画面”和“每个坐标属于哪个父节点”，随后建立相机与输入转换，再拆分渲染职责。第一轮保留现有手绘资产、景观构图、房间 ID、家具编辑结果和 SVG 遮挡关系。

推荐主线：

**基线 → 电波站真实入口收敛 → 建筑局部化 → 家具父子关系与存储兼容 → 相机/输入坐标 → 人物分配 → 交互 → 渲染及状态拆分 → 清理与优化。**

参考了 `ARCHITECTURAL_AUDIT.md`、`DESIGN.md`、投影提取文档，以及历史讨论“架构重构建议”。这些内容是参考材料；其中的实施建议、禁止事项和示例数值没有直接当作本次用户指令。以下结论以当前生产调用链和代码为准。

## 2. 核对结果：哪些结论成立，哪些需要修正

下面的行号对应上述基线，后续编辑会使行号变化。

| 问题 | 当前代码证据 | 对方案的影响 |
|---|---|---|
| 入口承担过多职责 | `src/components/ThreeWorld.tsx` 共 3440 行；相机约 L234–424，主 SVG defs L485–1046，主屋 L1835–3234，Tooltip L3347 起，外星卡片 L3387 起 | 按职责拆分，但行数不作为质量或性能指标 |
| 建筑布局有两级来源 | 主屋 L1835；胶囊集群 L3240；木屋集群 L3257；资产内部仍有世界平移 | 收敛 placement，而不是禁止所有局部 transform |
| 胶囊数值已变化 | `CapsulePodHaven.tsx:174` 为 `translate(930, 320)`，父节点为 `translate(-36, 0)` | 实际有效原点 **(894, 320)，scale=1**；不能迁移文档旧值 `(894,420),0.82` |
| 电波站模块没有接入生产画面 | `ThreeWorld.tsx:1445–1830` 内联站点，L1463 为 `translate(1000,460) scale(0.80)`；没有实例化 `CommunicationHill` | 第一刀必须处理真实渲染入口；仅改布局表无法解决问题 |
| 两份站点实现已经漂移 | `CommunicationHill.tsx:34` 用布局配置，但 scale=0.86；L294 用 `presenceSlots.observatory`，生产实现用 `observatory_post`；它传入 CharacterHead 的 `character/size` 也与该组件声明的 props 不一致 | 不能直接替换成现有抽取组件；从当前生产 JSX 校准并保留唯一实现 |
| 景观编排器并非生产总入口 | `YorkshireWorld.tsx` 存在，但 `ThreeWorld` 直接组合若干景观子组件及内联内容 | 先画清调用链，再收敛；不能直接挂载整个编排器，否则可能重复绘制或恢复旧景物 |
| 人物槽位已具备局部偏移 | `sceneViewMapping.ts`：胶囊 `(-10,8)`、木屋 `(0,26)`、观测台 `(-2,14)`；人物嵌在相应建筑内部 | 审计中的 `882/412` 不符合当前代码；主要缺的是明确 owner、统一派生和分配策略 |
| 存在三类投影相关代码 | `liveWithMeProjection.ts` 是提取/参考数据，唯一源码导入者为未接入主场景的校准组件；生产 Gizmo 使用 `isoMath.ts`；`utils/isometric.ts` 另含 2:1 数学和朝向转换 | 按运行用途分类；不能把三者直接改成一个矩阵 |
| 相机配置有两个不同来源 | 实际相机用 `ThreeWorld.tsx:56` 的 ROOM_VIEWPORTS；`initialData.ts:126` 的 ROOMS 另含 cameraTarget/zoom，未发现其被当前相机读取 | 房间元数据与镜头配置分责，清理无效镜头字段前检查消费者 |
| 输入转换存在近似常数 | `IsoGizmo.tsx:58–59` 使用鼠标差值乘 0.45；相机 pan L353–354 用 client 差值除 zoom | 优先修复 CSS 像素、viewBox、相机和父节点之间的转换 |
| 人物分配有覆盖风险 | `resolvePresenceSlots()` 将多个匹配同一槽位的人直接写入 occupant；茶席满员后重复使用 south；`predictPresenceSlot()` 与实际分配的条件顺序不同 | 这属于独立的业务正确性问题，需要专门的分配规则和测试 |
| 家具布局已本地保存 | `layoutStore.ts:358` 使用 `live_with_me_room_layout_v6`；同一个 screen 字段在不同父节点局部空间中使用 | 重构必须兼容旧数据，不应默认清空布局 |
| 交互边界类型较弱 | 主入口 hoveredObject 为 string；建筑 props 多处 string/any；Tooltip 包含 ID、前缀协议、直接展示的文字 | 建立类型化 target 和命令边界，保留过渡适配器 |

审计对维护成本的判断成立，但“大文件导致编译负担”的性能结论缺少对比测量。当前构建确有大包警告，后续应测量模块体积、重渲染范围和交互耗时，而不是把文件拆分等同于性能改善。

设计约束中，SVG、纯净草台、一主两翼与右侧电波站、低打扰陪伴体验继续保留。`RiverValley.tsx` 当前确实 `return null`；后续接入景观模块不得重新引入退役水系。时间状态还包含 `rainy`，主题迁移应覆盖五种状态。

## 3. 目标边界和目录

场景布局使用已经投影过的 SVG scene 坐标。新地面几何可使用独立 GroundPoint，再经过显式投影进入 scene；手绘建筑不需要先转换成虚构的三维世界。

```text
App / feature controllers
   ├─ people、letters、bookshelf、layout edits、modal state
   └─ typed scene commands
                ↓
World composition
   ├─ scene model + resolved transforms
   ├─ camera + gesture ownership
   ├─ SVG renderer（显式绘制顺序）
   └─ HTML overlays

Pure math / coordinate contracts
   ↑ scene、camera、editor 均可依赖；不依赖 React 或 storage
```

建议逐步形成以下目录，按阶段创建用得上的模块：

```text
src/world/
  scene/
    sceneTypes.ts             # EntityId、parent、LocalPoint、ScenePoint
    sceneLayout.ts            # 建筑 placement 和局部 anchor
    roomTargets.ts            # RoomId → entity + focus anchor
    resolveTransforms.ts      # 父子变换、点/向量转换
    sceneRenderers.tsx        # EntityId / kind → React renderer
  coordinates/
    affine2d.ts               # 组合、求逆、点与向量变换
    viewport.ts               # viewBox/slice 与 CSS 像素换算
  projection/
    groundProjection.ts       # 当前地面契约，按需接入
    gizmoProjection.ts        # 兼容现有家具操纵模型
  camera/
    cameraMath.ts
    useWorldCamera.ts
  interaction/
    interactionTypes.ts
    interactionRegistry.ts
    useWorldInteraction.ts
  render/
    WorldViewport.tsx
    WorldScene.tsx
    SceneEntity.tsx
    WorldDefs.tsx
    LandscapeLayers.tsx
  overlays/
    WorldTooltipOverlay.tsx
    AlienSignalOverlay.tsx
  theme/
    worldTheme.ts

src/features/
  presence/                   # 分配策略、槽位配置与 preview
  layout-editor/              # layout schema、v6 adapter、存储与 Gizmo
  bookshelf/                  # 在后续阶段迁移 controller；资产可暂留原位置

src/components/architecture/
  MainCottageHaven.tsx
  CapsulePodHaven.tsx
  WoodenCabinHaven.tsx
  ObservatoryHaven.tsx
```

已有地形、书桌、唱机柜、书架和植物组件继续复用。不要为目录一致性同时重命名所有文件。`ThreeWorld` 可先保留为入口，完成迁移后再决定是否改名为 `WorldScene`。

依赖规则：纯场景数据不导入 React 组件；renderer 注册表单独持有 JSX；资产只接收必要状态与回调；相机不读取建筑 JSX；槽位分配不读取 DOM；localStorage 只经过存储适配层访问。暂不增加通用 ECS、场景编辑后台或新的全局状态库。

## 4. 坐标契约：先统一语义和转换

### 4.1 明确五种空间

| 空间 | 内容 | 转换边界 |
|---|---|---|
| LocalPoint | 相对于明确 parent 的 SVG 局部点，如床内人物、桌上台灯 | parent transform → ScenePoint |
| ScenePoint | panoramic-world-stage 内的 SVG 坐标，建筑 placement 当前就属于这里 | camera → ViewBoxPoint |
| ViewBoxPoint | 相机变换后，1200×800 根 SVG 内的点 | slice fit → ClientPoint |
| ClientPoint | 事件 clientX/clientY 所在的浏览器视口 CSS 像素 | DOM CTM inverse → 目标父节点 LocalPoint |
| GroundPoint | 程序化地面使用的 a/b/h，具有命名的投影契约 | ground projection → 局部/scene 偏移 |

Point 和 Delta 应区分：点受平移影响，位移向量不受平移影响。不同空间的点采用品牌类型或受控构造函数，避免把 `{x,y}` 在所有 API 中通用。LocalPoint 还要携带或由调用边界确定 owner，光有同名类型不足以区分“桌面”和“主屋”。

### 4.2 初始建筑布局只复制当前生产事实

| entity | scene position | scale | 来源 |
|---|---:|---:|---|
| main_cottage | (540,210) | 1 | 当前主屋外层 |
| capsule_pod | (894,320) | 1 | (-36,0) + (930,320) |
| wooden_cabin | (220,340) | 1 | (60,0) + (160,340) |
| observatory | (1000,460) | 0.80 | 当前内联站点 |

`SceneEntity` 是唯一 placement 执行者；资产内部只保留局部几何 transform。`RoomId` 与 `EntityId` 保持独立：`my_room/living_nook/friend_room/porch_mailbox` 都是主屋内部区域，`corn_lounge` 是业务房间 ID，可映射到 `wooden_cabin`。不同时修改人物数据、房间导航和 DOM ID。

世界点由完整父子链派生：`M_scene = M_parent × M_local`。现有 translate + scale 的简单情况是 `scene = position + scale × local`。床内槽位有额外父节点：胶囊内部 `pod-bedroom-interior` 还有 `translate(12,3)`，迁移时必须保留，不能把 `(-10,8)` 当成建筑根节点下的同一点。

场景 data 定义 entity placement、局部 focusAnchor 与业务映射；局部 geometry 留在资产里。屋顶顶点、柱子数量、曲线控制点不因“存在数值常量”就全部配置化。

### 4.3 投影采用命名契约和共用数学能力

第一轮保留地面视觉基准和 Gizmo 旧矩阵。地面 `±0.283088` 与家具操纵 `cosU=1, cosV=0.8` 有不同语义与单位，代码也没有一个已经存在的通用三维世界。

可以共用矩阵计算、逆变换、误差检查；两个投影仍用明确名称。统一的是转换入口与坐标类型，不是强行统一所有资产透视。

处理 `utils/isometric.ts` 时先拆出被 `CharacterAvatar` 实际使用的朝向转换。2:1 几何工具及 `IsoComponents.tsx` 未发现被当前场景实例化；核对调试、导出和实验用途后再保留为独立 profile 或删除。文件存在不等于生产画面依赖该几何模型。

未来如果决定统一几何投影，单独立项：选一个家具试点，核对旧局部坐标与新参数化几何之间的关系、迁移已保存数据，再逐资产推进。不能承诺“修改 slope 后所有手绘建筑自动更新”；只有参数化几何能够做到这一点。

## 5. 相机和输入：使用真实 SVG 变换链

### 5.1 相机公式必须包括 transform-origin

当前 CSS stage transform 为 `translate(tx,ty) scale(z)`，原点 `o=(600,400)`。据此推导：

```text
viewBoxPoint q = o + z × (scenePoint p - o) + t
把 scene anchor p 放到 viewBox 构图点 c：
t = c - o - z × (p - o)
```

这不是 `viewportCenter - worldPosition × zoom` 的直接套用。现有 scene position 已是 SVG 坐标，不能再做一次 ground projection。

房间配置改为 `targetEntity + anchorName/localAnchor + zoom + compositionPoint`。overview 是独立的构图 preset，不必假装它是一个建筑 entity。同一建筑可以有多个房间 anchor。

迁移分两步：先根据旧 ROOM_VIEWPORTS 反推兼容构图点或局部 anchor，确保镜头不因架构迁移发生跳变；再单独调整不理想的取景，并给出前后截图。旧镜头反推的 anchor 可能落在建筑外，需标注为 legacy framing，不伪称建筑中心。

例：旧 observatory zoom=1.6，t=(-380,30)，c=o 时 p=(837.5,381.25)，对应建筑局部点约 (-203.125,-98.4375)。这个结果说明旧镜头没有对准当前站点原点。若之后直接聚焦站点原点，t=(-640,-96)，会越过当前固定 minX=-420；相机边界必须同步考虑焦点和 viewport，而不能继续套旧常数。

接受实体移动后，镜头保持同一相对构图：当站点 scene x 增加 200、zoom=1.6，兼容镜头 tx 应减少 320。实现要区分 room focus 与用户手动漫游；布局变化时重新派生 focus 模式，pan 模式不应被无关状态变化重置。

### 5.2 CSS 像素转换与 slice

根 SVG 使用 `preserveAspectRatio="xMidYMid slice"`。在宽 W、高 H 的可视区域内，fit 比例为 `r=max(W/1200,H/800)`，居中偏移为 `((W-1200r)/2,(H-800r)/2)`，还要加容器 client rect 的起点。

数学层可用这些数据做确定性测试。运行时拖拽优先以实际 DOM 的 `getScreenCTM().inverse()` 转换两次指针位置，再相减得到目标 parent 局部 delta；该 parent 必须是保存坐标所属的节点，不能误用把手自身的局部节点。这样包含 viewBox、camera、建筑 scale、桌面/柜体嵌套缩放和 CSS 变换。

相机平移使用根 SVG/viewBox 坐标中的 delta；家具编辑使用家具 parent 坐标中的 delta。删除固定 `0.45` 和未经空间确认的 `/zoom`。rounding 留在 UI 展示或提交存储处，不在每一步逆变换中累计截断。

统一 Pointer Events 管理 camera-pan / object-drag / click 三种手势所有权，支持 capture、cancel、lost capture 和组件卸载。将“拖动后不触发点击”的判定从各资产的 hasMovedRef 移至输入协调层。触屏 pinch 的单指/双指切换与 DOM 按钮交互也要覆盖。

## 6. 家具、人物和保存数据

### 6.1 不把现有家具编辑能力丢掉

`DEFAULT_ROOM_LAYOUT` 与各 JSX 的 `?? 默认坐标` 重复。通过一个 resolved layout 把 defaults 和用户 overrides 合并后再渲染，组件不重复维护兜底常量。

家具需要 parent 元数据，例如柜体摆件属于 cabinet-group，桌面摆件属于 desk-group，椅子当前与桌子在同级坐标中。是否让椅子随桌子移动必须作为明确规则，不根据名字擅自改变。

茶桌的三个蒲团当前优先使用独立保存坐标，故移动茶桌并不必然带动它们。第一轮保留此行为：通过 adapter 从主屋局部点推导相对茶桌的点，并明确 overrides 的语义。若产品希望变成整组随动，作为后续行为改动，迁移为 tea-table 的子节点，保留每个蒲团的可编辑偏移。

### 6.2 v6 兼容策略

第一轮能保留存储形状时优先保留，只增加运行时 parent 映射。若必须改形状，则使用版本化 envelope：`{version, projectionProfile, overrides}`；新版本号实施时确定，不能只换 storage key 丢弃旧结果。

迁移流程：读取 v6 → 对允许的 entity ID 校验有限数值、范围及 scale → 依据旧 parent 的矩阵还原位置 → 转换到新 parent local → 保留原 v6 原文作为迁移回退依据 → 成功后写入新版。非法条目回退该条默认值，避免整个布局丢失；处理 localStorage 禁用或配额失败。

只持久化编辑值，不覆盖 name、category、owner、id 等静态元数据。拖动中更新内存并按需预览；结束后保存或使用有界节流，避免当前 App 每个 delta 都序列化整份布局。复制/导出布局的面板也通过同一适配层。

### 6.3 人物分配先解决正确性，再迁移模块位置

保留现有 pose、facing、mirrored、accessory、badgeLabel 和 furniture slot ID。槽位增加明确 owner/anchor，位置从 resolved furniture layout 或建筑内部 anchor 派生；人物仍在原有遮挡层内渲染。

提取共享的候选槽位规则：preview 给出候选，实际 allocator 结合 occupancy 选择。当前 `predictPresenceSlot('corn_lounge','sleeping')` 优先返回胶囊，实际 resolver 则优先木屋；应先统一为“显式房间优先、状态提供房间内姿态/候选”的规则，并列出有意改动。

一个 capacity=1 的槽位不能静默覆盖两个人。采用稳定的输入顺序和同房间候选顺序，已占用就尝试下一合法候选；没有合法位置时返回 unplaced，保留人物状态并在 PresencePanel 提示“该房间席位已满，状态已保留”。不跨房间安置、不增加场景备用站位；前廊不分配室内席位，也不显示满员。

测试断言应覆盖：每人至多一席、每席不超 capacity、所有输入人物都有 placed/unplaced 结果、personToSlot 与 slots 一致、相同输入得到相同结果。

## 7. 交互与状态边界

InteractionTarget 使用判别联合：entity、room、person、book、poster、furniture-part。动态人物和书籍按 ID 引用数据，不拼接成 `person-${id}` 或把 tooltip 文本当作 ID。

静态 registry 存 label、tooltip 和 action 描述；运行时 dispatcher 接收类型化命令，如 focusRoom、selectPerson、openMailbox、inspectBook、captureAlienSignal、selectEditableObject。静态 registry 不持有 App 闭包或 React 状态。

迁移期间允许 `legacyHoverAdapter` 处理 bookshelf/cabinet/attic 前缀和景物直传文本，但新代码只能发 typed target。等所有消费者迁移完再删除适配器。Tooltip 的归属、离开子节点的 hover 恢复、拖动时提示隐藏、编辑模式优先级要有一致规则。

对用户可点击对象保留或补齐键盘激活、焦点样式与可读标签；装饰 SVG 不进入 Tab 顺序。先选信箱和房间入口验证，再扩展其它交互对象。

App 仍是 people/mail/memories 的业务状态所有者。按实际职责逐步抽出 usePresence、useMailbox、useBookshelf、useLayoutEditor 和少量弹窗控制；不把所有状态搬进一个 WorldContext。World 内部的相机、hover、站点信号、沙发反馈由对应 controller 管理。

炉火颜色的本地保存通过 storage adapter；定时动画通过有清理的 effect/hook，重复触发应取消或替换上次 timer。Toast 和书架操作等 setState updater 内的外部副作用在后续状态阶段清理。业务数据长期保存/服务端同步不属于本轮目标，也不能宣称当前 people/mail 已经持久化。

## 8. 渲染拆分与性能

先完成小范围、视觉等价的电波站提取，再迁移主屋和各层。禁止按行数平分 JSX，也不要从一开始把所有人物统一移到最末尾 CharacterLayer。

SVG 的绘制顺序就是遮挡关系。主屋的墙面、家具、人物、屋顶，胶囊的睡眠人物与前景玻璃，现有嵌套 clipPath 和滤镜必须保留原顺序。大型资产可以暴露局部的 rear/content/front 插槽；并非每个实体都需要一个全局 zIndex。

Scene 层保留 background → terrain → infrastructure → cottage → capsule → cabin → foreground 的明确顺序，再按现有内部顺序细分。远山 pines 与站点设施分开归属，移动电波站不应带走远山树群。启用整个 YorkshireWorld 之前列出与生产画面的内容差异，逐层合并，避免重绘 tractor、背景或旧台地。

WorldDefs 只管理真正共享的定义。局部渐变、clipPath 保留在资产模块并使用实例唯一 ID；提取时核对 `url(#...)`、`href`、filter 和 mask 引用，特别是依赖全局 softShadow 的组件。只有将资产多实例化时，才能验收 ID 隔离，不能只改声明而漏改引用。

主题先复用已有 YorkshireSceneTheme，集中当前 COUNTRYSIDE_THEMES，覆盖 morning/afternoon/dusk/night/rainy。资产逐步接收少量语义 token 或灯光状态；不将每一个 SVG 顶点和色值都变成 props。

性能验证在拆分后进行：相机/hover 更新是否仍重渲染全部家具，拖拽是否频繁写 storage，静态层是否适合 memo，弹窗是否值得 lazy load，图片是否影响首屏。806.80 kB 的主 JS 构建产物是一个基线；源码文件变小不自动意味着 bundle 变小。

## 9. 分阶段实施与可回退提交

工时是单人专注开发的粗估，包含检查和必要测试；不包含视觉重设计、多人同步或服务端开发。每阶段可由多个小 PR 构成。

| 阶段 | 改动范围 | 交付与验收 | 粗估 |
|---|---|---|---:|
| P0 基线 | 调用链清单、确定性截图环境、必要测试入口 | 固定 viewport、初始人物/布局、主题、字体、动画时间；保存 overview 与关键房间截图；记录 lint/build | 1–2 天 |
| P1 电波站闭环 | scene types/layout、SceneEntity、从生产 JSX 提取 ObservatoryHaven、站点 room target | 只渲染一个站点；scale 保持 0.80；移动 placement 后设施、人物、hit area 跟随；相机兼容取景可随动；旧死配置不再误导 | 1–2 天 |
| P2 建筑和家具归属 | 胶囊→木屋→主屋 placement；owner/parent 与 resolved layout；v6 adapter | 初始位置保持表中数值；编辑与重新加载位置不变；主屋局部移动不改变内部布局；保存失败有回退 | 2–3 天 |
| P3 相机/输入闭环 | cameraMath、roomTargets、viewport 转换、Gizmo parent-space delta、手势协调 | 不同缩放/宽高比下拖拽准确；focus 随 entity；cancel/drag-click/触屏完整；去掉 0.45 与空间错误的换算 | 2–3 天 |
| P4 人物分配 | 共享候选规则、capacity/overflow、slot owner/anchor、preview | 无静默覆盖；预览和落位规则一致；茶席与床位遮挡、朝向正常 | 1–2 天 |
| P5 类型化交互 | registry、dispatcher、legacy adapter、Tooltip、键盘入口 | 原有房间、信箱、人物、书架、海报、站点功能完整；编辑拖动不会误触导航 | 1–2 天 |
| P6 渲染及状态拆分 | 主屋资产、defs、景观层、overlays、功能 hooks | 生产只留一套相同职责实现；绘制顺序、滤镜和五种主题无回归；入口主要负责组合 | 2–4 天 |
| P7 清理和优化 | 旧镜头字段/兼容别名/闲置工具、依赖核对、按测量做 lazy/memo、文档 | 更新 DESIGN/AUDIT 的现状；确认被删除模块无消费者；记录构建与交互指标对比 | 1–2 天 |

完整一轮约 **11–20 个工作日**。P0–P1 为最小可验证切片，约 2–4 天；只有达到闭环验收后才复制到其它建筑。P1 中相机可先使用小范围兼容推导，完整 viewport 和手势重构留到 P3。P2 不改变茶席整组随动等产品行为，相关变化应有独立提交。

每个提交只改变一个责任边界；视觉调整、槽位业务规则变化、存储形状变化与纯文件提取分开提交。迁移期间通过适配层复用旧入口，避免新旧实现同时挂载。保留 v6 数据与迁移输入，使回退代码后仍能还原编辑结果。

## 10. 验证矩阵

| 类别 | 有价值的断言/场景 |
|---|---|
| 变换数学 | translate+scale 与多级 parent 链；local→scene→local 往返；点与 delta 区别；奇异矩阵保护 |
| 投影 | 地面与 gizmo 分别 round-trip；固定高度逆解；单位与方向明确；适当容忍旧 gizmo 取整误差 |
| 相机 | 含 transform-origin 的映射；旧构图兼容；同实体多 room anchor；移动后保持相对构图；overview reset；focus 与 bounds 协调 |
| 输入 | 1200×800、1600×900、窄屏裁切；zoom=0.66/1.6/2.5；scale=0.80 与嵌套桌面 scale；拖拽、cancel、双指切换 |
| 存储 | v6 default、改动后的旧布局、新 parent 转换、坏 JSON/NaN/缺失项/非法 scale、写入失败、重载、reset、面板导出 |
| 占位 | 单人/多人同房、三茶席满员、两个睡眠房间、reading 与 currentRoom 冲突、prediction 与 allocation、一致映射 |
| 交互 | 房间 focus、人物/信箱/书架/海报/炉火/站点；编辑模式与导航互斥；键盘激活；timer 重复触发及清理 |
| 视觉 | overview、主屋各区域、胶囊、木屋、电波站；night/rainy 代表画面；有人/空席、玻璃/人物/屋顶的遮挡与 SVG defs 引用 |

数学和分配纯函数可以从轻量测试入口开始；浏览器截图可用 Playwright 实现。新增测试工具是实施方案的一部分，当前 package.json 没有 test 脚本或截图基线。

截图需固定动画时间或在测试模式暂停 CSS/SMIL 动画，固定随机反馈、布局、人物数据和字体；截取前等待相机过渡完成。局部坐标重构尽量无视觉差异；无法消除的栅格抗锯齿差异设小容差，不能大范围 mask 掉建筑来制造通过。

关键验收操作：

1. 电波站 x 增加 200：站点、人物、交互区、focus 同步；远山树群不移动。
2. 胶囊 scale 从当前 1 改为测试值 0.9：床内人物、玻璃遮挡、交互区与 anchor 正确。
3. 移动柜体：桌面物品随 parent；编辑单个咖啡壶只改变该局部位置；刷新后保持。
4. 在三种 viewport 与多个 zoom 下拖动同一把手：落点准确且 camera 不同时漫游。
5. 多人选择同一床位或茶席满员：每人可追踪，无 occupant 静默覆盖。
6. 添加 TreeHouse：增加实体/局部资产/room target/必要交互，不修改无关相机公式或全局 tooltip 条件链。

## 11. 本次验证边界

本方案来自当前源码、引用文档和历史讨论的核对；本次只新增方案文件，没有实施业务重构。

- `npm run lint`：通过。该脚本实际执行 `tsc --noEmit`，并非 ESLint。
- `npm run build`：通过。第一次在受限环境中因 esbuild 子进程 `spawn EPERM` 失败；随后在获批的执行环境中重跑通过，不属于应用代码构建错误。
- 构建基线：Vite 6.4.3，主 JS 806.80 kB / gzip 211.22 kB，存在 chunk 超过 500 kB 的警告。
- 尚未创建或运行浏览器截图、手势测试或自动化回归；本文的视觉状态描述以代码为据，P0 必须补齐运行时基线。
- 没有用源码静态搜索推断所有实验文件都可删除；清理阶段仍需核对其消费者和用途。

第一项执行任务应是 **P0 + P1：从 ThreeWorld 的生产 JSX 建立电波站单一渲染入口，并完成 placement、slot、hit area、camera 的随动验证**。这个切片能直接检验新边界是否有效，也能阻止继续出现“文件已经拆了，配置仍未驱动画面”的问题。
