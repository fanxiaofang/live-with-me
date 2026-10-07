# Live With Me — 2.5D 田园景观与建筑系统设计文档 (Design Specification)

> **文档状态**: 基于真实项目代码全量扫描与运行画面重构校准
> **生成时间**: 2026-10-07 00:35:00 (UTC-7)
> **代码版本 (Commit ID)**: `Workspace Snapshot / Git Commit: N/A`
> *(注：当前 AI Studio Applet 预览容器运行在独立 Snapshot 运行时环境，Applet ID: `abf6f9cc-0a5c-4966-aa2c-84908391cdd2`，结合真实渲染页面与代码审查进行了全量校准)*

---

## 1. 系统总体设计架构 (System Architecture)

`Live With Me` 是一款低打扰陪伴空间（*Presence without conversation*）。系统架构采用 **React 19 + TypeScript + Vite + Tailwind CSS** 技术栈，基于 **纯粹 2.5D SVG 矢量渲染引擎** 搭建全景舞台（`#panoramic-world-stage`，全局 `viewBox="0 0 1200 800"`）。

```
                        ┌────────────────────────────────────────────────────────┐
                        │                  App.tsx / ThreeWorld                  │
                        │      (全景舞台镜头: Zoom 0.45..2.5, Pan, 昼夜 Theme)  │
                        └───────────────────────────┬────────────────────────────┘
                                                    │
               ┌────────────────────────────────────┴────────────────────────────────────┐
               ▼                                                                         ▼
┌───────────────────────────────┐                                       ┌───────────────────────────────┐
│     YorkshireWorld 景观系统    │                                       │      Architecture 建筑系统     │
│ (天空、远山、高架桥、草台箱庭)│                                       │ (中央主屋、安睡木屋、旧胶囊仓) │
└──────────────┬────────────────┘                                       └───────────────┬───────────────┘
               │                                                                         │
               └────────────────────────────────────┬────────────────────────────────────┘
                                                    ▼
                                    ┌───────────────────────────────┐
                                    │  VISUAL_GROUND_PROJECTION     │
                                    │  (视觉斜率 ±0.283088 / 15.8°) │
                                    └───────────────────────────────┘
```

### 1.1 2.5D 缓坡轴测投影契约 (Ground Projection Contract)

与传统 2:1 (±26.565°) 轴测视角不同，本项目采用专为广角英国田园透视定制的 **±15.806° 缓坡轴测投影契约**（定义于 `src/world/liveWithMeProjection.ts` 及 `docs/visual-system/live-with-me-projection-spec.md`）：

- **视觉地面斜率**: `|dy/dx| = 0.283088 ≈ ±15.806°`
- **地面轴向量**:
  - `Axis A` (右深轴): `( 0.96219,  0.272379)`（与水平线夹角 +15.806°）
  - `Axis B` (左宽轴): `( 0.96219, -0.272379)`（与水平线夹角 -15.806°）
  - `Vertical` (高度轴): `( 0, -1)`（纯屏幕垂直）
- **投影出处**: 主屋木地板 `TimberFlooring.tsx` 显式几何数值 (`<polygon points="-272,135 0,58 272,135 0,212" />`)。
- **双契约分离机制**:
  - `VISUAL_GROUND_PROJECTION`: 用于草地、步道、建筑落地。
  - `INTERACTION_GIZMO_PROJECTION_REFERENCE` (`isoMath.ts`): 专用于室内家具拖拽操纵（带有 `cosV = 0.8` 进深压缩）。

---

## 2. 主页面景观层次与实际代码实现 (Scenery Layering System)

