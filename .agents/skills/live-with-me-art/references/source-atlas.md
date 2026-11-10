# 项目源码参考索引

以下路径均相对仓库根目录，检索当前源码中的组件名/ID，不依赖容易失效的行号。初次提炼于 2026-10-31；当前文件与实际渲染优先于历史注释或截图。参考只读，不意味着获准修改这些资产。

## 参考的适用边界

索引列出可学习的部位，不给整件资产作合格或用户认可背书。选择时说明借鉴什么，勿把该资产的造型、色板与细节密度全部推广到其他对象。新增反馈只更新相关适用点；没有明确反馈的版本不标注“已认可”。

- 南瓜架、蜂箱、咖啡柜小物：参考形体、承托与材质色组；不向其他材料复制全部亮边和纹理。
- 羊圈石墙：参考压顶、转角端面和错缝；整段石缝密度不宜直接缩入小图标。
- 桂花树：枝干分叉、树冠遮挡和桂花可作局部参考；其团簇概括适用于该树，不能作为白桦／其他阔叶树的通用冠形。
- 近处三类树：落叶松方向曾获正向反馈；白桦在补齐下部枝簇后的 `open-weave` 版本获用户通过，适合参考挺拔主干、图形树皮与层叠叶簇。早期“三团冠”和碎叶帘不再代表当前白桦；暖阔叶不能据此视为已通过。详见 [植物结构与品种](plants.md)。
- 庭院蔬菜：用户明确通过过番茄造型，后续姿态、果面等调整不自动继承整件验收；上海青／小白菜的“猫爪”形得到用户明确喜爱，可参考自然株形中保留可爱变体的方式。其余新增作物、土地、香草苗圃和多肉区按当前效果与明确反馈判断，不因已实现就标为已认可。

## 按资产查找

