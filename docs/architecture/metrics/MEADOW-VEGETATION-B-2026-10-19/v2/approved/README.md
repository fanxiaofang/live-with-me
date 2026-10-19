# 草甸植被 v2：当前保留资产

2026-10-19，用户确认“暂时就这样先验收吧吧”，并明确要求 v2 样板中的三组草作为资产保留。

| 资产 | React 组件 | 透明 SVG |
| --- | --- | --- |
| 短草甸簇 | `ShortMeadowCluster` | [short-meadow.svg](../../../../../../src/assets/meadow/short-meadow.svg) |
| 禾本科野草簇 | `WildGrassCluster` | [wild-grass.svg](../../../../../../src/assets/meadow/wild-grass.svg) |
| 野花混生簇 | `WildflowerCluster` | [wildflower-mix.svg](../../../../../../src/assets/meadow/wildflower-mix.svg) |

组件单一来源：[MeadowVegetationAssets.tsx](../../../../../../src/components/scenery/yorkshire/vegetation/MeadowVegetationAssets.tsx)。原样板包装仍由 `tests/fixtures/meadow/GrassStudiesV2.tsx` 提供；它复用资产源码，不再复制图形。

- 本目录 `soft.svg`、`wild.svg`、`flower.svg` 是原带背景样板的逐字节副本。
- 透明资产只移除样板背景与展示倍率，植物内部的 Path、颜色、局部比例保持原样；viewBox 以根部附近为原点，可直接在场景地面平面定位。
- 完整造型、纯剪影、隐藏花朵及 0.66 倍查看入口继续保留：[原样板页](../index.html)。
- [manifest.json](manifest.json) 记录确认范围、源码及每个 SVG 的 SHA-256。脚本会校验原样板的静态渲染完全一致；再次生成时发现保留文件不同会停止，避免覆盖当前基准。
- 重新校验／保留：`node --import tsx scripts/retain-meadow-assets.tsx`。

## 使用

组件绘制 `<g>`，用于已有 SVG 场景；位置、缩放、配色适配由场景负责。组件内部不带背景、地形、阴影、泥土、随机纹理或动画。完整混生组是植物资产，不是所有位置都应整组复制；场景也可复用 `Grass`、`Plant` 原子造型进行已审阅的局部编排。

当前场景验收范围见[第九轮](../../../MEADOW-SCENE-TRIAL-2026-10-19/round-9/README.md)：沿用第八轮草台、蜂箱混生重组、主屋灌木保留、四处石缝草替换。2026-10-20 已将当前组合接入正式入口，见[集成记录](../../../MEADOW-SCENE-TRIAL-2026-10-19/integration/README.md)；没有扩大到全场统一替换。保留清单中的场景状态记录的是资产归档时的状态。

未来如重画造型，应建立新版本供比较，保留本版本作为当前基准。

## 本次整理校验

- `npm run lint` 通过。
- 三组新来源的静态渲染与原审阅样板逐字节一致；源码、透明 SVG、原样板副本 SHA-256 校验通过。
- 透明 SVG 无背景且图形均在 viewBox 内；三个下载链接、完整／剪影／隐藏花朵模式及 390px 页面检查通过。
- 第九轮仍能正常显示原 36 簇、蜂箱新组合与主屋灌木，浏览器无运行错误。
- 明细见 [verification.json](verification.json)。