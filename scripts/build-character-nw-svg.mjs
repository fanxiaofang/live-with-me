import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { hairstyles, hairParts } from '../tools/character-nw-svg/hair.mjs';

const reference=JSON.parse(fs.readFileSync('tools/character-nw-svg/reference-contours.json','utf8'));
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
// The original raster is historical provenance; the retained vector contours
// are sufficient to rebuild the approved assets after local drafts are archived.
if(fs.existsSync(reference.source))assert.equal(hash(reference.source),reference.sourceSha256);
const protectedFiles=fs.readdirSync('public')
  .filter(name=>/^character-(shorthair|curly|sidepart|shaggy)-(standing-)?(front|left|back|right)\.svg$/.test(name))
  .map(name=>({path:`public/${name}`,sha256:hash(`public/${name}`)}));
const l=reference.layers;
const sharedBody=`<g data-part="robe" data-shared="all-four-hairstyles">
  <path d="${l.robe.d}" fill="url(#PREFIX-robe)"/>
  <ellipse cx="462" cy="971" rx="65" ry="67" fill="url(#PREFIX-hand-soft-shade)" clip-path="url(#PREFIX-robe-clip)"/>
  <path d="M618,637 C625,696 628,758 632,812" stroke="#986348" stroke-opacity=".36" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M488,607 C516,625 515,695 511,750 C509,826 499,888 483,927" stroke="#986348" stroke-opacity=".36" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M695,674 C703,745 707,823 713,904" stroke="#986348" stroke-opacity=".32" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M437,1139 C448,1195 438,1249 415,1284 M704,1149 C699,1190 703,1223 719,1249" stroke="#986348" stroke-opacity=".36" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M480,541 Q555,562 624,534" stroke="#ac5c45" stroke-opacity=".4" stroke-width="11" fill="none"/>
</g>
<g data-part="round-hands">${l.hands.map(hand=>`<path d="${hand.d}" fill="url(#PREFIX-skin)"/>`).join('')}</g>
<g data-part="cuffs" fill="none" stroke="#ad6247" stroke-opacity=".64" stroke-linecap="round">
  <path d="M391,925 Q437,943 482,930" stroke-width="10"/>
  <path d="M696,913 Q705,914 718,905" stroke-width="6"/>
</g>`;

function definitions(prefix){return `<defs>
  <linearGradient id="${prefix}-robe" x1="350" y1="650" x2="777" y2="1230" gradientUnits="userSpaceOnUse"><stop stop-color="#e1795c"/><stop offset=".55" stop-color="#df775b"/><stop offset="1" stop-color="#e27b5e"/></linearGradient>
  <linearGradient id="${prefix}-skin" x1="350" y1="400" x2="650" y2="550" gradientUnits="userSpaceOnUse"><stop stop-color="#f6d3b8"/><stop offset=".55" stop-color="#f5d4b9"/><stop offset="1" stop-color="#f7d6bd"/></linearGradient>
  <linearGradient id="${prefix}-hat" x1="350" y1="270" x2="750" y2="270" gradientUnits="userSpaceOnUse"><stop stop-color="#3a4b59"/><stop offset="1" stop-color="#465e6f"/></linearGradient>
  <linearGradient id="${prefix}-cuff" x1="350" y1="345" x2="700" y2="490" gradientUnits="userSpaceOnUse"><stop stop-color="#3c5262"/><stop offset="1" stop-color="#435d70"/></linearGradient>
  <linearGradient id="${prefix}-short-hair" x1="510" y1="470" x2="650" y2="526" gradientUnits="userSpaceOnUse"><stop stop-color="#514435"/><stop offset="1" stop-color="#463c33"/></linearGradient>
  <clipPath id="${prefix}-hat-clip"><path d="${l.hat.d}"/></clipPath>
  <clipPath id="${prefix}-robe-clip"><path d="${l.robe.d}"/></clipPath>
  <radialGradient id="${prefix}-hand-soft-shade"><stop stop-color="#845139" stop-opacity=".16"/><stop offset="1" stop-color="#845139" stop-opacity="0"/></radialGradient>
</defs>`;}
function hat(prefix){return `<g data-part="beanie"><path d="${l.hat.d}" fill="url(#${prefix}-hat)"/>
  <g clip-path="url(#${prefix}-hat-clip)">
    <path d="M591,143 C616,122 653,139 670,165 Q679,176 672,183 C647,166 621,154 591,143Z" fill="#1d3341" opacity=".27"/>
    <path d="M604,147 Q644,141 668,181" fill="none" stroke="#253d4c" stroke-opacity=".45" stroke-width="10"/>
    <path d="M327,326 C452,347 579,409 728,422 L720,496 C580,508 433,457 326,385Z" fill="url(#${prefix}-cuff)"/>
    <path d="M342,328 C458,351 583,409 725,422" stroke="#253c49" stroke-opacity=".4" stroke-width="9" fill="none"/>
    <path d="M330,386 C447,454 592,505 716,492" stroke="#243a47" stroke-opacity=".4" stroke-width="8" fill="none"/>
    <path d="M378,343 L372,406 M441,362 L434,432 M514,386 L505,460 M587,409 L576,479 M659,426 L646,493 M718,438 L708,490" stroke="#243b49" stroke-opacity=".32" stroke-width="8" fill="none"/>
    <path d="M434,203 L410,234 M389,267 L379,298 M476,175 L510,161 M560,157 L593,171 M636,199 L657,226 M691,264 L699,297 M700,339 L697,375" stroke="#243b48" stroke-opacity=".34" stroke-width="13" fill="none"/>
  </g>
</g>`;}

