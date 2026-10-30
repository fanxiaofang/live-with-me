import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{PNG}=require(path.join(path.dirname(require.resolve('playwright-core/package.json')),'lib/utilsBundle.js'));
const dir='docs/visual-system/field-edges/',r=JSON.parse(await fs.readFile(dir+'verification.json','utf8'));
async function compare(ap,bp,bands){
 const a=PNG.sync.read(await fs.readFile(ap)),b=PNG.sync.read(await fs.readFile(bp));
 let maxDelta=0,changedAtZero=0,changedAtOne=0,changedAtTwo=0,outsideAtOne=0,outsideAtTwo=0,maxOutsideDelta=0;
 for(let y=0;y<a.height;y++)for(let x=0;x<a.width;x++){
  const i=(y*a.width+x)*4,d=Math.max(...[0,1,2].map(k=>Math.abs(a.data[i+k]-b.data[i+k])));
  const inside=bands.some(([lo,hi])=>y>=lo&&y<=hi);
  maxDelta=Math.max(maxDelta,d);if(d>0)changedAtZero++;if(d>1)changedAtOne++;if(d>2)changedAtTwo++;
  if(!inside){maxOutsideDelta=Math.max(maxOutsideDelta,d);if(d>1)outsideAtOne++;if(d>2)outsideAtTwo++;}
 }
 return{maxDelta,changedAtZero,changedAtOne,changedAtTwo,outsideAtOne,outsideAtTwo,maxOutsideDelta};
}
const report={thresholdMeaning:'A tolerance N counts pixels with any RGB channel difference > N/255.',pairs:[]};
report.priorAB=await compare('docs/visual-system/f2-trees/overview-ab.png',dir+'overview-original.png',[]);
for(const s of r.scenarios)for(const[mode,v]of Object.entries(s.views)){
 if(mode==='original')continue;
 report.pairs.push({scene:s.id,mode,...await compare(dir+s.views.original.image,dir+v.image,[...Object.values(v.bands),...Object.values(s.views.original.bands)])});
}
report.passed=report.priorAB.maxDelta<=1&&report.pairs.every(p=>p.maxOutsideDelta<=2);
await fs.writeFile(dir+'raster-precision.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));process.exitCode=report.passed?0:1;
