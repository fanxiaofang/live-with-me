# LiveWithMeProjectionSpec

> 2026-10-07 P7 状态：下文保留原投影提取数据和历史文件引用，属于 authoring 参考。旧 ProjectionCalibration 调试组件与 utils/isometric 已在无消费者检查后删除。当前 SceneEntity placement、相机公式及 parent CTM 拖拽契约见 [DESIGN.md](../../DESIGN.md)。liveWithMeProjection.ts 不参与生产相机或输入转换；资产局部几何没有改为统一投影。

> **Phase 0 — Live With Me 现有 2.5D 投影 / 地面关系提取**
> **Phase 0.1 — Projection Extraction Semantic Cleanup**
>
> 本文档是 **AUDIT + EXTRACTION** 产物，不是设计稿。
> 目的：让新的草地 SVG / WebP 纹理 / 道路 / 围栏 / 石墙 / 平台 **适配现有建筑**，
> 而不是为项目重新定义一套标准 isometric。
>
> **现有资产是唯一事实来源。** 为了做草地而修改建筑投影 = 违规。

---

## ⚠️ 先读这五条 —— 本文件要消除的五个误解

| # | ❌ 错误认知 | ✅ 正确认知 |
|---|---|---|
| 1 | `136` 是 world unit | **`VISUAL_GROUND_UNIT = 136` 只是 authoring convenience**（= 主屋地板宽 544 / 4），不是 world / meter / gameplay / projection / physical unit |
| 2 | Cabin `contactBand` 是真实 plan footprint | **它只是石砌基座在正面立面中的 visible ground-contact band**，不是平面占地；**禁止**用作物件避让/碰撞多边形 |
| 3 | Cabin 自身服从 ±15.806° ground projection | **Cabin 是 hand-drawn front-elevation 2.5D 资产，本身不暴露地面轴**；它只是 ANCHOR REFERENCE |
| 4 | Main House projection 与 isoMath 是同一个矩阵 | **两者是相关但不同的契约**：角度差 ≈0.1°，但 isoMath 进深轴有额外 x 收缩（cosV 0.8 vs cosU 1.0） |
| 5 | ±15.806° 已被定为未来永久 WORLD_PROJECTION | **它只是 CURRENT VISUAL CONTRACT，尚未冻结**；未来可能经 Projection Decision Prototype 与标准 2:1 (±26.565°) 等候选比较 |

---

## 0. 一句话结论

项目 **不使用** 标准 2:1 isometric（±26.565°）。
当前视觉地面斜率常量为 **±0.283088 ≈ ±15.806°**，在主屋地板与地基中显式写出并被复用。

新项目画地面网格时，应使用：

```
VISUAL_GROUND_PROJECTION
  axisA    = ( 0.96219,  0.272379)   // +15.806°
  axisB    = ( 0.96219, -0.272379)   // -15.806°
  vertical = ( 0, -1)                // 纯屏幕垂直
```

## STATUS

```
CURRENT VISUAL CONTRACT
NOT YET FROZEN AS FUTURE WORLD_PROJECTION
```

`VISUAL_GROUND_PROJECTION` 描述的是**项目当前状态**。
它刻意**不**命名为 `FINAL_WORLD_PROJECTION` / `WORLD_PROJECTION_V1` / `CANONICAL_PROJECTION`。
未来可能通过 Projection Decision Prototype 比较：Legacy ±15.806° / Standard 2:1 ±26.565° / 其他候选角度。

---

## 1. 两份互相独立的 Contract（不得合并）

项目**没有**单一的 unified world→screen camera。存在两份刻意**不合并**的契约：

### A. VISUAL_GROUND_PROJECTION — 地面绘制契约

| 项 | 值 |
|---|---|
| 来源 | `TimberFlooring.tsx` + `CottageFoundation.tsx` |
| 用途 | terrain · grass · paths · roads · fences · dry-stone walls · platforms · building ground planes · **future grass prototype** |
| 性质 | **VISUAL AUTHORING CONTRACT**（不是完整 3D camera） |
| 参数 | axisA ≈ +15.806°，axisB ≈ −15.806°，slope ≈ 0.283088，两轴 x 跨度相等（272 : 272） |

