# Live With Me — F3 大气透视分层与连续性规范（A）

> 状态：**设计提案，尚未修改代码、未进行视觉验收**  
> 基准：`fanxiaofang/live-with-me` GitHub `f3` 分支；本次审阅 HEAD `fb434d73592c0361048c0d17b4e289619cda439c`（2026-11-20）  
> 参考视图：用户提供的 F3 全景截图（2026-11-20）  
> 对应配图：`F3_Atmospheric_Layering_Diagram_B.png`（基于原截图标注，不是改色后的效果图）

## 0. 最重要的决策

**不要把主丘陵从最近远山的空间投影中直接拆走。**

需要拆开的，是**全区域统一的远山灰雾混色**；必须保留的，是**山体位置、边界相接、遮挡与边缘颜色交接**。

简述：**几何继续共锚定，颜色中心独立，边缘局部共融。** 这兼顾当前画面的“连续地形”与希望达到的“主丘陵更鲜明、更近、更清楚”。

## 1. 用户提出的真实问题

- F2 远山剪影本身可以接受；与当前灰青、灰绿的天空放在一起，显得发闷、不够通透。
- 主丘陵作为承载风车、农舍与树林的中景实体，颜色偏灰；它不应像最近远山剪影那样整体受到远景空气色侵染。
- 但此前尝试脱离最近山层，可能曾引发地形色彩或空间衔接割裂。因此**不能以“独立颜色”误写成“独立地形投影”**。
- 铁路、火车和高架桥在美术上应贴近主丘陵的中景空气层，不应像真正远山那样灰化；**同空气层不代表必须使用同一镜头视差参数**。

## 2. 已核实的代码关系（事实）

### 2.1 天空与远山：分开渲染，颜色来源相关联

`src/world/render/f2/F2DistantHills.tsx` 的 WebGL 场景有独立的 sky mesh 与多层 ridge mesh；它们在同一个 renderer 中分遍渲染，不是合成在一张固定图里。

`src/world/render/f2/config/baseline.json` 的夏季晴天源参数为：

- `palette.skyTop = #a8c9d7`
- `palette.air = #d4ddd1`
- 三个 ridge 形体的 `air`（基础空气混合权重）分别为 `.62 / .40 / .20`。

`src/world/render/f2/vendor/backdrop/environment.js` 和 `ridgeMaterial.js` 使用此环境数据计算天空的 `uTop/uAir/uHorizon` 与山体的 `uAir/uLayerAir`。因此**天空背景与山体各自有 Shader，但蓝灰天顶、偏灰绿地平线及山体空气色由同一来源关联**。截图里“天空脏”与此配色方式吻合，但还需要做单独渲染开关对照，不能仅凭截图断言唯一原因。

### 2.2 主丘陵：确实与最近远山共享空间锚点

`src/world/render/f2/F2CameraAdapter.ts`：

- `f2LandmarkTransform()` 明确选择 `index = 2`，即最近 F2 ridge。
- `F2DistantHills.tsx` 将这个矩阵写入 SVG 根 `#f2-nearest-landmarks`。
- `BackgroundLandscape.tsx` 把主丘陵、丘陵树林、风车/农舍放在此根下面。

**因此主丘陵当前是跟着最近远山走的**；这正是空间连接稳定的机制之一。此处不能只为提饱和度就解绑。

### 2.3 主丘陵：已有边缘融色机制，但内部颜色仍受远山空气色影响

`src/world/render/f2/meadowFoothillMaterial.ts`：

- `colorAt()` 先用草甸植被的多种固有色及法线受光计算主体色；再 `color.lerp(look.air, .18)`，把整座主丘陵的主体色向 F2 空气色推近。
- `groundAt(x)` 采用最近远山的材质/法线/空气雾量进行颜色采样。
- `endMix` 负责丘陵左右逐渐收薄的位置，`toeMix` 负责靠近坡脚的部分；它们将局部色值继续向 `groundAt()` 过渡。

这说明原实现**并非简单地给整座丘陵套与远山完全相同的滤镜**，而是设计了“主体色 + 共同空气色 + 边缘匹配”。当前应当优化混合范围和独立强度，而不是删除这一设计。

`src/world/render/f2/F2MeadowFoothill.tsx` 还把连续草甸裁在固定丘陵外轮廓中；左右/坡脚对接属于具体几何与材质共同组成的结果。

### 2.4 铁路：现在是“独立视差 + 最近远山空气色”

`src/world/render/BackgroundLandscape.tsx` 将铁路独立置于 `#parallax-railway-layer`。在 F2 模式下，它使用 `src/world/camera/parallaxMath.ts` 的 `PARALLAX_PRESETS.railway = {kTx:.28,kTy:.20,kSz:.40}`，不是 `f2LandmarkTransform()` 所用的最近山体响应。**不要把它误写成当前与主丘陵共享同一个空间投影。**

然而 `src/world/render/f2/F2Environment.ts` 将铁路空气色连接到最近 F2 山层的 `nearest.air`，强度由 `nearest.layerAir * .7` 计算；`src/components/scenery/yorkshire/infrastructure/railwayAppearance.ts` 再用 SVG 颜色矩阵/分量传递实现空气衰减。

