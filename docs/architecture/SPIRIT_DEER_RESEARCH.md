# 守护灵鹿：设计取舍与研究索引

更新：2026-11-19。当前正式实现与维护入口见 [SPIRIT_DEER.md](SPIRIT_DEER.md)。本页保留实验结论，避免重复失败路径；它不是待执行计划。

## 已通过的阶段基线

- 保留原生程序化灵鹿及四肢、30 控制骨架；不采用 Polyfork 的体型、头部摇摆或 Run 动画。
- 颈背修正 v33、尾巴修正 v34 已通过；形体修正已结束，本次不再重做比例。
- 主色采用低饱和月白蓝；透明度、身体光丝和原有透光响应保持。
- 最终外围氛围采用 D 林间灵息，且只在凝聚／离场转换时段出现；日常守望与巡视安静，脚下花不变。
- 这是当前阶段通过的项目实时效果。概念图是方向参考，不能当作真实渲染或精确骨长／动作测量。

## 未采用的实验与原因

| 实验 | 观察／结论 | 本次处理 |
| --- | --- | --- |
| Polyfork GLB 与混合体型 | 躯干／后腿有参考价值，但头颈、鹿角与原版轻盈气质不一致 | 删除运行资产、加载器及改造代码；保留来源与历史评论 |
| 连续雾带、B＋D 融合、流场原型 | 实时效果像固定装饰、局部排气；独立曲线与概念图的体积雾观感差距大 | 删除雾带和纹理原型；保留全部概念图与提示词 |
| A＋D 星屑、近身光屑 | 全程效果叠加后过多，且像附着在身上 | 删除 A 的运行实现，保留 D 的独立飞行历史轨迹 |
| 身体柔边／外壳光晕 | 易产生重影、散光和双轮廓 | 删除试验合成分支；正式辉光只来自外围灵息 |
| 局部内部雾／发光斑 | 密度与发光叠加显出斑块，进一步强调臀腹分段 | 删除替代材质试验，不继续堆噪声 |
| 静态 SDF 体积渲染 | 暴露分团体积；静态实验不能证明蒙皮动画体积效果成立 | 删除静态体积实验与重复截图脚本 |
| 纯色比较 | 珍珠冷白、香槟金作为对照；用户最终选月白蓝 | 固定正式色值，删除运行时选色开关 |

薄体积短步进、Fresnel、加法合成、溶解与 Bloom 都是可用工具，但单独换名词或叠噪声不能保证美术结果。透明画布没有 SVG 庭院背景的颜色／深度缓冲，不能直接套用游戏引擎抓屏折射。电影中的体积角色还有离线体积、毛发、合成等制作环节，不能把概念图质量当作当前 WebGL 实现的承诺。

## 外部参考与授权

Polyfork：Crystal-Antlered Spectral Stag，https://polyfork.dev/api/assets/spectral-stag-d19dc1 ，原模型 CC BY 4.0。此阶段正式鹿的模型、骨架和步态使用项目原生实现；不再分发该 GLB。历史评审与原授权文字见概念目录中的 POLYFORK_REVIEW.md。

慢步采用参考视频观察后的项目内关键姿态采样，不是提取视频动捕，也不是导入外部 Run。轻跃设计仍可参考概念姿态板，后续必须单独验收，不能把本轮通过视为电影级跳跃的通过。

## 本轮留存的研究链接

下列链接由本轮已有研究记录汇总，本次收尾没有重新逐个在线验证。保留原始来源，避免把研究演示或作者性能数据当成本项目实测。

