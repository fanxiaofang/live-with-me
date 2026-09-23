import React from 'react';

export type StoveColorVariant = 'terracotta' | 'walnut' | 'sage' | 'charcoal' | 'forest_green';

export interface CastIronWoodStoveProps {
  color?: StoveColorVariant;
  onSelectColor?: (color: StoveColorVariant) => void;
  scale?: number;
  showSwitchUI?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export const STOVE_PALETTES: Record<
  StoveColorVariant,
  {
    id: StoveColorVariant;
    label: string;
    subtitle: string;
    swatch: string;
    bodyGradId: string;
    pipeGradId: string;
    // Body & Facets
    facetLeft: string;
    facetLeftStroke: string;
    facetLeftHi: string;
    facetRight: string;
    facetRightStroke: string;
    frontFaceStroke: string;
    cornerRivetFill: string;
    cornerRivetStrokeL: string;
    cornerRivetStrokeR: string;
    // Base Plinth
    plinthBase: string;
    plinthLeft: string;
    plinthLeftStroke: string;
    plinthRight: string;
    plinthRightStroke: string;
    plinthFront: string;
    plinthFrontStroke: string;
    plinthTop: string;
    plinthHi: string;
    // Legs
    legsFrontLeft: string;
    legsFrontLeftStroke: string;
    legsFrontLeftHi: string;
    legsFrontRight: string;
    legsFrontRightStroke: string;
    legsFrontRightHi: string;
    legsRearLeft: string;
    legsRearRight: string;
    footPadLeft: string;
    footPadRight: string;
    // Arched Door
    doorFrame: string;
    doorFrameStroke: string;
    doorHi: string;
    mullion: string;
    mullionHi: string;
    hingeFill: string;
    // Top Mantel Shelf
    topShelfTrim: string;
    topShelfFront: string;
    topShelfFrontStroke: string;
    topShelfLeft: string;
    topShelfRight: string;
    topShelfFlat: string;
    topShelfFlatStroke: string;
    topShelfHi: string;
    // Flue Collar
    flueCollarBase: string;
    flueCollarTop: string;
    flueCollarBody: string;
    flueCollarHi: string;
    // Ceramic Mug
    mugShadow: string;
    mugBase: string;
    mugWall: string;
    mugStroke: string;
    mugHi: string;
    mugHandle: string;
    mugHandleHi: string;
    mugRim: string;
    mugLiquid: string;
  }
> = {
  // 1. 陶土栗棕色 (Warm Chestnut Terracotta) —— 温暖栗褐色手作粗陶质感，与地板原木/红砖屋顶浑然一体
  terracotta: {
    id: 'terracotta',
    label: '暖栗陶土',
    subtitle: '温润粗陶与栗木色调',
    swatch: '#8a4b35',
    bodyGradId: 'castIronBodyGrad_terracotta',
    pipeGradId: 'castIronPipeGrad_terracotta',
    // Body & Facets (Warm Earthy Chestnut & Terracotta)
    facetLeft: '#954f38',
    facetLeftStroke: '#683322',
    facetLeftHi: '#bf6c50',
    facetRight: '#5a2a1b',
    facetRightStroke: '#3a180f',
    frontFaceStroke: '#482014',
    cornerRivetFill: '#32140a',
    cornerRivetStrokeL: '#aa5a3f',
    cornerRivetStrokeR: '#6e301d',
    // Base Plinth
    plinthBase: '#2a1208',
    plinthLeft: '#82412c',
    plinthLeftStroke: '#4d2214',
    plinthRight: '#482014',
    plinthRightStroke: '#2a1109',
    plinthFront: '#68301f',
    plinthFrontStroke: '#3e1a0f',
    plinthTop: '#753925',
    plinthHi: '#ad5c40',
    // Legs
    legsFrontLeft: '#7d3e2b',
    legsFrontLeftStroke: '#482014',
    legsFrontLeftHi: '#b56247',
    legsFrontRight: '#4c2215',
    legsFrontRightStroke: '#2a1109',
    legsFrontRightHi: '#703422',
    legsRearLeft: '#3c180e',
    legsRearRight: '#2c1008',
    footPadLeft: '#3f190e',
    footPadRight: '#2c1008',
    // Arched Door
    doorFrame: '#421d12',
    doorFrameStroke: '#260e07',
    doorHi: '#8f4730',
    mullion: '#3c1a10',
    mullionHi: '#783521',
    hingeFill: '#281008',
    // Top Mantel Shelf
    topShelfTrim: '#38160c',
    topShelfFront: '#6d3120',
    topShelfFrontStroke: '#3c180e',
    topShelfLeft: '#8b452f',
    topShelfRight: '#3a170c',
    topShelfFlat: '#783522',
    topShelfFlatStroke: '#441c10',
    topShelfHi: '#be6548',
    // Flue Collar
    flueCollarBase: '#36150b',
    flueCollarTop: '#582415',
    flueCollarBody: '#451a0e',
    flueCollarHi: '#994a32',
    // Ceramic Mug (Warm Oatmeal Cream Mug)
    mugShadow: '#200a04',
    mugBase: '#d2c4b0',
    mugWall: '#ece2d2',
    mugStroke: '#94836d',
    mugHi: '#ffffff',
    mugHandle: '#d2c4b0',
    mugHandleHi: '#ffffff',
    mugRim: '#fffdfa',
    mugLiquid: '#3d2010',
  },

  // 2. 焦糖胡桃色 (Warm Walnut & Caramel) —— 与木地板、唱片柜、茶几实木家具 100% 同色系呼应！
  walnut: {
    id: 'walnut',
    label: '焦糖胡桃',
    subtitle: '与地板及原木家具同色系',
    swatch: '#5c3d28',
    bodyGradId: 'castIronBodyGrad_walnut',
    pipeGradId: 'castIronPipeGrad_walnut',
    // Body & Facets (Deep Smoked Walnut & Antique Warm Bronze)
    facetLeft: '#5c3d29',
    facetLeftStroke: '#3d2517',
    facetLeftHi: '#855b3f',
    facetRight: '#311c10',
    facetRightStroke: '#201008',
    frontFaceStroke: '#301c10',
    cornerRivetFill: '#1a0e07',
    cornerRivetStrokeL: '#734d34',
    cornerRivetStrokeR: '#4a2f1e',
    // Base Plinth
    plinthBase: '#1c0f07',
    plinthLeft: '#4f3321',
    plinthLeftStroke: '#331f12',
    plinthRight: '#29170c',
    plinthRightStroke: '#1a0d05',
    plinthFront: '#3d2617',
    plinthFrontStroke: '#26160b',
    plinthTop: '#472d1c',
    plinthHi: '#7a5237',
    // Legs
    legsFrontLeft: '#523522',
    legsFrontLeftStroke: '#311c0f',
    legsFrontLeftHi: '#7d5539',
    legsFrontRight: '#2b170c',
    legsFrontRightStroke: '#170b04',
    legsFrontRightHi: '#4c2e1b',
    legsRearLeft: '#261409',
    legsRearRight: '#1c0d05',
    footPadLeft: '#2e180c',
    footPadRight: '#1a0d05',
    // Arched Door
    doorFrame: '#311c0f',
    doorFrameStroke: '#1c0d06',
    doorHi: '#613e27',
    mullion: '#29160a',
    mullionHi: '#54341f',
    hingeFill: '#1c0d06',
    // Top Mantel Shelf
    topShelfTrim: '#26140a',
    topShelfFront: '#422a1a',
    topShelfFrontStroke: '#26150b',
    topShelfLeft: '#5c3d29',
    topShelfRight: '#26140a',
    topShelfFlat: '#4a301e',
    topShelfFlatStroke: '#311d11',
    topShelfHi: '#825a3d',
    // Flue Collar
    flueCollarBase: '#241309',
    flueCollarTop: '#3d2617',
    flueCollarBody: '#2e1b0f',
    flueCollarHi: '#66432b',
    // Ceramic Mug (Golden Honey Amber Ceramic)
    mugShadow: '#140803',
    mugBase: '#b45309',
    mugWall: '#d97706',
    mugStroke: '#78350f',
    mugHi: '#fbbf24',
    mugHandle: '#b45309',
    mugHandleHi: '#f59e0b',
    mugRim: '#fef3c7',
    mugLiquid: '#361503',
  },

  // 3. 柔和草席鼠尾草绿 (Warm Sage & Rush Green) —— 与榻榻米蔺草席面、室内绿植同色系呼应！
  sage: {
    id: 'sage',
    label: '柔和草席绿',
    subtitle: '与榻榻米草席及盆栽同色系',
    swatch: '#586e59',
    bodyGradId: 'castIronBodyGrad_sage',
    pipeGradId: 'castIronPipeGrad_sage',
    // Body & Facets (Muted, warm, earthy rush green, matches #7e9c76 tatami rush)
    facetLeft: '#4d634f',
    facetLeftStroke: '#334535',
    facetLeftHi: '#739175',
    facetRight: '#29372a',
    facetRightStroke: '#19231a',
    frontFaceStroke: '#2a392b',
    cornerRivetFill: '#162117',
    cornerRivetStrokeL: '#5f7c62',
    cornerRivetStrokeR: '#415543',
    // Base Plinth
    plinthBase: '#182419',
    plinthLeft: '#435845',
    plinthLeftStroke: '#2c3c2e',
    plinthRight: '#233124',
    plinthRightStroke: '#162117',
    plinthFront: '#334434',
    plinthFrontStroke: '#1f2c20',
    plinthTop: '#3b4e3c',
    plinthHi: '#668469',
    // Legs
    legsFrontLeft: '#445a46',
    legsFrontLeftStroke: '#28382a',
    legsFrontLeftHi: '#6c8d6f',
    legsFrontRight: '#243225',
    legsFrontRightStroke: '#152016',
    legsFrontRightHi: '#3e5440',
    legsRearLeft: '#1f2d21',
    legsRearRight: '#162217',
    footPadLeft: '#263728',
    footPadRight: '#172318',
    // Arched Door
    doorFrame: '#273629',
    doorFrameStroke: '#162217',
    doorHi: '#526e55',
    mullion: '#243225',
    mullionHi: '#49634c',
    hingeFill: '#162217',
    // Top Mantel Shelf
    topShelfTrim: '#212f23',
    topShelfFront: '#364937',
    topShelfFrontStroke: '#1e2c20',
    topShelfLeft: '#4f6651',
    topShelfRight: '#212f23',
    topShelfFlat: '#3f5441',
    topShelfFlatStroke: '#273829',
    topShelfHi: '#759678',
    // Flue Collar
    flueCollarBase: '#1f2c20',
    flueCollarTop: '#344736',
    flueCollarBody: '#28382a',
    flueCollarHi: '#547357',
    // Ceramic Mug (Warm Terracotta Glaze)
    mugShadow: '#121d14',
    mugBase: '#b94a28',
    mugWall: '#d45c34',
    mugStroke: '#8a3116',
    mugHi: '#f07b54',
    mugHandle: '#b94a28',
    mugHandleHi: '#f07b54',
    mugRim: '#fdf6eb',
    mugLiquid: '#3f190d',
  },

  // 4. 经典铸铁炭黑 (Matte Cast Iron Charcoal) —— 百搭中性色，与唱片机、黑管自然一体！
  charcoal: {
    id: 'charcoal',
    label: '经典炭黑',
    subtitle: '百搭中性经典铸铁',
    swatch: '#2b2724',
    bodyGradId: 'castIronBodyGrad_charcoal',
    pipeGradId: 'castIronPipeGrad_charcoal',
    // Body & Facets
    facetLeft: '#3c3631',
    facetLeftStroke: '#2b2723',
    facetLeftHi: '#5c544b',
    facetRight: '#1e1b19',
    facetRightStroke: '#141210',
    frontFaceStroke: '#211e1b',
    cornerRivetFill: '#141211',
    cornerRivetStrokeL: '#48423b',
    cornerRivetStrokeR: '#38332d',
    // Base Plinth
    plinthBase: '#161412',
    plinthLeft: '#38332e',
    plinthLeftStroke: '#272320',
    plinthRight: '#1c1917',
    plinthRightStroke: '#141210',
    plinthFront: '#2c2825',
    plinthFrontStroke: '#1d1a18',
    plinthTop: '#36312c',
    plinthHi: '#524a42',
    // Legs
    legsFrontLeft: '#3a342f',
    legsFrontLeftStroke: '#221e1b',
    legsFrontLeftHi: '#63594f',
    legsFrontRight: '#221e1c',
    legsFrontRightStroke: '#141210',
    legsFrontRightHi: '#38322c',
    legsRearLeft: '#1e1b19',
    legsRearRight: '#181514',
    footPadLeft: '#24201c',
    footPadRight: '#181513',
    // Arched Door
    doorFrame: '#1f1c1a',
    doorFrameStroke: '#12100e',
    doorHi: '#484139',
    mullion: '#25211e',
    mullionHi: '#48413a',
    hingeFill: '#141210',
    // Top Mantel Shelf
    topShelfTrim: '#231f1c',
    topShelfFront: '#312c28',
    topShelfFrontStroke: '#1a1715',
    topShelfLeft: '#433d36',
    topShelfRight: '#1a1715',
    topShelfFlat: '#3b352f',
    topShelfFlatStroke: '#2b2621',
    topShelfHi: '#685f54',
    // Flue Collar
    flueCollarBase: '#1e1a17',
    flueCollarTop: '#2c2723',
    flueCollarBody: '#231f1c',
    flueCollarHi: '#4e463d',
    // Ceramic Mug
    mugShadow: '#18110a',
    mugBase: '#92400e',
    mugWall: '#b45309',
    mugStroke: '#78350f',
    mugHi: '#d97706',
    mugHandle: '#92400e',
    mugHandleHi: '#d97706',
    mugRim: '#fef3c7',
    mugLiquid: '#451a03',
  },

  // 5. 复古森林绿 (Vintage Forest Green) —— 保留原始对比方案
  forest_green: {
    id: 'forest_green',
    label: '复古森林绿',
    subtitle: '深墨绿复古搪瓷',
    swatch: '#325740',
    bodyGradId: 'castIronBodyGrad_forestGreen',
    pipeGradId: 'castIronPipeGrad_forestGreen',
    // Body & Facets
    facetLeft: '#3a6249',
    facetLeftStroke: '#254432',
    facetLeftHi: '#5c9671',
    facetRight: '#1a2e22',
    facetRightStroke: '#122018',
    frontFaceStroke: '#1c3325',
    cornerRivetFill: '#112217',
    cornerRivetStrokeL: '#4a795c',
    cornerRivetStrokeR: '#335741',
    // Base Plinth
    plinthBase: '#132219',
    plinthLeft: '#345942',
    plinthLeftStroke: '#233f2e',
    plinthRight: '#182b1f',
    plinthRightStroke: '#111f16',
    plinthFront: '#264231',
    plinthFrontStroke: '#192e22',
    plinthTop: '#2c4d39',
    plinthHi: '#518765',
    // Legs
    legsFrontLeft: '#345a42',
    legsFrontLeftStroke: '#223c2c',
    legsFrontLeftHi: '#58916d',
    legsFrontRight: '#1d3124',
    legsFrontRightStroke: '#132319',
    legsFrontRightHi: '#32523e',
    legsRearLeft: '#17291e',
    legsRearRight: '#14231a',
    footPadLeft: '#1f3427',
    footPadRight: '#16261c',
    // Arched Door
    doorFrame: '#1e3427',
    doorFrameStroke: '#13231a',
    doorHi: '#477859',
    mullion: '#1d3225',
    mullionHi: '#417053',
    hingeFill: '#121f17',
    // Top Mantel Shelf
    topShelfTrim: '#1c3125',
    topShelfFront: '#284634',
    topShelfFrontStroke: '#172c20',
    topShelfLeft: '#3c634b',
    topShelfRight: '#172a1e',
    topShelfFlat: '#325740',
    topShelfFlatStroke: '#223d2d',
    topShelfHi: '#5d9c75',
    // Flue Collar
    flueCollarBase: '#1a2d21',
    flueCollarTop: '#284433',
    flueCollarBody: '#203728',
    flueCollarHi: '#4b7d5e',
    // Ceramic Mug
    mugShadow: '#131e17',
    mugBase: '#c25e2e',
    mugWall: '#d97746',
    mugStroke: '#9a3412',
    mugHi: '#f97316',
    mugHandle: '#c25e2e',
    mugHandleHi: '#fb923c',
    mugRim: '#fffbeb',
    mugLiquid: '#3e1e08',
  },
};

export const CastIronWoodStove: React.FC<CastIronWoodStoveProps> = ({
  color = 'terracotta',
  onSelectColor,
  scale = 1.38,
  showSwitchUI = true,
  onClick,
}) => {
  const p = STOVE_PALETTES[color] || STOVE_PALETTES.terracotta;

  // Compute stove body transformation anchored at floor contact level (0, 65.6)
  const floorAnchorY = 65.6;
  const stoveTransform = `translate(0, ${floorAnchorY}) scale(${scale}) translate(0, -${floorAnchorY})`;

  // Top of collar adapter under scaling:
  const topCollarY = floorAnchorY - (floorAnchorY - 38.2) * scale;
  // 更加纤细轻盈的排烟管径 (3.0px 替代原先厚重黑管，极轻质感与墙面屋脊浑然一体)
  const pipeWidth = 3.0;
  const pipeX = -pipeWidth / 2;

  // Sequential cycle list for direct stove clicks
  const colorOrder: StoveColorVariant[] = ['terracotta', 'walnut', 'sage', 'charcoal', 'forest_green'];

  const handleStoveClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
      return;
    }
    if (onSelectColor) {
      e.stopPropagation();
      const activeColor: StoveColorVariant = (color as StoveColorVariant) || 'terracotta';
      const currentIndex = colorOrder.indexOf(activeColor);
      const nextColor = colorOrder[(currentIndex >= 0 ? currentIndex + 1 : 0) % colorOrder.length];
      onSelectColor(nextColor);
    }
  };

  const handlePaletteClick = (selected: StoveColorVariant, e: React.MouseEvent) => {
    if (onSelectColor) {
      e.stopPropagation();
      onSelectColor(selected);
    }
  };

  return (
    <g id="freestanding-storybook-stove" className="select-none">
      {/* --- Gradient & Pattern Defs for All Palettes --- */}
      <defs>
        {/* 炉门内膛玻璃透景遮罩 (图一式开阔大圆拱，确保旺盛跳动火焰饱满充盈展露) */}
        <clipPath id="stoveDoorGlassClip">
          <path d="M-5.8,55.4 L-5.8,47.0 Q-5.8,42.8 0,42.8 Q5.8,42.8 5.8,47.0 L5.8,55.4 Z" />
        </clipPath>

        {/* 炉膛深处漫射炽红背光 (Deep Firebox Radiance) */}
        <radialGradient id="fireboxBackglow" cx="50%" cy="85%" r="70%">
          <stop offset="0%" stopColor="#ea580c" stopOpacity="0.90" />
          <stop offset="40%" stopColor="#c2410c" stopOpacity="0.65" />
          <stop offset="75%" stopColor="#7c2d12" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#1c0a03" stopOpacity="0.0" />
        </radialGradient>

        {/* 哑光陶土/粗陶手作微矿物颗粒纹理 (Terracotta Fine Clay Stipple Overlay) */}
        <pattern id="terracottaClayStipple" width="3.6" height="3.6" patternUnits="userSpaceOnUse">
          <circle cx="0.8" cy="0.8" r="0.22" fill="#2d0f07" opacity="0.18" />
          <circle cx="2.6" cy="2.4" r="0.28" fill="#ffd8cc" opacity="0.12" />
          <circle cx="2.2" cy="0.6" r="0.18" fill="#3a1309" opacity="0.14" />
          <circle cx="0.6" cy="2.8" r="0.18" fill="#ffffff" opacity="0.10" />
        </pattern>

        {/* 1. 暖栗陶土渐变 (温润粗陶与栗木色调，细腻渐变取代机械硬边) */}
        <linearGradient id="castIronBodyGrad_terracotta" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#87432e" />
          <stop offset="35%" stopColor="#a0543c" />
          <stop offset="70%" stopColor="#6e3220" />
          <stop offset="100%" stopColor="#4f2014" />
        </linearGradient>

        {/* 2. Warm Caramel Walnut Gradient (100% 同色系呼应木地板与木制家具) */}
        <linearGradient id="castIronBodyGrad_walnut" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4c3121" />
          <stop offset="35%" stopColor="#63422e" />
          <stop offset="70%" stopColor="#3b2518" />
          <stop offset="100%" stopColor="#28170c" />
        </linearGradient>

        {/* 3. Warm Sage Rush Green Gradient (呼应榻榻米蔺草席面与盆栽) */}
        <linearGradient id="castIronBodyGrad_sage" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#415343" />
          <stop offset="35%" stopColor="#556b57" />
          <stop offset="70%" stopColor="#354536" />
          <stop offset="100%" stopColor="#233024" />
        </linearGradient>

        {/* 4. Charcoal Black Body Gradient */}
        <linearGradient id="castIronBodyGrad_charcoal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3d3731" />
          <stop offset="35%" stopColor="#48423b" />
          <stop offset="70%" stopColor="#2b2724" />
          <stop offset="100%" stopColor="#1e1b19" />
        </linearGradient>

        {/* 5. Forest Green Body Gradient */}
        <linearGradient id="castIronBodyGrad_forestGreen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2b4a36" />
          <stop offset="35%" stopColor="#386047" />
          <stop offset="70%" stopColor="#223d2c" />
          <stop offset="100%" stopColor="#172b1f" />
        </linearGradient>

        {/* Flue Pipe Gradients (Warm Enamel with Cast Iron Sheen - Harmonized with warm timber and plaster) */}
        <linearGradient id="castIronPipeGrad_terracotta" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4a3730" />
          <stop offset="35%" stopColor="#664d42" />
          <stop offset="70%" stopColor="#43312b" />
          <stop offset="100%" stopColor="#2c1f1a" />
        </linearGradient>

        <linearGradient id="castIronPipeGrad_walnut" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#483c34" />
          <stop offset="35%" stopColor="#5e4f45" />
          <stop offset="70%" stopColor="#3d322a" />
          <stop offset="100%" stopColor="#28201a" />
        </linearGradient>

        <linearGradient id="castIronPipeGrad_sage" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3a473c" />
          <stop offset="35%" stopColor="#516154" />
          <stop offset="70%" stopColor="#334035" />
          <stop offset="100%" stopColor="#212a22" />
        </linearGradient>

        <linearGradient id="castIronPipeGrad_charcoal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#403c37" />
          <stop offset="35%" stopColor="#59544c" />
          <stop offset="70%" stopColor="#38342f" />
          <stop offset="100%" stopColor="#24211d" />
        </linearGradient>

        <linearGradient id="castIronPipeGrad_forestGreen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#35453b" />
          <stop offset="35%" stopColor="#4a5e51" />
          <stop offset="70%" stopColor="#2e3d34" />
          <stop offset="100%" stopColor="#1e2922" />
        </linearGradient>

        {/* 柔和环境漫光渐变 (Soft Diffused Floor Glow) */}
        <radialGradient id="stoveFloorSoftWarmGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.55" />
          <stop offset="35%" stopColor="#f59e0b" stopOpacity="0.45" />
          <stop offset="70%" stopColor="#ea580c" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#9a3412" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* --- 1. Warm Ambient Firelight Glow on Plaster Corner Walls --- */}
      <ellipse
        cx="0"
        cy="44"
        rx={72 * (scale / 1.3)}
        ry={50 * (scale / 1.3)}
        fill="url(#hearthWallWarmGlow)"
        className="animate-[pulse_2.4s_infinite]"
        opacity="0.95"
      />

      {/* Country Wall Decoration: Tiny Dried Herb Bouquet on Left Wall (紧贴左墙的田园小干花饰) */}
      <g id="dried-herb-bouquet" transform="translate(-21, 14)">
        <line x1="0" y1="0" x2="0" y2="3" stroke="#8c6a46" strokeWidth="0.6" />
        <circle cx="0" cy="0" r="1.1" fill="#6d4f31" />
        <path
          d="M-2,3 Q-4,8 -5,12 M0,3 Q0,8 -1,13 M2,3 Q4,8 3,11"
          stroke="#5d724f"
          strokeWidth="0.7"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="-5" cy="12" r="1" fill="#b084cc" />
        <circle cx="-1" cy="13" r="1.1" fill="#eab308" />
        <circle cx="3" cy="11" r="0.9" fill="#f87171" />
      </g>

      {/* --- 2. Ground Contact Shadows & Floor Glow (随炉体等比放大并自然贴合地面) --- */}
      <g id="cast-iron-floor-shadows">
        {/* Soft Belly Diffuse Shadow on Floor (炉腹沉稳漫反射闭塞投影) */}
        <ellipse
          cx="0"
          cy={floorAnchorY - 0.5}
          rx={18.0 * scale}
          ry={7.0 * scale}
          fill="#160e07"
          opacity="0.34"
          filter="url(#softShadow)"
        />

        {/* 4 粗壮敦实稳重脚撑地面接触柔和投影 (4 Leg Foot Contact Shadows) */}
        <ellipse cx={-5.6 * scale} cy={62.2 + (floorAnchorY - 62.2) * (1 - scale)} rx={2.4 * scale} ry={1.1 * scale} fill="#120c08" opacity="0.35" filter="url(#softShadow)" />
        <ellipse cx={5.6 * scale} cy={62.2 + (floorAnchorY - 62.2) * (1 - scale)} rx={2.4 * scale} ry={1.1 * scale} fill="#120c08" opacity="0.35" filter="url(#softShadow)" />
        <ellipse cx={-7.8 * scale} cy={floorAnchorY + 0.3} rx={2.8 * scale} ry={1.2 * scale} fill="#120c08" opacity="0.45" filter="url(#softShadow)" />
        <ellipse cx={7.8 * scale} cy={floorAnchorY + 0.3} rx={2.8 * scale} ry={1.2 * scale} fill="#120c08" opacity="0.45" filter="url(#softShadow)" />

        {/* 宽厚柔和的地面漫射壁炉火光 (Cozy Soft Floor Warm Glow, 自然过渡消除硬边界) */}
        <ellipse
          cx="0"
          cy={floorAnchorY + 0.8}
          rx={20.0 * scale}
          ry={7.5 * scale}
          fill="url(#stoveFloorSoftWarmGlow)"
          className="animate-[pulse_2.0s_infinite]"
        />
        <ellipse
          cx="0"
          cy={floorAnchorY + 0.2}
          rx={12.0 * scale}
          ry={4.5 * scale}
          fill="#fef08a"
          opacity="0.42"
          className="animate-[pulse_1.4s_infinite]"
        />
      </g>

      {/* --- 3. SCALED STOVE BODY & HEARTH ARCHITECTURE (以地面为锚点平滑缩放，绘本风去机械化重塑) --- */}
      <g
        id="stove-scalable-body-group"
        transform={stoveTransform}
        onClick={handleStoveClick}
        className="cursor-pointer"
        title={`点击切换炉子颜色 (当前: ${p.label} - ${p.subtitle})`}
      >
        {/* 3.1 远景后方粗实支撑后腿 (Stout Rear Legs) */}
        <g id="cast-iron-back-legs">
          <polygon
            points="-4.2,57.5 -5.8,57.5 -6.6,62.5 -4.8,62.5"
            fill={p.legsRearLeft}
            stroke="#12100e"
            strokeWidth="0.2"
          />
          <polygon
            points="4.2,57.5 5.8,57.5 6.6,62.5 4.8,62.5"
            fill={p.legsRearRight}
            stroke="#100e0c"
            strokeWidth="0.2"
          />
        </g>

        {/* 3.2 温润复古一体式加厚底托 (Cozy Rounded Low-Center Base Plinth) */}
        <g id="cast-iron-base-plinth">
          <path
            d="M-8.8,56.5 C-9.2,59.6 -6.5,60.8 0,60.8 C6.5,60.8 9.2,59.6 8.8,56.5 Z"
            fill={p.plinthFront}
            stroke={p.plinthFrontStroke}
            strokeWidth="0.25"
          />
          <path
            d="M-8.2,56.5 C-8.2,58.2 -5.5,59.4 0,59.4 C5.5,59.4 8.2,58.2 8.2,56.5"
            fill="none"
            stroke={p.plinthHi}
            strokeWidth="0.4"
            opacity="0.55"
          />
        </g>

        {/* 3.3 绘本风温润主炉舱 (Clean Warm Firebox: 消除生硬外黑边，纯粹温润体量感) */}
        <g id="cast-iron-firebox-chamber">
          {/* 左侧微折受光面 */}
          <polygon
            points="-7.2,40.5 -8.2,43.0 -8.2,57.2 -7.2,56.6"
            fill={p.facetLeft}
            stroke={p.facetLeftStroke}
            strokeWidth="0.2"
            strokeLinejoin="round"
          />
          {/* 右侧微折背光面 */}
          <polygon
            points="7.2,40.5 8.2,43.0 8.2,57.2 7.2,56.6"
            fill={p.facetRight}
            stroke={p.facetRightStroke}
            strokeWidth="0.2"
            strokeLinejoin="round"
          />
          {/* 正面温润珐琅/铸铁大色块 (宽阔稳重，下沉重心) */}
          <rect
            x="-8.2"
            y="42.8"
            width="16.4"
            height="14.4"
            rx="1.5"
            fill={`url(#${p.bodyGradId})`}
            stroke={p.frontFaceStroke}
            strokeWidth="0.2"
          />
          {/* 陶土色专属：细腻哑光陶土微矿物肌理 */}
          {color === 'terracotta' && (
            <rect
              x="-8.2"
              y="42.8"
              width="16.4"
              height="14.4"
              rx="1.5"
              fill="url(#terracottaClayStipple)"
              pointerEvents="none"
            />
          )}
        </g>

        {/* 3.4 敦厚稳重的小短腿 (Sturdy Stout Hearth Legs: 短而粗壮，告别细长机械感) */}
        <g id="cast-iron-front-legs">
          {/* 左前粗短腿 */}
          <g id="leg-front-left">
            <path
              d="M-5.6,58.0 C-7.0,60.2 -8.0,63.0 -8.8,65.6 C-7.2,65.8 -6.2,65.8 -5.2,65.6 C-4.8,63.2 -4.2,60.5 -3.8,58.0 Z"
              fill={p.legsFrontLeft}
              stroke={p.legsFrontLeftStroke}
              strokeWidth="0.2"
            />
            <ellipse cx="-7.2" cy="65.6" rx="2.0" ry="0.75" fill={p.footPadLeft} stroke="#141f17" strokeWidth="0.2" />
          </g>
          {/* 右前粗短腿 */}
          <g id="leg-front-right">
            <path
              d="M5.6,58.0 C7.0,60.2 8.0,63.0 8.8,65.6 C7.2,65.8 6.2,65.8 5.2,65.6 C4.8,63.2 4.2,60.5 3.8,58.0 Z"
              fill={p.legsFrontRight}
              stroke={p.legsFrontRightStroke}
              strokeWidth="0.2"
            />
            <ellipse cx="7.2" cy="65.6" rx="2.0" ry="0.75" fill={p.footPadRight} stroke="#101812" strokeWidth="0.2" />
          </g>
        </g>

        {/* 3.5 吉卜力绘本风宽宏大圆拱透景炉门与旺盛跳动大炉火 (Grand Arched Fireplace with Full View) */}
        <g id="cast-iron-arched-door">
          {/* 宽敞拱形炉门大外框 (开阔大视窗，气派沉稳) */}
          <path
            d="M-6.8,56.2 L-6.8,47.0 Q-6.8,41.8 0,41.8 Q6.8,41.8 6.8,47.0 L6.8,56.2 Z"
            fill={p.doorFrame}
            stroke={p.doorFrameStroke}
            strokeWidth="0.35"
          />
          {/* 内门框柔和高光导角 */}
          <path
            d="M-6.2,47.0 Q-6.2,42.6 0,42.6 Q6.2,42.6 6.2,47.0"
            fill="none"
            stroke={p.doorHi}
            strokeWidth="0.35"
            opacity="0.65"
          />

          {/* 复古黄铜小圆环拉手 */}
          <circle cx="5.6" cy="49.8" r="0.8" fill="none" stroke="#d97706" strokeWidth="0.35" />
          <circle cx="5.6" cy="49.3" r="0.38" fill="#fbbf24" />

          {/* 拱形玻璃视窗内部：使用宽阔大 clipPath 展现治愈大火苗 */}
          <g clipPath="url(#stoveDoorGlassClip)">
            {/* 深色温暖内炉膛 */}
            <path
              d="M-5.8,55.4 L-5.8,47.0 Q-5.8,42.8 0,42.8 Q5.8,42.8 5.8,47.0 L5.8,55.4 Z"
              fill="#120803"
            />
            {/* 炉膛深处漫射红光漫晕 (Deep Firebox Radiance) */}
            <path
              d="M-5.8,55.4 L-5.8,47.0 Q-5.8,42.8 0,42.8 Q5.8,42.8 5.8,47.0 L5.8,55.4 Z"
              fill="url(#fireboxBackglow)"
            />

            {/* 底部扎实交错的燃木粗柴堆 (Cozy Criss-Cross Wood Logs) */}
            <line x1="-5.0" y1="55.2" x2="4.6" y2="54.8" stroke="#361a08" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="-4.6" y1="53.6" x2="4.2" y2="55.4" stroke="#241105" strokeWidth="1.9" strokeLinecap="round" />
            <line x1="-4.2" y1="53.8" x2="3.8" y2="55.2" stroke="#502810" strokeWidth="1.3" strokeLinecap="round" />
            {/* 木柴年轮切面 */}
            <circle cx="-4.4" cy="53.6" r="0.65" fill="#d2ab82" stroke="#2c1405" strokeWidth="0.18" />
            <circle cx="-4.4" cy="53.6" r="0.25" fill="#e07128" />
            <circle cx="4.0" cy="55.0" r="0.5" fill="#c49a6f" stroke="#2c1405" strokeWidth="0.18" />

            {/* 宽阔炽热红旺余烬床 (Wide Radiant Ember Bed) */}
            <ellipse cx="0" cy="55.0" rx="5.4" ry="1.4" fill="#c2410c" opacity="0.92" className="animate-pulse" />
            <ellipse cx="0" cy="54.6" rx="4.5" ry="1.1" fill="#ea580c" opacity="0.95" className="animate-[pulse_1.7s_infinite]" />
            <ellipse cx="0" cy="54.2" rx="3.4" ry="0.85" fill="#f59e0b" opacity="0.95" className="animate-[pulse_1.2s_infinite]" />
            <ellipse cx="0" cy="53.8" rx="2.2" ry="0.5" fill="#fef08a" opacity="0.9" />

            {/* --- 旺盛充盈的大火苗系统 (Roaring Full Fireplace Flames) --- */}
            {/* 1. 外层宽大翻滚的赤橙主火焰 (饱满升腾，覆盖宽视窗) */}
            <path
              d="M-5.0,54.6 Q-5.6,47.8 -3.4,44.8 Q-2.6,42.5 -1.0,43.8 Q0.0,41.2 1.8,42.6 Q3.4,41.4 3.8,44.6 Q5.2,47.8 4.6,54.6 Q2.4,55.4 0,55.0 Q-2.4,55.4 -5.0,54.6 Z"
              fill="#ea580c"
              className="animate-[pulse_1.5s_infinite]"
            />

            {/* 2. 中外层活跃跳跃的鲜橙火舌 (左右交错摇曳，富有生命力) */}
            <path
              d="M-4.2,54.4 C-5.0,48.6 -3.2,45.4 -1.8,42.8 C-0.8,41.2 0.5,42.6 1.0,41.8 C2.2,40.4 3.4,43.0 4.0,46.5 C4.6,50.2 4.0,54.4 2.0,54.8 C0,54.6 -2.0,54.8 -4.2,54.4 Z"
              fill="#f97316"
              className="animate-[bounce_1.3s_infinite]"
            />

            {/* 3. 两侧簇拥的灵动火舌 */}
            {/* 左侧灵动小火舌 */}
            <path
              d="M-4.0,54.2 Q-4.6,49.8 -3.0,47.6 Q-2.4,46.0 -2.0,48.2 Q-2.6,51.8 -3.0,54.2 Z"
              fill="#fb923c"
              className="animate-[bounce_1.6s_infinite]"
            />
            {/* 右侧飘逸小火舌 */}
            <path
              d="M3.8,54.2 Q4.4,50.0 3.0,47.2 Q2.2,45.8 2.0,48.0 Q3.0,51.2 3.0,54.2 Z"
              fill="#fb923c"
              className="animate-[bounce_1.1s_infinite]"
            />

            {/* 4. 中层核心金黄烈焰 (Vibrant Golden Fire) */}
            <path
              d="M-3.0,54.0 Q-3.4,48.2 -1.2,45.2 Q0.2,42.8 1.4,44.8 Q2.5,43.2 2.5,47.0 Q3.2,50.8 2.6,54.0 Q1.4,54.5 0,54.2 Q-1.4,54.5 -3.0,54.0 Z"
              fill="#facc15"
              className="animate-[bounce_1.0s_infinite]"
            />

            {/* 5. 核心炽热白黄色极温火芯 (White-Hot Core) */}
            <path
              d="M-2.0,53.8 Q-2.2,49.2 -0.5,47.0 Q0.2,45.5 1.0,47.2 Q1.6,46.0 1.8,48.8 Q2.0,51.8 1.5,53.8 Q0.7,54.2 0,54.0 Q-0.7,54.2 -2.0,53.8 Z"
              fill="#fef08a"
              className="animate-[pulse_0.9s_infinite]"
            />
            <ellipse cx="0" cy="52.2" rx="1.2" ry="2.0" fill="#ffffff" opacity="0.92" />

            {/* 6. 轻盈升腾的灵动微小火星 (Dancing Spark Embers) */}
            <g id="fire-embers-rising" className="opacity-85">
              <circle cx="-2.0" cy="44.2" r="0.32" fill="#fef08a" className="animate-[ping_1.8s_infinite]" />
              <circle cx="2.2" cy="43.4" r="0.28" fill="#fde047" className="animate-[ping_2.2s_infinite]" />
              <circle cx="0.4" cy="42.0" r="0.34" fill="#fb923c" className="animate-[ping_1.5s_infinite]" />
              <circle cx="-0.8" cy="41.5" r="0.24" fill="#fef08a" className="animate-[ping_2.5s_infinite]" />
            </g>

            {/* 柔和透景玻璃微反光 */}
            <polygon points="-4.8,54.6 -2.0,44.2 -1.2,44.2 -3.8,54.6" fill="#ffffff" opacity="0.08" />
          </g>
        </g>

        {/* 3.6 温润复古顶盖置物台 (Soft Rounded Top Mantel) */}
        <g id="cast-iron-top-shelf">
          <path
            d="M-8.4,41.6 L8.4,41.6 C8.8,41.6 9.0,42.4 8.6,42.8 L7.6,43.4 L-7.6,43.4 L-8.6,42.8 C-9.0,42.4 -8.8,41.6 -8.4,41.6 Z"
            fill={p.topShelfFront}
            stroke={p.topShelfFrontStroke}
            strokeWidth="0.3"
          />
          <polygon
            points="-8.4,41.6 8.4,41.6 7.2,37.6 -7.2,37.6"
            fill={p.topShelfFlat}
            stroke={p.topShelfFlatStroke}
            strokeWidth="0.4"
            strokeLinejoin="round"
          />
          <line x1="-8.2" y1="41.6" x2="8.2" y2="41.6" stroke={p.topShelfHi} strokeWidth="0.5" strokeLinecap="round" />

          {/* 保温小陶瓷杯 (Warming Cozy Ceramic Mug with Storybook Steam) */}
          <g id="shelf-warming-mug" transform="translate(4.8, 39.0)">
            <ellipse cx="0" cy="0.4" rx="2.2" ry="0.9" fill={p.mugShadow} opacity="0.38" />
            <ellipse cx="0" cy="0.1" rx="1.8" ry="0.7" fill={p.mugBase} />
            <path d="M-1.8,0.1 L-1.8,-4.2 L1.8,-4.2 L1.8,0.1 Z" fill={p.mugWall} stroke={p.mugStroke} strokeWidth="0.3" />
            <line x1="-1.3" y1="-3.9" x2="-1.3" y2="-0.2" stroke={p.mugHi} strokeWidth="0.4" strokeLinecap="round" />
            <path d="M1.8,-3.5 C3.0,-3.5 3.0,-0.8 1.8,-0.8" fill="none" stroke={p.mugHandle} strokeWidth="0.7" strokeLinecap="round" />
            <ellipse cx="0" cy="-4.2" rx="1.8" ry="0.7" fill={p.mugRim} stroke={p.mugStroke} strokeWidth="0.3" />
            <ellipse cx="0" cy="-4.2" rx="1.4" ry="0.5" fill={p.mugLiquid} />

            {/* 绘本感轻柔微卷蒸气 (Storybook Curling Steam) */}
            <path
              d="M-0.2,-5.5 Q-1.2,-8.5 0,-11.0 Q1.2,-13.5 -0.2,-16.0"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.6"
              opacity="0.7"
              strokeLinecap="round"
              className="animate-[pulse_2.2s_infinite]"
            />
            <path
              d="M0.6,-6.0 Q1.5,-9.0 0.4,-11.8 Q-0.6,-14.5 0.5,-17.0"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.45"
              opacity="0.5"
              strokeLinecap="round"
              className="animate-[bounce_2.6s_infinite]"
            />
          </g>

          {/* 烟囱底圈收口 (Flue Collar Adapter: 柔和圆角微环) */}
          <g id="flue-collar-base">
            <ellipse cx="0" cy="39.4" rx="2.8" ry="1.1" fill={p.flueCollarBase} stroke="#14100e" strokeWidth="0.3" />
            <ellipse cx="0" cy="38.0" rx="2.5" ry="1.0" fill={p.flueCollarTop} stroke="#181412" strokeWidth="0.3" />
            <path d="M-2.5,38.0 L-2.8,39.4 L2.8,39.4 L2.5,38.0 Z" fill={p.flueCollarBody} />
          </g>
        </g>
      </g>

      {/* --- 4. CYLINDRICAL CHIMNEY FLUE (轻盈排烟管: 直通天花板屋脊, 消除大黑粗铁柱压迫感) --- */}
      <g id="cast-iron-cylindrical-chimney">
        {/* 墙面微弱漫反射柔光阴影 (消除硬边缘切墙感) */}
        <rect
          x={pipeX + 0.6}
          y="-86.6"
          width={pipeWidth + 0.8}
          height={topCollarY - (-86.6)}
          fill="#2b1f17"
          opacity="0.18"
          filter="url(#softShadow)"
        />

        <rect
          x={pipeX}
          y="-86.6"
          width={pipeWidth}
          height={topCollarY - (-86.6)}
          fill={`url(#${p.pipeGradId})`}
          stroke="#2d221c"
          strokeWidth="0.3"
        />

        {/* 柔和哑光高光线 (温暖漫光) */}
        <line
          x1={pipeX + 0.8}
          y1="-86.6"
          x2={pipeX + 0.8}
          y2={topCollarY}
          stroke="#c2ab95"
          strokeWidth="0.4"
          opacity="0.3"
        />

        {/* 极简精致微环 (Minimalist Decorative Pipe Bands: 替换原先厚重的大金属凸缘) */}
        <g id="pipe-joint-rings">
          <ellipse cx="0" cy="-10.0" rx={pipeWidth / 2 + 0.2} ry="0.6" fill="#3d2f26" stroke="#241a14" strokeWidth="0.25" />
          <ellipse cx="0" cy="-48.0" rx={pipeWidth / 2 + 0.2} ry="0.6" fill="#3d2f26" stroke="#241a14" strokeWidth="0.25" />
        </g>

        {/* 天花板原木穿透套环 (Warm Oak Ceiling Ring: 与屋顶木梁自然衔接) */}
        <g id="ceiling-trim-ring" transform="translate(0, -90)">
          <rect x="-4.8" y="0" width="9.6" height="4.2" rx="1.0" fill="#523620" stroke="#382314" strokeWidth="0.5" />
          <line x1="-3.8" y1="2.0" x2="3.8" y2="2.0" stroke="#8c5f39" strokeWidth="0.5" strokeLinecap="round" />
          <ellipse cx="0" cy="4.2" rx="3.2" ry="1.0" fill="#26170d" opacity="0.25" />
        </g>
      </g>

      {/* --- 5. INTERACTIVE HARMONIOUS COLOR PALETTE SELECTOR (低调优雅的微型温润原木悬浮色卡：默认隐匿，仅在暖炉区域鼠标悬停时柔和渐显) --- */}
      {showSwitchUI && (
        <g
          id="stove-color-palette-dock"
          transform="translate(0, 78)"
          className="select-none opacity-0 group-hover/stove:opacity-100 transition-opacity duration-300 pointer-events-auto"
        >
          {/* Main Discreet Floating Wooddock Plaque */}
          <rect
            x="-38"
            y="-6.5"
            width="76"
            height="13"
            rx="6.5"
            fill="#1e1812"
            fillOpacity="0.88"
            stroke="#453526"
            strokeWidth="0.6"
            filter="url(#softShadow)"
          />

          {/* 4 Harmonious Palette Swatch Buttons */}
          {(['terracotta', 'walnut', 'sage', 'charcoal'] as StoveColorVariant[]).map((variantKey, index) => {
            const pal = STOVE_PALETTES[variantKey];
            const isSelected = color === variantKey;
            // Center the 4 circles at x: -22.5, -7.5, +7.5, +22.5
            const cx = -22.5 + index * 15;
            return (
              <g
                key={variantKey}
                className="cursor-pointer group/swatch"
                onClick={(e) => handlePaletteClick(variantKey, e)}
              >
                {/* Active Outer Ring */}
                {isSelected && (
                  <circle
                    cx={cx}
                    cy="0"
                    r="4.6"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="0.9"
                  />
                )}
                {/* Swatch Circle */}
                <circle
                  cx={cx}
                  cy="0"
                  r="3.4"
                  fill={pal.swatch}
                  stroke={isSelected ? '#ffffff' : '#33271d'}
                  strokeWidth={isSelected ? '0.8' : '0.5'}
                />
              </g>
            );
          })}
        </g>
      )}
    </g>
  );
};
