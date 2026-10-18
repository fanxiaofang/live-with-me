# 墙面海报构图与矢量工具调研

> 2026-10-18 图片精简：本文部分历史过程图已转为本地归档，保留的代表图与恢复方法见[图片精简清单](metrics/IMAGE_RETENTION_2026-10-18.md)。历史技术记录不代表当前造型已获认可。

调研日期：2026-10-13（Asia/Shanghai）。以下版本来自当日 npm registry 的 latest 元数据；版本和漏洞状态应在正式采用时重新核对。

## 项目结论

当前场景由 React 直接声明 SVG，墙面电影海报位于 `src/components/wall-posters/WallPostersGallery.tsx`，画框局部尺寸为 26 × 37.5，画芯为 22.4 × 33.9，还会经过墙面剪切和相机缩放。详细赏析由 `PosterDetailModal.tsx` 展示 `posterTypes.ts` 中已有的本地 JPG。

本次需要调整构图，不需要增加绘图库。泳者原先的椭圆躯干、闭合椭圆泳衣、两侧短手臂与白色环形浪花，在小尺寸下容易形成龟壳和鳍肢的视觉组合。

实施方案：沿用海天背景和红色泳帽轮廓，将泳者移至下三分之一，稍放大泳帽，以浅色接缝呼应 JPG 的红白泳帽；以连续的后颈与少量肩线表达背影，前景海水遮住躯干；移除两侧划水手臂和白色环形浪花。墙面以海面和泳帽为辨识线索，详细图继续承担完整人物与海报信息的展示。

## 四个工具的适用范围

| 工具 / npm 包 | 当日 latest / 发布时间（UTC） | 能力 | 当前与后续用途 | 判断 |
| --- | --- | --- | --- | --- |
| SVG.js / `@svgdotjs/svg.js` | 3.2.8 / 2026-08-04 | 创建、操作和动画化原生 SVG，npm 包无声明的运行时依赖 | 后续独立 SVG 编辑器、批量资产生成、路径操作；现在 React 已能直接绘制 | 四者中与现有渲染最贴近，按需候选 |
| Paper.js / `paper` | 0.12.18 / 2024-07-17 | Canvas 场景图、贝塞尔曲线编辑、路径几何、SVG 导入导出 | 后续复杂植物、曲线轮廓、路径布尔运算或独立绘图工具 | 适合制作工具或离线生成资产，主场景引入成本较高 |
| Rough.js / `roughjs` | 4.6.6 / 2023-11-20 | 给线、曲线和多边形增加手绘抖动与排线，输出 SVG 或 Canvas | 后续便签、手写涂鸦、访客留言或局部草图 | 风格需要明确理由；微型电影海报采用抖动会增加视觉噪声 |
| Maker.js / `makerjs` | 0.19.2 / 2026-01-27 | 参数化二维几何、线和圆弧、模型组合、SVG / DXF 等导出 | 后续尺寸精确的窗框、家具部件、切割模板 | 几何制作工具候选，对人物和电影海报帮助较少 |

适配判断来自官方能力说明与当前代码结构。以上工具都不负责自动修正人体比例或生成合理的泳姿。

