/** Avatar facing labels; independent from ground geometry and editor axes. */
export type IsoDirection4 = 'SE' | 'SW' | 'NW' | 'NE';
export function normalizeIsoFacing(facing?: string): IsoDirection4 {
  switch (facing) {
    case 'SE':
    case 'front':
      return 'SE'; // 东南（正对镜头）
    case 'SW':
    case 'side':
      return 'SW'; // 西南（侧身面向左下）
    case 'NW':
    case 'back':
      return 'NW'; // 西北（背对镜头）
    case 'NE':
      return 'NE'; // 东北（侧身背向右上）
    default:
      return 'SE';
  }
}