**结论：铁路目前在“颜色关系”上与最近远山绑定，在“运动关系”上独立。** 是否调整铁路视差，需要另行用镜头对照验证，不能因为要统一中景空气色而顺手改动。

## 3. 之前为什么会出现割裂感：已知与待证实

### 3.1 有书面证据的历史问题

`docs/architecture/LANDSCAPE_CONTINUITY_FIX.md`（2026-10-09）明确记录：山、田、草在不同纵向位移/缩放阻尼下，原本依赖固定几何重叠的衔接可能露出空隙。解决方法是动态延展**被遮挡的底部裙边**，而不改变可见山脊和地标的位置。

这证明当前项目**确实曾发生过因不同视差、不同地形覆盖范围造成的层间断裂**。但这份记录早于 F2 当前方案，不能直接当作“当时把 F2 主丘陵与最近远山解耦失败”的逐次实验报告。

`docs/visual-system/f2-default-meadow-2026-10-29/README.md` 及 F2 集成代码可以核实：后续采用了与最近远山锚定、并由坡面/植被混色衔接的方案；存在 `source-foot` 对照入口。**当前保留这套结构有充分依据**。

### 3.2 针对你记忆中那次实验的合理解释（推断，非已找到的实验结论）

此前的“不自然”很可能混合了三种不同问题：

1. **空间断层**：丘陵与最近远山使用不同相机阻尼，拖拽/缩放后边界漂移。
2. **颜色断层**：主丘陵如果突然变得鲜绿，而与之相接的远山仍灰绿，会出现明显的“贴上去一块绿皮”的效果。
3. **材质断层**：坡脚、左右收薄的地方没有由主体植被色逐渐过渡到远山色，即使几何没有空隙，也会读成两张叠贴的图片。

不能在没有历史截图和实验参数的情况下把这三项归因到某一次特定失败；但现有代码的 `f2LandmarkTransform + groundAt/endMix/toeMix` 恰好对应了这几类问题的防御措施。

## 4. 推荐方案：几何共锚定，颜色分区，边缘共融

### 4.1 不动：空间和地形连续性

保持：

- F2 三条已认可远山轮廓、位置和弱视差参数。
- `#f2-nearest-landmarks` 与 `f2LandmarkTransform()` 的绑定。
- 主丘陵 `meadowHillPath()` 形状、风车、农舍、树群的位置和既有外轮廓。
- 原有视差覆盖、遮挡、被遮住的几何裙边和 F3 构图。

**不建议新增一个独立移动的“中景丘陵相机”来修颜色。**

### 4.2 先调：天空与地平线空气色分开定义

现有天空与远山空气色在同一套环境参数中联系太紧；建议把“天空看起来清透”与“山体被空气淡化”改为独立的美术控制：

- `skyZenithColor / skyMidColor / skyHorizonColor`：天空自上到下的干净颜色结构。
- `distantRidgeAirColor`：只给远山空气混色的颜色。
- `distantRidgeAirStrength`：分 ridge 的衰减权重，保留前后差异。

实现上先在 `resolveF2Environment()` / 原有 WebGL shader uniforms 的接入端做小范围扩展或参数解耦，不改远山几何、模型或 F2 CameraAdapter。

**优先验证“天空独立净化、山脊色保持原样”的试样**。不要同时加白云、光束、雾片，使原因不明。

### 4.3 再调：主丘陵只有内部需要独立、更清楚

`meadowFoothillMaterial()` 内建议区分两套颜色逻辑：

**A. 丘陵内部主体**：草甸本色 + 既有植被混色/受光 + 独立的、较轻的中景空气色。不要让 `.18` 作为固定的全丘陵远山空气混合权重不可调。

**B. 丘陵边界过渡**：左右收薄区域、坡脚及与最近远山真实接壤的局部，继续逐渐向 `groundAt()` 匹配的颜色收敛。保留该函数现有的最近远山材质/雾量关系。

示意伪代码（非可直接替换的实际实现）：

```ts
const hillInteriorColor = shadeAndBlendMeadowVegetation(x, depth);
const hillAirColor = mix(hillInteriorColor, midgroundAirColor, hillAirWeight);
const ridgeMatchedEdge = groundAt(x); // 保留现有最近山层配色采样
const boundaryWeight = transitionWeight(x, depth, localThickness); // 仅坡脚/收薄端
return mix(hillAirColor, ridgeMatchedEdge, boundaryWeight);
```

`transitionWeight` 应让**丘陵中腹 = 0，接缝处逐渐靠近 1**。不要画一条新的横向灰色带，也不要把宽幅渐变铺满山体。具体数值以 F3 实际视图调参，不提前写成已验收色值。

### 4.4 铁路：共享中景“空气逻辑”，但不强制共视差

建议让铁路使用 `midgroundAirColor / railwayAirWeight` 这一可独立调整的空气参数，确保**火车车体、拱桥和主丘陵在画面观感中属同一中景空气范围**。

