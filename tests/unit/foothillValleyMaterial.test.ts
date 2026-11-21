import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Vector4 } from 'three';
import { valleyFields } from '../../src/world/render/f2/FoothillValleyMaterial';
import { meadowFoothillMaterial } from '../../src/world/render/f2/meadowFoothillMaterial';
import { atmosphereStudyLook, defaultAtmosphereStudy, requestedAtmosphereStudy } from '../../src/world/render/f2/F3AtmosphereStudy';
import { meadowHillSurfaceY } from '../../src/world/scene/meadowFoothill';

test('valley depth follows ridge distance while the hill centre and skyline stay protected', () => {
  const map=new Vector4(600,190,400,1);
  const left=-1.25,centre=0,right=1.25;
  for(const z of [0,.1,.25,.5,.8]) {
    const fields=[left,centre,right].map(x=>valleyFields(x,-z,0,map));
    assert.equal(fields[0].depth,fields[1].depth);
    assert.equal(fields[1].depth,fields[2].depth);
    if(z<=.1)assert.equal(fields[1].weight,0,'main hill interior is protected');
    if(z===0)for(const f of fields)assert.equal(f.weight,0,'ridge skyline keeps original material');
    for(const f of fields){
      assert.ok(f.weight>=0 && f.weight<=.96);
      assert.ok(f.warm>=0 && f.warm<=1);
      assert.ok(f.understory>=0 && f.understory<=.42);
      assert.ok(Math.abs(f.variation-1)<=.085);
    }
  }
  assert.ok(valleyFields(left,-.6,0,map).weight>valleyFields(left,-.1,0,map).weight);
});

test('central valley participates in front of the curved foot while the hill remains protected', () => {
  const map=new Vector4(600,190,400,1);
  for(const lx of [430,550,700]) {
    const x=(lx-map.x)/map.z,foot=meadowHillSurfaceY(lx,1)!;
    const sample=(ly:number)=>valleyFields(x,(map.y-ly)/map.z,.2,map);
    assert.equal(sample(foot-20).weight,0,'inside hill stays protected');
    assert.equal(sample(foot).weight,0,'central contact remains continuous');
    assert.ok(sample(foot+15).weight>0,'near-front transition is included');
    assert.ok(sample(foot+40).weight>.7,'front valley is no longer excluded');
  }
});

test('S4 preserves the hill interior and landmarks and matches the new ground at contacts', () => {
  const base=meadowFoothillMaterial('day',undefined,undefined,atmosphereStudyLook('valley-transition','day').foothill);
  const s4=meadowFoothillMaterial('day',undefined,undefined,atmosphereStudyLook('foothill-valley','day').foothill);
  const mist=meadowFoothillMaterial('day',undefined,undefined,atmosphereStudyLook('foothill-valley-mist','day').foothill);
  for(const x of [90,120,200,330,490,735,870,960,990]) {
    assert.equal(s4.colorAt(x,1),s4.groundAt(x),`contact x=${x}`);
    assert.equal(mist.groundAt(x),s4.groundAt(x),'mist adds no terrain material change');
    assert.equal(s4.landmarkColor('#5a7557',[0,1,0]),base.landmarkColor('#5a7557',[0,1,0]));
    for(const d of [0,.35,.7,1])assert.equal(mist.colorAt(x,d),s4.colorAt(x,d));
  }
  for(const x of [330,490,735])for(const d of [0,.35,.7])assert.equal(s4.colorAt(x,d),base.colorAt(x,d));
  for(const x of [90,990])assert.notEqual(s4.groundAt(x),base.groundAt(x),'side ground changes');
});

test('S4 remains the default with independent no-mist review and evening mist disabled', () => {
  const base=atmosphereStudyLook('valley-transition','day');
  const s4=atmosphereStudyLook('foothill-valley','day');
  const mist=atmosphereStudyLook('foothill-valley-mist','day');
  assert.deepEqual(s4,{...base,foothill:{...base.foothill,valleyMaterial:'s4'}});
  assert.deepEqual(mist,{...s4,foothill:{...s4.foothill,mist:true,mistTechnique:'baked'}});
  for(const mode of ['foothill-valley','foothill-valley-mist'] as const){
    assert.equal(requestedAtmosphereStudy('?atmosphereStudy='+mode),mode);
    for(const time of ['dusk','night'] as const){
      assert.equal(atmosphereStudyLook(mode,time).foothill?.valleyMaterial,'s4');
      assert.equal(atmosphereStudyLook(mode,time).foothill?.mist,undefined);
    }
  }
  assert.equal(defaultAtmosphereStudy('day'),'accepted-landscape');
});

test('evening valley keeps exact contact colours without daytime-white air or local mist',()=>{
  for(const time of ['dusk','night'] as const){
    const look=atmosphereStudyLook('accepted-landscape',time);
    const material=meadowFoothillMaterial(time,undefined,undefined,look.foothill);
    assert.notEqual(look.foothill?.air,'#b9d2d8');
    assert.equal(look.foothill?.mist,undefined);
    for(const x of [90,200,330,490,735,870,990])assert.equal(material.colorAt(x,1),material.groundAt(x));
    assert.notEqual(material.groundAt(90),meadowFoothillMaterial(time).groundAt(90));
  }
});