### B. INTERACTION_GIZMO_PROJECTION_REFERENCE — 交互/操纵契约

| 项 | 值 |
|---|---|
| 来源 | `src/components/layout-gizmo/isoMath.ts` |
| 用途 | **仅** layout gizmo（家具 project / unproject / 拖拽） |
| 性质 | **INTERACTION / MANIPULATION CONTRACT** |
| 参数 | `cosU = 1.0`、`sinU = -0.2852`、`cosV = 0.8`、`sinV = 0.228`、`det = 0.45616` |
| 关键差异 | 角度与 A 相差 ≈0.1°，但**进深轴有额外 x foreshortening**（cosV 0.8 vs cosU 1.0） |

在 `liveWithMeProjection.ts` 中，B 仅作为 **extraction / reference metadata** 保存：

- ❌ 不 duplicate `isoMath` 实现
- ❌ 不替换、不修改 `isoMath`
- ❌ 不让 production gizmo import 本文件
- ❌ 不尝试统一两个系统

> **新 grass prototype 必须使用 A（VISUAL_GROUND_PROJECTION），不要使用 B。**

---

## 2. Source of Truth

### 2.1 资产角色（永不互换）

| 资产 | 角色 |
|---|---|
| `WoodenCabinHaven`（左侧「林间安睡木屋」） | **ANCHOR REFERENCE ONLY** |
| `TimberFlooring` + `CottageFoundation`（主屋木地板 / 碎石散水基底） | **VISUAL GROUND AXIS SOURCE** |

**Cabin 不是 axis source**，原因见 §5。

### 2.2 CALIBRATION ASSET

| 项 | 值 |
|---|---|
| **CALIBRATION_ASSET** | `WoodenCabinHaven` |
| 组件文件 | [src/components/architecture/WoodenCabinHaven.tsx](../../src/components/architecture/WoodenCabinHaven.tsx) |
| 组件名 | `WoodenCabinHaven` |
| 实例化位置 | [src/components/ThreeWorld.tsx](../../src/components/ThreeWorld.tsx) **L3759** |
| 角色 | ANCHOR REFERENCE ONLY（用于放置，不用于推轴） |

### 2.3 完整 Transform Chain（由外到内）

```
<svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">      ← ThreeWorld L471
  └─ <g id="panoramic-world-stage"                                     ← ThreeWorld L1049
        style="transform: translate(camX,camY) scale(zoom);
               transform-origin: 600px 400px">
       └─ <g id="wooden-cabin-cluster" transform="translate(60, 0)">   ← ThreeWorld L3759
            └─ <g id="wooden-cabin-haven">                             ← 组件根，无 transform
                 └─ <g id="room-corn_lounge"                           ← 组件 L78
                       transform="translate(160, 340)">
                      └─ 木屋全部 geometry（局部坐标）
```

**有效原点（scene 空间）= (160+60, 340+0) = (220, 340)**

| 层级 | transform | 备注 |
|---|---|---|
| `#panoramic-world-stage` | `translate(camX, camY) scale(zoom)` | CSS transform，`transform-origin: 600px 400px` |
| `#wooden-cabin-cluster` | `translate(60, 0)` | 把木屋向主屋收拢 |
| `#wooden-cabin-haven` | 无 | — |
| `#room-corn_lounge` | `translate(160, 340)` | 木屋本体原点 |
| 木屋自身 | 无 `rotate`、无 `scale` | 纯 translate |

### 2.4 场景空间定义

| 项 | 值 |
|---|---|
| `viewBox` | `0 0 1200 800` |
| `preserveAspectRatio` | `xMidYMid slice` |
| 坐标系 | `#panoramic-world-stage` 内部的 **SVG user space** |
| world unit → SVG unit | **1 : 1**（不存在独立换算） |
| overview camera | `x = 0, y = 135, zoom = 0.66` |
| zoom 范围 | `0.45 … 2.5` |
| 是否存在统一 projection helper | **部分存在**（仅 `layout-gizmo/isoMath.ts`，见 §4.3） |

