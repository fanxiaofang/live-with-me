export const GARDEN_CROPS = {
  cabbage: '包菜', carrot: '胡萝卜', lettuce: '莴笋', corn: '玉米', potato: '土豆',
  tomato: '番茄（带架）', bean: '豆角（带架）', bokChoy: '小白菜', daikon: '白萝卜', pepper: '辣椒',
  scallion: '小葱', garlic: '大蒜', shanghaiGreen: '上海青', cilantro: '香菜',
  // Keep the former lettuce key so existing planted plots restore as Chinese cabbage.
  strawberry: '草莓', waterSpinach: '空心菜', looseLettuce: '大白菜', peaShoots: '豌豆尖',
} as const;
export type GardenCrop = keyof typeof GARDEN_CROPS;
// Actual plant spread and height call for different spacing, especially climbing crops.
const CROP_SPACING: Record<GardenCrop, readonly [number, number]> = {
  cabbage: [23,19], carrot: [17,14], lettuce: [23,19], corn: [37,34], potato: [27,23],
  tomato: [35,34], bean: [40,37], bokChoy: [19,16], daikon: [20,17], pepper: [32,28],
  scallion: [15,13], garlic: [20,18], shanghaiGreen: [24,21], cilantro: [21,18],
  strawberry: [27,24], waterSpinach: [27,24], looseLettuce: [27,24], peaShoots: [26,23],
};
export const CROP_DENSITIES = { sparse: '疏植', normal: '适中', dense: '密植' } as const;
export type CropDensity = keyof typeof CROP_DENSITIES;
export type PlantingRow = readonly [number, number, number, number, number, number];
export const isGardenCrop = (value: unknown): value is GardenCrop =>
  typeof value === 'string' && Object.hasOwn(GARDEN_CROPS, value);
export const isCropDensity = (value: unknown): value is CropDensity =>
  typeof value === 'string' && Object.hasOwn(CROP_DENSITIES, value);

/** Use this drawing's actual ridge centres; resizing changes planting capacity, never plant size. */
export function gardenPlantingSlots(rows: readonly PlantingRow[], length: number, width: number,
  crop: GardenCrop, density: CropDensity) {
  if (!rows.length) return [];
  const spacing = CROP_SPACING[crop][0] * ({ sparse: 1.35, normal: 1, dense: .8 }[density]);
  const crossSpacing = CROP_SPACING[crop][1] * ({ sparse: 1.35, normal: 1, dense: .8 }[density]);
  const rowCount = Math.min(rows.length, Math.max(1, Math.floor((rows.at(-1)![2] - rows[0][2]) * width / 100 / crossSpacing) + 1));
  const slots: { u: number; v: number; rise: number; variation: number }[] = [];
  for (let r = 0; r < rowCount; r++) {
    const index = Math.round(rowCount === 1 ? (rows.length - 1) / 2 : r * (rows.length - 1) / (rowCount - 1));
    const row = rows[index];
    const start = row[0] + 8, end = row[1] - 8;
    const count = Math.max(1, Math.floor((end - start) * length / 100 / spacing) + 1);
    for (let c = 0; c < count; c++) {
      const along = count === 1 ? .5 : (c + .5) / count;
      slots.push({ u: start + (end - start) * along,
        v: row[2] + 2 * (1 - along) * along * row[3],
        rise: row[5] * .5, variation: (r * 7 + c * 3) % 5 });
    }
  }
  return slots;
}
