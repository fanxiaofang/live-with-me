import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
import * as THREE from 'three';
import type { TimeOfDay } from '../../../types';
import type { Camera } from '../../camera/cameraMath';
import type { YorkshireSceneTheme } from '../../../components/scenery/yorkshire/landscapeTypes';
import baseline from './config/baseline.json';
import initialStudy from './config/study.json';
import { createF2Backdrop } from './vendor/f2/createF2Backdrop.js';
import { updateRidgeMaterial } from './vendor/backdrop/ridgeMaterial.js';
import { updateReliefMaterial } from './vendor/f2/reliefMaterial.js';
import { sampleWorldView, f2Projection, f2LandmarkTransform } from './F2CameraAdapter';
import { F2_STUDIES, requestedF2Study } from './f2Config';
import { resolveF2Environment } from './F2Environment';
import { resolveSourceHillsLook } from './F2Atmosphere';
import { addHostNightSky } from './F2SkyDetails';
import { LANDSCAPE_SURFACES } from '../../scene/landscapeGeometry';
import { sliceViewport } from '../../coordinates/viewport';

interface Props {
  svgRef: RefObject<SVGSVGElement>;
  camera: Camera;
  isDragging: boolean;
  timeOfDay: TimeOfDay;
  theme: YorkshireSceneTheme;
  onReady: () => void;
  onFailure: (reason: string) => void;
}
type Uniform = { value: THREE.Color | THREE.Vector2 | THREE.Vector3 | THREE.Vector4 | number };
type Uniforms = Record<string, Uniform>;
const cloneUniform = (v: Uniform['value']) => typeof v === 'number' ? v : v.clone();

