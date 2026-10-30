// Long unequal runs, with a continuous slope instead of many short rounded corners.
// Only the foot spreads sideways; the crown retains the existing height and location.
const profile=[[90,0],[200,24],[330,105],[420,154],[490,170],[590,146],[735,78],[870,20],[990,0]];
export const MEADOW_FOOTHILL={start:90,end:990,peak:490,height:.65} as const;
const secants=profile.slice(1).map((p,i)=>(p[1]-profile[i][1])/(p[0]-profile[i][0]));
const tangents=profile.map((_,i)=>{
  if(i===0 || i===profile.length-1 || secants[i-1]*secants[i]<=0)return 0;
  return 2/(1/secants[i-1]+1/secants[i]);
});
export function meadowHillRelief(x:number) {
  if(x<=MEADOW_FOOTHILL.start || x>=MEADOW_FOOTHILL.end)return 0;
  const i=profile.findIndex(p=>p[0]>x)-1,a=profile[i],b=profile[i+1];
  const span=b[0]-a[0],t=(x-a[0])/span;
  return (2*t**3-3*t*t+1)*a[1]+(t**3-2*t*t+t)*span*tangents[i]
    +(-2*t**3+3*t*t)*b[1]+(t**3-t*t)*span*tangents[i+1];
}
export function meadowHillSurfaceY(x:number,depth:number,height=.65) {
  if(x<MEADOW_FOOTHILL.start || x>MEADOW_FOOTHILL.end)return undefined;
  const t=(x-MEADOW_FOOTHILL.start)/(MEADOW_FOOTHILL.end-MEADOW_FOOTHILL.start);
  const foot=247+21*Math.sin(Math.PI*t)-5*t;
  return foot-meadowHillRelief(x)*height*(1-Math.max(0,Math.min(1,depth)));
}
/** A broad turn of the hillside, independent of every change in its outline. */
export function meadowHillNormal(x:number,depth:number,relief=1) {
  const turn=Math.tanh((x-515)/185);
  const n=[turn*.48*(1-depth*.45)*relief,1,(.30+depth*.18)*relief];
  const length=Math.hypot(...n);
  return n.map(v=>v/length);
}
export function meadowHillPath(height=.65) {
  const xs=Array.from({length:181},(_,i)=>90+i*5);
  return 'M '+xs.map(x=>`${x},${meadowHillSurfaceY(x,0,height)}`).join(' L ')
    +' L '+xs.reverse().map(x=>`${x},${meadowHillSurfaceY(x,1,height)}`).join(' L ')+' Z';
}

export const MEADOW_HILL_FARM={x:530,depth:.54};
export const MEADOW_HILL_WINDMILL={x:475,depth:.105};

// Accepted 22-tree layout. Keep the stable IDs and placements from the reviewed scene.
const groves=[
  {group:'foot-west',data:[[218,.68,.51,'pine'],[236,.91,.58,'broadleaf'],[247,.57,.55,'birch'],[260,.82,.54,'pine']]},
  {group:'foot-middle',data:[[361,.58,.54,'birch'],[375,.78,.64,'broadleaf'],[397,.89,.61,'pine'],[413,.66,.64,'broadleaf'],[431,.95,.54,'pine']]},
  {group:'foot-east',data:[[630,.62,.51,'pine'],[646,.83,.63,'pine'],[657,.56,.54,'birch'],[697,.91,.56,'pine'],[707,.68,.53,'birch']]},
  {group:'upper-west',data:[[365,.11,.46,'birch'],[385,.065,.52,'broadleaf'],[405,.13,.46,'pine'],[421,.21,.49,'birch']]},
  {group:'upper-east',data:[[568,.17,.44,'birch'],[588,.24,.50,'broadleaf']]},
  {group:'middle-slope',data:[[328,.45,.46,'birch'],[610,.57,.5,'pine']]},
] as const;
export const MEADOW_HILL_TREES=groves.flatMap(({group,data})=>data.map(([x,depth,scale,species],i)=>({
  id:`shoulder-${group}-${i}`,group,x,depth,scale,species,
})));