scene → viewport 完整公式（viewport 指 CSS 像素，未乘 DPR）：

```
viewBox_pt = (scene - (600,400)) * zoom + (600,400) + (camX,camY)
viewport   = slice_fit(viewBox, 1200x800 → viewportW x viewportH)
             scale = max(vw/1200, vh/800)，居中裁剪
```

**验证**：1600×900 viewport，overview 相机下，木屋地面锚点 scene(220,395.5)
→ viewBox(349.2, 532) → viewport **(465.6, 626)**。
实测截图中木屋底座中心位于 ≈(466, 626)。**模型确认无误。**

---

## 3. Projection Result

### 3.1 Ground Axis A / B

来源：主屋木地板菱形 —— **VISUAL GROUND AXIS SOURCE**。

```
TimberFlooring.tsx  L88  <polygon points="-272,135 0,58 272,135 0,212" />
```

四角语义：`back(0,58)` · `right(272,135)` · `front(0,212)` · `left(-272,135)`

该 rhombus 的**两条边向量**就是投影后的两条地面轴：

| | 边向量 | 归一化 | 与屏幕水平夹角 |
|---|---|---|---|
| **Ground Axis A** | `(272, 77)` | `(0.96219, 0.272379)` | **+15.806°** |
| **Ground Axis B** | `(272, -77)` | `(0.96219, -0.272379)` | **−15.806°** |

`|dy/dx| = 0.283088`（源码注释显式写明：`宽轴向斜率 +0.283088`、`深轴向斜率 -0.283088`）

两轴 x 跨度相同（272 : 272）、`|slope|` 相同 → **镜像对称 dimetric**，非各向异性。

> ⚠️ `0.283088` 对应 **15.806°**，不是标准 2:1 iso 的 **26.565°**。
> 若新项目按 `screenY = (x+y)*0.5` 画网格，会与现有建筑明显错位。

### 3.2 Vertical Axis

```
verticalAxis = (0, -1)        angle = -90°（屏幕正上方）
```

可视为**纯 screen-space 垂直**，置信度 **high**。依据：

- 主屋左墙 `(-270,135) → (-270,-10)`：Δx = 0
- 主屋右墙 `(0,58) → (0,-90)`：Δx = 0
- `CottageFoundation` 承重柱：`<rect x={px - w/2} …>` 严格垂直
- 木屋烟囱 `<rect x="-35" … width="13">`、圆木墙 `<rect x="12" …>`：严格垂直

---

## 4. Cabin Calibration

### 4.1 Ground Anchor

| 项 | 值 |
|---|---|
| `groundAnchorLocal` | `(0, 55.5)` |
| `groundAnchorScene` | `(220, 395.5)` |
| confidence | **high** |

依据：`55.5` 是石砌基座（`cabin-foundation`）底边 —— 木屋实体几何与地面接触的最低稳定线：

```
WoodenCabinHaven.tsx L182  <polygon points="-62,44 62,44 64,47 -64,47">   ← 基座顶
WoodenCabinHaven.tsx L183  <rect x="-64" y="47" width="128" height="8.5"> ← 基座立面 → 底边 y = 55.5
```

**旁证**：组件内 `#cabin-stepping-stones` 使用**绝对坐标**（不在 `room-corn_lounge` 组内）

```
L72-74  ellipse cx=156/168/180  cy=396/404/412
```

加上 `wooden-cabin-cluster` 的 `translate(60,0)` → scene `(216,396)…(240,412)`，
即迎宾踏步正好落在 `(220, 395.5)` 前方 —— 与推导出的锚点完全吻合。

### 4.2 contactBand（**不是** plan footprint）

木屋**没有**平面视 rhombus。其接地轮廓是石砌基座的**立面接触带**：

