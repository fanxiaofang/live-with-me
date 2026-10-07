import type { Page } from '@playwright/test';

export async function stableScene(page: Page, path = '/') {
  await page.goto(path);
  await page.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    document.querySelectorAll('svg').forEach(svg => { svg.pauseAnimations(); svg.setCurrentTime(0); });
  });
  await page.locator('#panoramic-world-stage').waitFor();
}

export const ROOM_VIEWS = [
  ['overview', '整栋小屋'], ['my_room', '我的阁楼房间'],
  ['living_nook', '公共起居角'], ['friend_room', '林木的书房'],
  ['capsule_pod', '旧胶囊仓'], ['corn_lounge', '林间小木屋'],
  ['observatory', '山巅外星电波监听站'], ['porch_mailbox', '前廊'],
] as const;