- https://cdn.cloudflare.steamstatic.com/apps/valve/2010/siggraph2010_vlachos_waterflow.pdf
- https://dev.epicgames.com/documentation/en-us/unreal-engine/how-to-create-a-ribbon-effect-in-niagara-for-unreal-engine
- https://www.cs.ubc.ca/~rbridson/docs/bridson-siggraph2007-curlnoise.pdf
- https://research.manchester.ac.uk/en/publications/the-musculoskeletal-anatomy-of-the-reindeer-rangifer-tarandus-for/
- https://pmc.ncbi.nlm.nih.gov/articles/PMC7666566/
- https://bds.org.uk/wp-content/uploads/2025/05/Deer_Winter-2021-22.pdf
- https://polyfork.dev/asset/spectral-stag-d19dc1
- https://datadryad.org/dataset/doi:10.5061/dryad.rf5bj
- https://pmc.ncbi.nlm.nih.gov/articles/PMC8048804/
- https://www.mdpi.com/2076-2615/12/21/3053
- https://ramonhernandez25.artstation.com/projects/K3zq5y
- https://pmc.ncbi.nlm.nih.gov/articles/PMC6871776/
- https://pmc.ncbi.nlm.nih.gov/articles/PMC4844082/
- https://threejs.org/manual/pages/animation-system.html
- https://dev.epicgames.com/documentation/en-us/unreal-engine/pose-warping-in-unreal-engine
- https://github.com/sebastianstarke/AI4Animation/blob/master/AI4Animation/SIGGRAPH_2018/ReadMe.md
- https://history.siggraph.org/wp-content/uploads/2022/08/2020-Talks-Fong_Finding-the-Look-of-Souls.pdf
- https://history.siggraph.org/wp-content/uploads/2022/08/2020-Talks-Coleman_Making-Souls_-Methods-and-a-Pipeline-for-Volumetric-Characters.pdf
- https://cinesite.com/digitalmediaworldharrypotterdeathlyhallows2/
- https://www.harrypotter.com/features/clues-jkr-gave-us-about-the-harry-potter-books-death-and-redemption
- https://www.disneyanimation.com/publications/splat-developing-a-strange-shader/
- https://cdn.disneyanimation.com/uploads/publications/splat-developing-a-strange-shader/Splat_Developing_a_Strange_Shader.pdf
- https://endarg.artstation.com/projects/R3L44v
- https://github.com/Salwa08/ethereal-patronus
- https://threejs.org/manual/pages/tips.html#making-the-canvas-transparent
- https://threejs.org/manual/pages/color-management.html
- https://cinesite.com/the-magic-continues/
- https://www.artofvfx.com/harry-potter-and-the-deathly-hallow-part-1-holger-voss-superviseur-3d-cinesite/
- https://threejs.org/examples/webgl_volume_cloud.html
- https://github.com/mrdoob/three.js/blob/dev/examples/webgl_volume_cloud.html
- https://developer.nvidia.com/gpugems/gpugems/part-vi-beyond-triangles/chapter-39-volume-rendering-techniques
- https://threejs.org/examples/webgl_postprocessing_unreal_bloom_selective.html
- https://developer.nvidia.com/gpugems/gpugems3/part-iv-image-effects/chapter-23-high-speed-screen-particles
- https://threejs.org/docs/pages/SkinnedMesh.html
- https://threejs.org/docs/pages/CCDIKSolver.html
- https://github.com/jeromeetienne/threex.geometricglow
- https://jeromeetienne.github.io/threex.geometricglow/examples/geometricglowmesh.html
- https://stemkoski.github.io/Three.js/Shader-Glow.html
- https://threejs.org/examples/webgl_postprocessing_unreal_bloom.html
- https://threejs.org/docs/pages/UnrealBloomPass.html
- https://github.com/mrdoob/three.js/blob/dev/examples/jsm/postprocessing/UnrealBloomPass.js
- https://www.gamedeveloper.com/programming/surface-shaders-for-the-recently-deceased
- https://mattstein.artstation.com/projects/m8JGVE
- https://github.com/BinaryVortex/Spectral-Spooky-Ghost-3JS
- https://threejs.org/docs/pages/MeshStandardMaterial.html#normalMap
- https://github.com/mrdoob/three.js/blob/dev/src/renderers/shaders/ShaderChunk/skinnormal_vertex.glsl.js
- https://threejs.org/docs/pages/Material.html#alphaHash
