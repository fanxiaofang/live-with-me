# 温莎椅安坐 v2，2026-10-16

已实施安坐稿；用户最终视觉验收待反馈。原 v1 的证据保留在相邻目录，不能把历史技术通过当作造型认可。

## 本批变化

- 按[用户四张关系参考](../../references/windsor-seated-2026-10-16/README.md)重建肩、髋、大腿、膝和下摆；参考没有被用作替换人物/家具的贴图，也没有复制参考镜头或绿色配色。
- 原椅子保持同一几何、尺寸和摆放，人物适配椅子的 -v 前向与横轴投影。骨盆承托在坐垫，长袍覆盖大腿后从膝前垂下，近侧圆手可见地搭在腿上，远侧手允许被椅背局部遮挡。
- 温莎椅是安坐稿，所有状态都保持双手放腿；移动键盘不抬手。不再将它作为键盘接触/打字动作验收。复古椅继续原实现。
- 新增一个背侧方向，不修改原四图，不声称已完成八方向。八方向是制作组织方式，实际朝向必须匹配椅子投影，不能机械旋转旧图。
- 人物独立对照使用已有浅底；按需“查看坐姿结构”展示承托点与腿部参照，关掉窗口后实际场景不挂该层。

## 三种对照与补充图

- [身体无遮挡](body-1200.png)
- [同一个人物坐入原椅子](chair-1200.png)
- [实际房间近景](room-close-1200.png)，使用正常相机滚轮放大
- [结构参照](structure-1200.png)
- [桌面窗口](review-1200.png)、[原倍率房间](room-1200.png)、[窄屏窗口](review-390.png)、[窄屏房间](room-390.png)
- 四款现有发型同步：[短发](hair-short.png)、[卷发](hair-curly.png)、[偏分低束发](hair-sidepart.png)、[双色碎发](hair-shaggy.png)

两张独立人物图 viewBox 一致，实际场景沿用真实占用与原桌；没有使用生成效果图或替换房间模型。近景图只验证当前实际关系，不能证明全朝向、任意家具旋转、动态动作或自动碰撞正确。

## 保留范围的证据

以下三个文件在本轮开始与收尾的 SHA256 完全一致（已有上一批接入改动保留，本轮未重画或移动椅子）：

| 文件 | SHA256 |
| --- | --- |
| `WindsorChair.tsx` | `021AB507C2ECF245E4C88DDF241B9A28AA2CE230FB9983D3586D08038C36F4A9` |
| `chairGeometry.ts` | `B007E2BBF7678A36BA60546DEF0252719F5D490565FC2B977E6D990D4FA0DF62` |
| `layoutStore.ts` | `16788BA77C20C55022E34ED53BD249FFE5253AD51424ED8FAA1C45F75BAF8E71` |

`git diff --quiet -- src/components/CharacterAvatar.tsx src/components/characters public` 返回 0，原人物四视图绘制源、发型组件和 public 导出相对 HEAD 无改动。旧椅坐代码副本保存在 `previous-body.tsx.txt` / `previous-head.tsx.txt`，原 v1 图片与记录未覆盖。

## 技术检查与环境

- Windows 本机、生产预览 `http://127.0.0.1:4180/`，构建 `build/windsor-study-v2`；4179 保留 v1，3000 未停止/重启。
- `npm run lint` 和最终生产构建通过；现有大于 500 kB 的主包提示保留。
- 本轮 **8 个不同的浏览器用例通过**（1.8m）：新桌面/390px 姿态审阅两项、四发型近侧手掌可见性一项；旧桌面/390px 检视、空席、保存装扮、第二工位隔离五项。四发型循环属于一个用例，不计成四项。
- 检查内容：共享人物 ID / 袍身几何、同倍率、手掌在头部下方且渲染时未被覆盖、各发型下近侧手掌命中可见、SVG ID/引用、结构层按需挂载/关闭后卸载、键盘移动手不抬、状态提示正确、真实占用不变、v6 自定义布局逐字保持、无页面异常。
- 最终只收小后颈色块并接合领口后，重新构建并复验三项新姿态用例，3 项通过；重复运行不累计为新覆盖。最终图片均来自此构建。
- Playwright Chromium 无头，DPR 1，1200×900 / 390×900；390px 是桌面浏览器模拟，非真实手机。功能图使用 stableScene 禁用动画/过渡，未测试帧率，未恢复性能专项。内置浏览器仅提供查看入口，未用其替代自动化或真实手机证据。
- 新两项审阅使用隔离上下文的受控自定义布局（桌组 X +2，第一椅 X +1），测试前后保存逐字不变；不写入用户现用浏览器布局。

命令：

```powershell
npm run lint
npm run build -- --outDir build/windsor-study-v2
npx playwright test --config playwright.windsor-study.config.ts --grep 'Windsor single sitter|Windsor resting palms|chair inspection preserves layout|an unoccupied workstation|saved appearance|the second chair' --workers=1 --timeout=60000
npx playwright test --config playwright.windsor-study.config.ts --grep 'Windsor single sitter|Windsor resting palms' --workers=1 --timeout=60000
```

最终构建 SHA256：

- `index-BEyQgQfi.js`：`4CEFE2061B55F3B670C1E93FBB494D97EE8676E83DD871F59C086A0F44F4CA0C`
- `ChairInspectionModal-B6HoEU_U.js`：`C54A7A6111417B7E98E7EF4580F20E4AC0F24F9EEDA5040D1E48E8C79ADF39FB`

## 后续边界

当前只供审阅温莎椅中性坐姿、袍身松量及方向。人物手臂不操作键盘，电脑使用动作将来单独适配；完整八方向、其它席位、新家具布局和天气未实施。根据这三种对照反馈修改该单人，技术检查不代替用户视觉验收。性能继续暂停，未提交/推送。
