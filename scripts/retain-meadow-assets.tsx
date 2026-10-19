import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { GrassComposition } from '../src/components/scenery/yorkshire/vegetation/MeadowVegetationAssets';
import { StudySvg, studies } from '../tests/fixtures/meadow/GrassStudiesV2';

const sampleDir = 'docs/architecture/metrics/MEADOW-VEGETATION-B-2026-10-19/v2';
const archiveDir = `${sampleDir}/approved`;
const assetDir = 'src/assets/meadow';
const source = 'src/components/scenery/yorkshire/vegetation/MeadowVegetationAssets.tsx';
await mkdir(archiveDir, { recursive: true });
await mkdir(assetDir, { recursive: true });
const hash = (data: string | Buffer) => createHash('sha256').update(data).digest('hex');
async function preserve(path: string, content: string) {
  try { await writeFile(path, content, { flag: 'wx' }); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
    if (await readFile(path, 'utf8') !== content) throw new Error(`${path}: retained baseline differs; create a new version instead of overwriting`);
  }
}
const specs = [
  { kind: 'soft' as const, file: 'short-meadow.svg', component: 'ShortMeadowCluster', viewBox: '-78 -30 155 55' },
  { kind: 'wild' as const, file: 'wild-grass.svg', component: 'WildGrassCluster', viewBox: '-80 -72 150 100' },
  { kind: 'flower' as const, file: 'wildflower-mix.svg', component: 'WildflowerCluster', viewBox: '-78 -48 166 78' },
];
const assets = [];
for (const spec of specs) {
  const sample = await readFile(`${sampleDir}/${spec.kind}.svg`, 'utf8');
  // Exact SSR equality proves extraction preserved all shapes, colours and transforms.
  if (sample !== renderToStaticMarkup(<StudySvg kind={spec.kind} />)) {
    throw new Error(`${spec.kind}: retained source does not match the reviewed v2 SVG`);
  }
  const name = studies.find(study => study.kind === spec.kind)!.name;
  const svg = renderToStaticMarkup(<svg xmlns="http://www.w3.org/2000/svg" viewBox={spec.viewBox} role="img" aria-label={name}>
    <title>{name}</title><GrassComposition kind={spec.kind} />
  </svg>);
  await preserve(`${assetDir}/${spec.file}`, svg);
  await preserve(`${archiveDir}/${spec.kind}.svg`, sample);
  assets.push({ id: spec.kind, name, component: spec.component, svg: `${assetDir}/${spec.file}`, viewBox: spec.viewBox,
    sha256: hash(svg), reviewedSample: `${archiveDir}/${spec.kind}.svg`, reviewedSampleSha256: hash(sample),
    exactReviewedSvgMatch: true, paths: (svg.match(/<path\b/g) ?? []).length });
}
const manifest = {
  status: 'current-accepted-baseline', acceptedOn: '2026-10-19',
  userQuote: '暂时就这样先验收吧吧',
  assetRequest: '中的三组草 作为资产保留',
  scope: 'Current scene composition accepted for now; retain all three v2 compositions as reusable assets. Future artwork revisions should be versioned separately.',
  source, sourceSha256: hash(await readFile(source)), assets,
  scene: { revision: 9, record: 'docs/architecture/metrics/MEADOW-SCENE-TRIAL-2026-10-19/round-9/README.md', productionEnabled: false },
};
await preserve(`${archiveDir}/manifest.json`, JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ retained: assets.map(asset => asset.name), exactReviewedSvgMatch: true, source, archiveDir }));
