import * as THREE from 'three';

/** Retain the host's small night-sky accents inside the sky pass so mountains
 * occlude them correctly. Static pixel positions add no draw calls or timers. */
export function addHostNightSky(material: THREE.ShaderMaterial) {
  material.uniforms.uNight = { value: 0 };
  material.uniforms.uViewport = { value: new THREE.Vector2(1, 1) };
  material.uniforms.uPixelRatio = { value: 1 };
  material.fragmentShader = material.fragmentShader.replace('varying float vY;', `
uniform float uNight,uPixelRatio;uniform vec2 uViewport;
float starAt(vec2 center,float radius){return 1.-smoothstep(radius-.6,radius+.6,length(gl_FragCoord.xy-center*uViewport)/uPixelRatio);}
varying float vY;`).replace('gl_FragColor=vec4(c,1.);', `
float stars=starAt(vec2(.20,.92),1.6)+starAt(vec2(.35,.86),1.)+starAt(vec2(.65,.94),2.)+starAt(vec2(.78,.84),1.5);
vec2 moon=(gl_FragCoord.xy-vec2(.86,.89)*uViewport)/uPixelRatio;
float disc=1.-smoothstep(17.,18.,length(moon));
float bite=smoothstep(17.,18.,length(moon-vec2(-6.,5.)));
c=mix(c,vec3(.76,.79,.72),clamp(uNight*(stars*.75+disc*bite*.75),0.,1.));
gl_FragColor=vec4(c,1.);`);
  material.needsUpdate = true;
}