这里的“同一范围”表示相近的清晰度、空气色温和明暗衰减趋势，并不表示铁轨材质、墙面固有色与丘陵绿色必须相同。

第一轮保留铁路既有位置、遮挡和视差 `(.28,.20,.40)`；检视快速平移、房间聚焦及极端缩放时桥与山体相对位置。如果视觉证据确实要求铁路追随丘陵，再单独设计**空间移动**专项，不与本轮调色混在一起。

### 4.5 接缝补救的正确顺序

1. **先检查几何/遮挡**：关闭所有雾，确认主丘陵没有露底、悬浮或运动错位。
2. **再检查色阶**：只看主丘陵的色面与最近远山的衔接，不加粒子与云。
3. **最后做局部过渡**：只在真实接壤区域适度混合，不能靠大片雾遮盖结构问题。

## 5. 可执行的三轮对照（不改地形）

| 试样 | 修改范围 | 判断目标 |
|---|---|---|
| S0 原样基线 | 所有参数不动 | 保留 F3 原截图、山体位置、铁路位置与色值作对照 |
| S1 天空净化 | 只调整天空的三段颜色与地平线关系，山体/主丘陵不动 | 验证“脏感”究竟来自天空本身还是山体/暗角 |
| S2 丘陵分区混色 | 在 S1 基础上减少丘陵中心的灰化，边缘仍采样最近山层 | 中心更绿更实，左右边和坡脚不出现明显拼贴边 |
| S3 铁路中景空气 | 在 S2 基础上微调铁路颜色衰减，保持原视差 | 高架/火车清晰度与主丘陵相容，仍能辨认砂岩和车身 |

建议同时设置几项诊断开关：`skyOnly`、`ridgeOnly`、`foothillOnly`、`atmosphereOff`、`seamDebug`。它们仅用于实验，不得作为产品默认功能。

## 6. 验收门槛

**静态画面**

- 天空比当前更清澈通透；地平线不出现大面积浑浊灰绿薄膜。
- 三条远山既有轮廓和前后层次完整保留，没有被重新绘制为高山或另一套地貌。
- 主丘陵中部可以更鲜明，但与最近山脊接壤处没有可辨认的硬边或灰色腰带。
- 铁路、火车与主丘陵看起来同属较近的大气距离，但材质自身仍分明。

**运动画面**

- 默认视角、最远缩放、主屋聚焦、水平/竖直拖拽及快速反向缩放，主丘陵与最近远山不相互滑动。
- 不出现 WebGL 与 SVG 之间的露白、穿透、遮挡错位或地形裙边断开。
- 关闭雾层后也不应出现几何缺口（不得靠氛围层掩盖接缝）。

**性能与回退**

- 不为此单独创建第二套持续运行的 WebGL 渲染循环。
- 动画、交互、房间点击与现有 `prefers-reduced-motion` 行为保持可用。
- 任何一个阶段可独立开关/回退，确保原因可识别。

## 7. 需要 Codex 优先阅读的源码与证据

- `src/world/render/f2/F2CameraAdapter.ts` — 最近山层 SVG 变换绑定。
- `src/world/render/f2/F2DistantHills.tsx` — Sky/Ridge WebGL 多遍渲染及同步。
- `src/world/render/f2/F2Atmosphere.ts` — 各山层空气色与层级衰减。
- `src/world/render/f2/F2Environment.ts` — 天空/山/铁路环境主题衔接。
- `src/world/render/f2/config/baseline.json` — 已认可的三条山脊和天空/空气源色。
- `src/world/render/f2/vendor/backdrop/environment.js` — 环境基础色、时间与天气光照。
- `src/world/render/f2/vendor/backdrop/ridgeMaterial.js` — Shader 天空色和山体 fog 计算。
- `src/world/render/f2/F2MeadowFoothill.tsx`、`meadowFoothillMaterial.ts` — 主丘陵植被、坡脚和侧边色彩过渡。
- `src/world/scene/meadowFoothill.ts`、`foothillGeometry.ts` — 已验收丘陵轮廓与几何锚点。
- `src/components/scenery/yorkshire/infrastructure/railwayAppearance.ts`、`RailwayLandscape.tsx` — 铁路空气滤镜。
- `src/world/camera/parallaxMath.ts`、`src/world/render/BackgroundLandscape.tsx` — 铁路与 F2 山体不同的空间归属。
- `docs/architecture/LANDSCAPE_CONTINUITY_FIX.md` — 2026-10-09 历史山田草视差断层修复。
- `docs/visual-system/f2-default-meadow-2026-10-29/README.md`、`docs/visual-system/F2_DISTANT_HILLS_INTEGRATION.md` — 后续 F2 已审核集成与衔接约束。

## 8. 限定说明

这是一套**基于当前代码与用户截图的调整规范**，不是已经实现或通过浏览器测试的成品。已查阅的当前仓库证据足以解释现有绑定与历史连续性问题，但不足以逐帧还原用户记忆里所有已淘汰实验；不能将其中某个推断写成有明确 commit 证据的事实。

> 最终设计句：**“山形连着，空气分级；丘陵有自己的草色，但山脚仍属于同一个山谷。”**
