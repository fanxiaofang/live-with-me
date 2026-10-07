# Live With Me：当前设计与架构

更新：2026-10-07（Asia/Shanghai）。本文对应 P0–P7 重构后的真实生产代码。原始设计文档保存在 [历史设计](docs/architecture/history/DESIGN_BEFORE_REFACTOR.md)，逐批证据见 [执行记录](docs/architecture/EXECUTION_STATUS.md)。

## 产品与技术栈

Live With Me 是低打扰的陪伴空间。继续使用 React 19、TypeScript、Vite、SVG、CSS / Tailwind CSS 4；CSS 负责布局、浮层、响应式、主题和动画，TypeScript 负责场景数据及坐标转换，SVG 保留手绘资产。npm 及 package-lock.json 是安装入口；dev 端口仍为 3000，DISABLE_HMR 配置保留。

本轮保留 RoomId、人物状态、SVG 导出、家具编辑、原构图与资产遮挡顺序。没有引入 ECS、全局状态库、后端或多人同步。房间状态、信件及家具布局仍由 App 的功能 hooks 所有。

## 生产调用链与渲染顺序

唯一主入口为 main.tsx → App → ThreeWorld。ThreeWorld 组合 WorldDefs、BackgroundLandscape、远山 DistantPines、ObservatoryHaven、MainCottageHaven、CapsulePodHaven、WoodenCabinHaven、ForegroundLandscape 及浮层。旧 YorkshireWorld 和 CommunicationHill 已移除。

四处建筑均由 world/render/SceneEntity 执行 placement，建筑资产只保留内部几何、床内偏移、墙面剪切及原绘制顺序。主屋内部地板、墙面、家具、人物、玻璃、屋顶顺序按原生产 JSX 保留，未按新的类别重排。远山松树位于场景层，不随电波站移动。defs 保持现有标识和引用。

| 实体 | scene position | scale |
| --- | --- | --- |
| main_cottage | (540,210) | 1 |
| capsule_pod | (894,320) | 1 |
| wooden_cabin | (220,340) | 1 |
| observatory | (1000,460) | 0.80 |

定义入口：src/world/scene/sceneLayout.ts。主屋大段几何位于 components/architecture/MainCottageHaven.tsx；景观、主题、浮层分别位于 world/render、world/theme、world/overlays。

## 坐标、相机与手势

sceneTypes 区分 LocalPoint、ScenePoint、ViewBoxPoint、ClientPoint 及对应位移。局部点显式携带 parent。SVG viewBox 保持 1200×800，preserveAspectRatio 为 xMidYMid slice。

相机由 useWorldCamera 管理，公式为 q = origin + zoom × (p − origin) + translation，origin=(600,400)，zoom 范围 0.45–2.5。RoomFocus 用 targetEntity、localAnchor、zoom、compositionPoint；anchor 反推自原镜头，本轮未重新取景，允许 anchor 位于建筑外。overview 是独立 preset。房间 focus 不被旧边界截断；手动范围包含旧边界与派生 focus 的包围范围。手动操作进入漫游，重新选择同一房间也恢复 focus。

| 视角 | 初始 translation | zoom |
| --- | --- | --- |
| overview | (0,135) | 0.66 |
| my_room | (220,150) | 1.55 |
| living_nook | (20,130) | 1.55 |
| friend_room | (-180,140) | 1.55 |
| capsule_pod | (-280,60) | 1.6 |
| corn_lounge | (210,-30) | 1.6 |
| observatory | (-380,30) | 1.6 |
| porch_mailbox | (40,-80) | 1.5 |

相机 pan 使用根 SVG 坐标差；Gizmo 把两次 client 指针位置通过保存坐标所属 parent 的 getScreenCTM 逆矩阵转换后求 delta，包含相机、嵌套 scale 与左墙剪切。轴向把手保留原 isoMath authoring 方向，不再乘固定 0.45。

统一 Pointer Events；优先级为把手编辑、场景漫游、点击。移动超过 4 CSS 像素取消点击；编辑禁止同时漫游及导航。pointercancel / lost capture 回到手势起点、不保存。双指切换重建起点并处理 capture 转移。

## 家具归属与存储