```
contactBand = [
  { x: -62, y: 44    },   // backLeft  (基座顶边左端)
  { x:  62, y: 44    },   // backRight
  { x:  64, y: 55.5  },   // frontRight(基座底边右端)
  { x: -64, y: 55.5  },   // frontLeft
]
contactBandCenter       = (0, 49.75)
contactBandWidthVisual  = 126
contactBandHeightVisual = 11.5   // 基座立面可见高度 —— 不是 depth
planFootprint           = null   // 无法推导
```

> ⚠️ **`contactBand` is NOT a plan-view building footprint.**
> **DO NOT use `contactBand` as a building exclusion polygon.**
> 草簇避让、碰撞、道路避让等逻辑**禁止**直接使用它作为真实建筑占地。
> `contactBandHeightVisual` 是可见基座立面高度，**不是**建筑进深。

confidence: **medium**。
理由：该 quad 是「可见接地带」，可用于对齐地面网格；但木屋以**正面立面**方式绘制，
其**真实平面进深**无法从 geometry 反推，因此不填伪精确数字。

### 4.3 Visual Ground Scale

项目**不存在任何现实尺度**（无米、无 cm、无 gameplay world unit）。

```
worldScale = null
visualScaleUnit = SVG user unit（#panoramic-world-stage 内）
VISUAL_GROUND_UNIT = 136   // = 主屋地板宽 544 / 4
```

> ⚠️ **`VISUAL_GROUND_UNIT` is an authoring convenience only.**
> 它**不是** world unit、meter、gameplay unit、projection unit，也不是任何物理尺度。
> 它只是主屋地板宽（544）/ 4，作为网格间距与贴图平铺的方便模数。

参考尺寸（均为 scene units）：

| 参考物 | 尺寸 |
|---|---|
| 主屋地板 rhombus | 544 宽 × 154 深 |
| 主屋地板单板节距 | 9.625（16 板 / 154） |
| 木屋 contactBand 宽 | 126 |
| 木屋 contactBand 可见高度 | 11.5 |

---

## 5. Main House Cross-check

### 5.1 主屋地板轴（VISUAL GROUND AXIS SOURCE）

```
主屋 floor rhombus = (-272,135) (0,58) (272,135) (0,212)     center = (0,135)
主屋 gravel swale  = (-292,145) (0,62) (292,145) (0,236)     center = (0,149)   ← 外扩 20
```

| | Ground Axis A | Ground Axis B |
|---|---|---|
| **Main House** | `(272, 77)` → **+15.806°** | `(272, -77)` → **−15.806°** |

### 5.2 对比结果

```
Cabin:        A = 无法测量      B = 无法测量
Main House:   A = +15.806°      B = -15.806°

Difference:   A = N/A           B = N/A
```

**结论：不能认为 Cabin 与 MainHouse「共享同一投影 contract」—— 两者是不同绘制范式。**

- **Main House**：严谨 dimetric 轴测盒体。显式 rhombus、显式斜率常量、垂直墙边、柱础按 `0.283088 * px` 排布。
- **Cabin**：手绘 **正面立面 2.5D**。证据：
  - 接地是**水平带状** `<polygon points="-62,44 62,44 64,47 -64,47">` + 轴对齐椭圆接触影 `ellipse cx=0 cy=58 rx=94 ry=23`
  - 侧墙是**矩形** `<rect x="12" y="-2" width="48" height="44">` — 无透视收缩
  - 屋顶是**对称正山墙** `polygon points="-66,-2 0,-44 66,-2"` — 两坡 ±32.5°，轴测下不该对称
  - 室内地板是**一点透视梯形** `polygon points="-56,42 -48,24 12,24 12,42"`，左缘斜率 ≈ −66°
  - 室内侧墙顶缘 Δ(8,4) = **+26.565°（2:1）**，与地板的 −66° **自相矛盾**

因此木屋**不暴露任何地面轴边对**，无法给出角度差。
**这是结构性 mismatch，不是视觉容差**。Cabin 因此只是 **ANCHOR REFERENCE**，永不作为轴线来源。

> 本项目**不修复**此项（Phase 0 禁止重画资产）。
> 实务建议：**地面网格以 Main House 的 ±15.806° 为准**，木屋的 `groundAnchor` 仅用于放置。
> 因为 ±15.806° 网格足够平缓，在正面立面建筑脚下同样自然。

