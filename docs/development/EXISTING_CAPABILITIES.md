# 已有能力使用指南

整理：2026-11-02。入口名称与参数按当前源码核对；本文整理现有能力，不代表本次重新完成了浏览器验证或造型验收。开发服务检查、定向验证与几何计算见 [可复用开发工具](REUSABLE_TOOLS.md)。

## 启动与找到入口

在项目根目录运行：

```powershell
npm run dev
npm run dev:inspect -- --url http://127.0.0.1:3000/
```

打开终端实际报告的本地地址。默认端口为 3000，若被占用，Vite 可能改用其他端口，检查命令也要使用实际地址。已有本项目服务时直接复用；`dev:inspect` 只检查，不启动服务。

左侧同住人面板收起时先展开，底部有「检视工位椅子 (空椅 / 组合态)」和「人物 5 视图 SVG」。这些是应用内窗口，不需要单独启动人物或家具编辑器。顶栏「原木书架」在窄屏仅显示图标，可通过其无障碍名称识别。

## 人物多视图与 SVG 导出

1. 左侧同住人面板 →「人物 5 视图 SVG」。
2. 选择经典短发、层叠长卷发、偏分低束发或双色蓬松碎发。
3. 选择「站姿五视图」或「坐姿四视图 + NW」。站姿包含正面、左右侧、背面和 NW 斜侧；坐姿保留原四视图并增加独立 NW 稿。
4. 查看总表，或在单视角区域复制／下载 SVG；需要大图时使用「打开完整五视图／打开完整视图」。经典短发站姿还提供坐站比例、地面与材质接地对照。

这个窗口读取 `public/` 中的独立 SVG，适合核对轮廓和导出资产。要检查**自己的当前装扮或未保存配色**，从自己的状态编辑面板进入「人物装扮」→「查看完整装扮」；这里的五视图随装扮草稿变化，保存／取消沿用状态编辑流程。独立导出窗口的静态 SVG 不会自动变成当前配色。

源码入口：

- [SvgExportModal.tsx](../../src/components/SvgExportModal.tsx)：发型、姿态、总表与单视角文件选择、复制和下载。
- [StatusPickerModal.tsx](../../src/components/StatusPickerModal.tsx)、[CharacterAppearanceFiveViews.tsx](../../src/components/characters/CharacterAppearanceFiveViews.tsx)：当前装扮与草稿预览。
- [generate-character-five-views.mjs](../../scripts/generate-character-five-views.mjs)、[generate-seated-nw-hairstyles.tsx](../../scripts/generate-seated-nw-hairstyles.tsx)：现有制作脚本。它们会生成／写入资产或证据，日常查看直接使用窗口，无需先运行生成器；修改资产时按项目美术技能处理。

## 工位、椅子与接触校准

左侧同住人面板 →「检视工位椅子 (空椅 / 组合态)」→ 按目的选页签：

| 页签 | 用途 |
| --- | --- |
| 沙发椅测试 | A／B 两款试样的空椅与 NW 上身入椅对照；试样仍需审阅 |
| 原椅保留对比 | 按工位对比原椅与人物关系 |
| 温莎椅单人姿态 | 独立人物／就坐对照、坐姿结构、SVG 下载及返回实际房间 |
| 查看桌椅关系 | 查看真实桌椅装配，切换空椅／当前在座人物 |
| 双人姿态样例 | 查看明确标注的双人示意，不代表实际占用 |
| 接触校准 · 草稿 | 调桌面参数和锚点，查看辅助线，导出草稿并临时试放 |

工位无人时部分视图使用标明的参考人物；「查看桌椅关系」的实际就坐人物按钮会禁用。预览中的人物切换不重新分配真实同住人或席位。

接触校准的基本流程：

1. 进入「接触校准 · 草稿」，选择席位，调整桌高、厚度、宽度比例或椅子／键盘锚点。
2. 按需打开接触辅助线，对照原稿，检查桌沿、坐面、手部可达和遮挡。提示用于制作判断，不等同于真实碰撞检测。
3. 用「放回房间试看」检查实际装配；返回工具继续调整，或结束试放恢复原资产。
4. 导出草稿 JSON／SVG 供后续制作。当前没有自动导入或正式应用按钮；草稿和试放不写正式布局存储。关闭工具后恢复原资产并卸载辅助线。

源码入口：[ChairInspectionModal.tsx](../../src/components/desk/ChairInspectionModal.tsx)、[DeskCalibrationWorkbench.tsx](../../src/components/desk/DeskCalibrationWorkbench.tsx)、[DeskWorkstations.tsx](../../src/components/desk/DeskWorkstations.tsx)、[deskStudyModel.ts](../../src/components/desk/deskStudyModel.ts)。完整参数范围和草稿格式见 [资产制作与人物接触校准工作台](../architecture/ASSET_AUTHORING_CALIBRATION.md)；造型与历史验收见 [桌椅记录](../architecture/DESK_CHAIR_STATIC_REFINEMENT.md)。历史记录中的 4178 等端口是当时的预览地址，使用时以当前服务为准。

