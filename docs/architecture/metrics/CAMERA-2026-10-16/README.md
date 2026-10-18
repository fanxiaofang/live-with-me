# 两条镜头切换的局部检查

说明及结论见 [性能专项第 10 节](../../SCENE_PERFORMANCE_DIAGNOSIS.md#10-两条镜头切换的轻量核查2026-10-16)。只使用当前 4177 生产构建，两条路线各一次正常记录及一次临时 will-change 对照；没有改产品代码。

- `normal/my_room.json`：全景 → 阁楼正常记录，主要 rAF 间隔 667.4ms。
- `normal-living/living_nook.json`：全景 → 公共起居角正常记录，主要间隔 633.8ms。
- `promote/my_room.json`、`promote/living_nook.json`：临时四层 will-change，对应最大间隔 1101.1 / 834.3ms，未显示改善，未采用。
- 各目录 `environment.json`：构建资源哈希、浏览器/视口/DPR、种子和限制。
- `scale-check/*-normal.json`、`scale-check/*-pan-only.json`：后续最小配对。阁楼正常/仅平移最大间隔 1000.9 / 366.9ms，公共起居角 900.8 / 400.3ms；仅平移组四层倍率保持 0.66。倍率/可见面积也改变，不能将其视为同构图的产品优化。新样本与上轮均保留。

首次 `normal` 执行在阁楼成功后，公共起居角因按钮名称使用数据全名而超时；缺少的第二条已在 `normal-living` 补齐。没有删除、覆盖原始样本。

脚本：`scripts/check-camera-switch.mjs <新目录> [normal|promote|scale-check] [可选 my_room|living_nook]`；scale-check 每条路线各运行一次正常和仅平移。rAF 和 transition 事件不是实际呈现帧率；无 trace、无手机或内置浏览器性能样本。不要横向比较不同环境或不同批次的绝对毫秒值。