### 5.3 layout-gizmo 交叉验证（**不同契约**）

独立子系统 [src/components/layout-gizmo/isoMath.ts](../../src/components/layout-gizmo/isoMath.ts) 自带完整可逆投影：

```
X_screen = u * 1.0   + v * 0.8
Y_screen = u * -0.2852 + v * 0.228 - w
```

| | |slope| | 角度 |
|---|---|---|
| isoMath u 轴 | 0.2852 | 15.926° |
| isoMath v 轴 | 0.228 / 0.8 = 0.2850 | 15.907° |
| 主屋 | 0.283088 | 15.806° |
| **差值** | — | **0.100° / 0.119°** |

`0.100° < 3°` → 角度上**高度一致**。

⚠️ **但两者不是同一个矩阵**：isoMath 对进深轴额外做了 x 收缩（`cosV = 0.8` vs `cosU = 1.0`），
而主屋两轴 x 跨度相等（272 : 272）。

- 若做 **地面**（terrain/grass/roads/walls/platforms）→ 用 **VISUAL_GROUND_PROJECTION**
- 若做 **家具拖拽 gizmo** → 用 **isoMath（INTERACTION_GIZMO_PROJECTION_REFERENCE）**

---

## 6. Architecture Conclusion

**分类：B**

> **存在部分 projection helper，但很多资产自行修正。**

| 判据 | 结果 |
|---|---|
| 存在显式、被文档化的投影常量 | ✅ `0.283088`，写死在 2 个文件 |
| 存在真正可逆的投影 helper | ✅ `layout-gizmo/isoMath.ts`（project / unproject / delta） |
| 两者角度一致性 | ✅ ≈0.1° |
| 是否存在**全场景共用**的单一 camera/helper | ❌ 无。每个资产各自重写或手改常量 |
| 是否存在系统性本地差异 | ✅ isoMath 进深轴 x 收缩 0.8 vs 主屋 1:1 |
| 外围资产是否遵循 | ❌ 木屋为手绘正面立面 2.5D，无地面 rhombus |

**不是 A**（没有统一 world→screen camera）；
**不是 C**（不是纯手绘无契约 —— 常量真实存在且跨文件一致）。

因此新项目应继承的是 **VISUAL PROJECTION CONTRACT**（§3 的三条轴），而不是虚构的 3D camera。

---

## 7. 生成文件

| 文件 | 作用 |
|---|---|
| [docs/visual-system/live-with-me-projection-spec.md](./live-with-me-projection-spec.md) | 本文档 |
| [src/world/liveWithMeProjection.ts](../../src/world/liveWithMeProjection.ts) | 机器可读提取件（`VISUAL_GROUND_PROJECTION` + `projectGround()`） |
| [src/components/debug/ProjectionCalibration.tsx](../../src/components/debug/ProjectionCalibration.tsx) | 独立校准场景（**未接入 app**） |

上述三个文件**不被任何现有组件 import**，因此：

- 不进入 production bundle（Vite 只打包可达文件）
- 不改变现有 production scene 的任何像素
- 不影响任何 gameplay / z-order / camera

---

## 8. Prototype Migration Package

### MUST COPY

| 文件 | 原因 |
|---|---|
| `src/components/architecture/WoodenCabinHaven.tsx` | 校准资产本体（左边那栋木屋） |
| `src/components/CharacterAvatar.tsx` | 上者的依赖（`CharacterHead`） |
| `src/world/liveWithMeProjection.ts` | 投影契约 |
| `src/components/debug/ProjectionCalibration.tsx` | 校准场景 |
| `docs/visual-system/live-with-me-projection-spec.md` | 人读规格 |

> **新 prototype 应使用 `VISUAL_GROUND_PROJECTION`（契约 A），
> 而不是 `INTERACTION_GIZMO_PROJECTION_REFERENCE`（契约 B）。**
>
> `WoodenCabinHaven` 引用了 5 个**外部定义**的 gradient / filter：
> `cabinStoneGrad`、`cabinShingleGrad`、`cabinLogGrad`、`cabinGlow`、`softShadow`。
> 它们原本定义在 `ThreeWorld.tsx` 的共享 `<defs>` 中。
> `ProjectionCalibration` 已内置最小 stub，无需再复制 ThreeWorld。

