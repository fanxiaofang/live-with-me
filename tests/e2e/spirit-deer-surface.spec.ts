import {test,expect} from '@playwright/test';

test('灵鹿实际相机的近远表面深度与法线方向一致',async({page})=>{
 await page.route('**/__deer_depth_contract__',route=>route.fulfill({contentType:'text/html',body:'<canvas></canvas>'}));
 await page.goto('/__deer_depth_contract__');
 // Follow Vite's resolved dependency URL, including its optimization version.
 // The node_modules folder may live above an isolated release checkout.
 const source=await (await page.request.get('/src/components/scenery/yorkshire/dressing/spiritDeerMeshRenderer.ts')).text();
 const threePath=source.match(/from\s*["']([^"']*\/(?:three|three\.module)\.js[^"']*)["']/)?.[1];
 expect(threePath).toBeTruthy();
 const samples=await page.evaluate(async(threePath)=>{
  const rendererPath='/src/components/scenery/yorkshire/dressing/spiritDeerMeshRenderer.ts';
  const T=await import(threePath),{createSpiritDeerCamera,SPIRIT_NEAR_SIDE,SPIRIT_FAR_SIDE}=await import(rendererPath);
  const renderer=new T.WebGLRenderer({canvas:document.querySelector('canvas'),preserveDrawingBuffer:true});renderer.setSize(256,256);
  const camera=createSpiritDeerCamera();camera.updateMatrixWorld(true);
  const scene=new T.Scene(),geometry=new T.SphereGeometry(8,40,32),material=new T.ShaderMaterial({
   vertexShader:'varying vec3 p;varying vec3 n;void main(){p=position;n=normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
   fragmentShader:'varying vec3 p;varying vec3 n;void main(){gl_FragColor=vec4(p.z/32.+.5,n.z*.5+.5,0.,1.);}',
  }),mesh=new T.Mesh(geometry,material);mesh.position.y=-60;scene.add(mesh);
  const center=mesh.position.clone().project(camera),x=Math.floor((center.x+1)*128),y=Math.floor((center.y+1)*128),gl=renderer.getContext(),out:{depth:number;normal:number}[]=[];
  for(const side of [SPIRIT_NEAR_SIDE,SPIRIT_FAR_SIDE]){
   material.side=side;material.needsUpdate=true;renderer.render(scene,camera);const pixel=new Uint8Array(4);gl.readPixels(x,y,1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixel);
   out.push({depth:(pixel[0]/255-.5)*32,normal:pixel[1]/255*2-1});
  }
  geometry.dispose();material.dispose();renderer.dispose();return out;
 },threePath);
 expect(samples[0].depth).toBeGreaterThan(6);expect(samples[1].depth).toBeLessThan(-6);
 expect(samples[0].normal).toBeGreaterThan(.8);expect(samples[1].normal).toBeLessThan(-.8);
});
