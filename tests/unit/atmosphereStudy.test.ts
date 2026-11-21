import assert from 'node:assert/strict';
import { test } from 'node:test';
import { atmosphereStudyLook, withStudySky, defaultAtmosphereStudy, requestedAtmosphereStudy, withStudyRailway } from '../../src/world/render/f2/F3AtmosphereStudy';
import { createF2SceneTheme } from '../../src/world/render/f2/F2Environment';
import { COUNTRYSIDE_THEMES } from '../../src/world/theme/worldTheme';
import { meadowFoothillMaterial } from '../../src/world/render/f2/meadowFoothillMaterial';
import { projectHillFootFog } from '../../src/world/render/f2/HillFootFog';
import { f2Projection } from '../../src/world/render/f2/F2CameraAdapter';
import { F2_PLACEMENT } from '../../src/world/render/f2/f2Config';
import { FOG_BAKE_BOUNDS, fogBakeUv } from '../../src/world/render/f2/BakedHillFog';
import { railwayAppearance } from '../../src/components/scenery/yorkshire/infrastructure/railwayAppearance';
import { LANDSCAPE_SURFACES } from '../../src/world/scene/landscapeGeometry';

test('formal daytime defaults to accepted S4 valley with baked optics; removed previews fall back safely', () => {
  assert.equal(defaultAtmosphereStudy('day'),'accepted-landscape');
  assert.equal(atmosphereStudyLook(defaultAtmosphereStudy('day'),'day').foothill?.mistTechnique,'baked');
  assert.equal(atmosphereStudyLook(defaultAtmosphereStudy('day'),'day').foothill?.valleyMaterial,'s4');
  for (const time of ['dusk','night'] as const) {
    assert.equal(defaultAtmosphereStudy(time),'accepted-landscape');
    const look=atmosphereStudyLook(defaultAtmosphereStudy(time),time);
    assert.equal(look.vignetteOpacity,0);
    assert.equal(look.foothill?.mist,undefined);
  }
  for (const search of ['', '?atmosphereStudy=valley-art-mist', '?atmosphereStudy=valley-reference-mist'])
    assert.equal(requestedAtmosphereStudy(search),'accepted-landscape');
  assert.equal(requestedAtmosphereStudy('?atmosphereStudy=valley-expanded-mist'),'valley-expanded-mist');
  assert.equal(requestedAtmosphereStudy('?atmosphereStudy=baseline'),'baseline');
});

test('S3 changes only daytime railway air and preserves accepted scenery and emission', () => {
  const accepted=atmosphereStudyLook('valley-baked-mist','day');
  const s3=atmosphereStudyLook('railway-midground','day');
  assert.deepEqual(s3.sky,accepted.sky);
  assert.equal(s3.foothill,accepted.foothill);
  assert.equal(s3.vignetteOpacity,accepted.vignetteOpacity);
  const base={...withStudySky(createF2SceneTheme(COUNTRYSIDE_THEMES.day,'day'),accepted.sky),foothillAtmosphere:accepted.foothill};
  const candidate=withStudyRailway(base,s3.railway);
  for(const key of Object.keys(base) as (keyof typeof base)[]) if(key!=='railwayAtmosphere')assert.deepEqual(candidate[key],base[key],key);
  assert.ok(candidate.railwayAtmosphere!.strength>0 && candidate.railwayAtmosphere!.strength<base.railwayAtmosphere!.strength);
  assert.equal(candidate.railwayAtmosphere!.nearestMountainStrength,base.railwayAtmosphere!.nearestMountainStrength);
  assert.equal(railwayAppearance(candidate).light,railwayAppearance(base).light);
  assert.equal(railwayAppearance(candidate).emission,railwayAppearance(base).emission);
  assert.equal(requestedAtmosphereStudy('?atmosphereStudy=railway-midground'),'railway-midground');
  assert.equal(defaultAtmosphereStudy('day'),'accepted-landscape');
  for(const time of ['dusk','night'] as const){
    const rail=atmosphereStudyLook('railway-midground',time).railway;
    assert.ok(rail && rail.strength>0);
    const theme=createF2SceneTheme(COUNTRYSIDE_THEMES[time],time);
    const adapted=withStudyRailway(theme,rail);
    assert.equal(railwayAppearance(adapted).emission,railwayAppearance(theme).emission);
    assert.equal(railwayAppearance(adapted).light,railwayAppearance(theme).light);
  }
});

test('formal landscape combines S3 railway with the accepted S4 baked valley', () => {
  const formal=atmosphereStudyLook(defaultAtmosphereStudy('day'),'day');
  const valley=atmosphereStudyLook('foothill-valley-mist','day');
  const railway=atmosphereStudyLook('railway-midground','day');
  assert.deepEqual(formal,{...valley,railway:railway.railway});
  assert.equal(requestedAtmosphereStudy('?atmosphereStudy=accepted-landscape'),'accepted-landscape');
  for(const time of ['dusk','night'] as const){
    const look=atmosphereStudyLook(defaultAtmosphereStudy(time),time);
    assert.deepEqual(look.railway,atmosphereStudyLook('railway-midground',time).railway);
    assert.equal(look.foothill?.valleyMaterial,'s4');
    assert.equal(look.foothill?.mist,undefined);
  }
});

test('optical bake coordinates keep transparent padding and top/bottom orientation', () => {
  const b=FOG_BAKE_BOUNDS;
  assert.deepEqual(fogBakeUv(b.minX,b.minY),{u:0,v:1});
  assert.deepEqual(fogBakeUv(b.minX+b.width,b.minY+b.height),{u:1,v:0});
  assert.deepEqual(fogBakeUv(b.minX+b.width/2,b.minY+b.height/2),{u:.5,v:.5});
  for (const [x,y] of [[30,200],[205,260],[513,280],[1050,295]]) {
    const uv=fogBakeUv(x,y);
    assert.ok(uv.u>0 && uv.u<1 && uv.v>0 && uv.v<1,'C+ support fits within the transparent frame');
  }
});

