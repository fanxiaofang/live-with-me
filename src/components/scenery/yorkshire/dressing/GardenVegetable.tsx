import type { GardenCrop } from '../../../../features/yard-editor/yardCrops';
import type { YorkshireSceneTheme } from '../landscapeTypes';
import { GardenUprightCrop } from './GardenUprightCrops';
import { GardenLeafCrop } from './GardenLeafCrops';
import { GardenHerbCrop } from './GardenHerbCrops';
import { StrawberryPlant } from './KitchenGardenPlants';
import { GardenSaladCrop } from './GardenSaladCrops';
import { GardenPeaShoots } from './GardenPeaShoots';
import { GardenChineseCabbage } from './GardenChineseCabbage';

/** Mature tomato: soft compound foliage and full fruit, readable at scene scale. */
function TomatoPlant({ theme, variation }: { theme: YorkshireSceneTheme; variation: number }) {
  const p = theme.isNight
    ? { deep: '#304b38', leaf: '#54794b', light: '#7c9059', stem: '#60734a', wood: '#776147', woodShade: '#443d31', tie: '#9c987a', red: '#ad5949', redShade: '#804338', redLight: '#c57f5b' }
    : theme.timeOfDay === 'dusk'
      ? { deep: '#3b5831', leaf: '#68873d', light: '#9aab57', stem: '#71864b', wood: '#987142', woodShade: '#573c28', tie: '#c1ab77', red: '#d65a36', redShade: '#a6402b', redLight: '#ee9256' }
      : { deep: '#355c34', leaf: '#608b40', light: '#9bb658', stem: '#648345', wood: '#a27b49', woodShade: '#5e422c', tie: '#d0bc8b', red: '#e34d30', redShade: '#b23b29', redLight: '#fa8650' };
  const lean = (variation - 2) * .3;
  const pose = variation % 3;
  const leafAngles = [[0,0,0,0,0,0],[12,-14,-9,9,13,-8],[-11,11,14,-12,-9,10]][pose];
  const leafRoots = [[-1,-9],[-1.1,-16],[1.2,-13],[.1,-22],[1.3,-25],[-.2,-29]];
  const leafTransform = (index: number) => `rotate(${leafAngles[index]} ${leafRoots[index][0]} ${leafRoots[index][1]})`;
  const fruitClusters = [
    [[-6.1,-13,0,1.35],[6.6,-18.3,0,1.4],[-2.7,-24.1,0,1.25],[4.6,-7.6,0,1.32]],
    [[-6.8,-14.4,12,1.4],[5.5,-19.5,-14,1.28],[-3.7,-25,8,1.32],[4.9,-9.2,-9,1.35]],
    [[-5.3,-12.1,-13,1.28],[7,-17,11,1.42],[-1.6,-24.5,-7,1.3],[3.5,-7.2,13,1.4]],
  ][pose];
  return <g data-tomato-art="mature">
    <ellipse data-crop-ground-shadow="" cx=".8" cy=".4" rx="7" ry="1.7" fill={p.deep} opacity=".24" />
    <ellipse cx="-6.2" cy=".2" rx="1.8" ry=".7" fill={p.woodShade} opacity=".55" />
    <ellipse cx="6.4" cy=".3" rx="1.7" ry=".7" fill={p.woodShade} opacity=".55" />
    <path d="M-6.3,.2 L-5.2,-35 M6.4,.2 L5.4,-34 M-5.9,-7 L5.7,-26" fill="none" stroke={p.woodShade} strokeWidth="1.4" strokeLinecap="round" />
    <path d="M-6.6,-.2 L-5.5,-35 M6.1,-.2 L5.1,-34" fill="none" stroke={p.wood} strokeWidth=".85" strokeLinecap="round" />
    <path d="M-5.7,-22 Q0,-21 5.7,-22 M-6,-11.3 Q0,-10.4 6,-11.2" fill="none" stroke={p.tie} strokeWidth=".5" opacity=".8" />
    <g transform={`translate(${lean} 0)`}>
      <path d="M0,-.4 Q-1.8,-13 .2,-22 Q1,-29 -.2,-32 M-.6,-8 Q-5.5,-12 -8,-18 M-.3,-15 Q4,-18.1 8,-23 M.1,-22 Q-4,-25 -6,-29 M.2,-26 L4.7,-31" fill="none" stroke={p.deep} strokeWidth="1.6" strokeLinecap="round" />
      {/* Broad curved leaflets droop from compound sprays; dark colour stays inside the crown. */}
      <path d="M-.7,-11 C-5,-15.6 -7.9,-14.6 -7.7,-11.8 Q-7.6,-8.7 -4.4,-8.6 Q-1.8,-8.4 -.7,-11Z M.3,-18 C3.4,-22.1 6.5,-21.8 6.8,-18.9 Q7.2,-15.9 3.7,-15.2 Q1.7,-15.5 .3,-18Z M-.4,-25 Q-5.2,-29.8 -7,-27 Q-8.2,-23.5 -4,-22.4 Q-1.4,-22.7 -.4,-25Z" fill={p.deep} />
      {["M-1,-9 C-4.2,-12.3 -8.5,-13.2 -9.8,-10.5 Q-11.2,-8.1 -8.9,-6.6 Q-9,-5.8 -7.5,-5.9 Q-3.5,-5.8 -1,-9Z", "M-1.1,-16 C-2.9,-21.4 -6.3,-22.4 -8,-20 Q-9.7,-17.4 -7.3,-15.8 Q-7.5,-14.6 -6,-14.4 Q-3.3,-13.9 -1.1,-16Z", "M1.2,-13 C4.4,-16.4 8.8,-16.8 10.2,-14 Q11.8,-11.2 9.1,-10.1 Q8,-8.6 6.1,-9.4 Q3.3,-10 1.2,-13Z", "M.1,-22 C-2.1,-26 -5.1,-26.9 -6.6,-24.5 Q-8.1,-22.1 -5.7,-20.9 Q-5.5,-19.7 -4,-20 Q-1.9,-19.8 .1,-22Z", "M1.3,-25 C2.1,-30.1 5.6,-31.5 7.4,-29.2 Q9.1,-26.8 7,-25.1 Q7.2,-23.6 5.5,-23.2 Q2.9,-23 1.3,-25Z", "M-.2,-29 C-3.9,-29.5 -5,-32.1 -3.1,-33.5 Q-.9,-35 .5,-32.7 Q1.4,-30.7 -.2,-29Z"].map((d,i) => <path key={i} d={d} transform={leafTransform(i)} fill={p.leaf} />)}
      {["M-2,-9.1 Q-6,-12 -8.2,-10.4 Q-9,-9.7 -8.7,-8.8 Q-5.4,-10.2 -2,-9.1Z", "M-1.9,-16.6 Q-4.2,-20.7 -6.8,-19.5 Q-7.7,-19 -7.6,-18.1 Q-4.7,-19.1 -1.9,-16.6Z", "M2.7,-25.9 Q3.5,-29.9 6,-29.2 Q7,-28.8 7,-27.7 Q4.8,-28.2 2.7,-25.9Z", "M-.6,-30 Q-3,-30.7 -3.1,-32.2 Q-1.7,-33.1 -.6,-30Z"].map((d,i) => <path key={i} d={d} transform={leafTransform([0, 1, 4, 5][i])} fill={p.light} opacity=".72" />)}
      {["M-2,-9 Q-4.7,-9.4 -7.4,-8.1", "M-1.9,-16 Q-4.3,-18 -6.4,-17.3", "M2.4,-13 Q5.5,-13.5 8.6,-12.1", "M2.1,-25.2 Q4.5,-27 5.8,-27"].map((d,i) => <path key={i} d={d} transform={leafTransform([0, 1, 2, 4][i])} fill="none" stroke={p.stem} strokeWidth=".45" strokeLinecap="round" opacity=".7" />)}
      <path d="M0,-.5 Q-1.1,-11 .3,-20 M-1,-10 L-6,-13 M.2,-17 L6,-20" fill="none" stroke={p.stem} strokeWidth=".8" strokeLinecap="round" />
      {fruitClusters.map(([x,y,angle,size], i) => <g key={i} transform={`translate(${x} ${y}) rotate(${angle}) scale(${size})`}>
        <path d="M0,-3 L.3,-4.6" stroke={p.stem} strokeWidth=".6" />
        <path d="M-2.5,-.5 C-2.8,-2.3 -1.2,-2.9 -.2,-2.6 Q1.9,-3 2.5,-1 Q3,1.4 .9,2 Q-1.8,2.7 -2.5,-.5Z" fill={p.red} />
        <path d="M2,-1.4 Q3.3,1 .9,2 Q-1.2,2.6 -2.2,.6 Q-.5,1.9 1,.9 Q2.1,.1 2,-1.4Z" fill={p.redShade} />
        <path d="M-2.1,-.6 Q-2.2,-2.1 -.6,-2.2 Q1,-2.4 1.5,-1.1 Q1.6,-.1 .4,.2 Q-1.1,.2 -1.5,.8 Q-2.2,.5 -2.1,-.6Z" fill={p.redLight} opacity=".82" />
        <path d="M-1.7,-2.3 L-.3,-2.9 1.5,-2.2 .6,-1.8 0,-2.2 -1,-1.7Z" fill={p.deep} />
      </g>)}
      <path d="M-1.3,-19.5 Q.1,-20.2 1.2,-19.5 M-1.4,-7 Q-.1,-7.6 1,-7" fill="none" stroke={p.tie} strokeWidth=".6" />
      <path d="M-2,-.4 Q-.4,-1.8 1.8,-.4 L2.4,.3 -2,.3Z" fill={p.woodShade} opacity=".5" />
    </g>
  </g>;
}

