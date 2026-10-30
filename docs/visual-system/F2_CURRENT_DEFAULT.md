# F2 当前默认场景

2026-10-30。当前木屋和此前审核的草甸丘陵均已由用户确认。直接打开首页，无需试验参数。

唯一配置为 src/world/scene/currentScene.ts 的 CURRENT_F2_SCENE。首页、fixture 与取证脚本读取同一定义。

| 部分 | 默认 |
| --- | --- |
| 远山与天空 | f2 / refined，来源三层弱视差，原天空与统一环境 |
| 山麓 | meadow，连续草甸材质、风车/农舍、31 棵分树种树木 |
| 田界 / 草地 / 入口 | both / complete / entrance |
| 主屋 | seedpod，已定稿薄壳、自然枝撑和阁楼 |
| 时段 | 白天、黄昏、夜晚；夜间室内保留暖感 |

农田保留独立的 .65/.55/.70 响应，草地与建筑使用近景相机，铁路独立运动。窗景、书桌台灯和阁楼南瓜灯响应时段；已移除两盏一楼新增吊灯。

旧屋对照使用 ?cottage=classic，旧背景使用 ?hills=legacy。其他显式比较参数见 SceneOptions；参数只作用于当前 URL，不保存到用户存储。旧屋与旧背景为独立开关。

F2 加载或 WebGL context loss 时回退背景，不恢复已经淘汰的草台和植被。默认场景/窄屏/回退/键鼠验证见[合入记录](f2-main-release-2026-10-30/README.md)。

[木屋定稿](f2-default-cottage-2026-10-30/README.md) · [丘陵定稿](f2-default-meadow-2026-10-29/README.md)

当前范围为夏季晴天三时段，四季、雨雪遮罩、积雪和阁楼人物席位属于后续工作。历轮试验、对照和大体积截图保留在 codex/f2-hills-integration 分支及原本地目录；主线仅保留当前说明、最终证据与来源校验文件。
