import * as THREE from 'three';
import { createBakedHillFog } from './BakedHillFog';
import { createExpandedHillFogMaterial } from './ExpandedHillFogMaterial';
import { f2LandmarkTransform, type SampledWorldView } from './F2CameraAdapter';
import type { F2Placement } from './f2Config';
import { sliceViewport } from '../../coordinates/viewport';
import { LANDSCAPE_SURFACES } from '../../scene/landscapeGeometry';

/** CSS-pixel projection, owned by the hill, never by the crop boundary. */
export function projectHillFootFog(view: SampledWorldView, placement: F2Placement) {
  const s = sliceViewport(view.width, view.height), m = f2LandmarkTransform(view, placement);
  return { x: s.e + s.a * m.e,
    y: s.f + s.d * (m.f + m.d * LANDSCAPE_SURFACES.backgroundOffsetY),
    scaleX: s.a * m.a, scaleY: s.d * m.d };
}

// A localized 2.5D volume: screen rays traverse a real 3D density field.
// The accepted default caches C+ optics; original C and realtime C+ remain comparisons.
export function createHillFootFog(parent: HTMLElement, onInvalidate: () => void) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0, 0);
  const canvas = renderer.domElement;
  canvas.dataset.hillFootFog = 'webgl-raymarch';
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '1' });
  parent.append(canvas);
  const material = new THREE.ShaderMaterial({ transparent: true, depthTest: false, depthWrite: false,
    uniforms: { uViewport: { value: new THREE.Vector2() }, uDpr: { value: 1 },
      uProjection: { value: new THREE.Vector4() },
      uAmbient: { value: new THREE.Color('#b8ced5') }, uSun: { value: new THREE.Color('#f4f2dc') } },
    vertexShader: 'void main(){gl_Position=vec4(position.xy,0.,1.);}',
    fragmentShader: `
      precision highp float;
      uniform vec2 uViewport;
      uniform float uDpr;
      uniform vec4 uProjection;
      uniform vec3 uAmbient, uSun;
      float hash(vec3 p){p=fract(p*.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
      float noise3(vec3 p){
        vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),
          mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
          mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),
          mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
      }
      float fbm(vec3 p){return .57*noise3(p)+.29*noise3(p*2.03+17.)+.14*noise3(p*4.11+31.);}
      float pocket(vec3 p,vec3 center,vec3 size){vec3 q=(p-center)/size;return exp(-2.*dot(q,q));}
      float density(vec3 p){
        float banks=pocket(p,vec3(205.,4.,18.),vec3(65.,7.,16.))
          +.85*pocket(p,vec3(405.,6.,46.),vec3(74.,9.,19.))
          +.75*pocket(p,vec3(640.,3.,25.),vec3(80.,6.,18.))
          +.9*pocket(p,vec3(835.,5.,52.),vec3(60.,8.,17.));
        float n=fbm(vec3(p.x*.032,p.y*.14,p.z*.072));
        float ground=smoothstep(-3.,2.,p.y+1.6*sin(p.x*.041));
        return banks*ground*smoothstep(.38,.75,n)*.065;
      }
      void main(){
        vec2 css=gl_FragCoord.xy/uDpr;
        vec2 local=(vec2(css.x,uViewport.y-css.y)-uProjection.xy)/uProjection.zw;
        if(local.x<90.||local.x>990.)discard;
        float t=(local.x-90.)/900.;
        float foot=247.+21.*sin(3.14159265*t)-5.*t;
        if(local.y<foot-23.||local.y>foot+10.)discard;
        float transmittance=1.; vec3 light=vec3(0.);
        // Two offset depth banks are integrated along 32 samples, with
        // vertical perspective and light extinction inside each volume.
        for(int i=0;i<32;i++){
          float z=(float(i)+.5)*2.25;
          vec3 p=vec3(local.x,foot-local.y+4.-z*.075,z);
          float d=density(p);
          float alpha=1.-exp(-d*2.25);
          float shadow=exp(-40.*density(p+vec3(-8.,4.,-3.)));
          vec3 color=mix(uAmbient,uSun,.48*shadow);
          light+=transmittance*alpha*color;
          transmittance*=1.-alpha;
        }
        float alpha=1.-transmittance;
        if(alpha<.001)discard;
        gl_FragColor=vec4(light/max(alpha,.0001),alpha);
        #include <colorspace_fragment>
      }` });
  const geometry = new THREE.PlaneGeometry(2, 2);
  const scene = new THREE.Scene();
  const mesh = new THREE.Mesh(geometry, material); scene.add(mesh);
  let expanded: ReturnType<typeof createExpandedHillFogMaterial> | undefined;
  let baked: ReturnType<typeof createBakedHillFog> | undefined;
  const camera = new THREE.Camera();
  renderer.debug.onShaderError = () => { throw new Error('Hill-foot volumetric fog shader compilation failed'); };
  let width = 0, height = 0, ratio = 0;
  let frames = 0;
  const draw = () => {
    renderer.render(scene, camera);
    canvas.dataset.fogFrames = String(++frames);
  };
  const restored = () => { baked?.invalidate(); onInvalidate(); };
  canvas.addEventListener('webglcontextrestored', restored);
  return {
    /** Diagnostic fixture only; lazy-loaded so the normal scene adds no probe loop. */
    async measurePerformance(view: SampledWorldView, placement: F2Placement) {
      const { measureFogPerformance } = await import('./FogPerformanceProbe');
      return measureFogPerformance(renderer, mode => { this.render(view, placement, mode); }, draw, () => {
        baked!.invalidate(); this.render(view, placement, 'baked');
      });
    },
    render(view: SampledWorldView, placement: F2Placement, mode: 'off' | 'volume' | 'expanded' | 'baked') {
      const enabled = mode !== 'off';
      canvas.style.display = enabled ? 'block' : 'none';
      canvas.dataset.hillFootFog = mode === 'baked' ? 'baked-c-plus-optics' : mode === 'expanded' ? 'expanded-c-raymarch' : 'webgl-raymarch';
      const p = projectHillFootFog(view, placement);
      if (!enabled) return p;
      if ((mode === 'expanded' || mode === 'baked') && !expanded) expanded = createExpandedHillFogMaterial(material);
      if (mode === 'baked' && !baked) baked = createBakedHillFog(renderer, expanded!.material);
      const activeMaterial = mode === 'baked' ? baked!.material : mode === 'expanded' ? expanded!.material : material;
      mesh.material = activeMaterial;
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      if (width !== view.width || height !== view.height || ratio !== dpr) {
        width = view.width; height = view.height; ratio = dpr;
        renderer.setPixelRatio(dpr); renderer.setSize(width, height, false);
      }
      activeMaterial.uniforms.uViewport.value.set(width, height);
      activeMaterial.uniforms.uDpr.value = dpr;
      activeMaterial.uniforms.uProjection.value.set(p.x,p.y,p.scaleX,p.scaleY);
      if (mode === 'baked') baked!.ensure();
      draw();
      if (baked) canvas.dataset.fogBake = JSON.stringify(baked.stats());
      canvas.dataset.fogMotion = 'static';
      canvas.dataset.projection = JSON.stringify(p);
      return p;
    },
    dispose() {
      canvas.removeEventListener('webglcontextrestored', restored);
      geometry.dispose(); material.dispose(); baked?.dispose(); expanded?.dispose(); renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
    },
  };
}
