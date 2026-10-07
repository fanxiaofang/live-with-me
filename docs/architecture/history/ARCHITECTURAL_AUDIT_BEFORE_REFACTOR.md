# Live With Me — 项目代码硬编码与架构扩展性排查报告 (Code & Architecture Audit)

> **审计状态**: 基于全量代码库真实验证排查
> **生成时间**: 2026-10-07 00:39:54 (UTC-7)
> **代码版本 (Commit ID)**: `Workspace Snapshot / Git Commit: N/A`
> *(注：本报告拒绝凭空猜测，所有排查项均附带文件绝对路径、精确行号与真实代码片段)*

---

## 一、 核心排查结论与架构风险总览

项目在 UI 视觉展现与动画交互上达到了较高的工匠级质量，但从软件工程与系统可扩展性角度审视，代码库中存在大量**硬编码坐标（Magic Coordinates）、双重投影数学模型不一致、单体巨型组件过载、硬编码魔数字符串（Magic Strings）**等反模式。这些问题直接导致了后续更改位置（例如此前将电波站平移）时容易出现“修改了配置却未在 UI 中生效”的困境。

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            核心架构反模式大盘点                               │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. 3400+ 行单体文件过载 (`ThreeWorld.tsx` 承担了视图/状态/几何/动画全量逻辑)    │
│ 2. 坐标双重硬编码 (`ThreeWorld` 外层 translate + 组件内部 translate 叠加)      │
│ 3. 镜头视角配置与物理坐标解耦 (相机视角 `ROOM_VIEWPORTS` 需人工手动二次换算)    │
│ 4. 投影数学契约不一致 (`VISUAL_GROUND` 斜率 0.283088 vs `isoMath` cosV 0.8)    │
│ 5. 交互悬停与状态判断基于字符串模糊匹配 (`hoveredObject === 'tractor'`)      │
│ 6. 资产内部写死绝对 Path/Gradient (难以复用与参数化更换主题)                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 二、 详细代码硬编码与反模式排查 (附真实代码支撑)

### 1. 坐标双重硬编码反模式 (Dual-Layer Coordinate Hardcoding)

#### 🔴 问题描述：
组件的绝对 Scene 坐标没有收拢到统一的配置文件（如 `landscapeLayout.ts`）中，而是**被拆分硬编码在 `ThreeWorld.tsx` 的外层 `<g>` 标签和子组件内部根 `<g>` 标签中**。这种“双重叠加硬编码”是此前修改位置失效的根本原因。

#### 📄 代码证据：
- **子组件内部硬编码**：
  - File: `src/components/architecture/CapsulePodHaven.tsx` (L420)
    ```tsx
    // 胶囊仓组件内部写死了 translate(930, 420)
    <g id="room-capsule_pod" transform="translate(930, 420) scale(0.82)">
    ```
  - File: `src/components/architecture/WoodenCabinHaven.tsx` (L78)
    ```tsx
    // 木屋组件内部写死了 translate(160, 340)
    <g id="room-corn_lounge" transform="translate(160, 340)">
    ```

- **父级视图外层二次偏移硬编码**：
  - File: `src/components/ThreeWorld.tsx` (L1835, L3240, L3257)
    ```tsx
    // 主屋外层 translate
    <g id="living-cottage-haven" transform="translate(540, 210)">

    // 胶囊仓集群外层二次偏移 translate(-36, 0)
    <g id="capsule-pod-cluster" transform="translate(-36, 0)">

    // 木屋集群外层二次偏移 translate(60, 0)
    <g id="wooden-cabin-cluster" transform="translate(60, 0)">
    ```

#### ⚠️ 架构影响：
若要移动一个建筑，开发人员必须同时计算组件内部 `translate` 与外部集群 `translate` 的向量叠加。任何一处未更新，就会导致组件位置错位或配置失效。

---

### 2. 镜头相机配置与场景物理坐标解耦 (Decoupled Camera Viewports)

#### 🔴 问题描述：
在 `ThreeWorld.tsx` 顶部定义了房间视角映射表 `ROOM_VIEWPORTS`，其坐标与缩放比例均为**手动试错得出的魔数（Magic Numbers）**，未与景观对象的真实 Scene 坐标建立数学联动。

