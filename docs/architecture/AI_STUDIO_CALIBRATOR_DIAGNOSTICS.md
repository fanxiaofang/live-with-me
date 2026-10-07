# AI Studio 布局校准器黑屏排查

日期：2026-10-07。平台版本基线：db8acaa，分支 codex/npm-compatibility。

## 已知现象与结论边界

用户确认 AI Studio 拉取后场景可以渲染，拖动咖啡黑胶柜后黑屏。提供的日志是 Backend 启动日志，其中 Server stopped 后紧接 Server started on port 3000 和 Vite ready，尚无浏览器前端异常堆栈。不能据此认定拖动导致服务器退出。

柜体拖动仅更新 React 内存，释放后写入 localStorage；代码没有通过拖动写服务器文件或触发服务器重启的路径。平台日志中的 Vite 为 6.4.4，本地锁文件为 6.4.3，存在环境差异，但尚未证明它是故障原因。

本地已验证条目选择与微调、把手捕获路径、原生咖啡柜拖动和刷新、跨域 sandbox iframe。未复现平台黑屏，**根因仍未确定，不能将诊断补丁描述为平台问题已经修复**。

## 本次补丁

main.tsx 使用 React 的 onUncaughtError 回调显示独立于 React root 的错误卡片。React root 因渲染错误卸载时，卡片仍可显示错误及组件堆栈，提供复制和重新加载入口。拖动事件异常和未处理的 Promise 异常由 window error / unhandledrejection 监听，保留第一条错误，不递归报告；开发 HMR 时移除旧监听。文本通过 textarea.value 设置，不将错误作为 HTML 插入。

浏览器拒绝 clipboard 写入时，选中错误文本供手动复制。重新加载不会清空 live_with_me_room_layout_v6；尚未释放提交的拖动结果不被承诺保存。错误继续通过 window.reportError / console.error 输出到前端 Console，正常渲染时不增加可见 UI。

回归增加到 tests/e2e/layout-editor.spec.ts 与 runtime-failure.spec.ts：

- 所有 v6 条目反复打开、选择、面板微调；保留原本无挂载资产的 left-wall-poster 条目。
- 可渲染把手的自由和 u/v/w 轴捕获路径、键盘微调、编辑不漫游。部分把手保留原遮挡，通过已激活鼠标指针显式派发 pointerdown 验证捕获路径，不把这些用例当成所有把手可直接点到的证明。
- 咖啡柜用真实鼠标拖动，检查落点、保存和刷新。
- 实际 HTTP 页面承载跨域 sandbox iframe，检查柜体微调及真实鼠标拖动；该 fixture 只用于开发浏览器测试。
- 注入真实数字渲染异常，检查错误卡片、clipboard 被拒时手动复制、重新加载保留已保存布局。

生产 preview 测试覆盖真实 dist 的编辑与错误恢复；iframe fixture 单独在开发环境测试，不写入 dist。

## 平台下一步证据

拉取本次诊断提交后再拖动咖啡黑胶柜。若出现“页面遇到运行错误”，复制卡片里的完整前端错误信息。若仍黑屏且没有卡片，在浏览器按 F12 打开开发者工具、切换 Console（控制台），复现后记录第一条红色错误和时间；该 Console 与 AI Studio 的 Backend 日志不同。

得到前端错误后再修复触发点。当前未更换应用依赖版本、删除用户布局或调整场景构图。

## 本地最终验证

类型检查、19 项纯函数测试、全量 40 项浏览器回归（含 11 张未更新的视觉基线）通过。补齐全局事件/Promise 监听后另跑 3 项诊断回归通过；最终生产 preview 9 项通过、1 项开发 iframe fixture 按设计跳过。构建主入口为 739.25 kB / gzip 196.41 kB。
