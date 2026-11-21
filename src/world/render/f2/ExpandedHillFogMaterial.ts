import * as THREE from 'three';
import { meadowHillSurfaceY } from '../../scene/meadowFoothill';

/** A separate C+ material: preserve C's kernel, add localized volume outside it. */
export function createExpandedHillFogMaterial(original: THREE.ShaderMaterial) {
  const bytes = new Uint8Array(256 * 4);
  for (let i = 0; i < 256; i++) {
    bytes[i * 4] = Math.round((meadowHillSurfaceY(90 + i / 255 * 900, 0) ?? 247) / 300 * 255);
    bytes[i * 4 + 3] = 255;
  }
  const crown = new THREE.DataTexture(bytes, 256, 1);
  crown.minFilter = crown.magFilter = THREE.LinearFilter;
  crown.needsUpdate = true;
  const material = original.clone();
  material.uniforms.uCrown = { value: crown };
  let source = original.fragmentShader;
  const replace = (from: string, to: string) => {
    if (!source.includes(from)) throw new Error('C+ fog extension no longer matches the C shader');
    source = source.replace(from, to);
  };
  replace('void main(){', `
    uniform sampler2D uCrown;
    float expandedDensity(vec3 p,float rearVisible){
      // Lower flanks spread outward; C's original four centers stay intact.
      float sides=.70*pocket(p,vec3(106.,3.,26.),vec3(63.,6.,19.))
        +.66*pocket(p,vec3(952.,4.,45.),vec3(63.,7.,20.));
      float ground=smoothstep(-3.,2.,p.y+1.6*sin(p.x*.041));
      // Small offset pockets toward the crop, never attached to its boundary.
      float front=.34*pocket(p,vec3(282.,-6.,21.),vec3(75.,6.,20.))
        +.44*pocket(p,vec3(513.,-8.,47.),vec3(94.,7.,23.))
        +.30*pocket(p,vec3(747.,-5.,33.),vec3(75.,6.,20.));
      float frontGround=smoothstep(-14.,-9.,p.y+sin(p.x*.035));
      // Low hollows at the outer slope corners, behind the accepted hill crown.
      float rear=.40*pocket(p,vec3(162.,18.,35.),vec3(69.,7.,21.))
        +.35*pocket(p,vec3(925.,16.,51.),vec3(67.,6.,19.));
      float n=fbm(vec3(p.x*.032,p.y*.14,p.z*.072));
      return (sides*ground+front*frontGround+rear*rearVisible)*smoothstep(.38,.75,n)*.052;
    }
    void main(){`);
  replace('if(local.x<90.||local.x>990.)discard;', 'if(local.x<30.||local.x>1050.)discard;');
  replace('float t=(local.x-90.)/900.;', 'float t=clamp((local.x-90.)/900.,0.,1.);');
  replace('if(local.y<foot-23.||local.y>foot+10.)discard;', `
    if(local.y<foot-42.||local.y>foot+29.)discard;
    bool inOriginal=local.x>=90.&&local.x<=990.&&local.y>=foot-23.&&local.y<=foot+10.;
    float crown=texture2D(uCrown,vec2(t,.5)).r*300.;
    float rearVisible=1.-smoothstep(crown-2.,crown+.5,local.y);`);
  replace('float d=density(p);', 'float d=inOriginal?density(p):0.;');
  replace('if(alpha<.001)discard;', '');
  replace('gl_FragColor=vec4(light/max(alpha,.0001),alpha);', `
    float extraT=1.; vec3 extraLight=vec3(0.);
    for(int j=0;j<32;j++){
      float z=(float(j)+.5)*2.25;
      vec3 p=vec3(local.x,foot-local.y+4.-z*.075,z);
      float d=expandedDensity(p,rearVisible);
      float a=1.-exp(-d*2.25);
      float shadow=exp(-40.*expandedDensity(p+vec3(-8.,4.,-3.),rearVisible));
      vec3 color=mix(uAmbient,uSun,.48*shadow);
      extraLight+=extraT*a*color;
      extraT*=1.-a;
    }
    light=extraLight+light*extraT;
    alpha=1.-(1.-alpha)*extraT;
    if(alpha<.001)discard;
    gl_FragColor=vec4(light/max(alpha,.0001),alpha);`);
  material.fragmentShader = source;
  return { material, dispose() { material.dispose(); crown.dispose(); } };
}