经过真实代码审查与最新画面优化，项目去除了长椅、连接平台、地面石基、挡土矮墙、杂乱石墙、碎石散水及断头山溪，形成了以**“无界极简绿丘草台”**为核心的纯净画面，外星电波监听站已调整置于草台右侧绿框草地：

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 00 BACKGROUND MATTE (英伦高空天空渐变 + 柔和大气薄雾 + 远山云影)              │
├─────────────────────────────────────────────────────────────────────────────┤
│ 01 & 05 DISTANT SCENERY & INFRASTRUCTURE                                    │
│ ├── 远景起伏山丘 (TerrainSilhouette.tsx)                                   │
│ └── 高架石拱桥与行进列车 (RailwayLandscape.tsx)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ 02 & 03 MIDGROUND PASTURE & HARVEST                                         │
│ └── 中景金黄麦田、耕作红色拖拉机与南瓜堆 (PastureFields.tsx)                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ 04 FIELD BOUNDARY (DrystoneWalls.tsx)                                       │
│ └── 极简纯净：仅保留独立原木 5-Bar 牧场大门，去除周围所有石墙                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ CENTRAL GREEN HILL ISLAND (绿丘草台箱庭)                                     │
│ ├── 环形暗角包围的椭圆绿丘草台 (纯净留白负空间)                               │
│ ├── 右侧绿框草甸外星电波监听站 (CommunicationHill.tsx · x=1000, y=460)         │
│ ├── 前廊右侧“守护之树” (带手工挂牌)                                         │
│ ├── 散落的 Swaledale 黑脸绵羊、微型野花与立式木信箱                           │
│ └── [水系 RiverValley 说明]: 已彻底退役 (`return null`)，消除视觉切割感        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.1 00 天空与背景基底 (`BackgroundYorkshireMatte.tsx`)
- **动态昼夜调色**: 根据 `timeOfDay`（`morning` 清晨 / `afternoon` 午后 / `dusk` 黄昏 / `night` 夜晚）动态切换。例如午后采用英伦夏日蔚蓝渐变至暖金奶油色 (`#4a7896` -> `#faedd6`)。
- **无缝渐变消隐 (Fade-to-Transparent)**: 每条远山山脊线均叠加 `linearGradient` 向下方透明过渡，彻底消除了贴图切割感。

### 2.2 01 & 05 远景山丘与高架桥 (`TerrainSilhouette`, `RailwayLandscape`)
- **远景山脊 (`TerrainSilhouette.tsx`)**: 起伏的绿灰色山丘，带极细日照高光边。
- **高架石拱桥与列车 (`RailwayLandscape.tsx`)**: 位于画面左侧地平线，石拱桥洞下蒸汽/柴油列车穿行。

### 2.3 02 & 03 中景田野与南瓜丰收 (`PastureFields.tsx`)
- 中景为开阔的莫兰迪色系麦田，左侧停放着一台发动的红色复古拖拉机，车灯喷吐微光，旁边堆放着丰收的南瓜。

### 2.4 04 边界、监听站与水系的真实代码状态
- **外星电波监听站 (`CommunicationHill.tsx` / `ThreeWorld.tsx`) 真实位置**:
  已根据绿框目标区域，从远方山巅真正平移至**主庭院右侧草甸**（`x = 1000, y = 460`，即旧胶囊仓右侧平地），带有钢构桁架基座、巨型 SETI 抛物面天线（`1420.405 MHz`）与太阳能板，支持点击接收外星解码电波。
- **牧场大门与石墙 (`DrystoneWalls.tsx`) 状态**:
  移除了大门两侧的所有低矮石墙，仅保留独立的**英伦原木五木杠牧场大门 (`5-Bar Field Gate`)**，展现无界的开阔草场视角。
- **溪流水系 (`RiverValley.tsx`) 状态**:
  组件已彻底退役（`return null`），消除了对草坡的视觉切割感。

### 2.5 绿丘草台箱庭 (Central Oval Terrace Island)
- 整个生活区聚焦于中央一个被温和暗角（`#frameVignetteRadial`）包围的**椭圆绿丘草台**上。
- 草台右前方立着一棵茂盛的**“守护之树”**（挂有手工木牌），右侧设有点缀于草地上的外星电波监听站（`x=1000, y=460`），周围散落着黑脸绵羊群、雏菊野花与立式信箱。

