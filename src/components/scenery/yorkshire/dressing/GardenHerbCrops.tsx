import type { YorkshireSceneTheme } from '../landscapeTypes';

type HerbCrop = 'scallion' | 'garlic' | 'shanghaiGreen' | 'cilantro';
const GREENS = {
  day: {
    scallion: ['#365f3b','#65934a','#9dbb63'],
    garlic: ['#435f3d','#7c995a','#b0c07a'],
    shanghaiGreen: ['#244c32','#467b3d','#8bad57'],
    cilantro: ['#3e6531','#72a044','#afc86a'],
  },
  dusk: {
    scallion: ['#435e32','#788d43','#acb260'],
    garlic: ['#4c5e37','#8c9453','#b9b472'],
    shanghaiGreen: ['#324c2d','#59743a','#9da153'],
    cilantro: ['#4b622e','#85963f','#babd64'],
  },
  night: {
    scallion: ['#324c37','#56794a','#869f60'],
    garlic: ['#3c4e39','#687f54','#93a174'],
    shanghaiGreen: ['#293f32','#446347','#78905e'],
    cilantro: ['#354d32','#618047','#93a96b'],
  },
} as const;

/** A curved tube of stable diameter; only its final quarter narrows to a tip. */
function scallionTube(base: number, tipX: number, tipY: number, bendX: number, bendY: number) {
  const samples = Array.from({length:17},(_,i) => {
    const t=i/16, q=1-t;
    const x=q*q*q*base+3*q*q*t*(base-.5)+3*q*t*t*bendX+t*t*t*tipX;
    const y=q*q*q*-1.5+3*q*q*t*-7+3*q*t*t*bendY+t*t*t*tipY;
    const dx=3*q*q*-.5+6*q*t*(bendX-base+.5)+3*t*t*(tipX-bendX);
    const dy=3*q*q*-5.5+6*q*t*(bendY+7)+3*t*t*(tipY-bendY);
    const norm=Math.hypot(dx,dy)||1;
    return {x,y,nx:-dy/norm,ny:dx/norm,r:.7*(t<.75 ? 1 : (1-t)/.25)};
  });
  const ribbon = (width: number, offset: number) => {
    const edge = (side: number) => samples.map(p => `${p.x+p.nx*p.r*side*width+offset},${p.y+p.ny*p.r*side*width}`);
    return 'M'+edge(1).join(' L')+' L'+edge(-1).reverse().join(' L')+'Z';
  };
  return { silhouette:ribbon(1,0), face:ribbon(.64,-.17),
    glint:'M'+samples.slice(2,12).map(p => `${p.x-.32},${p.y}`).join(' L') };
}