export default function F2DistantHills(props: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const calibration = useRef(F2_STUDIES[requestedF2Study()]).current;
  const placement = calibration.placement;
  const state = useRef(props);
  state.current = props;
  const wake = useRef<() => void>(() => {});
  useLayoutEffect(() => wake.current(), [props.camera, props.isDragging, props.timeOfDay, props.theme]);

  useEffect(() => {
    const host = hostRef.current, svg = state.current.svgRef.current;
    if (!host || !svg) return;
    const landmarks = svg.querySelector<SVGGElement>('#f2-nearest-landmarks');
    let disposed = false, raf = 0, deadline = 0, ready = false, failed = false;
    let backdrop: ReturnType<typeof createF2Backdrop> | undefined;
    let themeKey = '', lastSignature = '', lastDpr = 0, wasBlending = false;
    let themeStart = 0;
    let from: Uniforms[] = [], to: Uniforms[] = [];
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const samples: number[] = [];
    const fail = (error: unknown) => {
      if (disposed || failed) return;
      failed = true;
      state.current.onFailure(error instanceof Error ? error.message : String(error));
    };
    const lost = (event: Event) => { event.preventDefault(); fail('WebGL context lost'); };
    try {
      backdrop = createF2Backdrop(host, baseline, initialStudy, {
        observeResize: false, transparentBackground: false,
        pixelRatio: Math.min(devicePixelRatio || 1, placement.pixelRatioLimit),
      });
    } catch (error) {
      // Constructor failure can leave a canvas before a complete renderer exists.
      host.replaceChildren();
      fail(error);
      return;
    }
    const f2 = backdrop;
    f2.core.renderer.debug.onShaderError = () => { throw new Error('F2 shader compilation failed'); };
    const meshes = f2.core.scene.children.filter((child: THREE.Object3D) =>
      (child as THREE.Mesh).isMesh && child.renderOrder >= 0 && child.renderOrder <= 4) as THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>[];
    const sky = f2.core.scene.children.find(child => child.renderOrder === -100) as THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>;
    addHostNightSky(sky.material);
    const animatedMeshes = [...meshes, sky];
    f2.core.renderer.autoClear = false;
    f2.core.renderer.info.autoReset = false;
    // Continue the existing mesh skirt below the occluding wheat; no extra visible terrain.
    for (const mesh of meshes) {
      const position = mesh.geometry.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 12; i < position.count; i += 13) position.setY(i, placement.hiddenBottom);
      position.needsUpdate = true;
    }
    f2.canvas.setAttribute('aria-hidden', 'true');
    f2.canvas.addEventListener('webglcontextlost', lost);
    const uniformSnapshot = () => animatedMeshes.map(mesh => Object.fromEntries(
      Object.entries(mesh.material.uniforms).filter(([key, u]) => key !== 'uViewport' && key !== 'uPixelRatio' && (typeof u.value === 'number' || u.value?.isColor || u.value?.isVector2 || u.value?.isVector3 || u.value?.isVector4))
        .map(([key, u]) => [key, { value: cloneUniform(u.value) }]),
    ) as Uniforms);
    const setEnvironment = (now: number) => {
      const { timeOfDay, theme } = state.current;
      const key = timeOfDay + theme.skyBottom;
      if (key === themeKey) return false;
      const first = !themeKey;
      themeKey = key;
      from = uniformSnapshot();
      const { config, study, sky: skyLook } = resolveF2Environment(timeOfDay);
      meshes.forEach((mesh, index) => {
        const look = resolveSourceHillsLook(config, index);
        updateRidgeMaterial(mesh, look);
      });
      updateReliefMaterial(f2.getReliefMaterial(), study, baseline.layers[2].points);
      sky.material.uniforms.uTop.value.copy(skyLook.top);
      sky.material.uniforms.uAir.value.copy(skyLook.air);
      sky.material.uniforms.uHorizon.value.copy(skyLook.horizon);
      sky.material.uniforms.uNight.value = timeOfDay === 'night' ? 1 : 0;
      to = uniformSnapshot();
      themeStart = first || motion.matches ? now - 1400 : now;
      return true;
    };
    const applyEnvironment = (now: number) => {
      const t = motion.matches ? 1 : Math.min(1, (now - themeStart) / 1400);
      animatedMeshes.forEach((mesh, i) => {
        for (const [key, target] of Object.entries(to[i] || {})) {
          const uniform = mesh.material.uniforms[key], start = from[i][key].value;
          if (typeof target.value !== 'number' && typeof start !== 'number')
            (uniform.value as THREE.Color).copy(start as THREE.Color).lerp(target.value as THREE.Color, t);
          else if (typeof target.value === 'number' && typeof start === 'number')
            uniform.value = start + (target.value - start) * t;
        }
      });
      return t < 1;
    };
    const frame = (now: number) => {
      raf = 0;
      if (disposed || failed || document.hidden) return;
      try {
        const view = sampleWorldView(svg);
        if (!view) return;
        const dpr = Math.min(devicePixelRatio || 1, placement.pixelRatioLimit);
        const resized = view.width !== f2.getStats().width || view.height !== f2.getStats().height || dpr !== lastDpr;
        if (resized) { f2.resize(view.width, view.height, dpr); lastDpr = dpr; }
        const changedTheme = setEnvironment(now);
        const blending = applyEnvironment(now);
        const environmentChanged = changedTheme || blending || wasBlending;
        wasBlending = blending;
        const signature = JSON.stringify(view);
        if (signature !== lastSignature || resized || environmentChanged || !ready) {
          const begin = performance.now();
          meshes.forEach((mesh, index) => {
            const p = f2Projection(view, index, placement);
            mesh.position.set(p.x, p.y, 0);
            mesh.scale.set(p.scale, p.scale, 1);
          });
          // The SVG roots and WebGL ridge use the same sampled frame and projection.
          // No second easing clock or independent tree/house response is introduced.
          if (landmarks) {
            const m = f2LandmarkTransform(view, placement);
            landmarks.setAttribute('transform', `matrix(${m.a} ${m.b} ${m.c} ${m.d} ${m.e} ${m.f})`);
          }
          // The existing opaque wheat/meadow covers every pixel below this conservative
          // envelope. Scissor only hidden fragments; keep all ridge vertices/shaders.
          const wheat = svg.querySelector<SVGGElement>('#parallax-wheat-layer');
          const renderer = f2.core.renderer;
          renderer.setScissorTest(false);
          renderer.info.reset();
          renderer.clear();
          sky.material.uniforms.uViewport.value.set(renderer.domElement.width, renderer.domElement.height);
          sky.material.uniforms.uPixelRatio.value = renderer.getPixelRatio();
          // Full sky first, then the original scissored ridge pass. Both reuse one renderer.
          meshes.forEach(mesh => { mesh.visible = false; });
          sky.visible = true;
          renderer.render(f2.core.scene, f2.core.camera);
          meshes.forEach(mesh => { mesh.visible = true; });
          sky.visible = false;
          if (wheat) {
            const matrix = new DOMMatrixReadOnly(getComputedStyle(wheat).transform);
            const slice = sliceViewport(view.width, view.height);
            const sourceY = LANDSCAPE_SURFACES.backgroundOffsetY + LANDSCAPE_SURFACES.wheatBackMaxY;
            const screenY = slice.f + slice.d * (400 + matrix.a * (sourceY - 400) + matrix.f);
            const topHeight = Math.max(0, Math.min(view.height, Math.ceil(screenY + 4)));
            renderer.setScissor(0, view.height - topHeight, view.width, topHeight);
            renderer.setScissorTest(true);
          }
          f2.render();
          sky.visible = true;
          if (f2.core.renderer.info.programs?.some(program => (program as unknown as { diagnostics?: { runnable: boolean } }).diagnostics?.runnable === false))
            throw new Error('F2 shader compilation failed');
          samples.push(performance.now() - begin);
          if (samples.length > 300) samples.shift();
          host.dataset.stats = JSON.stringify({
            ...f2.getStats(), mode: 'B', reliefLayer: 2, skyVisible: true,
            skyDither: sky.material.dithering, environmentOwner: 'source-v2',
            skyTop: sky.material.uniforms.uTop.value.getHexString(), skyHorizon: sky.material.uniforms.uHorizon.value.getHexString(),
            materialIds: meshes.map(mesh => mesh.material.uuid), geometryIds: meshes.map(mesh => mesh.geometry.uuid),
            environment: state.current.timeOfDay, environmentProgress: motion.matches ? 1 : Math.min(1, (now - themeStart) / 1400),
            geometryBytes: meshes.reduce((sum, mesh) => sum + Object.values(mesh.geometry.attributes).reduce((s, a) => s + a.array.byteLength, 0) + (mesh.geometry.index?.array.byteLength || 0), 0),
            camera: state.current.camera, isDragging: state.current.isDragging,
            sampledCamera: view.camera, placement, calibration: calibration.id,
            responseOwner: 'source-v2', layerResponses: baseline.layers.map(layer => layer.response),
            renderSamples: samples.length, renderMeanMs: samples.reduce((a,b)=>a+b,0)/samples.length,
          });
          lastSignature = signature;
          if (!ready) { ready = true; state.current.onReady(); }
        }
        if (now < deadline || blending) raf = requestAnimationFrame(frame);
      } catch (error) { fail(error); }
    };
    const schedule = () => {
      deadline = performance.now() + 500;
      if (!disposed && !failed && !document.hidden && !raf) raf = requestAnimationFrame(frame);
    };
    wake.current = schedule;
    const clock = svg.querySelector('#panoramic-world-stage');
    const transition = (event: Event) => {
      if (event.target === clock && (event as TransitionEvent).propertyName === 'transform') schedule();
    };
    // Follow actual CSS transitions too, including interrupted/reversed ones.
    // Camera gestures still wake through the layout effect; this adds no clock.
    const transitionEvents = ['transitionrun', 'transitionend', 'transitioncancel'];
    transitionEvents.forEach(type => clock?.addEventListener(type, transition));
    const observer = new ResizeObserver(schedule);
    observer.observe(host);
    const visibility = () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
      else schedule();
    };
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('resize', schedule);
    motion.addEventListener('change', schedule);
    schedule();
    return () => {
      disposed = true;
      wake.current = () => {};
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('resize', schedule);
      document.removeEventListener('visibilitychange', visibility);
      motion.removeEventListener('change', schedule);
      transitionEvents.forEach(type => clock?.removeEventListener(type, transition));
      f2.canvas.removeEventListener('webglcontextlost', lost);
      landmarks?.removeAttribute('transform');
      f2.dispose();
    };
  }, []);
  return <div ref={hostRef} data-f2-hills="true" data-f2-study={calibration.id} aria-hidden="true"
    className="absolute inset-0 pointer-events-none" style={{ pointerEvents: 'none' }} />;
}
