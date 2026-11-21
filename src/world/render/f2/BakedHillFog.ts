import * as THREE from 'three';

// The full C+ silhouette and its transparent padding, in hill-local units.
// Screen pan/zoom only changes projection; it never changes these bake bounds.
export const FOG_BAKE_BOUNDS = { minX: 0, minY: 180, width: 1080, height: 140 } as const;
export const FOG_BAKE_STEPS = 128;

export function fogBakeUv(x: number, y: number) {
  const b = FOG_BAKE_BOUNDS;
  return { u: (x - b.minX) / b.width, v: 1 - (y - b.minY) / b.height };
}

/** Cache final integrated radiance L and opacity 1-T, not a density slice. */
export function createBakedHillFog(renderer: THREE.WebGLRenderer, source: THREE.ShaderMaterial) {
  const b = FOG_BAKE_BOUNDS;
  const width = Math.min(2160, renderer.capabilities.maxTextureSize);
  const height = Math.round(width * b.height / b.width);
  const halfFloat = renderer.extensions.has('EXT_color_buffer_float');
  const target = new THREE.WebGLRenderTarget(width, height, {
    type: halfFloat ? THREE.HalfFloatType : THREE.UnsignedByteType,
    format: THREE.RGBAFormat, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
    depthBuffer: false, stencilBuffer: false, generateMipmaps: false,
  });
  target.texture.colorSpace = THREE.LinearSRGBColorSpace;
  target.texture.name = 'C+ final optical radiance and opacity';
  const bakeMaterial = source.clone();
  bakeMaterial.uniforms.uCrown.value = source.uniforms.uCrown.value;
  bakeMaterial.transparent = false;
  bakeMaterial.blending = THREE.NoBlending;
  bakeMaterial.toneMapped = false;
  const requireReplace = (from: string, to: string) => {
    if (!bakeMaterial.fragmentShader.includes(from)) throw new Error('Fog bake no longer matches C+ integration');
    bakeMaterial.fragmentShader = bakeMaterial.fragmentShader.replace(from, to);
  };
  requireReplace('for(int i=0;i<32;i++)', `for(int i=0;i<${FOG_BAKE_STEPS};i++)`);
  requireReplace('for(int j=0;j<32;j++)', `for(int j=0;j<${FOG_BAKE_STEPS};j++)`);
  // Both preserved C and added volume integrate the same 72-unit depth interval.
  bakeMaterial.fragmentShader = bakeMaterial.fragmentShader.replaceAll('2.25', String(72 / FOG_BAKE_STEPS));
  requireReplace('gl_FragColor=vec4(light/max(alpha,.0001),alpha);', 'gl_FragColor=vec4(light,alpha);');
  requireReplace('#include <colorspace_fragment>', '');
  bakeMaterial.uniforms.uViewport.value.set(width, height);
  bakeMaterial.uniforms.uDpr.value = 1;
  const sx = width / b.width, sy = height / b.height;
  bakeMaterial.uniforms.uProjection.value.set(-b.minX * sx, -b.minY * sy, sx, sy);
  const geometry = new THREE.PlaneGeometry(2, 2);
  const scene = new THREE.Scene();
  scene.add(new THREE.Mesh(geometry, bakeMaterial));
  const camera = new THREE.Camera();
  let baked = false, bakeCount = 0, bakeSubmitMs = 0;
  const material = new THREE.ShaderMaterial({ transparent: true, depthTest: false, depthWrite: false,
    uniforms: { uViewport: { value: new THREE.Vector2() }, uDpr: { value: 1 },
      uProjection: { value: new THREE.Vector4() }, uBake: { value: target.texture },
      uBounds: { value: new THREE.Vector4(b.minX, b.minY, b.width, b.height) } },
    vertexShader: 'void main(){gl_Position=vec4(position.xy,0.,1.);}',
    fragmentShader: `
      precision highp float;
      uniform vec2 uViewport;
      uniform float uDpr;
      uniform vec4 uProjection,uBounds;
      uniform sampler2D uBake;
      void main(){
        vec2 css=gl_FragCoord.xy/uDpr;
        vec2 local=(vec2(css.x,uViewport.y-css.y)-uProjection.xy)/uProjection.zw;
        vec2 uv=(local-uBounds.xy)/uBounds.zw;
        if(uv.x<=0.||uv.x>=1.||uv.y<=0.||uv.y>=1.)discard;
        vec4 fog=texture2D(uBake,vec2(uv.x,1.-uv.y));
        if(fog.a<.001)discard;
        // Linear premultiplied L is interpolated in the cache. Unpremultiply
        // once for the existing straight-alpha, sRGB canvas output pipeline.
        gl_FragColor=vec4(fog.rgb/max(fog.a,.0001),fog.a);
        #include <colorspace_fragment>
      }` });
  return {
    material,
    invalidate() { baked = false; },
    ensure() {
      if (baked) return;
      const previous = renderer.getRenderTarget();
      const start = performance.now();
      try {
        renderer.setRenderTarget(target);
        renderer.clear();
        renderer.render(scene, camera);
        baked = true;
        bakeCount++;
        bakeSubmitMs = performance.now() - start;
      } finally { renderer.setRenderTarget(previous); }
    },
    stats() { return { bakeCount, width, height, stepsPerVolume: FOG_BAKE_STEPS,
      format: halfFloat ? 'RGBA16F' : 'RGBA8', encoding: 'linear-premultiplied-radiance-and-opacity',
      bakeSubmitMs, bounds: b, textureId: target.texture.uuid }; },
    dispose() { material.dispose(); bakeMaterial.dispose(); geometry.dispose(); target.dispose(); },
  };
}
