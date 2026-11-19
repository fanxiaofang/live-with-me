# 图像生成提示词

工具：内置 image_gen。生成意图：带参考图的设计候选，非直接修改项目运行资产。背景为不透明深绿。

## 造型与比例板

输入：用户当前v11标注截图（诊断参考，不保留标框）。输出：shape-target-v1.png。

```text
Use case: stylized-concept / production character reference sheet.
Input image 1 is a diagnostic REFERENCE ONLY from a game: preserve the identity of its luminous pale-cyan spirit stag, fine branched antlers, quiet dark forest-green background, and relatively successful elegant forelegs. Do not copy its errors: the red-marked head-neck area looks folded and the green-marked rump is bulbous. Do not reproduce colored rectangles.
Create an ideal target design board for a game animator, high-resolution landscape 3:2. This is a DESIGN EXPLORATION, not a biological measurement chart. Refined, anatomical, cinematic deer grace, realistic deer structural logic with restrained stylization, light streamlined muscles, not a heavy realistic muscular animal.
ONE consistent adult male deer across views, no horse, goat, dog or fantasy extra appendages. Exactly four anatomically coherent legs, small cloven hooves, slender distal legs. Retain roughly the reference antler size and sparse branching. Compact upper forelimb under the chest, visually long delicate cannon segments but not stilt-like; the thin foreleg aesthetic in the source is already acceptable. Proximal hindquarter has a shallow elongated flow of muscle from pelvis toward stifle, NOT a round buttock, saddlebag, lump, haunch ball, or exaggerated mass. Nearly level continuous back into a gently descending croup and short low tail. Refined abdomen with a modest tuck. Slim pelvis width in front and rear views; no pinched dysfunctional pelvis. Natural rear hock geometry remains.
Head and neck must be especially polished: smoothly tapered small deer head with a gentle forehead-to-muzzle bridge, subtle jaw and throat, coherent ear bases, softly curved alert neck and continuous poll connection. No origami folds, polygon facets, square jaw, neck hinge, hard seam, swan kink, detached nose glow or bobblehead.
Spirit material: translucent opalescent cyan-white low-frequency soft volume that clearly carries anatomy, sparse subtle fibers flowing along the body, controlled halo at antlers and hooves. No dense horizontal wire grid, bright cut seams, lumpy exposed muscles, horror skeleton or overblown bloom. Keep leg silhouette readable.
Layout: upper row has three aligned orthographic neutral-standing studies: a large right-facing exact SIDE view, FRONT view, REAR view, all at a consistent scale and ground line. Lower row has a beautiful large three-quarter target render on the left and a large smooth head/neck three-quarter detail on the right. Leave disciplined generous margins. Restrained fine technical guide lines may indicate shoulder level, pelvis level, and principal leg landmarks, but do not cover the beauty silhouettes with a skeleton. Small elegant warm-gold guides and mint guides, refined legible Simplified Chinese typography.
Exact text only:
Title “灵鹿 · 轻盈流线造型目标”
View labels “侧面” “正面” “背面” “三分之四视角” “头颈连续曲面”
Short callouts “肩胛融入胸廓” “臀线平顺，不做鼓包” “股部压薄，向膝部收束” “炮骨修长，保留跗关节” “颌颈柔和过渡” “设计参考，非生物学测量”
Make the anatomy and the narrow streamlined rump visually explicit. This is a polished professional concept art reference sheet, not a UI mockup or a reproduction of the old screenshot.
```

## 姿态板

输入：当前v11标注截图，以及上一步造型板（统一角色与风格参考）。输出：pose-reference-v1.png。