### REFERENCE ONLY

| 文件 | 用途 |
|---|---|
| `src/components/architecture/TimberFlooring.tsx` | 投影常量的**原始出处**（VISUAL GROUND AXIS SOURCE） |
| `src/components/architecture/CottageFoundation.tsx` | 常量复用范例（柱础 / 台阶 / 卵石排布） |
| `src/components/layout-gizmo/isoMath.ts` | 若新项目要做家具拖拽，参考其可逆投影实现 |

> ⚠️ **`isoMath.ts` 是 REFERENCE ONLY。
> 不要把它作为新 grass prototype 的 ground projection implementation。**

### DO NOT COPY

| 文件 / 目录 | 原因 |
|---|---|
| `src/components/scenery/yorkshire/**` | 约克郡景观系统（matte / terrain / parcels / walls / dressing），与草地原型无关 |
| `src/components/ThreeWorld.tsx` | 全屋主场景（约 3900 行），依赖大量 gameplay 状态 |
| `CottageRoofFraming.tsx`、`CottageWallProfiles.tsx`、`CapsulePodHaven.tsx` | 主屋/胶囊舱资产，校准不需要 |
| `src/components/layout-gizmo/**`（除 isoMath 参考） | 家具布局校准器 UI |
| 任何 `App.tsx` / 状态容器 / 弹窗 / 存储逻辑 | 与投影无关 |

**迁移原则**：新项目只带走「1 栋木屋 + 1 份轴契约 + 1 个校准场景」，
不要携带旧项目的背景系统、地形系统与 gameplay。

---

## 9. 成功标准自检

> 能否把一个真实 Cabin 放进全新空白项目，根据本 spec 画出地面网格，
> 让网格在视觉上自然地从 Cabin 脚底延伸出去？

| 检查项 | 状态 |
|---|---|
| 三条轴有明确数值（非假设） | ✅ 来自主屋显式常量，且经 isoMath 0.1° 内验证 |
| 地面锚点稳定且可复核 | ✅ 由迎宾踏步绝对坐标旁证 |
| 网格可用同一锚点对齐木屋脚底 | ✅ `ProjectionCalibration` 以 `translate(0, -55.5)` 使锚点落于原点 |
| 未虚构 3D camera | ✅ 只声明 visual projection contract |
| 未混淆两份 contract | ✅ A / B 明确分离 |
| 未修改任何现有资产 | ✅ |
| production scene 像素不变 | ✅ 新增 3 文件均不可达 |

**Phase 0 / 0.1 完成。** 可进入草地纹理阶段。

---

## 附录 A — 为什么不是 2:1 isometric（速查）

| | 标准 2:1 iso | **Live With Me 当前** |
|---|---|---|
| 地面轴角度 | ±26.565° | **±15.806°** |
| \|slope\| | 0.5 | **0.283088** |
| screenX | `x - y` | **`x*0.96219 + y*0.96219`** |
| screenY | `(x + y) * 0.5` | **`x*0.272379 - y*0.272379 - h`** |

用 2:1 网格叠加现有主屋地板，会在 ±272 处产生 **约 60px 的纵向错位**。

## 附录 B — 置信度汇总

| 项 | confidence | 依据 |
|---|---|---|
| `visualGroundAxes` | **high** | 2 文件显式常量 + 1 子系统 0.1° 内独立复现 |
| `groundAnchor` | **high** | 基座底边几何 + 迎宾踏步绝对坐标双重佐证 |
| `cabinContactBand` | **medium** | 仅可见接地带；平面进深不可推导 |
| `verticalAxis` | **high** | 所有墙/柱/烟囱/门框边缘严格 Δx = 0 |
| `cabinVsMainHouse` | **无法测量** | 木屋为正面立面范式，无地面轴边对 |
