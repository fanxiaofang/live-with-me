export const SOURCE_VIEWBOX={width:1200,height:800};
export const OVERVIEW={x:0,y:135,zoom:.66};
export const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
export function sliceViewport(width,height,source=SOURCE_VIEWBOX){
 if(![width,height,source.width,source.height].every(v=>Number.isFinite(v)&&v>0))throw Error('viewport尺寸必须为正数');
 const scale=Math.max(width/source.width,height/source.height),offsetX=(width-source.width*scale)/2,offsetY=(height-source.height*scale)/2;
 return {scale,offsetX,offsetY,visible:{minX:-offsetX/scale,maxX:(width-offsetX)/scale,minY:-offsetY/scale,maxY:(height-offsetY)/scale}};
}
export function sourceToScreen(p,camera,viewport,source=SOURCE_VIEWBOX){
 const s=sliceViewport(viewport.width,viewport.height,source),ox=source.width/2,oy=source.height/2;
 return {x:s.offsetX+s.scale*(ox+camera.zoom*(p.x-ox)+camera.x),y:s.offsetY+s.scale*(oy+camera.zoom*(p.y-oy)+camera.y)};
}
// Pure protocol adapter. Accepts sampled Camera values; never installs DOM input handlers.
export function WorldViewAdapter({camera,viewport,sourceViewBox=SOURCE_VIEWBOX,isDragging=false,isTransitioning=false},response={pan:0,zoom:0}){
 if(!camera||![camera.x,camera.y,camera.zoom].every(Number.isFinite)||camera.zoom<.45||camera.zoom>2.5)throw Error('非法Camera');
 const slice=sliceViewport(viewport.width,viewport.height,sourceViewBox);
 const unit=2/viewport.height;
 return {...slice,sourceViewBox,viewport,isDragging,isTransitioning,
  foreground:{x:camera.x,y:camera.y,zoom:camera.zoom,originX:sourceViewBox.width/2,originY:sourceViewBox.height/2},
  backdrop:{x:clamp((camera.x-OVERVIEW.x)*slice.scale*unit*response.pan,-.01,.01)+0,y:clamp(-(camera.y-OVERVIEW.y)*slice.scale*unit*response.pan,-.01,.01)+0,scale:(camera.zoom/OVERVIEW.zoom)**response.zoom}};
}
// Match source cubic-bezier(.2,.8,.2,1) by solving its x(t), not by using elapsed as t.
export function sourceEase(progress){
 const x=clamp(progress,0,1),bezier=(t,a,b)=>3*(1-t)**2*t*a+3*(1-t)*t*t*b+t*t*t;
 let lo=0,hi=1;for(let i=0;i<24;i++){const m=(lo+hi)/2;if(bezier(m,.2,.2)<x)lo=m;else hi=m;}return x===0?0:x===1?1:bezier((lo+hi)/2,.8,1);
}
export function interpolateCamera(a,b,progress){if(progress<=0)return{...a};if(progress>=1)return{...b};const t=sourceEase(progress);return{x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,zoom:a.zoom+(b.zoom-a.zoom)*t};}
export function roomCamera(viewport){
 const s=sliceViewport(viewport.width,viewport.height),w=s.visible.maxX-s.visible.minX,h=s.visible.maxY-s.visible.minY;
 const zoom=Number(Math.max(.45,Math.min(1.18,w*.86/460,h*.76/380)).toFixed(4));
 return{x:60*zoom,y:85*zoom,zoom};
}
/** CSS computed transform excludes transform-origin; m.e/m.f retain source SVG translation units. */
export function cameraFromMatrix(m){
 if(!m||![m.a,m.b,m.c,m.d,m.e,m.f].every(Number.isFinite)||Math.abs(m.b)>1e-6||Math.abs(m.c)>1e-6||Math.abs(m.a-m.d)>1e-6)throw Error('只支持当前源协议的等比CSS translate/scale');
 return {x:m.e,y:m.f,zoom:m.a};
}
export function readSourceCameraFromElement(element){
 return cameraFromMatrix(new DOMMatrixReadOnly(getComputedStyle(element).transform));
}