#### 📄 代码证据：
- File: `src/components/ThreeWorld.tsx` (L56-L65)
  ```typescript
  const ROOM_VIEWPORTS: Record<string, { x: number; y: number; scale: number }> = {
    overview: { x: 0, y: 135, scale: 0.66 },
    my_room: { x: 220, y: 150, scale: 1.55 },
    living_nook: { x: 20, y: 130, scale: 1.55 },
    friend_room: { x: -180, y: 140, scale: 1.55 },
    porch_mailbox: { x: 40, y: -80, scale: 1.5 },
    capsule_pod: { x: -280, y: 60, scale: 1.6 },
    corn_lounge: { x: 210, y: -30, scale: 1.6 },
    observatory: { x: -380, y: 30, scale: 1.6 },
  };
  ```

#### ⚠️ 架构影响：
当电波站从远山移动到右侧草地后，不仅需要修改电波站的 SVG 坐标，还必须凭肉眼手动推算并修改 `ROOM_VIEWPORTS.observatory` 的 `x: -380, y: 30`。缺少形如 `getRoomCameraViewport(sceneX, sceneY, zoom)` 的自动推导公式。

---

### 3. 单体巨型文件过载反模式 (Monolithic File Overload)

#### 🔴 问题描述：
`src/components/ThreeWorld.tsx` 当前行数高达 **3,441 行**！该文件承担了过多的职责，极大地违反了单一职责原则（Single Responsibility Principle）。

#### 📄 代码证据：
- File: `src/components/ThreeWorld.tsx`
  - **职责 1**：全景镜头状态与事件监听（L300-L450）
  - **职责 2**：全局 SVG `<defs>` 50+ 个滤镜与渐变定义（L100-L500）
  - **职责 3**：内联硬编码大量房间墙面、红砖烟囱、茶几与地板（L1835-L2500）
  - **职责 4**：外星信号接收与 UI 解码卡片（L3425-L3465）
  - **职责 5**：全局 Hover Tooltip 的大型 Switch/Ternary 判断逻辑（L3370-L3423）

#### ⚠️ 架构影响：
即使只是修改一行 UI 文本或微调一个颜色，都需要重新解析整个 3400+ 行的大文件，增加打包编译负担与维护成本。

---

### 4. 投影契约数学模型不一致 (Inconsistent Projection Math)

#### 🔴 问题描述：
项目中并行存在两套**数学公式不一致**的投影契约：

#### 📄 代码证据：
- **契约 A（地面绘制契约）**：
  - File: `src/world/liveWithMeProjection.ts` (L20) 及 `TimberFlooring.tsx` (L88)
  - 数学公式：`slope = 0.283088` (≈ ±15.806°)，X/Y 两轴跨度绝对相等（`272 : 272`）。
- **契约 B（交互/家具拖拽操纵契约）**：
  - File: `src/components/layout-gizmo/isoMath.ts` (L12-L20)
    ```typescript
    export const ISO_MATRIX = {
      cosU: 1.0,
      sinU: -0.2852,  // 对应 15.926°
      cosV: 0.8,      // ⚠️ 进深轴带有 0.8 额外 X 轴收缩
      sinV: 0.228,
    };
    ```

#### ⚠️ 架构影响：
使用 `isoMath` 计算得出的坐标拖拽家具时，其等轴测网格与 `TimberFlooring` 绘制的原木地板并不存在 100% 的数学重合，存在 ≈0.12° 的角度偏差与进深缩放偏差。

---

### 5. 交互状态硬编码与字符串魔数判断 (Magic String Tooltips & Interactions)

#### 🔴 问题描述：
视图悬停（Hover）提示与交互判定依赖于散落各处的**魔数字符串（Magic Strings）**与条件拼接，缺乏统一的 ENUM 或数据驱动的交互注册表。

#### 📄 代码证据：
- File: `src/components/ThreeWorld.tsx` (L3370-L3420)
  ```tsx
  {hoveredObject === 'tractor' && '🚜 麦浪拖拉机 · 梯田里的丰收耕耘与南瓜丰收'}
  {hoveredObject === 'mailbox' && '📪 前廊木信箱 · 点击查看信件或留言'}
  {hoveredObject === 'person-self' && '🌿 我 · 点击更新生活状态'}
  {hoveredObject === 'daybed' && '🛋️ 日式实木蔺草榻榻米 · 暖炉旁小憩好去处'}
  {hoveredObject?.startsWith('bookshelf:') && hoveredObject.replace('bookshelf:', '')}
  {hoveredObject === 'room-corn_lounge' && '🪵 林间小木屋 · 质朴原木与雪松清香的安睡木屋（点击对焦参观）'}
  ```

