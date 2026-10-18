# 温莎椅单人姿态审阅，2026-10-16

状态：已实施首版；下列技术检查通过；用户最终视觉验收待反馈。

## 三种对照

同一真实工位人物、同一套几何和配色，没有替换成生成效果图。

- [身体无遮挡](body-1200.png)
- [坐入温莎椅](chair-1200.png)
- [实际房间近景](room-close-1200.png)，使用正常滚轮相机放大
- [双图审阅窗口](review-1200.png)、[实际房间原倍率](room-1200.png)
- [窄屏窗口](review-390.png)、[窄屏身体](body-390.png)、[窄屏椅坐](chair-390.png)、[窄屏实际房间](room-390.png)

第一、第二图保持相同 viewBox。第三图保留真实家具、遮挡和人物，使用原桌，不是上一批异形桌草稿。场景中的手部受到当前头部和桌面视线遮挡，不以隐藏细节代替可达性检查。该姿态只适配当前温莎椅固定方向，没有实现随任意家具旋转自动生成姿态。

## 环境与检查

- Windows 本机，Playwright Chromium 无头，DPR 1，1200×900 和 390×900。
- 独立生产预览 `http://127.0.0.1:4179/`，产物 `build/windsor-study`。现有 3000/4177/4178 服务未停止或重启。
- 功能截图使用 stableScene，禁用动画/过渡；本批不测性能，内置浏览器和真实手机性能均未测。390px 是桌面浏览器窄屏模拟。
- 控制布局只在隔离测试上下文中设定：桌组 X +2、第一椅 X +1；不改用户浏览器的保存布局。检查前后 v6 存储逐字一致。
- `npm run lint` 通过；最终 `npm run build -- --outDir build/windsor-study` 通过，既有大于 500 kB 包警告仍在。
- **7 个不同浏览器用例通过**：新单人对照在 1200/390px 两项；既有桌面/窄屏检视、无人席位、保存装扮同步、第二工位隔离五项。
- 最后仅调整下摆接地斜率和影子后，重新构建并复验两项新单人用例，2 passed（38.1s）。不将复验累加为额外覆盖。
- 检查真实人物 ID、袍身几何一致、同倍率、SVG ID 唯一及引用有效、窄屏无横溢、返回房间、布局保存不变、无页面异常。旧检视覆盖圆手定位及换装同步，第二席保持原姿态源。
- `git diff --quiet -- src/components/CharacterAvatar.tsx src/components/characters public` 返回 0：原四视图绘制源、发型组件及静态导出资产相对 HEAD 均未改动。`git diff --check` 通过。
- 初始沙箱构建/预览遇到 esbuild `spawn EPERM`，获子进程权限后成功；首次预览早于构建目录完成而退出，待构建结束后启动成功。

命令：

```powershell
npx playwright test --config playwright.windsor-study.config.ts --grep 'Windsor single sitter|chair inspection preserves layout|an unoccupied workstation|saved appearance|the second chair' --workers=1 --timeout=60000
npx playwright test --config playwright.windsor-study.config.ts --grep 'Windsor single sitter' --workers=1 --timeout=60000
```

最终构建 SHA256：

- `index-DZqcHi-F.js`：`5FE9CCC9485A6D86B76F79564B4F8AB055C4FF9E91EF8A385B796A042D3F3D9A`
- `ChairInspectionModal-5isL708H.js`：`1B2AB1EC4031B64E47824115A5FED90B8EB471370ED8B035C4321086F93030F3`

## 尚待决定

新增背侧头部转向、肩背与袍身松量、椅背遮挡后的整体观感待用户审阅。本轮没有自动碰撞检查、任意朝向姿态系统，也没有推广第二席。下一步根据这些图修正一个人物，确认后再推进家具布局。性能专项继续暂停。
