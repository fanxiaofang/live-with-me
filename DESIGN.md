# Live With Me：当前设计与架构

更新：2026-10-09（Asia/Shanghai）。本文对应 P0–P7 重构、中远景视差连续性修复、房间导航优化及建筑布局与资产调整后的生产代码。原始设计文档保存在 [历史设计](docs/architecture/history/DESIGN_BEFORE_REFACTOR.md)，逐批证据见 [执行记录](docs/architecture/EXECUTION_STATUS.md)。

## 产品与技术栈

Live With Me 是低打扰的陪伴空间。继续使用 React 19、TypeScript、Vite、SVG、CSS / Tailwind CSS 4；CSS 负责布局、浮层、响应式、主题和动画，TypeScript 负责场景数据及坐标转换，SVG 保留手绘资产。npm 及 package-lock.json 是安装入口；dev 端口仍为 3000，DISABLE_HMR 配置保留。

P0–P7 架构重构保留了 RoomId、人物状态、SVG 导出、家具编辑、原构图与资产遮挡顺序。后续中远景调整及连续性修复的范围见下文。系统未引入 ECS、全局状态库、后端或多人同步。房间状态、信件及家具布局仍由 App 的功能 hooks 所有。

## 生产调用链与渲染顺序

唯一主入口为 main.tsx → App → ThreeWorld。ThreeWorld 先绘制 WorldDefs 和 BackgroundLandscape 的天空、远山铁路、麦田三层视差，再在 panoramic-world-stage 中组合 HomesteadMeadow、四处建筑及 ForegroundLandscape，最后绘制浮层。远山松林在 MountainSilhouette 内。旧 YorkshireWorld 和 CommunicationHill 已移除。

四处建筑均由 world/render/SceneEntity 执行 placement，建筑资产只保留内部几何、床内偏移、墙面剪切及原绘制顺序。主屋内部地板、墙面、家具、人物、玻璃、屋顶顺序按原生产 JSX 保留，未按新的类别重排。远山松树位于场景层，不随电波站移动。defs 保持现有标识和引用。

| 实体 | scene position | scale |
| --- | --- | --- |
| main_cottage | (540,210) | 1 |
| capsule_pod | (1000,350) | 1 |
| wooden_cabin | (125,350) | 1 |
| observatory | (1100,230) | 0.80 |

定义入口：src/world/scene/sceneLayout.ts。主屋大段几何位于 components/architecture/MainCottageHaven.tsx；景观、主题、浮层分别位于 world/render、world/theme、world/overlays。

## 建筑布局与资产调整

第三阶段天气光效仍暂缓。小木屋与胶囊舱分别移到草台西、东侧，底座、台阶及接地阴影留在草台内；电波站移到靠近麦田的右后方草地，仍处于 1.0x 主舞台。TerrainMass 的四处地面阴影消费同一 sceneLayout 的 position / scale，不再使用与建筑脱离的绝对坐标。

小木屋用统一的浅轴测基底绘制屋顶、外墙、地板、床与台阶，正面朝画面右下方（东南），左侧可见圆木侧墙；窗台花保留在正面窗户上。木床恢复圆头床柱、木质床头/床尾板、蓬松软枕和陶土红羊毛厚被，床头在东侧，床头柜和单盏阅读灯在旁。无火炉的烟囱、烟雾和柴棚移除，人物局部床位随床铺调整。胶囊舱恢复原始正视舱身、圆形黄铜舷窗及支腿，不再剪切舱体或叠加偏移后壳；床铺限于舷窗开口，入口踏步与水平门槛对齐。电波站锅面增加背壳、倾斜口沿及朝天空右上方的馈源支架，并修正台面栏杆与机柜面板的投影。

小木屋床头柜旁不设内隔墙，后墙和地板延续到花窗后方。屋檐与主屋共用 terracottaRoof 陶瓦材质，瓦口下有暖木封檐梁和深色底面，踏步绘制完整的顶面、侧面与立面。五杠牧场门移到东侧麦田与草甸的田界，与矮石墙接续；门和石墙位置统一定义在 landscapeLayout.ts，主屋前廊前的草地保持开阔。

主屋三组低矮植物位于地板绘制之后，遮挡少量柱脚而保留架空层、前廊台阶和入口。详见 [建筑调整记录](docs/architecture/BUILDING_LAYOUT_REFINEMENT.md)。

## 坐标、相机与手势

sceneTypes 区分 LocalPoint、ScenePoint、ViewBoxPoint、ClientPoint 及对应位移。局部点显式携带 parent。SVG viewBox 保持 1200×800，preserveAspectRatio 为 xMidYMid slice。

相机由 useWorldCamera 管理，公式为 q = origin + zoom × (p − origin) + translation，origin=(600,400)，zoom 范围 0.45–2.5。RoomFocus 用 targetEntity、localAnchor、zoom、compositionPoint、contextSize；anchor 围绕实际活动区域或设施定义，contextSize 在实体局部空间定义周边环境范围，结合 slice 可见视口及实体 scale 下调窄屏缩放。overview 是独立 preset。选中房间与相机目标同次提交，手动相机继续独立保存；切换房间、同房间重新选择或 focus 下调整视口都会重新派生焦点。cameraBounds 按实际可见视口、缩放与建筑 placement 推导手动漫游范围；全景保留建筑构图与山田间距，包含响应式房间 focus 及周边平移空间。拖动、滚轮、按钮及双指缩放共享约束。

背景阻尼仍由 parallaxMath 的 sky / mountains / wheat / stage 配置控制。landscapeGeometry 定义地形边缘及其保守包络，resolveLandscapeCoverage 把前层后缘投影到后层局部空间，延展山麓与麦田底部曲线，保留至少 8 个根 SVG 单位的覆盖。cameraMotion 统一四层 400ms 过渡，450ms 后收敛地形覆盖，连续操作会重新计时。选中房间仅由导航状态与镜头聚焦表达，场景内不绘制区域虚线、填色或选中光圈；室内地板保留透明点击区域。建筑资产与编辑手势上下文保持稳定。详见 [中远景修复记录](docs/architecture/LANDSCAPE_CONTINUITY_FIX.md) 和 [房间导航优化记录](docs/architecture/ROOM_NAVIGATION_OPTIMIZATION.md)。

| 视角 | 初始 translation | zoom |
| --- | --- | --- |
| overview | (0,135) | 0.66 |
| my_room | (246,144) | 1.20 |
| living_nook | (70.8,100.3) | 1.18 |
| friend_room | (-96,120) | 1.20 |
| capsule_pod | (-580,60.9) | 1.45 |
| corn_lounge | (652.4,44.8) | 1.40 |
| observatory | (-775,269.7) | 1.55 |
| porch_mailbox | (16.2,33.8) | 1.08 |

表格对应默认 placement 与完整 1200×800 可见视口；窄屏、极宽屏或建筑 scale 变化时，房间 zoom 与 translation 会重新派生。已确认的 overview 参数保持固定。

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

InteractionTarget 使用 entity、room、person、book、poster、furniture-part 六种类型。registry 保存静态描述，dispatcher 接收运行时上下文并执行业务回调。人物姓名、书名和动态文字不作为 ID。主要 SVG 入口支持 Enter / Space，与鼠标路径一致。家具描述仅读取布局表自身的合法 ID，未知运行时 ID 返回通用文案，避免悬停文字异常卸载场景。React 类型声明作为锁定开发依赖提供 props 与家具 ID 的编译检查。

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