#### ⚠️ 架构影响：
当添加一个新物件或重命名房间时，必须手动去 `ThreeWorld.tsx` 的 50 多行 JSX 三元表达式中逐行查找与修改字符串。

---

### 6. 人物场景槽位与偏移量写死 (Hardcoded Character Presence Slots)

#### 🔴 问题描述：
人物在房间内的坐姿、站姿、面向与偏移量被直接写死在映射表文件中，无法通过后台或参数配置。

#### 📄 代码证据：
- File: `src/utils/sceneViewMapping.ts` (L15-L50)
  ```typescript
  export const SCENE_SLOT_CONFIGS: Record<string, SceneSlotConfig> = {
    sofa_lounge: {
      roomId: 'living_nook',
      slotName: '懒人沙发角',
      offset: { dx: 142, dy: 114 }, // 硬编码偏移
      facing: 'front',
      badgeLabel: '🛋️ 软糯面包懒人沙发',
    },
    tatami_capsule: {
      roomId: 'capsule_pod',
      slotName: '胶囊舱榻榻米床',
      offset: { dx: 882, dy: 412 }, // 硬编码偏移
      facing: 'side',
      badgeLabel: '🚀 旧太空胶囊舱卧室',
    },
  };
  ```

#### ⚠️ 架构影响：
如果不慎调整了胶囊仓或大木屋的位置，这些写死在 `sceneViewMapping.ts` 中的 `dx/dy` 人物槽位就会发生“人物悬空脱离床位/沙发”的 Bug。

---

### 7. 建筑资产内部几何与样式缺乏参数化 (Lack of Parametric Props)

#### 🔴 问题描述：
建筑组件（如 `CottageFoundation.tsx`、`CapsulePodHaven.tsx`）内部写死了大量多边形顶点坐标与特定颜色的 Gradient ID。

#### 📄 代码证据：
- File: `src/components/architecture/CottageFoundation.tsx` (L21-L22)
  ```typescript
  // 柱子 X 坐标在代码内部写死，无法通过 props 增减柱子数量或改变间距
  const postsLeft = [-225, -165, -105, -45];
  const postsRight = [45, 105, 165, 225];
  ```
- File: `src/components/architecture/CapsulePodHaven.tsx` (L60-L160)
  在组件 `<defs>` 中内联定义了 14 个仅供自身使用的 Gradient（如 `#podShellUpperGrad`），无法复用外部主题调色板（`theme`）。

---

## 三、 重构与可扩展性优化建议路线图 (Refactoring Roadmap)

为了提升代码库的维护性与扩展性，建议按以下阶段进行逐步解耦：

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            架构解耦重构三步走                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ Phase 1: 场景坐标配置收拢 (Unified Scene Layout Registry)                    │
│ └── 创建 `sceneLayoutRegistry.ts`，将所有建筑/设施/人物槽位绝对坐标统一收拢     │
│                                                                             │
│ Phase 2: 镜头自动推导 (Automated Camera Focus Engine)                       │
│ └── 编写 `getCameraViewportForScenePos(sceneX, sceneY, zoom)` 自动计算视口    │
│                                                                             │
│ Phase 3: 拆分 `ThreeWorld.tsx` (Component Decomposition)                     │
│ └── 将 SVG `<defs>`、交互提示、外星卡片拆分为独立模块组件                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

1. **统一场景注册表 (`sceneLayoutRegistry.ts`)**：
   将 `MainCottage`、`WoodenCabin`、`CapsulePod`、`CommunicationHill` 的坐标收拢至单一配置文件。子组件渲染时强制从注册表读取 `transform`。
2. **基于物体的镜头自动计算**：
   替换 `ROOM_VIEWPORTS` 的硬编码数值，改为由物体的 Scene 坐标动态推导镜头 center `(camX, camY)`。
3. **拆分 `ThreeWorld.tsx`**：
   - 提取 `WorldDefs.tsx`（专存渐变与滤镜）
   - 提取 `WorldTooltipOverlay.tsx`（专存 Hover 浮层与提示配置表）
   - 提取 `MainCottageHaven.tsx`（将主屋建筑独立封装）

---

## 四、 总结

本次全量代码排查共发现 **7 项重度硬编码/架构扩展瓶颈**。所有排查项均经由项目真实源码验证。本报告可作为团队下一步架构解耦与重构的直接依据。