/** Four distinct edible greens, attached at the root and drawn upright in scene space. */
export function GardenHerbCrop({ crop, theme, variation }: {
  crop: HerbCrop; theme: YorkshireSceneTheme; variation: number;
}) {
  const [deep,leaf,light] = GREENS[theme.isNight ? 'night' : theme.timeOfDay==='dusk' ? 'dusk' : 'day'][crop];
  const pale = theme.isNight ? '#a5ad8c' : theme.timeOfDay==='dusk' ? '#d1c79b' : '#dddcb0';
  const stalk = theme.isNight ? '#7f9468' : theme.timeOfDay==='dusk' ? '#a5af73' : '#b9cd86';
  const pose = variation%3;
  const scallionBlades = [
    [[-.8,-4.2,-16.5,-3.7,-13.5],[0,.7,-20.5,.9,-15],[.8,5.1,-14,4.3,-13]],
    [[-.7,-6.2,-11.2,-7,-15.7],[.1,-.8,-19.5,-1,-15.5],[.8,4.8,-16.3,3.8,-14.8]],
    [[-.8,-3.4,-18.7,-3.2,-15],[0,1.3,-21.3,.6,-16.5],[.8,7.1,-10.8,7.6,-16.1]],
  ][pose];
  const garlicBlades = [
    'M-.5,-3 C-2.5,-6.4 -3.9,-12.5 -7,-14.3 Q-4.3,-15.8 -2.9,-11 Q-1.2,-7.3 .7,-4Z M-.3,-6 Q-.2,-15.8 2.7,-21.5 Q.9,-15.5 1.2,-5.3Z M.5,-8 C2.4,-11.9 6.7,-15.2 9,-11.2 Q8,-12.5 5.8,-10.3 Q2.8,-7.3 .5,-6Z',
    'M-.4,-4 Q-3.2,-10.6 -7.1,-9.1 Q-7.3,-12.1 -4.3,-11.3 Q-1.7,-9.7 .6,-4.1Z M-.3,-7 C-2.5,-13.6 -1.6,-20.7 1.1,-21.8 Q-.8,-17.2 1.1,-7.5Z M.5,-10 C4.3,-17.7 8.9,-18.4 10,-13.4 Q8.3,-16.6 5.5,-12.2 Q3.2,-8.9 .5,-7.5Z',
    'M-.4,-3 Q-3,-9.4 -4.4,-17.2 Q-1.9,-16.8 -.4,-11.2 L.7,-4.5Z M-.3,-7 C-2.3,-14.5 -6.4,-18.8 -8,-14.3 Q-6.8,-16.4 -4.9,-12.1 Q-2.8,-7.7 .6,-6Z M.4,-10 Q3.8,-20.7 6.8,-20.5 Q4.2,-16.8 1.3,-8Z',
  ][pose];
  const corianderLeaves = [
    [[-6.2,-7.4,-24,0,.9],[-1.5,-9.3,-14,1,.86],[.2,-13,8,0,.92],[4.5,-10,25,0,.85],[6,-5.8,39,1,.9],[-2.8,-4,-35,0,.8]],
    [[-5.7,-9,-33,1,.9],[-2.5,-12.5,-15,0,.85],[1.8,-13.5,12,0,.8],[5.5,-8.6,24,0,.95],[2.6,-5.5,42,1,.8],[-5.3,-4.5,-48,0,.78],[.5,-8.3,6,1,.8]],
    [[-6.6,-5.1,-46,0,.87],[-4.9,-10.2,-25,0,.8],[-.7,-12.6,5,0,.85],[4.8,-10.2,21,0,.9],[6.3,-5.8,41,1,.86],[-2.9,-7.5,-16,1,.77],[1.7,-7.4,14,0,.8],[.4,-3.7,42,1,.7]],
  ][pose];
  return <g data-herb-crop={crop} data-plant-pose={pose}>
    <ellipse data-crop-ground-shadow="" cx=".5" cy=".4" rx={crop==='scallion' ? 3.3 : crop==='garlic' ? 4 : 6} ry="1.2" fill={deep} opacity=".25" />
    {crop==='scallion' && <>
      {/* Rounded tubes carry a narrow dark side, with no broad blade or central leaf vein. */}
      {scallionBlades.map(([base,tipX,tipY,bendX,bendY],i) => {
        const tube=scallionTube(base,tipX,tipY,bendX,bendY);
        return <g key={i}>
        <path d={tube.silhouette} fill={deep} />
        <path d={tube.face} fill={leaf} />
        <path d={tube.glint} fill="none" stroke={light} strokeWidth=".28" opacity=".45" strokeLinecap="round" />
        <path d={`M${base},${i===1 ? -.1 : .2} Q${base+.3},-1 ${base},${i===1 ? -2.6 : -1.9}`} fill="none" stroke={stalk} strokeWidth=".85" strokeLinecap="round" />
        <path d={`M${base-.1},0 L${base},${i===1 ? -1.3 : -.8}`} stroke={pale} strokeWidth=".55" opacity=".65" strokeLinecap="round" />
      </g>;
      })}
    </>}
    {crop==='garlic' && <>
      {/* Alternating leaves leave the short pseudostem at different heights. */}
      <path d="M-.8,.1 Q-1.3,-3 -.3,-10 Q1.4,-9.6 1,-4 Q.7,-1.2 1,.1Z" fill={leaf} />
      <path d={garlicBlades} fill={leaf} />
      <path d={[
        'M-.3,-6 Q.2,-16.1 2.7,-21.5 Q.3,-14.8 .4,-7Z M.8,-8.4 Q5.8,-15.9 9,-11.2 Q6.5,-13.6 3.4,-9Z',
        'M-.3,-7 Q-2.5,-17.2 1.1,-21.8 Q-1.5,-15.7 .5,-8Z M.8,-10 Q7,-20 10,-13.4 Q7.8,-17 4.8,-12.5Z',
        'M.4,-10 Q3.8,-20.7 6.8,-20.5 Q4.4,-18 2,-12.1Z M-.3,-7 Q-6.6,-20.4 -8,-14.3 Q-6.9,-17.9 -3.5,-10Z',
      ][pose]} fill={light} opacity=".5" />
      <path d="M-.5,.1 Q-1,-1.1 -.4,-2.8 Q.5,-3.5 .6,-1.5 Q.5,-.2 .8,.1Z" fill={stalk} />
      <path d="M-.5,-.2 Q-.8,-1 -.4,-1.7" fill="none" stroke={pale} strokeWidth=".55" opacity=".6" strokeLinecap="round" />
    </>}
    {crop==='shanghaiGreen' && (variation===4 ? <g data-crop-silhouette="paw">
      {/* An occasional compact, rounded older form among the open natural poses. */}
      {/* Keep the right petiole underneath its leaf, with no free pale tip beside the crown. */}
      <path d="M-1,.2 Q-3.7,-2.3 -3.9,-5 Q-1.3,-5.8 0,-2.4 Q1.1,-6.7 2.5,-8.2 Q3.7,-5.2 1,.2Z" fill={stalk} />
      {[[-3,-6,-30],[2,-7,28],[0,-9,-5]].map(([x,y,angle],i) => <g key={i} transform={`translate(${x} ${y})`}>
        <path d={`M${-x},${-y} Q-1,2 0,-3`} fill="none" stroke={stalk} strokeWidth={i===2 ? 2.3 : 2.1} strokeLinecap="round" />
        <g transform={`rotate(${angle} 0 -2)`}>
          <path d="M0,-1 C-3.9,-1.5 -5.5,-5 -3.4,-7.1 Q-1.1,-9.7 1.5,-7.8 Q5,-6.8 3.6,-3.8 Q2.5,-1.7 0,-1Z" fill={deep} />
          <path d="M-.4,-1.8 Q-4.2,-3.6 -2.6,-6.3 Q-1.1,-8.3 1,-6.7 Q3.5,-5.2 1.8,-3.4Z" fill={leaf} />
          <path d="M-.1,-1.6 Q.2,-4.3 -.6,-6.4" fill="none" stroke={light} strokeWidth=".55" strokeLinecap="round" />
        </g>
      </g>)}
      <path d="M0,-2 Q-2.6,-4.7 -1.3,-7 Q.9,-8.5 2,-6.1 Q2.2,-3.5 0,-2Z" fill={leaf} />
    </g> : <>
      {/* Staggered spoon leaves retain the rounded character, with one smaller front leaf. */}
      {[
        [[-.8,-8.8,-9,.8,1.06,-.2,-.6],[-3.5,-5.7,-34,1,.86,-.9,.1],[3,-6.3,29,.77,1,.7,-.2],[.7,-3.4,18,.6,.7,.3,.2]],
        [[1.1,-9.1,14,.78,1.03,.4,-.6],[-3.1,-6.5,-24,.82,1,-.7,-.2],[3.7,-4.9,43,1,.76,.9,.1],[-.8,-3.6,-21,.65,.72,-.2,.2]],
        [[-.4,-9.5,-4,.72,1.05,0,-.7],[-3.8,-4.8,-46,1,.78,-.9,.2],[2.5,-7,17,.84,1.04,.6,-.2],[1.1,-3.1,29,.6,.66,.3,.3]],
      ][pose].map(([x,y,angle,sx,sy,rootX,rootY],i) => <g key={i} transform={`translate(${x} ${y})`}>
        <path d={`M${rootX-x},${rootY-y} Q-1,1 0,-2`} fill="none" stroke={light} strokeWidth={i===3 ? 1.8 : 2.8} strokeLinecap="round" />
        <path d={`M${rootX-x-.2},${rootY-y-.1} Q-1.2,.6 -.2,-2.2`} fill="none" stroke={stalk} strokeWidth={i===3 ? 1.2 : 1.9} strokeLinecap="round" />
        <g transform={`rotate(${angle} 0 -2) translate(0 -2) scale(${sx} ${sy}) translate(0 2)`}>
        <path d="M0,-1 C-3.9,-1.5 -5.5,-5 -3.4,-7.1 Q-1.1,-9.7 1.5,-7.8 Q5,-6.8 3.6,-3.8 Q2.5,-1.7 0,-1Z" fill={deep} />
        <path d="M-.3,-1.4 C-3.4,-1.8 -4.7,-4.9 -2.9,-6.7 Q-1.1,-8.8 1.4,-7.1 Q4.4,-6.4 3,-3.8 Q1.9,-2 -.3,-1.4Z" fill={leaf} />
        <path d="M-2.5,-5.7 Q-1.7,-7.9 .3,-7 Q1.8,-6.5 1.9,-5.5 Q-.2,-6.6 -2.5,-5.7Z" fill={light} opacity=".55" />
        <path d="M-.1,-1.6 Q.2,-4.3 -.6,-6.4" fill="none" stroke={light} strokeWidth=".5" strokeLinecap="round" opacity=".8" />
        </g>
      </g>)}
    </>)}
    {crop==='cilantro' && <>
      {/* Six to eight leaflets share branching petioles, leaving small gaps inside a full crown. */}
      {[[-2,-5],[.6,-7],[2.5,-4]].map(([x,y],i) => <path key={i} d={`M0,-.5 Q${x*.3},${y*.5} ${x},${y}`}
        fill="none" stroke={leaf} strokeWidth=".8" strokeLinecap="round" />)}
      {corianderLeaves.map(([x,y,angle,profile,size],i) => <g key={i}>
        <path d={`M${[-2,.6,2.5][i%3]},${[-5,-7,-4][i%3]} Q${x*.6},${y*.8} ${x},${y}`} fill="none" stroke={leaf} strokeWidth=".55" strokeLinecap="round" />
        <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${size})`}>
          <path d={profile===0
            ? 'M0,.5 Q-1,-.9 -2.9,-1.2 Q-4.5,-1.7 -3.4,-2.7 Q-4.2,-4 -2.6,-4.1 Q-2.6,-5.6 -1.1,-4.8 Q.2,-6.4 1,-4.8 Q2.7,-5.1 2.4,-3.6 Q4,-3.1 2.8,-2 Q2.5,-1 1.3,-1 Q.5,-.6 0,.5Z'
            : 'M0,.5 C-2.4,-.8 -2.5,-3.4 -.9,-4.5 Q-.2,-6.1 .7,-4.6 Q2.3,-4.6 1.8,-3 Q3,-1.8 1.4,-1.3Z'} fill={i%3===0 ? deep : leaf} />
          <path d="M0,-.1 Q-.6,-1.7 -.4,-3.3" fill="none" stroke={i%3===0 ? leaf : light} strokeWidth=".35" opacity=".4" strokeLinecap="round" />
        </g>
      </g>)}
    </>}
  </g>;
}