## 书架与柜子详细查看

- **书架**：顶栏「原木书架」打开；选择书籍或摆件查看详情并聚焦。支持预设与既有藏书操作，预览共享当前布局及人物借阅状态。
- **柜子**：普通场景点击咖啡黑胶柜柜体、台面或柜格物件，打开「咖啡与黑胶角」；可用 Enter／Space 打开可聚焦的 SVG 入口。校准模式中的点击用于选中布局对象，先退出校准再查看。
- **查看操作**：滚轮／双指缩放、拖动平移；聚焦查看区后可用方向键、＋／－与 Home，或使用窗口的缩放和完整视图控件。书架、柜子支持 1～6 倍缩放。

查看窗口复用真实资产与当前数据。单纯缩放、聚焦不改主世界相机或布局；书架的新增藏书、抽出／归位等既有操作会改变对应藏书状态。人物正在借阅的书籍不能在窗口中强制归位。

源码入口：[BookshelfModal.tsx](../../src/components/bookshelf/BookshelfModal.tsx)、[CabinetDetailModal.tsx](../../src/components/cabinet/CabinetDetailModal.tsx)、[SvgDetailView.tsx](../../src/components/inspection/SvgDetailView.tsx)。扩展查看资产前核对独立 SVG ID、defs 引用和专属交互，具体约束见 [家具详细查看](../architecture/FURNITURE_DETAIL_INSPECTION.md)。

## 性能诊断（按需重启）

现有专项按用户此前决定暂停；整理入口不触发采样。明确要求重启后再使用以下步骤。该脚本面向生产构建，在隔离 Chromium context 中使用默认人物／布局，不连接用户浏览器存档。脚本本身不启动预览服务。

```powershell
# 终端一：构建并启动独立生产预览；strictPort 防止端口被占时悄悄换端口
npm run build
npm run preview -- --host=127.0.0.1 --port=4175 --strictPort

# 终端二：从项目根目录采样；每次换一个尚不存在的证据目录
node scripts/diagnose-scene-performance.mjs --url=http://127.0.0.1:4175 --suite=baseline --dpr=1 --headed=false --repeats=3 --out=build/scene-diagnosis/run-01
node scripts/summarize-scene-diagnosis.mjs build/scene-diagnosis/run-01
```

| 参数／输出 | 说明 |
| --- | --- |
| 参数写法 | 诊断脚本使用 `--key=value`，不要改为空格分隔 |
| `--suite` | `baseline` 基线；`controls` 临时对照；`trace` 短 trace；`calibration` 校准采样 |
| `--dpr` | 仅 1 或 2；默认 1 |
| `--headed` | `true` 打开有窗口浏览器；默认无头。窗口模式需核对前台状态 |
| `--inspect` | `true` 在首次打开页面后留出 15 秒供前台检查；有窗口人工检查时可配合 `--headed=true` |
| `--repeats` | 正整数，默认 3；`trace` 必须为 1 |
| `--out` | 必填，每次独立目录；原始证据采用防覆盖写入 |
| 原始结果 | 环境、Git／dist 来源信息、逐次测量；trace 模式另存轨迹证据 |
| 汇总结果 | 汇总脚本在证据目录生成／覆盖 `summary.json`、`summary.md` |

采样期间保持源码、dist 和服务版本一致，不并行跑截图／浏览器测试。脚本记录的是 rAF 间隔、长任务与根提交等指标；rAF 节奏不能直接称为呈现 FPS，trace 跨线程 inclusive 耗时不能相加为墙钟占比，桌面 DPR 2 也不代表真机性能。

另有 [playwright.performance.config.ts](../../playwright.performance.config.ts) 与 [scene-performance.spec.ts](../../tests/performance/scene-performance.spec.ts) 的固定生产性能检查，默认使用 4173 并自行管理服务，和上述手动预览脚本的运行方式不同。历史证据、采样局限与暂停决定见 [场景性能诊断](../architecture/SCENE_PERFORMANCE_DIAGNOSIS.md)，不把历史结果记作当前版本已通过。

## 按本次改动选择验证

| 变更区域 | 可复用检查入口 |
| --- | --- |
| 人物装扮／SVG 导出 | [character-export.spec.ts](../../tests/e2e/character-export.spec.ts) |
| 工位查看 | [chair-inspection.spec.ts](../../tests/e2e/chair-inspection.spec.ts) |
| 接触校准、试放与草稿隔离 | [desk-calibration.spec.ts](../../tests/e2e/desk-calibration.spec.ts)、[desk-pose.test.ts](../../tests/unit/desk-pose.test.ts) |
| 书架／柜子查看 | [furniture-inspection.spec.ts](../../tests/e2e/furniture-inspection.spec.ts) |

文档整理只需核对路径、入口名称和参数。小幅美术改动检查局部及实际场景尺寸；涉及交互或状态再选择对应检查。`check:target` 不是所有能力的完整依赖映射，先查看计划，未知路径按上表明确选用现有用例，不因此自动扩成全量测试或性能专项。