| 用户参照 | 源码路径 | 检索锚点与学习重点 |
|---|---|---|
| 南瓜架及配件 | `src/world/render/BackgroundLandscape.tsx` | `cottage-pumpkin-patch`、`spilling-pumpkin-vines`；架体厚度、暗木与亮果蔬、招牌/工具与地面关系 |
| 蜂箱与小蜜蜂 | `src/world/render/BackgroundLandscape.tsx` | `storybook-wooden-beehive`；支腿、起降板、木箱侧面、绿屋顶、细小金色重点 |
| 拖拉机与组件 | `src/world/render/BackgroundLandscape.tsx` | `tractor-in-field`、`tractor-farm-supplies`、`data-tractor-body`；红漆、胎纹、轮毂、排气、座椅、农具篮 |
| 炉子 | `src/components/CastIronWoodStove.tsx` | `STOVE_PALETTES`；跨色相保留 facet/stroke/hi 的角色，底座、炉门、烟管和炉脚 |
| 咖啡与黑胶角总体 | `src/components/cabinet/RecordCabinet.tsx`、`CabinetFrame.tsx`（同目录） | `warm-walnut-cabinet`；统一承接面、柜板厚度、深格与浅物的对比、暖木倒角 |
| 唱片机 | `src/components/cabinet/RetroTurntable.tsx` | `retro-turntable-unit`；象牙白机身、黑胶、珊瑚橙键、黄铜件；投影与旋转分层 |
| 蜂蜜罐 | `src/components/cabinet/HoneyJar.tsx` | `honey-jar-body`、`honey-jar-lid`；金蜜液、透明玻璃、布盖、木棒分别处理 |
| 咖啡豆与陶杯 | `src/components/cabinet/CoffeeCorner.tsx` | `CoffeeBeansDisplay`、`CeramicCupsDisplay`；纸袋折角、少数豆形、软木塞、釉杯与素陶 |
| 摩卡壶 | `src/components/cabinet/MokaPot.tsx` | `MokaPot`；八角金属分面、深电木手柄、黄铜阀 |
| 羊圈与草卷 | `src/components/scenery/yorkshire/boundaries/SheepPen.tsx`、`src/components/scenery/yorkshire/dressing/HayBaleStack.tsx` | 棚架、石水槽、前后围栏；`sheep-pen-exterior-hay-bales` 的卷芯、绳与堆叠 |
| SVG 版插画 | `src/components/wall-posters/WallPostersGallery.tsx` | `poster-young-woman` 及另外两幅海报；画芯主题色、简化形体、木框、卡纸与挂绳。这里以现有墙面 SVG 插画为参照，若用户指定其他作品则补充索引 |
| 一楼地板 | `src/components/architecture/TimberFlooring.tsx`、`TimberFloorMaterial.tsx`（同目录） | `artisan-timber-flooring`、`timberPlankTones`、`SparseTimberGrain`；局部轴、安静暗缝、微色差、收边梁和昼夜木色 |
| 桂花树 | `src/components/scenery/yorkshire/vegetation/GuardianOsmanthus.tsx` | `guardianTreePalette`、`OsmanthusWood`、`OsmanthusCanopy`；枝干扭转、冠团层级、对生叶与四瓣花 |
| 草地／麦田近树 | `src/components/scenery/yorkshire/vegetation/NearFieldTreeShape.tsx`、`src/components/scenery/yorkshire/terrain/FieldEdgePlanting.tsx`、`TerrainSilhouette.tsx`（同 terrain 目录） | `BirchOpenCrown`、`open-weave`、`wheat-margin-trees`；获通过白桦的主干、树皮、层叠叶簇与下枝连接；其他树种按各自适用边界参考 |
| 庭院菜地与作物 | `src/components/scenery/yorkshire/dressing/TilledGardenPlot.tsx`、`GardenVegetable.tsx`、`GardenLeafCrops.tsx`、`GardenUprightCrops.tsx`、`GardenHerbCrops.tsx`（同目录） | 按组件名定位物种；土面／根点投影与直立植株分离，主体色面、花果连接、品种姿态变体；不照搬固定株数或比例 |
| 香草苗圃与草莓 | `src/components/scenery/yorkshire/dressing/KitchenHerbNursery.tsx`、`KitchenGardenPlants.tsx`（同目录） | `KitchenHerbPlant`、`StrawberryPlant`、`kitchen-herb-nursery`；可复用植物、木槽与陶盆承接、三出复叶及花果梗；整体效果未自动获通过 |
| 南瓜架多肉与藤叶 | `src/components/scenery/yorkshire/dressing/PumpkinGardenPlants.tsx`、`src/world/render/BackgroundLandscape.tsx` | `PumpkinSucculentNursery`、`PumpkinLobedLeaf`、`spilling-pumpkin-vines`；原有深绿／薄荷绿关系、浅裂叶和瓜蒂附近绕出的藤；保留用户指定颜色，不把细部调整当作更换整件配色的授权 |
| 小火车 | `src/components/scenery/yorkshire/infrastructure/RailwayLandscape.tsx` | `ribblehead-steam-train`；深绿车头、红褐车厢、暖窗、金属小件与蒸汽。保留其景深下的信息简化，不把近景细节密度强加于它 |
| 大木屋门前踩踏痕迹 | `src/components/architecture/CottageFoundation.tsx`、`src/components/scenery/yorkshire/dressing/MeadowWearPatch.tsx`、`src/components/scenery/yorkshire/vegetation/HomesteadMeadowPlanting.tsx` | `porch-entry-grass-wear`、`MeadowWearPatch`、`porch-landing`；主要入口磨损与轻量延伸碎片是不同层，均应留草间隙 |
| 室内盆栽 | `src/components/plants/MonsteraPlant.tsx` | `component-monstera-deliciosa`；叶片前后、孔洞、新叶、土壤、素陶盆、木架与脚底影 |
| 床上用品 | `src/components/architecture/MainCottageHaven.tsx` | `tatami-pillow`、`tatami-folded-quilt`；暖米枕头、红陶毯、绿席、厚折层与软接触影；其他房间床品再按实际任务补读 |
| 公共茶具 | `src/components/architecture/MainCottageHaven.tsx` | `tea-set`；木托盘厚度、茶壶、杯口与茶汤、少量鲜色茶点 |
| 书架小物 | `src/components/bookshelf/ShelfDecorations.tsx`、`Bookshelf.tsx`（同目录） | `PineconeBasket`、`TrailingIvy`、`DryVase` 等；微型资产保留辨识特征，不塞过多纹理 |

## 接入辅助参考

- `src/world/render/GroundShadow.tsx`：区分接触影、环境影与软物阴影。
- `src/components/inspection/usePreviewSvgIds.ts`：独立预览资源 ID 隔离。
- `src/world/render/SceneEntity.tsx`、`src/world/scene/sceneLayout.ts`：实体外层变换；不要在内部各自缩放物件、人物和命中区。
- `src/components/layout-gizmo/isoMath.ts`：家具 authoring 的轴向；以实际父节点空间为准。
- `docs/visual-system/live-with-me-projection-spec.md`：投影提取的历史参考；其中旧相机、旧摆放数值不是当前实现。

## 使用顺序

制作新花器：先看陶杯/盆栽，再看将要放置的柜格。制作机械小摆件：先看摩卡壶或拖拉机，再看书架小物的细节密度。制作新床品：先看枕头/折毯，再看人物或家具遮挡。

优先复用规律，不复制整套装饰：新花器不必带蜜罐标签，新机械不必使用拖拉机红，新布料不必沿用红陶色。