/** A single upright plant. Only its root is projected onto the soil plane. */
export function GardenVegetable({ crop, theme, variation = 0 }: {
  crop: GardenCrop; theme: YorkshireSceneTheme; variation?: number;
}) {
  if (crop === 'peaShoots') {
    return <g data-garden-crop={crop} transform={`scale(${.94 + variation * .025} ${.96 + variation * .018})`}>
      <GardenPeaShoots theme={theme} variation={variation} />
    </g>;
  }
  if (crop === 'looseLettuce') {
    return <g data-garden-crop={crop} transform={`scale(${.94 + variation * .025} ${.96 + variation * .018})`}>
      <GardenChineseCabbage theme={theme} variation={variation} />
    </g>;
  }
  if (crop === 'waterSpinach') {
    return <g data-garden-crop={crop} transform={`scale(${.94 + variation * .025} ${.96 + variation * .018})`}>
      <GardenSaladCrop crop={crop} theme={theme} variation={variation} />
    </g>;
  }
  if (crop === 'strawberry') {
    return <g data-garden-crop={crop} transform={`scale(${.94 + variation * .025} ${.96 + variation * .018})`}>
      <StrawberryPlant theme={theme} variation={variation} />
    </g>;
  }
  if (crop === 'scallion' || crop === 'garlic' || crop === 'shanghaiGreen' || crop === 'cilantro') {
    return <g data-garden-crop={crop} transform={`scale(${.94 + variation * .025} ${.96 + variation * .018})`}>
      <GardenHerbCrop crop={crop} theme={theme} variation={variation} />
    </g>;
  }
  if (crop === 'cabbage' || crop === 'carrot' || crop === 'lettuce' || crop === 'potato') {
    return <g data-garden-crop={crop} transform={`scale(${.94 + variation * .025} ${.96 + variation * .018})`}>
      <GardenLeafCrop crop={crop} theme={theme} variation={variation} />
    </g>;
  }
  if (crop === 'corn' || crop === 'bean' || crop === 'pepper') {
    return <g data-garden-crop={crop} transform={`scale(${.94 + variation * .025} ${.96 + variation * .018})`}>
      <GardenUprightCrop crop={crop} theme={theme} variation={variation} />
    </g>;
  }
  const p = theme.isNight
    ? { dark: '#344b3d', leaf: '#567052', light: '#7d8860', vein: '#969775', root: '#966441', rootDark: '#694c37' }
    : theme.timeOfDay === 'dusk'
      ? { dark: '#4b6039', leaf: '#78894a', light: '#a2a660', vein: '#c6ba7b', root: '#bd7943', rootDark: '#8b5533' }
      : { dark: '#42663f', leaf: '#73954f', light: '#a6ba70', vein: '#d0cd91', root: '#d9934b', rootDark: '#a86737' };
  const flip = variation % 2 ? -1 : 1;
  const detail = theme.isNight
    ? { red: '#9a6651', redShade: '#745047', cream: '#a7ac8d', gold: '#aaa06b', wood: '#7b7053', woodDark: '#514e3e' }
    : theme.timeOfDay === 'dusk'
      ? { red: '#c77b4e', redShade: '#984e35', cream: '#d1c6a0', gold: '#c7ad60', wood: '#a08a5b', woodDark: '#705437' }
      : { red: '#d8784b', redShade: '#aa4c38', cream: '#e1dbb5', gold: '#d8bb65', wood: '#b19865', woodDark: '#796044' };
  return <g data-garden-crop={crop} transform={`scale(${(crop === 'tomato' ? 1 : flip) * (.94 + variation * .025)} ${.96 + variation * .018})`}>
    <ellipse data-crop-ground-shadow="" cx=".7" cy=".4" rx={crop === 'daikon' ? 3 : 5.8} ry="1.35" fill={p.dark} opacity=".28" />





    {crop === 'tomato' && <TomatoPlant theme={theme} variation={variation} />}

    {crop === 'bokChoy' && (variation===4 ? <g data-crop-silhouette="paw">
      <path d="M0,.2 Q-4.1,-.5 -4.4,-5 L-2.2,-7 -.4,-2.1 Q-.8,-7.4 .7,-8.5 Q2.6,-7.3 1,-2.2 L3.2,-7.5 5.1,-5.4 Q4.7,-.6 0,.2Z" fill={detail.cream} />
      <path d="M-3.1,-3 Q-8.7,-4.3 -6.7,-8.1 Q-3.7,-10.7 -2.2,-6.7 Q-1.5,-3.8 -3.1,-3 M.1,-4.6 Q-3,-9 -.8,-11.4 Q2.6,-12 2.5,-8.6 Q2.2,-6.2 .1,-4.6 M2.6,-3.2 Q1.7,-8 5,-9.1 Q8.5,-7.2 6.2,-4.4 Q4.8,-2.7 2.6,-3.2Z" fill={p.dark} />
      <path d="M-3.8,-4 Q-7.1,-5.8 -5.7,-7.9 Q-3.8,-9 -2.9,-6 M.1,-5.9 Q-1.6,-9 -.2,-10.1 Q1.8,-10.4 1.5,-7.9 M3.5,-4.2 Q3,-7 5.1,-7.7 Q7,-6.5 5.3,-4.7" fill={p.leaf} />
      <path d="M-.4,-1 L-.1,-7.9 M-1.3,-1.5 L-4,-5.9 M1.1,-1.4 L4.5,-5.8" fill="none" stroke={detail.cream} strokeWidth=".6" strokeLinecap="round" />
    </g> : <>
      {[
        [[.4,-7.5,5,.7,1,0,-.5],[-3.1,-4.5,-37,1,.85,-.7,.1],[3.1,-5.1,29,.8,.94,.6,-.2],[-.6,-2.5,-13,.55,.65,-.2,.2]],
        [[-.9,-7.6,-11,.7,1,-.2,-.6],[3.7,-4.2,45,.96,.8,.8,.2],[-2.6,-5.7,-23,.83,1,-.6,-.2],[.8,-2.8,24,.6,.62,.2,.3]],
        [[.8,-8.1,13,.65,1,.1,-.6],[-3.5,-4,-46,1,.8,-.8,.2],[2.6,-5.6,20,.82,.96,.6,-.3],[-1,-2.5,-25,.58,.67,-.3,.2]],
      ][variation%3].map(([x,y,angle,sx,sy,rootX,rootY],i) => <g key={i} transform={`translate(${x} ${y})`}>
        <path d={`M${rootX-x},${rootY-y} Q-.4,1.4 0,-1.8`} fill="none" stroke={p.light} strokeWidth={i===3 ? 1.3 : 2} strokeLinecap="round" />
        <path d={`M${rootX-x-.15},${rootY-y-.1} Q-.6,1.1 -.2,-1.8`} fill="none" stroke={detail.cream} strokeWidth={i===3 ? .8 : 1.25} strokeLinecap="round" />
        <g transform={`rotate(${angle} 0 -1.5) translate(0 -1.5) scale(${sx} ${sy}) translate(0 1.5)`}>
          <path d="M0,-.7 C-2.7,-1.4 -3.9,-4.1 -2.5,-5.6 Q-.6,-7.5 1.3,-5.9 Q3.8,-4.7 2.5,-2.5 Q1.7,-1.3 0,-.7Z" fill={p.dark} />
          <path d="M-.2,-1.3 Q-3,-2.7 -1.9,-4.9 Q-.8,-6.3 .9,-5.3 Q2.9,-4 1.4,-2.3Z" fill={p.leaf} />
          <path d="M-.1,-.9 Q-.4,-2.8 -.1,-4.6" fill="none" stroke={p.light} strokeWidth=".5" strokeLinecap="round" />
        </g>
      </g>)}
    </>)}
    {crop === 'daikon' && <>
      <path d="M-2.1,.1 Q-2.9,-2.5 -.4,-3.6 Q2.6,-3.8 2.3,-.1Z" fill={p.vein} />
      <path d="M-1.8,-.2 Q-2.3,-2.4 -.6,-3.1 Q1,-3.4 1.1,-1.2 L.4,0Z" fill={detail.cream} />
      {[-1,0,1].map((side,i) => <g key={side} transform={`rotate(${side*32+(variation%3-1)*(i===1 ? 5 : 9)} 0 -3)`}>
        <path d="M0,-3 C-3.2,-5 -3.8,-7 -2.1,-8 Q-4,-9.2 -2.3,-10.3 Q-3.2,-12.6 -.8,-13.3 Q.6,-15 1.7,-13 Q3.4,-12.4 2,-10.3 Q4,-8.8 2,-7.4 Q3,-5.8 0,-3Z" fill={i===0 ? p.dark : p.leaf} />
        <path d="M0,-3 Q-1.9,-6.2 -.5,-8.2 Q-2.2,-9.5 -.4,-10.8 Q-1.3,-12.7 .5,-13.4 Q2,-12.4 .7,-10.5 Q2.3,-9 .6,-7.8 Q1.3,-5.4 0,-3Z" fill={i===0 ? p.leaf : p.light} opacity=".8" />
        <path d="M0,-2.5 Q.6,-7.6 .4,-12.2 M.3,-7.2 L-1.7,-8.6 M.4,-9.3 L1.7,-10.2" fill="none" stroke={p.vein} strokeWidth=".45" strokeLinecap="round" opacity=".65" />
      </g>)}
      <path d="M-2.7,.2 Q-.1,-.4 2.8,.1" fill="none" stroke={p.rootDark} strokeWidth=".6" opacity=".45" strokeLinecap="round" />
    </>}

  </g>;
}