家具静态元数据和默认值统一在 layoutStore，归属表在 features/layout-editor/furnitureParents.ts。柜体摆件属于 cabinet-group，桌面摆件属于 desk-group，书架摆件属于 bookshelf-group，左墙物件使用 craft-wall 剪切空间；桌椅保持同级，茶席保持独立。

保留 live_with_me_room_layout_v6 的 key 和兼容对象结构。加载只接受合法 ID、有限 x/y 及正 scale；坏条目单独回退默认值，存储不能覆盖名称、类别、parent 等静态元数据。渲染、面板复制和保存消费同一 resolved layout。

拖动仅改内存，pointer up 提交保存；面板坐标修改、键盘微调和 reset 提交后保存。存储失败保留内存结果并显示一次轻提示。取消拖动不落盘；回退业务提交不需要清空用户布局。

## 人物分配

features/presence/presenceAllocation.ts 是唯一候选与容量规则。App 派生一次 slots、personToSlot、unplaced，提供给场景及陪伴面板。预览调用同一分配函数。

按 people 输入顺序分配；显式房间优先于生活状态。阁楼使用工作椅、书房使用沙发、起居角按东/西/南茶席顺序选择、两个睡眠房间使用各自床位、观测台使用监听席。每人最多一席，每席容量为 1。同房间满员不跨房间安置、不改写 currentRoom，不增加场景站位；面板显示“该房间席位已满，状态已保留”。前廊不分配室内席位，也不显示满员。

## 交互、状态与 CSS 生命周期

InteractionTarget 使用 entity、room、person、book、poster、furniture-part 六种类型。registry 保存静态描述，dispatcher 接收运行时上下文并执行业务回调。人物姓名、书名和动态文字不作为 ID。主要 SVG 入口支持 Enter / Space，与鼠标路径一致。

App 的 usePresenceState、useMailbox、useBookshelf、useLayoutEditor、useToast 管理业务状态；相机、hover、站点和沙发反馈由对应 controller 管理。TimerScope 使用命名期限，重复触发替换前一次期限，关闭浮层或卸载清理；音频引擎卸载时停止 interval、声源和 AudioContext。

src/index.css 保留 Tailwind 入口；景观专属动画在 world/render/landscape.css。动态位置由计算结果驱动，有定位的反馈使用外层 transform、内层 CSS 动画，避免互相覆盖。支持 morning、afternoon、dusk、night、rainy 五种主题。

## 加载、测量与测试

浮层按首次打开加载，已有信箱草稿等状态在关闭后保留。稳定事件回调与 React.memo 让相机移动避免重画无关建筑和景观。指标及限制见执行记录；大型主屋 SVG 仍在首屏，不能把拆文件等同于性能改善。

未捕获的 React 渲染异常、全局事件异常及 Promise 异常由独立于 root 的错误卡片显示，提供前端堆栈复制和保留已保存布局的重载入口。AI Studio 校准器问题的后续证据与结论边界见 [排查记录](docs/architecture/AI_STUDIO_CALIBRATOR_DIAGNOSTICS.md)。

- npm run lint：TypeScript 类型检查。
- npm run test:unit：Node 内置测试 + tsx。
- npm run test:e2e：非视觉浏览器回归。
- npm run test:visual：11 个视觉场景。
- npm run build 后 npm run test:preview：真实生产构建的导航、编辑、浮层和导出。

Playwright 1.56.1 / Chromium 141.0.7390.37 固定于开发和 CI，浏览器安装不进入启动脚本或 postinstall。视觉基线使用 Windows、DPR=1、字体等待、暂停 CSS/SMIL 动画，差异像素上限 0.1%，建筑无遮罩。跨操作系统字体渲染不作为同一截图环境。

## 保留的投影契约与延后工作

手绘资产继续使用各自局部几何；主屋地面视觉斜率约 ±0.283088，家具 authoring 轴保留 isoMath 的进深压缩，两者没有统一成一个矩阵。world/liveWithMeProjection.ts 与投影提取文档是 authoring 参考资料，不属于生产相机或拖拽调用链。拖拽正确性由实际父节点 CTM 保证。

镜头重新取景、家具整组随动、投影统一、额外性能预算和资产进一步拆分属于后续独立体验工作。本轮没有借架构迁移调整这些行为。
