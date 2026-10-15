# Codex 会话交接上下文

更新：2026-10-15（Asia/Shanghai）。用于延续当前工作，不代表启动全部后续计划。

## 2026-10-15 最新延续：统一前置总计划与新增专项

用户本轮明确授权更新文档、关联专项并保留历史成果和其余待办。已将 [PRE_PHASE_3_ASSET_READINESS.md](PRE_PHASE_3_ASSET_READINESS.md#6-当前优先顺序与历史顺序) 作为第三阶段前的唯一全局优先顺序入口；[性能诊断](SCENE_PERFORMANCE_DIAGNOSIS.md)、[资产校准工具](ASSET_AUTHORING_CALIBRATION.md)、[生态屋顶](ECO_ROOF_VIEWING_PLAN.md) 新建方案记录，家具新需求补入 [原桌椅记录](DESK_CHAIR_STATIC_REFINEMENT.md)。猫狗、草地、必要远景及其他姿态待办保留。当前建议下一小批次为定位既有长帧；新测量、工具、布局、屋顶和第三阶段均未因本次文档工作启动。

最新保护条件：完整保留原书架及其造型、层板、陈设/交互；单桌双席被反馈局促，不能把历史技术通过写成该布局已验收。用户不会使用 Boxy SVG，不以其手动编辑曲线为前提。主桌、吧台及手边桌允许自由轮廓；右侧小升降桌无椅，只供临时站立放笔记本或一本书，长期第二席应另行核对。已认可人物、四款发型和软影保留。

生态屋顶参考只吸收木框、玻璃和苔草植物样式，房间保持单层，可悬浮，不要求与墙梁真实连接；剖面表现、遮雨覆盖及镜头分别设计。用户布局草图和屋顶参考已归档到 `references/`，由对应专项链接。屋顶/工具不是自动新增的整套第三阶段强制门槛。后续全局顺序只维护总入口，专项维护局部证据，避免复制漂移。

## 2026-10-15 最新延续：书桌椅与双人工位

用户确认按空椅 → 长袍坐姿/耳机 → 双人工位 → 状态与发型检查执行，已实施。桌面约 22.6、厚度 2.4，坐垫从 19.4 降到 14.2。DeskSeatedCharacter 移除裤腿和鞋，髋膝转折的长袍遮脚；DeskHeadphones 共用头部位置与缩放，帽子和四款发型路径保留。第二椅为固定四脚、无轮无扶手的复古绿色软垫椅，两种椅子共用身体与坐高。

阁楼新增 `desk_workstation_secondary`，两人各用电脑与杯子。DeskWorkstations 供世界/检视共享摆放和键盘锚点；可达范围外或休息时收手。固定人物列表前两人各有席位偏好，暂离不挪动另一人。检查面板提供两椅对比、实际占用及明确标注的双人示意，窗口的空椅切换仅控制预览。v6 key 保持，旧版精确默认值迁移，自定义坐标保留；自定义布局仍需核对双人空间。

最终 lint/build、31 项单元及 13 项定向浏览器检查分组通过（4 开发场景夹具、9 生产）。桌面/390px、四款发型、两席键盘接触和样例占用隔离已核对，新造型与双人布局仍待用户最终验收。补一轮默认单人/DPR 1 正常动画样本，P95 约 33–83ms，仍有长帧；无同期修改前对照，不代表改善或双人/手机流畅。历史性能与截图保留，详见 DESK_CHAIR_STATIC_REFINEMENT.md 顶部。第三阶段未启动。

## 2026-10-15 最新延续：装扮面板内嵌站立四视图

用户确认用面板内可展开的站立四视图替换独立头像放大弹窗，已实施。64×80 小头像作为正面摘要保留，点击头像或“查看完整装扮”展开；四视图在选项滚动区内，桌面横排四个、窄屏两行，默认收起。草稿发型、帽色、肤色、发色、衣服和毛球同步到现有 StandingCharacter，已认可人物路径与软投影保留。区域内收起返回摘要焦点；确认才保存，取消或 Escape 关闭配置面板且不保存。独立素材工具继续提供坐站与 SVG 导出。

源码入口为 `StatusPickerModal.tsx`、`CharacterAppearancePreview.tsx`、新增 `CharacterAppearanceFourViews.tsx`；`CharacterAppearancePreviewDialog.tsx` 已移除。下文 10 月 14 日的 304px 弹窗、112×152 放大头像及方向按钮描述属于已替换的历史实现。

本轮类型检查、生产构建通过，6 项定向生产浏览器检查分组通过，覆盖桌面/390px 内嵌四视图、四款发型和各侧身份、换色/毛球、键盘焦点、保存/取消/Escape、场景与工位共享。首次工位测试引用截短的旧颜色名称，改为完整名称后复验通过。桌面/手机截图已核对，新交互与造型观感仍待用户最终验收；没有进行新的 FPS 采样。最新截图为 `metrics/character-appearance-inline-four-views-desktop.png`、`character-appearance-inline-four-views-mobile.png`，收起态为 `character-appearance-inline-collapsed-desktop.png`、`character-appearance-inline-collapsed-mobile.png`。第三阶段仍未启动。

## 当前项目与工作区

- 项目：Live With Me，低打扰的田园陪伴空间。React 19 + TypeScript + Vite + Tailwind CSS 4，人物与家具主要为手绘 SVG/JSX。
- 工作区：`D:\CodeStudy\myProject\liveWithMe`，Windows / PowerShell。开发入口 `http://127.0.0.1:3000/`；生产预览测试端口 4173。
- 本次核对 HEAD 为 `2206f95`。工作区存在大量已修改和未跟踪文件，包含本会话及前期成果；不能将 HEAD 当成当前交付状态，不能 reset、clean 或覆盖现有改动。未替用户提交或推送这些修改。
- 主架构入口见 `DESIGN.md`，进度以 `docs/architecture/EXECUTION_STATUS.md` 顶部最新记录为准。旧版本描述是历史，不要拿旧图覆盖新稿。

## 总体阶段与完成边界

当前仍在第三阶段前的静态资产准备。第三阶段天气、昼夜、大气的规划已保存，但尚未启动该阶段的实施。

`PRE_PHASE_3_ASSET_READINESS.md` 第 0 项“人物比例与身份特征”已有稳定的坐站参照、四款发型和共用组件，核心方案基本落地；不能标记为全部完成：新款观感未全部获得明确验收，完整睡姿、各家具姿态适配及八方向素材尚未完成。技术检查通过不等于用户认可造型。

第 1 项已有书桌椅试点、就坐接触修正与生产性能采样；采样发现明显长帧，没有证明性能改善，仍需当前版本复测和热点定位。第 2 项中的茶席共面、部分手部与观测站站姿已有修复，不能把全部席位、两处睡姿视为完成。猫狗多姿态、草地新色差样例及后续动态仍为计划。

## 用户审美与必须保留的决定

- 坐姿正视图是松弛、圆手、袍子流畅度的基准。其余形态应接近这一气质，避免僵硬、缩脖、鼓肩、细长尖手、纸片躯干。
- 侧坐身体以用户提供并认可的左侧稿为主：圆润胸背、自然袖子、圆手、宽扁袍摆。当前 `SeatedSideBody` 已采用该稿并补对应右侧。用户最新明确不会使用 Boxy SVG，后续不以其自行编辑矢量为前提。不要回退到前几版狭窄、拘谨的侧坐身体。
- 标准站姿长袍遮脚，手部采用接近哆啦 A 梦的圆手；正背及侧身的身体方向要真实可辨。不要为统一比例再次全面重画已认可轮廓。
- 发型变化应保留帽子、肤色、身体和接地；卷发及替换发型有自己的帽下发束，不能叠加经典短发黑色月牙刘海。
- 认可的人物软投影、信箱效果和懒人沙发作为参照保留；不为性能或统一投影直接删掉细节或软影。
- 全景、房间近景、独立素材图要分别核对。开发用放大图不能代替实际场景验收。

## 已实施：人物比例、朝向和接地

- 共用比例：标准站高约 48 场景单位，头圆直径约 14.93。独立侧坐含帽约 34.3，正背坐姿约 35.2；书桌和沙发当前坐高约 44 / 43。高度定义和接触锚点见 `characterProportions.ts`，不要将不同姿态生硬缩放到同一总高度。
- 地面线在屏幕上相对水平约为 ±15.806°（斜率 ±0.283088），不是相机方位角或俯仰角。角色四方向标签沿用 SE / SW / NW / NE，并非已建立八向连续转身模型。
- v11：用户侧坐稿、对应右侧、真实袍底最低点归零、薄接触影。
- v12：茶席人物与蒲团共面修复，顶面扁率、袍摆中心、蒲团厚度与阴影分层同步；南席场景背坐底部适配家具平面。
- 观测站复用标准站姿并补偿建筑 0.8 倍缩放；书桌椅保留已修正接触关系。
- 来源：`CHARACTER_PROPORTION_REVISION.md`、`CHARACTER_STANDING_PROPORTIONS.md`、`DESK_CHAIR_STATIC_REFINEMENT.md`。

## 已实施：四款发型及素材工具

| 用户名称 | 配置 ID | 当前方案 |
| --- | --- | --- |
| 经典利落短发 | `curtain_crescent` | 原短发身份，作为基础款 |
| 层叠长卷发 | `wavy_curly` | 独立卷发发束与肩背层叠，取消该款共用短发刘海 |
| 偏分低束发 | `long_wavy` | 替换原随性披肩长发；偏分前发、耳后收拢、后颈低扎发尾 |
| 双色蓬松碎发 | `medium_straight` | 替换原利落及肩直发；浅金上层碎发与深色后颈底发 |

旧 ID/别名保留兼容，旧发型不是额外待精修选项。不要重新加入被用户取消的披肩长发与及肩直发。

偏分低束发当前为 v16：正面画面左侧长前发属于人物自身右侧，SW 展示耳后侧，NE 展示长前发侧；后枕发量连续收向低扎点。整体人物镜像时通过 `hairFacing` 保持真实发型身份，不能仅整体镜像不对称头发。

双色碎发当前为 v17：上层参考色 `#E4C983`，后颈底发 `#25221F`，上层可换色。装扮新增银灰 `#B8AFA0`，标签已改为“发丝色泽”。

四款都有坐姿和站姿四视图、总表及独立方向 SVG，并进入网页查看/复制/下载工具。入口为左侧独立的“人物 4 视图 SVG”；短发还提供坐站比例、地面及材质参照。素材生成脚本维护路径，修改共享源后按对应脚本生成，不手改大量导出文件造成分叉。

总表和面板人物区域使用浅暖灰 `#DDD8CF`，保证深色底发可见；标题和外围保持深色，独立人物 SVG 保持透明。资源检查覆盖过 45 张 SVG；不要误称最新一轮重新跑过全部资源检查。

## 2026-10-14 装扮用户界面记录（放大弹窗已被上方最新方案替换）

用户认为开发四视图不必直接放进装扮界面。已将装扮页和独立开发素材工具分开，装扮标签改为“人物装扮”，移除该页的轴测比例、方位代码和内嵌 SVG 导出；保留用户能理解的正面/左侧/背面/右侧。

上一版常驻大头像实际撑得太大，选项区域被挤压。用户明确要求“默认小头像，点击后才适度放大”。最新代码已修正：

- 常驻头像 64×80，紧凑摘要在选项滚动区域上方，毛球和四方向仍可切换。
- 点击头像打开宽度上限 304px、头像 112×152 的独立弹窗；容器和 SVG 都显式约束尺寸，不能依赖 SVG 默认尺寸。
- 关闭按钮、遮罩或 Escape 只退出预览；配置选择保留，焦点回到头像。
- 放大弹窗打开时父配置面板暂停交互。取消或父配置内 Escape 不保存；确认保存才同步小世界。
- 本轮未修短发刘海路径。用户指出的侧面刘海首尾瑕疵仍是可检查的局部问题，不能把缩小展示当作路径已修复，也不要未经确认全面改发型。

当前预览方式已实现并做技术检查，尚未收到用户对最终大小的进一步评价。本次最新用户任务只是整理交接上下文，不是授权启动全部后续工作。

截图：`metrics/character-appearance-compact.jpg`、`metrics/character-appearance-detail.jpg`，手机版本为 `character-appearance-compact-mobile.png`、`character-appearance-detail-mobile.png`。带 `user-preview` 的旧截图对应已被替换的大预览，不是当前目标。

## 其它前期成果与性能情况

- 墙面《泳者之心》和《红辣椒》简化 SVG 已优化，保持点开原 JPG 的详细赏析。无需重新实施海报工作。
- SVG.js / Paper.js / Rough.js / Maker.js 的适用性、许可和安全调查保存于 `WALL_POSTER_GRAPHICS_RESEARCH.md`。当时决定现有工作继续使用原生 SVG/JSX，未安装这些库；它们不能自动修正人体造型。该文漏洞信息是历史调查，真正采用时重新核对固定版本和依赖。
- Anatomy / Zdog 仅为候选制作工具，未引入项目运行时，不应为了继续资产修正先换绘图库。
- 正常动画生产性能采样已保存于书桌椅记录及 `metrics/PRE3-*`。近期发型和装扮修改没有重新采样 FPS，不可声称项目已经流畅或已完成性能优化。
- `stableScene` 会关闭部分动态，适合稳定功能测试，不能作为正常动画性能依据。窄屏截图也不是实际手机性能测试。

## 历史下一步建议与执行边界（当前顺序以总入口为准）

下列为本轮统一总计划前的交接建议，保留供追溯；最新执行顺序与新增需求见 [总入口第 6 节](PRE_PHASE_3_ASSET_READINESS.md#6-当前优先顺序与历史顺序)，不按本段旧列表自动启动工作。

1. **收尾第 0 项的基准。** 核对当前用户界面与四款坐站参考，确认偏分/碎发当前版本及小预览体验；若用户继续反馈只局部修改。可检查短发侧面刘海首尾曲线，保留原身份和其余已认可轮廓。把“基准确定”和“全姿态验收”分开记录。
2. **回到已有试点并补当前性能基线。** 先读书桌椅采样方法，当前生产构建正常动画开启，在可比较条件下复测全景、房间、拖动/缩放和切换，定位绘制/滤镜热点，保留原始结果。不要因库或 SVG 节点数量猜测性能结论。
3. **逐实际席位完成静态适配。** 核对茶几东/西/南三席的朝向、发型、持杯、接触与遮挡；随后处理胶囊与木屋睡姿的枕面/被沿，再检查观测站人物。已修好的比例和蒲团不重画；完整睡姿不能因替换了头发就标记完成。
4. **单独的小范围样例。** 猫狗先确定身份、睡觉/站立、身体与窝分离及实际路线需要的方向；草地先做少量固定种子的低对比材质色差与有原因的入口磨损。各样例观察成本，不一次挂载全部方向或加入全场动画。
5. **前述静态关系与基线稳定后进入第三阶段。** 依据 `PHASE_3_WEATHER_ATMOSPHERE_PLAN.md` 推进清晨、午后、黄昏、深夜、静雨的大气与光照。完整八向、猫狗散步和人物小动作按独立批次实施，不默认作为天气阶段的全部强制门槛。

上述是交接建议；新会话先读上下文和最新用户指令，再决定实际执行范围。不要只因为看到计划就自动开展第 3 阶段。

## 文件导航与验证

先读：本文件 → `DESIGN.md` → `PRE_PHASE_3_ASSET_READINESS.md` → `EXECUTION_STATUS.md` 最新部分。发型专项记录为 `CHARACTER_CURLY_HAIR_REVISION.md`、`CHARACTER_SIDEPART_HAIR_REVISION.md`、`CHARACTER_SHAGGY_HAIR_REVISION.md`。

主要源码（相对工作区）：

- `src/components/StatusPickerModal.tsx`、`src/components/characters/CharacterAppearancePreview.tsx`、`CharacterAppearanceFourViews.tsx`：当前小头像摘要与面板内站立四视图。
- `src/components/CharacterAvatar.tsx` 及 `src/components/characters/`：共用头部、四款发型、坐站身体、圆手、比例与展示底色。
- `src/components/SvgExportModal.tsx`：独立四视图工具。
- `src/components/tea/`、`src/components/architecture/MainCottageHaven.tsx`、`ObservatoryHaven.tsx`：场景装配。
- `scripts/generate-standing-character.tsx`、`generate-curly-character.tsx`、`generate-sidepart-character.tsx`、`generate-shaggy-character.tsx`：静态 SVG 生成。
- `tests/e2e/character-export.spec.ts`、`chair-inspection.spec.ts`；`tests/performance/scene-performance.spec.ts` 与 `playwright.performance.config.ts`：功能和性能分别验证。

最新装扮修正的 `npm run lint` 与 `npm run build` 通过；6 项相关浏览器检查分组通过，包含桌面/390px 按需预览、四方向、焦点循环/返回、关闭与草稿保存，以及发型和椅子场景共享。首次失败来自测试引用被暂时隐藏的父 dialog 和焦点顺序断言，已修正测试并复验；不是未解决的产品故障。生产构建仍有现有主包超过 500kB 的提示。

相关检查命令：

```powershell
npm run lint
npm run build
npx playwright test --config playwright.preview.config.ts tests/e2e/character-export.spec.ts tests/e2e/chair-inspection.spec.ts --grep 'appearance picker|layered curly|old shoulder|two-tone shaggy|saved appearance' --workers=1
```

检查按改动范围选择，不宣称每轮都跑了全站全部测试。继续保护已有未提交成果，更新最新状态而非删除历史验证与截图。