const report=[];
const selected=process.argv.slice(2);
for(const style of hairstyles.filter(style=>!selected.length||selected.includes(style.id))){
  const prefix=`nw-${style.id}`, hair=hairParts(style.id,reference,prefix);
  const shadow=`<g data-part="soft-ground-shadow" fill="#59352a">${reference.shadow.map(band=>`<g opacity="${band.opacity.toFixed(5)}">${band.paths.map(d=>`<path d="${d}"/>`).join('')}</g>`).join('')}</g>`;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1060 1484" width="265" height="371" role="img" aria-labelledby="${prefix}-title ${prefix}-desc" data-direction="NW-eight-view" data-pose="neutral-standing" data-hair="${style.id}" data-head-offset-x="10.875">
<title id="${prefix}-title">${style.label} · 新增 NW 斜侧中性站姿</title>
<desc id="${prefix}-desc">独立矢量路径；沿用已确认二维稿的头肩位置、圆润脸型与软影。原四视图未修改。本文件是新增 NW 背侧方向，不覆盖旧 NW=背面映射。</desc>
${definitions(prefix)}
${shadow}
${sharedBody.replaceAll('PREFIX',prefix)}
<g data-part="head" transform="translate(${reference.headTranslation},0)">
  ${hair.back}
  <path data-part="head-skin" d="${l.skinBase.d}" fill="url(#${prefix}-skin)"/>
  ${hair.front}
  ${hat(prefix)}
</g>
</svg>\n`;
  assert.ok(!/<(?:image|foreignObject|script)\b|data:image|\.png/i.test(svg));
  const file=`public/character-${style.id}-standing-nw.svg`;
  fs.writeFileSync(file,svg);
  report.push({id:style.id,file,bytes:Buffer.byteLength(svg),sha256:hash(file)});
}
for(const item of protectedFiles)assert.equal(hash(item.path),item.sha256);
fs.writeFileSync('docs/architecture/metrics/CHARACTER-NW-SVG-2026-10-16/hair-touchup-v4/assets.json',JSON.stringify({files:report,protectedFilesUnchanged:protectedFiles.length,source:reference.source,sourceSha256:reference.sourceSha256,headTranslation:reference.headTranslation,sharedBodySha256:crypto.createHash('sha256').update(sharedBody).digest('hex')},null,2));
console.log(JSON.stringify(report));