---

## 3. 建筑集群与景观的关系 (Architecture & Scenery Integration)

庄园采用了**“一主两翼 + 右侧监听站”**（中央主木屋 + 左翼安睡木屋 + 右翼旧胶囊仓 + 右草甸电波站）的独立聚落布局：

```
                    [ 远山 / 高架桥列车 ]
                              │
    ┌─────────────────────────┼─────────────────────────┐
    ▼                         ▼                         ▼
┌────────────────────┐   ┌────────────────────┐   ┌────────────────────┐
│ 左翼：林间小木屋    │   │    中央主木屋      │   │ 右翼：旧太空胶囊仓 │
│ (WoodenCabinHaven) │   │  (Main Cottage)    │   │ (CapsulePodHaven)  │
│ [ 标识: 安睡木屋 ] │   │  [ 标识: 整栋小屋 ]│   │ [ 标识: 旧胶囊仓 ] │
└─────────┬──────────┘   └─────────┬──────────┘   └─────────┬──────────┘
          │                        │                        │
          └────────────────────────┼────────────────────────┘
                                   ▼
          [ 极简绿丘草台 & 守护之树 & 外星电波监听站 (x=1000, y=460) ]
```

### 3.1 建筑与设施组件坐标配置

| 组件 | 空间位置与 Transform | 交互标识 (Badge) | 功能与景观交互 |
|---|---|---|---|
| **中央主木屋** (`Main Cottage`) | 位于中心草台 `translate(540, 210)` | `整栋小屋` | 开放式 2.5D 结构，包含阁楼书房、暖炉起居角、林木书房。屋顶立有**红砖烟囱**（飘出白云慢烟）。 |
| **林间小木屋** (`WoodenCabinHaven`) | 位于主屋左侧 `translate(60, 0)` | `安睡木屋` | 温馨雪松原木卧房，提供大床、云朵软枕与夜读台灯，独立安放于左侧纯净草甸之上。 |
| **旧太空胶囊仓** (`CapsulePodHaven`) | 位于主屋右侧 `translate(-36, 0)` | `旧胶囊仓` | 复古航天舱卧房，带圆舷窗与独立液压活塞支脚，独立站立于右侧草坡。 |
| **外星电波监听站** (`CommunicationHill`) | 位于右侧草甸 `translate(1000, 460)` | `山巅外星电波监听站` | 人工钢构观星高台与 1420.405 MHz SETI 接收器，独立矗立在右侧开阔绿丘上（绿框目标区域）。 |

---

## 4. 代码文件索引 (Code Index)

- **全景主舞台**: `src/components/ThreeWorld.tsx`
- **景观编排器**: `src/components/scenery/yorkshire/YorkshireWorld.tsx`
- **天空与背景**: `src/components/scenery/yorkshire/background/BackgroundYorkshireMatte.tsx`
- **远山与高架桥**: `src/components/scenery/yorkshire/terrain/TerrainSilhouette.tsx` & `RailwayLandscape.tsx`
- **外星电波监听站**: `src/components/scenery/yorkshire/infrastructure/CommunicationHill.tsx`
- **牧场大门**: `src/components/scenery/yorkshire/boundaries/DrystoneWalls.tsx`
- **水系文件 (退役状态)**: `src/components/scenery/yorkshire/terrain/RiverValley.tsx` (`return null`)
- **中央主木屋基底**: `src/components/architecture/CottageFoundation.tsx`
- **左翼安睡木屋**: `src/components/architecture/WoodenCabinHaven.tsx`
- **右翼旧胶囊仓**: `src/components/architecture/CapsulePodHaven.tsx`
- **投影契约文档**: `docs/visual-system/live-with-me-projection-spec.md` & `src/world/liveWithMeProjection.ts`