官方来源：[SVG.js 仓库](https://github.com/svgdotjs/svg.js)、[Paper.js 功能](https://paperjs.org/features/)、[Rough.js 官方网站](https://roughjs.com/)、[Maker.js 仓库](https://github.com/microsoft/maker.js)、[Maker.js 导出](https://maker.js.org/docs/exporting/)。

版本与依赖证据：[SVG.js package.json](https://github.com/svgdotjs/svg.js/blob/master/package.json)、[Paper.js package.json](https://github.com/paperjs/paper.js/blob/develop/package.json)、[Rough.js package.json](https://github.com/rough-stuff/rough/blob/master/package.json)、[Maker.js package.json](https://github.com/microsoft/maker.js/blob/master/packages/maker.js/package.json)。仓库分支版本可能与 npm latest 不同，本次同时读取了 npm registry 元数据。

## 开源协议与使用条件

| 工具 | 协议 | 使用与发布要求 |
| --- | --- | --- |
| SVG.js | MIT | 可用于商业及闭源项目；复制或分发软件及其重要部分时保留版权声明和许可文本 |
| Paper.js | MIT | 同上 |
| Rough.js | MIT | 同上 |
| Maker.js | Apache-2.0 | 可用于商业及闭源项目；分发时附许可文本、保留相关声明；若分发修改过的库文件，应注明修改；若发行包包含 NOTICE，则保留适用的 NOTICE 内容 |

这些协议不要求将我们自己的应用整体开源。采用后应将相应许可和版权声明纳入发布产物的第三方声明；插件、字体、服务端辅助包等新增依赖要分别核对。

协议依据：[SVG.js LICENSE](https://github.com/svgdotjs/svg.js/blob/master/LICENSE.txt)、[Paper.js LICENSE](https://github.com/paperjs/paper.js/blob/develop/LICENSE.txt)、[Rough.js LICENSE](https://github.com/rough-stuff/rough/blob/master/LICENSE)、[Maker.js LICENSE](https://github.com/microsoft/maker.js/blob/master/LICENSE)。库的软件许可只覆盖库及受该许可约束的代码，不自动授予电影 JPG、字体或其他素材的版权许可。

## 安全调查与边界

### 已查询的公开漏洞状态

- SVG.js、Paper.js、Rough.js 的 GitHub 仓库安全页面在本次读取时没有发布的安全公告。
- Maker.js 有公开公告 [GHSA-2cp6-34r9-54xx / CVE-2026-24888](https://github.com/microsoft/maker.js/security/advisories/GHSA-2cp6-34r9-54xx)，中等严重度。`extendObject` 对输入对象的属性复制缺少自身属性检查与危险键过滤，公告列出的受影响版本是 `<= 0.19.1`，涉及不可信输入或外部配置的合并。
- 公告的 Patched versions 字段仍为 None。不过，本次读取的 npm `makerjs@0.19.2/dist/index.js` 与 [当前源代码](https://github.com/microsoft/maker.js/blob/master/packages/maker.js/src/core/maker.ts) 已增加 `hasOwnProperty` 检查，并过滤 `__proto__`、`constructor`、`prototype`。这能证明相关防护已出现，不能作为整库无漏洞的证明；未来采用应避开公告受影响版本，并验证最终锁定版本和调用方式。
- 通过 OSV 的 `querybatch` API 查询了四个具体版本 `3.2.8 / 0.12.18 / 4.6.6 / 0.19.2`，HTTP 200，四项都未返回匹配公告。这次查询覆盖四个主包版本，不覆盖全部传递依赖，也不是渗透测试或完整源码审计。

查询来源：[SVG.js security](https://github.com/svgdotjs/svg.js/security)、[Paper.js security](https://github.com/paperjs/paper.js/security)、[Rough.js security](https://github.com/rough-stuff/rough/security)、[Maker.js security](https://github.com/microsoft/maker.js/security)、[OSV API](https://google.github.io/osv.dev/api/)。没有查到公告不等于没有未知漏洞。

### 具体使用方式决定风险

1. **固定、本地的 SVG 几何是当前合适的方案。** 通过 JSX 声明已审阅的路径和属性，不需要运行外部绘图脚本，也不需要新增第三方 CDN。若以后使用生成工具，优先在制作阶段输出静态 SVG，场景继续只消费已审阅的资产。
2. **SVG.js 的字符串导入不应当作清洗器。** 官方 `.svg()` API 支持字符串导入。未来如果接收用户上传的 SVG，应先限制元素、事件属性、链接和外部资源，避免将未经处理的字符串直接注入页面。当前海报没有这样的输入路径。参见 [SVG.js 操作 API](https://svgjs.dev/docs/3.2/manipulating/)。
3. **PaperScript 是可执行代码。** Paper.js 的 full 构建包含 PaperScript，其 [执行源码](https://github.com/paperjs/paper.js/blob/develop/src/core/PaperScript.js) 会构造函数或插入 script 执行编译结果。后续普通 JS / TS 绘图应选择 `paper-core`，不执行用户提交的 PaperScript。官方 [构建区别](https://github.com/paperjs/paper.js#which-version-to-use) 明确 core 不包含 PaperScript 与 Acorn。
4. **绘图输入要有计算预算。** 如果未来接受外部路径或模型，应限制文件大小、路径数、点数、坐标与迭代次数。复杂曲线运算或密集排线可能占用主线程；可在制作阶段计算，交互编辑时再考虑 Worker。Rough.js 需要固定 seed 以保证重渲染和截图稳定，降低排线密度以适应小尺寸。参见 [Rough.js API](https://github.com/rough-stuff/rough/wiki)。
5. **依赖和浏览器权限是两层问题。** 四者运行于页面 JavaScript 环境，不能视作隔离的绘图沙箱。以后采用时锁定确切版本与 lockfile，核对发布包及传递依赖，运行依赖漏洞检查；正常 npm 包的运行时依赖与开发仓库中的构建依赖应区分。当前没有安装这四个库。

未来采用 SVG.js 时，应让独立编辑器拥有自己的 DOM 容器，或在制作阶段导出路径；避免 React 和 SVG.js 同时改写同一组节点。采用 Paper.js 时，应将 Canvas 项目限定在独立编辑面板，并在卸载时清理作用域、事件和渲染循环。

## 后续选择原则

- 海报、装饰、已有家具的轻量调整：继续 React + 原生 SVG。
- 较多重复几何或批量 SVG 资产：再评估 SVG.js。
- 真正需要曲线编辑、复杂路径运算：再评估 Paper.js core，优先用于资产制作。
- 便签、留言、涂鸦有明确的手绘表现需求：局部使用 Rough.js，固定 seed。
- 尺寸驱动的窗框或家具部件、工程文件导出：再评估经过版本安全核对的 Maker.js。

这次修改没有增加运行时依赖、CDN、动态脚本执行或外部 SVG 导入。

## 验证

- `npm run lint`：通过。
- `npm run build`：最终版本通过；仍有现有主包超过 500 kB 的构建提示。
- `npx playwright test --config playwright.preview.config.ts tests/e2e/interactions.spec.ts`：1 项生产预览交互回归通过，包含 SVG 海报键盘激活。
- 本地浏览器确认《泳者之心》可正常点开，原 JPG 加载成功，原始尺寸为 848 × 1264。
- 人工检查全景、书房取景和放大视角的海面遮挡、人物轮廓与画框裁切。本次不更新全站视觉基线。

截图：书房中的实际效果（历史过程图 `wall-posters-room-after.jpg`，已本地归档）、墙面海报近景（历史过程图 `wall-posters-closeup-after.jpg`，已本地归档）。

## 《红辣椒》墙面图后续优化

2026-10-13：参照既有 JPG，将全身小人改为红棕短发、明暗分割脸部与红衣肩部的近景，身体延伸至画框下缘。移除裤腿、鞋、弯曲手臂、金色蝴蝶和多层光晕；背景使用深紫色与少量低对比星点，适应墙面的小尺寸展示。保持既有画框、墙面投影与赏析入口。

`npm run lint`、`npm run build` 与生产预览的 `interactions.spec.ts` 回归通过（1 项）。浏览器确认《红辣椒》原始 848 × 1264 JPG 正常加载。

截图：[红辣椒优化后的墙面海报组](metrics/paprika-wall-gallery-after.jpg)。