```text
Use case: stylized-concept / annotated animation pose reference.
Input image 1: old game screenshot, diagnostic reference only; DO NOT replicate its folded head-neck join, round oversized rump, or colored boxes. Input image 2: the newly generated streamlined spirit deer turnaround, use this as the SAME CHARACTER identity, anatomy, narrow pelvis, small refined head, smooth head-neck surface, soft slim proximal musculature, long slender distal limbs, sparse branch antlers and cyan spirit material. Do not make the rump bulky again.
Create ONE polished landscape 3:2 high-resolution production POSE BOARD, three equal columns: calm slow walking, small graceful forward leap, quiet alert stance. A single consistent adult stag, exactly four coherent legs and small cloven hooves per pose. All main poses face right for comparison. Thin streamlined muscles only, no horse haunches, balloons, bodybuilder bulges, origami facets, broken knees, skeleton horror, extra limbs, excessive glow, big forest scenery or distracting particles. Dark forest-green studio background matching the references, quiet soft cyan-white translucency, fine restrained flowing filaments. Full bodies and hooves visible with adequate margins.
Each column contains a large beautiful final-material pose on top, a matching simplified low-glow anatomical/control silhouette directly below, and six short Simplified Chinese notes at the bottom. The schematic is an ANIMATION DESIGN GUIDE, not a literal radiograph or exact force simulation. Use consistent discreet dots and fine lines, preserve readable anatomy. Label shoulder line and pelvis line with small amber ticks; turquoise gaze direction arrow; coral approximate center-of-mass dot and vertical dashed projection for grounded poses; a violet line follows spine and head-neck gesture. For the leap use a LOW shallow dotted trajectory arc, COM in the air; do not show a planted stance foot. Make guides physically coherent and label them as a proxy.
Column 1 “慢走”: a natural low-amplitude walk transition with overlapping limb motion. Near forelimb softly advancing forward with elbow action and a low clear hoof, not high prancing. Far forelimb planted under chest in an extended but not locked support. Near hindlimb finishes grounded push behind pelvis, far hindlimb recovers with stifle/hock folding underneath. Keep all four limbs distinct. Body glides horizontally with quiet level shoulders, gently sloped croup, subtle natural spine. Head steady, neck soft and gently forward, gaze ahead. Ground projection of COM lies within the support span.
Column 2 “轻跃”: a SMALL quiet forward hop, captured midflight after rear push, all four hooves off the ground. Body is only modestly elevated, slightly nose-up, no giant flying jump or rearing. Forelimbs softly gathered and beginning to reach, hindlimbs folded compactly under pelvis with recognizable stifle and hock, not four identical tucked pegs. Elastic subtle spine curve, elongated soft neck, stable head, gaze forward/down toward landing. Keep slim hindquarters the same size as the walking deer; communicate stored power through joint folding rather than bulky muscle.
Column 3 “警戒”: a stable elegant four-hoof standing stance with the near/far feet slightly staggered and separately readable. Weight balanced within supports, no crouched injured hindlimb. Neck lengthens and lifts softly, smooth poll and throat, head turns slightly toward viewer while gaze points attentively forward-right. Ears attend to sound; spine quiet, shoulders and pelvis steady. Neither a frozen soldier nor a startled rearing animal.
Typography: crisp refined readable Simplified Chinese, generous line spacing, mint/ivory notes, no small illegible essays. Draw identical numbering/style for notes in each column. Use these EXACT concise notes under the corresponding panels:
Title “灵鹿 · 慢走 / 轻跃 / 警戒 姿态参考”
Slow walk notes:
“肩臀线：平稳，臀线微降”
“视线：平视前方”
“重心：支撑区内，低幅起伏”
“头颈：稳定，柔和前送”
“四肢：承重舒展，回收有折叠”
“脊柱：近水平，轻微弹性”
Leap notes:
“肩臀线：整体轻抬，不耸臀”
“视线：前下方落点”
“重心：沿浅弧前移”
“头颈：延伸，头部稳定”
“四肢：后肢蹬伸后收折，四蹄离地”
“脊柱：轻微伸屈，不折腰”
Alert notes:
“肩臀线：安定，不挤成鼓包”
“视线：前方目标”
“重心：四蹄支撑区内”
“头颈：柔和抬起，耳朵听音”
“四肢：错位站定，关节留余量”
“脊柱：舒展，不僵直”
Footer “动作设计示意 · 非动捕或生物力学测量”
Ensure the visuals, guide dots and arrows actually agree with these poses. Keep the quiet ethereal look of image 2, continuous elegant anatomy, with the rump smaller and smoother than image 1.
```