test('GPU fog projection agrees with nearest ridge coordinates across camera movement and resize', () => {
  const p = F2_PLACEMENT;
  for (const [width,height] of [[1600,900],[900,1100]]) for (const y of [-100,0,100]) {
    const view={width,height,camera:{x:20,y,zoom:1.2}};
    const fog=projectHillFootFog(view,p), ridge=f2Projection(view,2,p);
    const units=p.unitsPerDesignUnit*p.scale*p.layerScale[2];
    for (const [x,foot] of [[205,254],[610,265],[810,257]]) {
      const sx=(x-p.centerX-p.offsetX)/units;
      const sy=(p.horizonY+p.offsetY+p.layerOffsetY[2]-foot-LANDSCAPE_SURFACES.backgroundOffsetY)/units;
      assert.ok(Math.abs(fog.x+fog.scaleX*x-(width/2+(ridge.x+ridge.scale*sx)*height/2))<1e-7);
      assert.ok(Math.abs(fog.y+fog.scaleY*foot-(height/2-(ridge.y+ridge.scale*sy)*height/2))<1e-7);
    }
  }
});

test('the review sky leaves every non-sky material role and the normal appearance intact', () => {
  for (const time of ['day', 'dusk', 'night'] as const) {
    const original = createF2SceneTheme(COUNTRYSIDE_THEMES[time], time);
    assert.equal(withStudySky(original, atmosphereStudyLook('baseline', time).sky), original);
    const candidate = withStudySky(original, atmosphereStudyLook('clear-sky', time).sky);
    for (const key of Object.keys(original) as (keyof typeof original)[]) {
      if (!['skyTop', 'skyMid', 'skyBottom'].includes(key)) assert.deepEqual(candidate[key], original[key], key);
    }
    assert.notEqual(candidate.skyTop, original.skyTop);
    assert.notEqual(candidate.skyBottom, original.skyBottom);
  }
});

test('S2.1 retains S2 interior/landmarks and exact contacts; mist adds no second material change', () => {
  const a = atmosphereStudyLook('midground', 'day');
  const b = atmosphereStudyLook('valley-transition', 'day');
  const c = atmosphereStudyLook('valley-mist', 'day');
  const expanded = atmosphereStudyLook('valley-expanded-mist', 'day');
  const baked = atmosphereStudyLook('valley-baked-mist', 'day');
  const material = [a,b,c,expanded,baked].map(p => meadowFoothillMaterial('day', undefined, undefined, p.foothill));
  for (const p of [b,c,expanded,baked]) { assert.deepEqual(p.sky,a.sky); assert.equal(p.vignetteOpacity,a.vignetteOpacity); }
  for (const x of [90,120,200,330,490,735,870,960,990]) {
    for (const m of material.slice(1)) {
      assert.equal(m.groundAt(x),material[0].groundAt(x));
      assert.equal(m.colorAt(x,1),material[0].colorAt(x,1));
      assert.equal(m.landmarkColor('#5a7557',[0,1,0]),material[0].landmarkColor('#5a7557',[0,1,0]));
    }
    for (const depth of [0,.5,.85,.925,1]) for (const m of material.slice(2))
      assert.equal(material[1].colorAt(x,depth),m.colorAt(x,depth));
  }
  for (const x of [330,490,735]) for (const depth of [0,.35,.7])
    assert.equal(material[1].colorAt(x,depth),material[0].colorAt(x,depth));
  assert.notEqual(material[1].colorAt(490,.925),material[0].colorAt(490,.925));
  assert.equal(b.foothill.mist,undefined); assert.equal(c.foothill.mist,true);
  assert.equal(expanded.foothill.mistTechnique,'expanded');
  assert.equal(baked.foothill.mistTechnique,'baked');
  for (const time of ['dusk','night'] as const) for (const mode of ['valley-mist','valley-expanded-mist','valley-baked-mist'] as const)
    assert.equal(atmosphereStudyLook(mode,time).foothill?.mist,undefined);
});

test('S2 changes the interior and landmarks while keeping the complete source-matched boundary', () => {
  const s1 = atmosphereStudyLook('clear-sky-no-vignette', 'day');
  const s2 = atmosphereStudyLook('midground', 'day');
  assert.deepEqual(s2.sky, s1.sky);
  assert.equal(s2.vignetteOpacity, s1.vignetteOpacity);
  const original = meadowFoothillMaterial('day');
  const candidate = meadowFoothillMaterial('day', undefined, undefined, s2.foothill);
  for (const x of [90, 120, 200, 330, 490, 735, 870, 960, 990]) {
    assert.equal(candidate.groundAt(x), original.groundAt(x), `source sample x=${x}`);
    assert.equal(candidate.colorAt(x, 1), original.colorAt(x, 1), `toe x=${x}`);
  }
  for (const x of [90, 990]) for (const depth of [0, .25, .5, .75, 1])
    assert.equal(candidate.colorAt(x, depth), original.colorAt(x, depth), `end x=${x} d=${depth}`);
  assert.notEqual(candidate.colorAt(490, .5), original.colorAt(490, .5));
  assert.notEqual(candidate.landmarkColor('#5a7557', [0, 1, 0]), original.landmarkColor('#5a7557', [0, 1, 0]));
  for (const time of ['dusk', 'night'] as const) assert.ok(atmosphereStudyLook('midground', time).foothill);
});
