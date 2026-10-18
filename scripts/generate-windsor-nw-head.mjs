import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

// Derive a runtime head from the finalized native SVG. Never redraw/trace it.
const sourceDir='docs/architecture/metrics/CHARACTER-NW-SVG-2026-10-16/approved';
const approval=JSON.parse(fs.readFileSync(`${sourceDir}/user-approval.json`,'utf8'));
const heads={};
for(const file of approval.files) {
  const svg=fs.readFileSync(file.snapshot,'utf8');
  assert.equal(crypto.createHash('sha256').update(svg).digest('hex'),file.sha256);
  const allDefs=svg.match(/<defs>([\s\S]*?)<\/defs>/)[1];
  const definitions=allDefs.replace(/<(linearGradient|radialGradient|clipPath)\b[^>]*id="[^"]*(?:robe|hand-soft-shade)[^"]*"[^>]*>[\s\S]*?<\/\1>/g,'');
  const head=svg.slice(svg.indexOf('<g data-part="head"'),svg.lastIndexOf('</svg>')).trim();
  assert.ok(head.startsWith('<g data-part="head" transform="translate(10.875,0)">'));
  const hat=head.match(/<g data-part="beanie"><path d="([^"]+)"/)[1];
  // The no-pompom option follows the cap curve at this one missing sector.
  // Default pompom-on uses the exact approved path without any modification.
  const from=hat.indexOf('C687.8,198.92');
  const end=hat.indexOf('C578.74,131.94');
  assert.ok(from>0&&end>from);
  const withoutPom=`M547,133 C603,130 652,153 686.86,194.14${hat.slice(from,end)}C563,133 553,133 547,133Z`;
  let markup=`<defs>${definitions}</defs>${head}`.replaceAll(`nw-${file.id}`,'NW_PREFIX');
  const colors={
    '#57483d':'var(--nw-hair)', '#b8afa0':'var(--nw-hair)', '#e4c983':'var(--nw-hair)',
    '#514435':'var(--nw-hair)', '#463c33':'var(--nw-hair-shade)',
    '#f6d3b8':'var(--nw-skin)', '#f5d4b9':'var(--nw-skin)', '#f7d6bd':'var(--nw-skin)',
    '#3a4b59':'var(--nw-hat-shade)', '#465e6f':'var(--nw-hat)',
    '#3c5262':'var(--nw-hat-shade)', '#435d70':'var(--nw-hat)',
  };
  for(const [hex,variable] of Object.entries(colors))markup=markup.replaceAll(hex,variable);
  assert.ok(!/<(?:image|foreignObject|script)\b/.test(markup));
  heads[file.id]={sourceSha256:file.sha256,markup,hatWithPom:hat,hatWithoutPom:withoutPom};
}
const output='src/components/desk/nwSeatedHeadAssets.ts';
fs.writeFileSync(output,`// Generated from finalized NW SVGs by scripts/generate-windsor-nw-head.mjs.\n// Geometry is unchanged; colors and instance IDs are runtime parameters.\nexport const NW_SEATED_HEAD_ASSETS = ${JSON.stringify(heads,null,2)} as const;\n`);
console.log(JSON.stringify({output,heads:Object.keys(heads)}));
