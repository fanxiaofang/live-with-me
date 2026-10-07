# 重构执行记录

## 工具兼容验证

- npm 迁移提交：`bc501a2`，已推送至 `codex/npm-compatibility`。
- 2026-10-07，用户确认 Google AI Studio 可以拉取运行，工具兼容门槛通过。
- 平台运行结果由用户提供；本地安装、版本和构建证据见 `NPM_MIGRATION.md`。

## P0：基线与测试入口

已通过。3 个纯函数测试、1 个浏览器导航/布局刷新测试、11 个视觉场景、类型检查、构建全部通过；八个视角连续截图字节一致。Node 内置测试通过现有 tsx 加载；Playwright 固定为 1.56.1，Chromium 141.0.7390.37（build v1194），仅为开发/CI 安装，不加入 postinstall。

生产调用链：`main.tsx → App → ThreeWorld → Yorkshire 地形子组件 + 内联电波站/主屋 + CapsulePodHaven/ WoodenCabinHaven → 家具资产 → IsoGizmo`。`YorkshireWorld` 与旧 `CommunicationHill` 均不是生产入口。

截图使用 Windows、Chromium、DPR=1、1200×800，默认 INITIAL_PEOPLE 和 v6 布局；等待字体，停用 CSS 过渡/动画，SMIL 固定在 0 秒。覆盖八个视角、night、rainy、空席。建筑主体不遮罩；差异比例上限 0.1%。八个视角检查连续截图字节一致。截图通过显式 `--update-snapshots` 建立，后续纯提取批次禁止更新。

新增测试依赖后原 222 个应用依赖实例版本未变化。工具迁移冻结校验脚本保留作历史记录，其 manifest 校验仅适用于 bc501a2，不作为 P0 后的检查入口。

后续批次依次为 P1 电波站、P2 placement/家具归属、P3 相机/输入、P4 分配、P5 类型化交互、P6 渲染与功能状态、P7 清理和交付。每批验收通过后记录提交并进入下一批。

## P1：电波站闭环

已通过。唯一资产由生产内联 JSX 提取，旧 CommunicationHill 改为适配入口；SceneEntity 执行 (1000,460),0.80 placement。远山松树留在场景层。兼容 anchor 为 (-203.125,-98.4375)，初始镜头仍为 (-380,30),1.6。

6 个纯函数测试、类型检查和构建通过；11 个视觉基线无需更新，导航与布局刷新通过。浏览器验证 x+200 时站点、人物、天线交互区在 overview 下同步移动 132 viewBox 像素，松树不动；focus translation 从 -380 变为 -700，信号可激活。矩阵断言容差 0.001 像素。

P0 回退点：`147792d`。站点资产提取与 placement 接入分别提交。
