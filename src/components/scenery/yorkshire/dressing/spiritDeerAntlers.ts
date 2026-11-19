import * as THREE from 'three';
import type {Point3} from './spiritDeerShape3D';
import type {createDeerModelSurface} from './spiritDeerModel';
import {PAIRED_DEER_EARS,pairedEarPoint,PAIRED_DEER_ANTLERS,NATURAL_DEER_ANTLERS} from './spiritDeerHeadFeatures';

export function addAntlerFibers(surface: ReturnType<typeof createDeerModelSurface>,guardian=false,paired=false,cinematic=false) {
  // Sparse meridians make the thin ear membranes readable without filling them as solid leaves.
  if(paired)PAIRED_DEER_EARS.forEach(ear=>{
    for(let strand=0;strand<6;strand++)for(let j=0;j<36;j++)for(const t of [j/36,(j+1)/36]){
      const point=pairedEarPoint(ear,(1-t)*Math.PI,strand/6*Math.PI*2);
      surface.positions.push(...point.toArray());surface.normals.push(0,0,0);surface.strengths.push(.95);surface.phases.push(strand*.7);surface.travel.push(.06+t*.88);
    }
  });
  else for(const [cx,cy,cz,rx,ry,rz,angle] of [[23,-105,4,2.7,8.5,1.4,-.62],[42,-105,-4,2.5,8,1.3,.6]]) {
    for(let strand=0;strand<6;strand++) for(let j=0;j<36;j++) {
      for(const t of [j/36,(j+1)/36]) {
        const phi=(1-t)*Math.PI,theta=strand/6*Math.PI*2;
        const x=rx*Math.cos(theta)*Math.sin(phi),y=-ry*Math.cos(phi),z=rz*Math.sin(theta)*Math.sin(phi);
        surface.positions.push(cx+Math.cos(angle)*x-Math.sin(angle)*y,cy+Math.sin(angle)*x+Math.cos(angle)*y,cz+z);
        surface.normals.push(0,0,0);
        surface.strengths.push(.95);surface.phases.push(strand*.7);surface.travel.push(.06+t*.88);
      }
    }
  }
  const branches: Point3[][]=paired?(cinematic?NATURAL_DEER_ANTLERS:PAIRED_DEER_ANTLERS):[
    [[34,-99,1],[30,-110,1],[21,-124,2],[18,-140,1]],
    [[25,-118,2],[30,-127,3],[29,-135,2]],
    [[21,-125,2],[12,-126,3],[6,-134,3]],
    [[17,-126,2],[12,-133,2],[12,-140,2]],
    [[43,-100,-1],[48,-116,-2],[48,-130,-2],[52,-144,-1]],
    [[48,-122,-2],[55,-127,-1],[59,-138,-1]],
    [[51,-127,-2],[63,-125,-1],[70,-136,1]],
    [[47,-115,-2],[41,-123,-1],[40,-132,0]],
  ];
  branches.forEach((points,b)=>{
    const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
    for(let strand=0;strand<8;strand++) for(let j=0;j<60;j++) {
      for(const t of [j/60,(j+1)/60]) {
        const point=curve.getPoint(t), tangent=curve.getTangent(t);
        const axis=new THREE.Vector3(0,0,1).cross(tangent).normalize();
        const radius=(b===0||b===4?(paired?.85:1.15):(paired?.48:.65))*Math.pow(1-t,.8)+.03;
        const angle=strand/8*Math.PI*2+t*4;
        point.addScaledVector(axis,Math.cos(angle)*radius);
        if(paired)point.addScaledVector(new THREE.Vector3().crossVectors(tangent,axis).normalize(),Math.sin(angle)*radius);
        else{
          point.z+=Math.sin(angle)*radius;
          point.z+=(b<4?1:-1)*(3+Math.max(0,-point.y-103)*.3);
          point.x=34+(point.x-39)*.72;point.y=-100+(point.y+100)*.65;point.z*=.8;
        }
        surface.positions.push(point.x,point.y,point.z);
        surface.normals.push(0,0,0);
        surface.strengths.push(1.4);surface.phases.push(guardian?b*1.15:strand*.9+b);surface.travel.push(.08+t*.84);
      }
    }
  });
}

/** Centers of actual authored tips, including the crown's transverse spread. */
export const DEER_ANTLER_TIPS:Point3[]=[
 [18,-140,1],[29,-135,2],[52,-144,-1],[70,-136,1],
].map(([x,y,z],i)=>[34+(x-39)*.72,-100+(y+100)*.65,(z+(i<2?1:-1)*(3+Math.max(0,-y-103)*.3))*.8] as Point3);
