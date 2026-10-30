import {createBackdrop} from '../backdrop/createBackdrop.js';
import {resolveLook,updateRidgeMaterial} from '../backdrop/ridgeMaterial.js';
import {createReliefMaterial,updateReliefMaterial} from './reliefMaterial.js';
import {validateStudy} from './VirtualReliefModel.js';
export function createF2Backdrop(container,baseline,initial,options={}){
 if(baseline.composition!=='saddle'||baseline.layers.length!==3||baseline.surfaceStyle!=='slope'||baseline.material!=='shader')throw Error('F2只接受冻结saddle三层shader基线');
 const points=baseline.layers[2].points,validInitial=validateStudy(initial,points);
 const core=createBackdrop(container,{...options,config:baseline}),index=2,mesh=core.scene.children.find(o=>o.isMesh&&o.renderOrder===index*2),original=mesh.material,relief=createReliefMaterial();
 let state,disposed=false;
 // This second material reuses the v2 color/air uniforms; no other mesh is touched.
 const hold=mesh.material;mesh.material=relief;updateRidgeMaterial(mesh,resolveLook(baseline,baseline.layers[index],index));mesh.material=hold;
 function setStudy(next){const valid=validateStudy(next,points);updateReliefMaterial(relief,valid,points);mesh.material=valid.mode==='A'&&valid.view==='beauty'?original:relief;state=valid;core.setViewState({camera:valid.camera});core.render();}
 setStudy(validInitial);
 return {core,setStudy,getStudy:()=>structuredClone(state),getTarget:()=>mesh,getReliefMaterial:()=>relief,render:core.render,resize:core.resize,setViewState:core.setViewState,getStats:core.getStats,canvas:core.canvas,
  dispose(){if(disposed)return;mesh.material=original;relief.dispose();core.dispose();disposed=true;}};
}
