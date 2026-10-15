export type CabinetPartId = 'cabinet-group' | 'record-player' | 'moka-pot' | 'honey-jar' | 'coffee-beans' | 'ceramic-cups';

export const CABINET_DETAILS: { id: CabinetPartId; title: string; description: string }[] = [
  { id: 'cabinet-group', title: '整座咖啡黑胶柜', description: '温润的木台面、开放收纳格和细木柜脚，装着这间屋子日常的小小仪式。这里展示的是房间里当前的陈设。' },
  { id: 'record-player', title: '黑胶唱片机', description: '唱针轻轻搭在转动的唱片上，黄铜旋钮与木质机座陪着一段缓慢的下午。可以放大看看唱臂、唱盘和小开关。' },
  { id: 'moka-pot', title: '摩卡咖啡壶', description: '棱面的银色壶身、深色把手和短短的壶嘴，盛着刚煮好的咖啡，留下一缕轻轻的热气。' },
  { id: 'honey-jar', title: '野花蜂蜜罐', description: '金黄的蜂蜜透过玻璃，木盖与蜂蜜棒带着暖暖的手作感。罐身标签和玻璃反光都保留着。' },
  { id: 'coffee-beans', title: '咖啡豆与储豆罐', description: '牛皮纸豆袋和软木塞玻璃罐安静地收在柜格里，深烘的咖啡豆给木色添了一点浓香。' },
  { id: 'ceramic-cups', title: '手作陶杯', description: '陶土、燕麦与抹茶色的小杯子各有自己的釉面与杯口，随手取一只，就能坐下来喝点热的。' },
];
