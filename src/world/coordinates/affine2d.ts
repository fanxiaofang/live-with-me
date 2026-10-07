export type Affine2D = Readonly<{ a:number; b:number; c:number; d:number; e:number; f:number }>;
export function transformPoint(m:Affine2D,p:{x:number;y:number}) {
  return {x:m.a*p.x+m.c*p.y+m.e,y:m.b*p.x+m.d*p.y+m.f};
}
export function transformDelta(m:Affine2D,p:{dx:number;dy:number}) {
  return {dx:m.a*p.dx+m.c*p.dy,dy:m.b*p.dx+m.d*p.dy};
}
export function inverse(m:Affine2D):Affine2D {
  const det=m.a*m.d-m.b*m.c;
  if(!Number.isFinite(det)||Math.abs(det)<1e-12) throw new Error('Non-invertible coordinate transform');
  return {a:m.d/det,b:-m.b/det,c:-m.c/det,d:m.a/det,e:(m.c*m.f-m.d*m.e)/det,f:(m.b*m.e-m.a*m.f)/det};
}
export function multiply(parent:Affine2D,local:Affine2D):Affine2D {
  return {a:parent.a*local.a+parent.c*local.b,b:parent.b*local.a+parent.d*local.b,
    c:parent.a*local.c+parent.c*local.d,d:parent.b*local.c+parent.d*local.d,
    e:parent.a*local.e+parent.c*local.f+parent.e,f:parent.b*local.e+parent.d*local.f+parent.f};
}
