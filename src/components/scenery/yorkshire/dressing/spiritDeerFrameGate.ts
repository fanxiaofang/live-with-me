/** Keep the scheduled deadline rather than throwing away the fractional frame.
 * Pose time still uses elapsed wall time; this gate only schedules rendering. */
export function createDeerFrameGate(fps=30){
 const interval=1000/fps;let next=0;
 return {reset(){next=0;},ready(time:number){
  if(next&&time+.25<next)return false;
  next=next?next+(Math.floor(Math.max(0,time-next)/interval)+1)*interval:time+interval;
  return true;
 }};
}
