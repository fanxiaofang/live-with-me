# 当前保留的草甸植被资产

2026-10-19 按用户要求保留 Phase B v2 三组原生 SVG：

- `short-meadow.svg`：短草甸簇。
- `wild-grass.svg`：禾本科野草簇。
- `wildflower-mix.svg`：野花混生簇。

透明背景，根部附近为局部坐标原点。使用 `viewBox` 原比例缩放；不将资产本身的尺寸当作场景的默认摆放尺度。

React 源码位于 `src/components/scenery/yorkshire/vegetation/MeadowVegetationAssets.tsx`，提供 `ShortMeadowCluster`、`WildGrassCluster`、`WildflowerCluster`，以及 `Grass`、`Plant` 基础造型。样板、历史试放与新资产共享该源码。

[确认范围与校验清单](../../../docs/architecture/metrics/MEADOW-VEGETATION-B-2026-10-19/v2/approved/README.md)。重新校验运行 `node --import tsx scripts/retain-meadow-assets.tsx`；不要直接覆盖已保留 SVG，造型修订请另建版本。
