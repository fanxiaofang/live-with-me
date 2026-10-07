# AI Studio 布局校准器黑屏排查与修复

日期：2026-10-07。分支 codex/npm-compatibility。原平台版本 db8acaa；诊断提交 a10815d；本记录所在提交修复触发点。

## 已确认的根因

用户在独立错误卡片中提供前端堆栈：TypeError: Cannot read properties of undefined (reading 'name')，来自 describeInteraction → WorldOverlays → ThreeWorld → App。打开 2.5D 校准器、进入唱片柜的子部件后触发。本地新增回归在修复前重现了同一错误及组件堆栈。

RecordCabinet 的咖啡豆、陶杯悬停事件仍传入旧家具 ID cabinet-beans / cabinet-cups；DEFAULT_ROOM_LAYOUT 中实际 ID 是 coffee-beans / ceramic-cups。registry 对未注册 ID 直接读取 name，导致 React 渲染异常并卸载场景。该悬停路径在校准器开启和关闭时均可能触发，点击、拖动柜体过程中也可能经过这些部件。

之前的测试从面板选中家具并移动把手，未覆盖这两个场景子节点的悬停回调。因此，已通过的柜体拖动测试未发现这处迁移遗漏。新增测试从实际子节点派发 React 委托所用的 mouseover，并点击、微调检查保存的规范 ID；不是把面板选择视为悬停验证。

先前提供的 Backend 日志中 Server stopped 后紧接 Server started 和 Vite ready，不能证明鼠标操作导致服务器退出。平台 Vite 6.4.4 与锁文件 6.4.3 的差异也不是这次已复现错误的必要条件。

## 修复与预防

- 两个事件改用 coffee-beans / ceramic-cups，与渲染、选中和 v6 保存的 ID 一致。
- registry 对家具 ID 检查自身键；未知或继承属性键显示“家具部件”，避免悬停文案让整个场景崩溃。
- 补齐并锁定开发依赖 @types/react / @types/react-dom 19.3.0，显式标注柜体 props。此前缺少 React 类型声明，当前非严格 TypeScript 配置未有效检查 React.FC 的 props；家具 ID 联合类型无法拦住该遗漏。
- 补齐类型后暴露的书架面板 props 名称和缺失选择回调、reading_lin 预设拼写已修正；炉火 SVG 提示改为合法 title 子节点。新增书架切换预设、插放新书和选中/收起回归。初始构图与几何不变。
- package-lock 对比表明已有包版本均未变化，仅新增两项 React 类型包及其 csstype 依赖。类型包仅用于开发检查，不参与应用启动。

## 保留的错误诊断

a10815d 的 React onUncaughtError 与 window error / unhandledrejection 监听继续保留。独立于 React root 的卡片显示第一条错误及组件堆栈，支持复制和重新加载；拒绝 clipboard 时选中文本供手动复制，HMR 清理监听。文本通过 textarea.value 设置，默认 Console 错误继续输出。

重新加载不清空 live_with_me_room_layout_v6；未释放的拖动结果不承诺保存。修复不迁移或重置用户布局。

## 验证范围与平台复测

已用失败回归确认同一前端错误，修复后柜内咖啡豆/陶杯 × 校准器开启/关闭的四项回归通过。类型检查、20 项单元测试、构建、47 项开发浏览器回归及生产 preview 14 项通过；preview 按设计跳过 1 项开发 iframe fixture，开发环境已通过。11 张视觉基线未更新。详细结果见执行记录。本轮禁止更新视觉基线。全量回归同时覆盖真实鼠标柜体拖动和刷新、跨域 sandbox iframe、所有布局条目的面板微调、可渲染把手的捕获路径、错误卡片恢复。原遮挡下部分把手通过已激活指针显式派发 pointerdown 测试捕获，不声称所有把手都可原生命中；iframe fixture 仅用于开发测试。

拉取本记录所在修复提交后，在 AI Studio 再打开校准器，点击唱片柜、咖啡豆和陶杯，拖动柜体、微调并刷新检查已保存布局。根因已在本地复现并修复；平台修复后的实际运行结果仍需用户重新拉取验证。

本修复可独立回退至 a10815d；该诊断提交可独立回退至 db8acaa。两次回退都不需要转换或清空 v6 布局。
