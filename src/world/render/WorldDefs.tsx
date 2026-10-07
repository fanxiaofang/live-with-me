import React from 'react';
import { YorkshireDefs } from '../../components/scenery/yorkshire';
import type { YorkshireSceneTheme } from '../../components/scenery/yorkshire/landscapeTypes';
import './landscape.css';
export interface WorldDefsProps {
  theme: YorkshireSceneTheme;
}
function WorldDefsAsset({ theme }: WorldDefsProps) {
  return <><defs>
            {/* Unified Low-Poly Theme Defs, Gradients & Patterns */}
            <YorkshireDefs theme={theme} />

            {/* Seamless Panoramic Sky Fill Gradient (万物生灵参考图经典4阶渐变：夏日灰蓝天际 -> 柔和浅青 -> 暖金晨雾 -> 地平线奶油杏黄) */}
            <linearGradient id="skyFillGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.skyTop} />
              <stop offset="48%" stopColor="#96bac5" />
              <stop offset="78%" stopColor="#dbe8e0" />
              <stop offset="100%" stopColor={theme.skyBottom} />
            </linearGradient>

            {/* Yorkshire Dales wheat field texture (toasted oat & straw) */}
            <pattern id="wheatPattern" width="16" height="16" patternTransform="rotate(35 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="16" stroke="#cbb274" strokeWidth="2" opacity="0.6" />
              <line x1="8" y1="0" x2="8" y2="16" stroke="#ded0a8" strokeWidth="1.6" opacity="0.4" />
            </pattern>

            {/* Yorkshire Dales pasture texture (muted olive & sage) */}
            <pattern id="grassPattern" width="14" height="14" patternTransform="rotate(-25 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="14" stroke="#4d643d" strokeWidth="1.8" opacity="0.6" />
              <line x1="7" y1="0" x2="7" y2="14" stroke="#667f53" strokeWidth="2" opacity="0.5" />
            </pattern>

            {/* River Water Gradient */}
            <linearGradient id="riverGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={theme.riverColor} />
              <stop offset="50%" stopColor={theme.riverReflect} />
              <stop offset="100%" stopColor={theme.riverColor} />
            </linearGradient>

            {/* Soft Shadow Filter */}
            <filter id="cozyShadow" x="-10%" y="-10%" width="125%" height="125%">
              <feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.2" />
            </filter>
            <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.18" />
            </filter>

            {/* Diorama Atmospheric Cloud & Mist Diffusion Filters (消除贴画生硬边缘，提供水彩漫反射与空气透视羽化) */}
            <filter id="cloudAtmosphereBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.6" />
            </filter>
            <filter id="ridgeMistBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6.5" />
            </filter>
            <filter id="wispyCloudSoft" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.0" />
            </filter>

            {/* Retro Anime Parallax Cloud Drift Animations (长周期舒缓漂移，赋予微缩景观呼吸感) */}


            {/* Roof terracotta tile pattern (饱满哑光老陶瓦层次) */}
            <linearGradient id="terracottaRoof" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.roofColor} />
              <stop offset="60%" stopColor="#8c3822" />
              <stop offset="100%" stopColor="#6e2716" />
            </linearGradient>

            {/* Fireplace Wall & Floor Ambient Glow (消除贴纸感，提供墙面与地面的真实光影漫反射) */}
            <radialGradient id="hearthWallWarmGlow" cx="50%" cy="75%" r="65%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.48" />
              <stop offset="45%" stopColor="#ea580c" stopOpacity="0.25" />
              <stop offset="85%" stopColor="#9a3412" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#7c2d12" stopOpacity="0" />
            </radialGradient>

            {/* Wooden Cabin Interior Warm Candlelight Radial Glow */}
            <radialGradient id="cabinGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff8eb" stopOpacity="0.92" />
              <stop offset="45%" stopColor="#fed7aa" stopOpacity="0.48" />
              <stop offset="100%" stopColor="#9a5824" stopOpacity="0" />
            </radialGradient>

            {/* Wooden Cabin Shingle, Log, and Stone Gradients */}
            <linearGradient id="cabinLogGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9e693d" />
              <stop offset="35%" stopColor="#82522b" />
              <stop offset="70%" stopColor="#673e1f" />
              <stop offset="100%" stopColor="#482710" />
            </linearGradient>

            <linearGradient id="cabinStoneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#635b50" />
              <stop offset="50%" stopColor="#494137" />
              <stop offset="100%" stopColor="#2e2720" />
            </linearGradient>

            <linearGradient id="cabinShingleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#c55f3a" />
              <stop offset="50%" stopColor="#a34524" />
              <stop offset="100%" stopColor="#722b13" />
            </linearGradient>

            {/* 3D Sloping Roof Side Shingle Gradient (Sunlit Terracotta) */}
            <linearGradient id="cabinRoofSideGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#df7a57" />
              <stop offset="35%" stopColor="#c55f3a" />
              <stop offset="70%" stopColor="#a34524" />
              <stop offset="100%" stopColor="#682913" />
            </linearGradient>

            {/* 3D Timber Floor Waxed Hardwood Gradient */}
            <linearGradient id="cabinFloorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a87a4e" />
              <stop offset="50%" stopColor="#8c5f35" />
              <stop offset="100%" stopColor="#674121" />
            </linearGradient>

            {/* 2.5D Isometric Cabin Floorboard Perspective Gradient (Back depth to front threshold) */}
            <linearGradient id="cabinFloorIsoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4f2f16" />
              <stop offset="35%" stopColor="#6d4422" />
              <stop offset="70%" stopColor="#8c5d35" />
              <stop offset="100%" stopColor="#9e6d40" />
            </linearGradient>

            {/* 2.5D West Side Wall Ambient Occlusion Gradient */}
            <linearGradient id="cabinSideWallGrad" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#4d321d" />
              <stop offset="60%" stopColor="#6d4627" />
              <stop offset="100%" stopColor="#845833" />
            </linearGradient>

            {/* 2.5D East Partition Wall Interior Shadow Gradient */}
            <linearGradient id="cabinEastWallGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#482e1a" />
              <stop offset="50%" stopColor="#5d3a20" />
              <stop offset="100%" stopColor="#7a4e2a" />
            </linearGradient>

            {/* 2.5D Ceiling & Soffit Ambient Occlusion Drop Shadow */}
            <linearGradient id="cabinCeilingAOGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a0f07" stopOpacity="0.75" />
              <stop offset="65%" stopColor="#28170c" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#28170c" stopOpacity="0" />
            </linearGradient>

            {/* Brass Hurricane Porch Lantern Radial Glow */}
            <radialGradient id="cabinLanternGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fffbeb" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#fde68a" stopOpacity="0.6" />
              <stop offset="75%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
            </radialGradient>

            {/* Corn Lounge / Cabin Fallback Radial Glow */}
            <radialGradient id="cornGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff8eb" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#fed7aa" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#c27329" stopOpacity="0" />
            </radialGradient>

            {/* Toasted Harvest Corn Shell Gradient */}
            <linearGradient id="toastedCornGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dfb770" />
              <stop offset="55%" stopColor="#c58e42" />
              <stop offset="100%" stopColor="#9c6628" />
            </linearGradient>

            {/* Unified Homestead Garden Lawn Gradient (阳光明媚温暖的约克郡金橄榄草坪，从向阳草绿自然过渡到温和暗苔) */}
            <linearGradient id="homesteadLawnGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#98ad48" />
              <stop offset="42%" stopColor={theme.hillGreenMid} />
              <stop offset="85%" stopColor="#637c35" />
              <stop offset="100%" stopColor={theme.hillGreenNear} />
            </linearGradient>

            {/* Foreground Pasture Sunlit Gradient (近景辽阔草甸：暖金草尖、深邃厚实苔藓底座，层次鲜明) */}
            <linearGradient id="foregroundPastureGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#829940" />
              <stop offset="30%" stopColor={theme.hillGreenNear} />
              <stop offset="75%" stopColor="#2c3c18" />
              <stop offset="100%" stopColor="#1a2510" />
            </linearGradient>

            {/* Retro Anime & Diorama Atmospheric Cloud Gradients (低对比度灰蓝、柔乳灰与晨霭紫蓝，融入远山与大气) */}
            <linearGradient id="cloudFarBandGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c2d5e2" stopOpacity="0.68" />
              <stop offset="35%" stopColor="#d5e3ec" stopOpacity="0.55" />
              <stop offset="70%" stopColor="#a8bfd0" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#92abc0" stopOpacity="0.08" />
            </linearGradient>

            {/* Cloud Crest Soft Highlight (绝非死板纯白，而是晨光透射下的极淡乳蓝灰天光) */}
            <linearGradient id="cloudCrestGlaze" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#edf3f7" stopOpacity="0.48" />
              <stop offset="50%" stopColor="#cde0ed" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#b2c8d8" stopOpacity="0.0" />
            </linearGradient>

            {/* Midground Mountain Ridge & Valley Mist (山谷流岚与山脊薄雾，与远山交融晕染) */}
            <linearGradient id="ridgeValleyMistGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c8dbe6" stopOpacity="0.0" />
              <stop offset="30%" stopColor="#dde7ee" stopOpacity="0.45" />
              <stop offset="65%" stopColor={theme.skyBottom} stopOpacity="0.55" />
              <stop offset="100%" stopColor={theme.skyBottom} stopOpacity="0.0" />
            </linearGradient>

            {/* Upper Atmosphere Wispy Cirrus Gradient */}
            <linearGradient id="wispyCirrusGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9bb4c7" stopOpacity="0.0" />
              <stop offset="25%" stopColor="#c0d4e2" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#d4e3ed" stopOpacity="0.5" />
              <stop offset="85%" stopColor="#b2c8d8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#9bb4c7" stopOpacity="0.0" />
            </linearGradient>

            {/* Distant Atmospheric Aerial Haze (极致空气透视雾霭，让远山与天际线柔和交融) */}
            <linearGradient id="distantHazeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.skyBottom} stopOpacity="0" />
              <stop offset="50%" stopColor={theme.skyBottom} stopOpacity="0.45" />
              <stop offset="100%" stopColor={theme.skyBottom} stopOpacity="0.8" />
            </linearGradient>

            {/* Deep Water Translucent Depth Gradient (万物生灵参考图纯正青碧宝石溪水·Teal-Cyan Beck) */}
            <linearGradient id="riverDepthGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#76bcbb" stopOpacity="0.9" />
              <stop offset="30%" stopColor={theme.riverColor} stopOpacity="0.98" />
              <stop offset="70%" stopColor="#286969" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#4c9391" stopOpacity="0.92" />
            </linearGradient>

            {/* North Shore Grassy Bank Slope Gradient (北岸：向阳草坡过渡到暖褐溪流泥滩) */}
            <linearGradient id="northBankSlope" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.hillGreenMid} />
              <stop offset="55%" stopColor="#556c32" />
              <stop offset="100%" stopColor="#826848" />
            </linearGradient>

            {/* South Shore Pebble Verge to Meadow Gradient (南岸：暖砂卵石滩平滑衔接青青草甸) */}
            <linearGradient id="southBankSlope" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#786144" />
              <stop offset="40%" stopColor="#52692e" />
              <stop offset="100%" stopColor={theme.hillGreenNear} />
            </linearGradient>

            {/* Terraced Agricultural Retaining Bund Loam Gradient */}
            <linearGradient id="terraceLoamGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5d4227" />
              <stop offset="60%" stopColor="#473019" />
              <stop offset="100%" stopColor="#301e0f" />
            </linearGradient>

            {/* 2.5D Isometric Terraced Stone Retaining Wall Gradients (石砌护土台地梯级) */}
            <linearGradient id="stoneWallCapGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#827769" />
              <stop offset="50%" stopColor="#9a8e7f" />
              <stop offset="100%" stopColor="#7c7062" />
            </linearGradient>
            <linearGradient id="stoneWallFaceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f4439" />
              <stop offset="50%" stopColor="#3a3128" />
              <stop offset="100%" stopColor="#251f19" />
            </linearGradient>

            {/* Yorkshire Dales Drystone Wall Gradients (万物生灵经典干砌石墙：风化灰岩材质) */}
            <linearGradient id="drystoneCapGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#948d82" />
              <stop offset="45%" stopColor="#aba398" />
              <stop offset="100%" stopColor="#878075" />
            </linearGradient>
            <linearGradient id="drystoneFaceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#524d45" />
              <stop offset="60%" stopColor="#3d3831" />
              <stop offset="100%" stopColor="#292621" />
            </linearGradient>

            {/* Yorkshire Ribblehead Stone Railway Viaduct Gradients (约克郡经典石砌高架铁路拱桥) */}
            <linearGradient id="viaductStoneGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#857e72" />
              <stop offset="50%" stopColor="#6f685d" />
              <stop offset="100%" stopColor="#565046" />
            </linearGradient>
            <linearGradient id="viaductArchShade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38332c" />
              <stop offset="100%" stopColor="#28241f" />
            </linearGradient>

            {/* Frame Vignette Gradient (四周边缘画框式压暗，让用户视觉高度聚拢于中心建筑群) */}
            <radialGradient id="frameVignetteRadial" cx="50%" cy="48%" r="62%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" />
              <stop offset="60%" stopColor="#000000" stopOpacity="0" />
              <stop offset="85%" stopColor="#121811" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#0a0e09" stopOpacity="0.45" />
            </radialGradient>
            <linearGradient id="bottomEdgeVignetteGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10170e" stopOpacity="0" />
              <stop offset="40%" stopColor="#10170e" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#0a1008" stopOpacity="0.55" />
            </linearGradient>

            {/* Cast-Iron Stove Surface Gradients (独立式铸铁柴火炉材质渐变) */}
            <linearGradient id="castIronBodyGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3d3731" />
              <stop offset="35%" stopColor="#48423b" />
              <stop offset="70%" stopColor="#2b2724" />
              <stop offset="100%" stopColor="#1e1b19" />
            </linearGradient>
            <linearGradient id="castIronPipeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#34302c" />
              <stop offset="28%" stopColor="#4d463f" />
              <stop offset="65%" stopColor="#2a2623" />
              <stop offset="100%" stopColor="#191715" />
            </linearGradient>

            {/* 焦糖南瓜色懒人沙发布艺渐变 (Warm Caramel Pumpkin Fabric Gradients) */}
            <linearGradient id="caramelPumpkinBack" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e57b37" />
              <stop offset="50%" stopColor="#cb6324" />
              <stop offset="100%" stopColor="#a34712" />
            </linearGradient>
            <linearGradient id="caramelPumpkinSeat" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f08b46" />
              <stop offset="55%" stopColor="#d96f2a" />
              <stop offset="100%" stopColor="#ab4d15" />
            </linearGradient>

            {/* --- NEW FOREGROUND & TERRACE GROUNDING SYSTEM GRADIENTS --- */}
            {/* 1. Countryside Picnic Red-and-Cream Gingham Check Pattern */}
            <pattern id="picnicGinghamPattern" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(22 0 0)">
              <rect width="14" height="14" fill="#fffaf5" />
              <rect width="7" height="14" fill="#e0533c" opacity="0.38" />
              <rect width="14" height="7" fill="#e0533c" opacity="0.38" />
              <rect width="7" height="7" fill="#b91c1c" opacity="0.65" />
            </pattern>

            {/* 2. Ha-ha Stone Retaining Terrace Wall Gradients (英式跌水石砌护坡体系) */}
            <linearGradient id="terraceCopingGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#cfc2af" />
              <stop offset="45%" stopColor="#ded3c1" />
              <stop offset="85%" stopColor="#bdaf9b" />
              <stop offset="100%" stopColor="#9a8d7a" />
            </linearGradient>
            <linearGradient id="terraceWallCoursesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5a4e40" />
              <stop offset="35%" stopColor="#453b30" />
              <stop offset="75%" stopColor="#322920" />
              <stop offset="100%" stopColor="#1e1813" />
            </linearGradient>

            {/* 3. Wooden Boardwalk Pier & Pilings Gradients */}
            <linearGradient id="boardwalkPlankGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9c7a56" />
              <stop offset="50%" stopColor="#ba976f" />
              <stop offset="100%" stopColor="#876644" />
            </linearGradient>
            <linearGradient id="pierPilingGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3d2b1a" />
              <stop offset="50%" stopColor="#543c26" />
              <stop offset="100%" stopColor="#2b1d11" />
            </linearGradient>

            {/* 4. Moored Wooden Rowboat Clinker Hull & Interior */}
            <linearGradient id="rowboatClinkerGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#94592a" />
              <stop offset="45%" stopColor="#75411a" />
              <stop offset="100%" stopColor="#48250c" />
            </linearGradient>
            <linearGradient id="rowboatFloorGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ba854f" />
              <stop offset="60%" stopColor="#966535" />
              <stop offset="100%" stopColor="#69401d" />
            </linearGradient>

            {/* 5. Gnarled Old Apple Tree Bark & Foliage Gradients */}
            <linearGradient id="oldAppleBarkGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#382a1d" />
              <stop offset="35%" stopColor="#4f3c2a" />
              <stop offset="70%" stopColor="#3a291b" />
              <stop offset="100%" stopColor="#23170e" />
            </linearGradient>
            <radialGradient id="appleFruitHighlight" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fca5a5" />
              <stop offset="40%" stopColor="#ef4444" />
              <stop offset="85%" stopColor="#b91c1c" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </radialGradient>

            {/* 6. Diorama Island Strata Cutaway Base (沙盘微缩手办土壤切面基座) */}
            <linearGradient id="dioramaIslandSoilGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2e421c" />
              <stop offset="12%" stopColor="#382516" />
              <stop offset="45%" stopColor="#291a0e" />
              <stop offset="85%" stopColor="#1c1108" />
              <stop offset="100%" stopColor="#100a04" />
            </linearGradient>
            <linearGradient id="dioramaBasePlinthGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#45382b" />
              <stop offset="50%" stopColor="#2e241a" />
              <stop offset="100%" stopColor="#17120c" />
            </linearGradient>

            {/* ========================================================================= */}
            {/* PRESERVED ASSET: SCANDINAVIAN CORNER MASONRY HEARTH                       */}
            {/* (用户要求保留当前石材壁炉作为资产的一部分，不在场景中使用，安全收录于此处) */}
            {/* ========================================================================= */}
            <g id="asset-corner-masonry-hearth">
              <g id="asset-hearth-ground-shadow">
                <polygon
                  points="-27,65.5 -18,68.2 -7,65.2 7,65.2 18,68.2 27,65.5 25,62 0,56 -25,62"
                  fill="#150f0a"
                  opacity="0.28"
                  filter="url(#softShadow)"
                />
                <ellipse cx="0" cy="67" rx="19" ry="6" fill="#f59e0b" opacity="0.25" />
              </g>
              <g id="asset-hearth-unified-base-and-benches">
                <polyline
                  points="-25,65.1 -18,67.1 -7,64.0 7,64.0 18,67.1 25,65.1"
                  fill="none"
                  stroke="#b3a38c"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polygon points="-25,53.1 -18,55.1 -18,67.1 -25,65.1" fill="#ded3c1" stroke="#cbbfa9" strokeWidth="0.4" strokeLinejoin="round" />
                <polygon points="-18,55.1 -7,52.0 -7,64.0 -18,67.1" fill="#ede4d5" stroke="#d6cbba" strokeWidth="0.4" strokeLinejoin="round" />
                <polygon points="-7,52.0 7,52.0 7,64.0 -7,64.0" fill="#e4d9c8" stroke="#d1c5b2" strokeWidth="0.4" strokeLinejoin="round" />
                <polygon points="7,52.0 18,55.1 18,67.1 7,64.0" fill="#d6cbb8" stroke="#c2b49e" strokeWidth="0.4" strokeLinejoin="round" />
                <polygon points="18,55.1 25,53.1 25,65.1 18,67.1" fill="#c8bca7" stroke="#b5a892" strokeWidth="0.4" strokeLinejoin="round" />
                <polygon points="-25,53.1 -14,50.0 -7,52.0 -18,55.1" fill="#f6f0e6" stroke="#ded5c4" strokeWidth="0.4" strokeLinejoin="round" />
                <line x1="-18" y1="55.1" x2="-7" y2="52.0" stroke="#ffffff" strokeWidth="0.7" strokeLinecap="round" />
                <polygon points="14,50.0 25,53.1 18,55.1 7,52.0" fill="#ede3d4" stroke="#d7ccba" strokeWidth="0.4" strokeLinejoin="round" />
                <line x1="7" y1="52.0" x2="18" y2="55.1" stroke="#faf5ed" strokeWidth="0.6" strokeLinecap="round" />
                <polygon points="-14.5,49.6 -7,51.6 7,51.6 14.5,49.6 14.0,50.4 7,52.4 -7,52.4 -14.0,50.4" fill="#dfd5c3" />
                <line x1="-7" y1="52.0" x2="7" y2="52.0" stroke="#fffdfa" strokeWidth="0.6" strokeLinecap="round" />
              </g>
              <g id="asset-hearth-wood-cavity">
                <rect x="-5.2" y="54.6" width="10.4" height="8.4" rx="1.0" fill="#201812" stroke="#362a20" strokeWidth="0.4" />
                <rect x="-4.8" y="55.0" width="9.6" height="1.2" fill="#ea580c" opacity="0.18" />
                <circle cx="-3.4" cy="61.0" r="1.3" fill="#e5d2ba" stroke="#5c3a21" strokeWidth="0.3" />
                <circle cx="-1.0" cy="61.2" r="1.15" fill="#dfc9af" stroke="#5c3a21" strokeWidth="0.3" />
                <circle cx="1.4" cy="61.1" r="1.2" fill="#ebd8c2" stroke="#5c3a21" strokeWidth="0.3" />
                <circle cx="3.6" cy="61.0" r="1.25" fill="#e5d2ba" stroke="#5c3a21" strokeWidth="0.3" />
                <path d="M-4.8,59.0 L-3.2,57.6 L-3.4,59.4 Z" fill="#c29a6e" stroke="#5c3a21" strokeWidth="0.25" />
                <circle cx="-2.1" cy="58.4" r="0.95" fill="#dfc9af" stroke="#5c3a21" strokeWidth="0.3" />
                <path d="M-0.8,59.2 L1.4,59.2 L0.3,57.8 Z" fill="#cca478" stroke="#5c3a21" strokeWidth="0.25" />
                <circle cx="2.3" cy="58.5" r="0.95" fill="#dfc9af" stroke="#5c3a21" strokeWidth="0.3" />
                <path d="M3.4,57.6 L4.8,59.0 L3.6,59.4 Z" fill="#b99064" stroke="#5c3a21" strokeWidth="0.25" />
              </g>
              <g id="asset-bench-cushions">
                <g transform="translate(-16, 53.6)">
                  <ellipse cx="0" cy="1.2" rx="4.5" ry="2.0" fill="#1b120c" opacity="0.18" />
                  <ellipse cx="0" cy="0.6" rx="4.2" ry="1.9" fill="#c4b998" />
                  <ellipse cx="0" cy="-0.6" rx="4.0" ry="1.8" fill="#ded7c0" stroke="#b8ad90" strokeWidth="0.4" />
                  <circle cx="0" cy="-0.6" r="0.6" fill="#8f856c" />
                </g>
                <g transform="translate(16, 53.6)">
                  <ellipse cx="0" cy="1.2" rx="4.5" ry="2.0" fill="#1b120c" opacity="0.18" />
                  <ellipse cx="0" cy="0.6" rx="4.2" ry="1.9" fill="#beb291" />
                  <ellipse cx="0" cy="-0.6" rx="4.0" ry="1.8" fill="#d6ceb6" stroke="#aea285" strokeWidth="0.4" />
                  <circle cx="0" cy="-0.6" r="0.6" fill="#827860" />
                </g>
              </g>
              <g id="asset-hearth-upper-masonry-body">
                <polygon points="-14,23.0 -7,25.0 -7,52.0 -14,50.0" fill="#f3ece0" stroke="#ded5c4" strokeWidth="0.4" strokeLinejoin="round" />
                <polygon points="-7,25.0 7,25.0 7,52.0 -7,52.0" fill="#e8dfce" stroke="#d4cab7" strokeWidth="0.4" strokeLinejoin="round" />
                <polygon points="7,25.0 14,23.0 14,50.0 7,52.0" fill="#d2c5b1" stroke="#c0b39e" strokeWidth="0.4" strokeLinejoin="round" />
                <line x1="-7" y1="25.0" x2="-7" y2="52.0" stroke="#ffffff" strokeWidth="0.6" opacity="0.85" />
                <line x1="7" y1="25.0" x2="7" y2="52.0" stroke="#bfb29c" strokeWidth="0.5" opacity="0.6" />
              </g>
              <g id="asset-hearth-firebox-door">
                <rect x="-5.6" y="29.0" width="11.2" height="19.5" rx="1.2" fill="#24201e" stroke="#161312" strokeWidth="0.6" />
                <rect x="-4.8" y="30.0" width="9.6" height="17.5" rx="0.7" fill="#171514" />
                <rect x="-4.0" y="31.0" width="8.0" height="15.5" rx="0.5" fill="#120c08" />
                <ellipse cx="0" cy="44.5" rx="3.5" ry="1.4" fill="#ef4444" opacity="0.85" />
                <ellipse cx="0" cy="44.0" rx="2.5" ry="1.1" fill="#f59e0b" opacity="0.75" />
              </g>
              <g id="asset-hearth-flat-top-shelf">
                <polygon points="-14.8,22.2 -7.5,24.4 -7.5,26.0 -14.8,23.8" fill="#cfc4b0" />
                <polygon points="-7.5,24.4 7.5,24.4 7.5,26.0 -7.5,26.0" fill="#d6cbba" />
                <polygon points="7.5,24.4 14.8,22.2 14.8,23.8 7.5,26.0" fill="#b9ab96" />
                <polygon points="-14.8,22.2 -7.5,24.4 7.5,24.4 14.8,22.2 14.0,21.0 0,17.5 -14.0,21.0" fill="#fbf7f1" stroke="#eae0d0" strokeWidth="0.4" strokeLinejoin="round" />
              </g>
              <g id="asset-hearth-square-chimney">
                <polygon points="-5.5,19.5 0,21.0 0,-86.6 -5.5,-88.1" fill="#ede4d6" stroke="#d4c8b6" strokeWidth="0.4" />
                <polygon points="0,21.0 5.5,19.5 5.5,-88.1 0,-86.6" fill="#c8bcab" stroke="#b6a895" strokeWidth="0.4" />
                <line x1="0" y1="21.0" x2="0" y2="-86.6" stroke="#faf5ed" strokeWidth="0.8" opacity="0.85" />
              </g>
            </g>

            {/* ========================================================================= */}
            {/* PRESERVED ASSET: COUNTRYSIDE GINGHAM PICNIC SCENE & GNARLED APPLE TREE    */}
            {/* (用户要求保留野餐垫及全套组件作为项目资产保留，不在场景中强塞，安全收录于此处) */}
            {/* ========================================================================= */}
            <g id="asset-country-picnic-scene">
              <polygon points="162,652 278,630 306,686 188,708" fill="#152113" opacity="0.4" filter="url(#softShadow)" />
              <polygon points="165,650 275,632 298,682 186,702" fill="url(#picnicGinghamPattern)" stroke="#e2d6c3" strokeWidth="0.8" />
              <polygon points="167,651 273,634 296,680 188,699" fill="none" stroke="#c2410c" strokeWidth="0.6" strokeDasharray="3 2" opacity="0.5" />
              <ellipse cx="168" cy="652" rx="3.5" ry="2" fill="#7a6c5a" stroke="#483d31" strokeWidth="0.4" />
              <ellipse cx="272" cy="634" rx="4" ry="2.2" fill="#8c7d6b" stroke="#483d31" strokeWidth="0.4" />
              <ellipse cx="295" cy="680" rx="3.8" ry="2" fill="#7a6c5a" stroke="#483d31" strokeWidth="0.4" />
              <ellipse cx="188" cy="700" rx="4.2" ry="2.2" fill="#8c7d6b" stroke="#483d31" strokeWidth="0.4" />
              <g transform="translate(255, 638)">
                <ellipse cx="8" cy="16" rx="14" ry="5" fill="#141f12" opacity="0.35" />
                <rect x="0" y="4" width="18" height="12" rx="2.5" fill="#b47b42" stroke="#694119" strokeWidth="0.8" />
                <line x1="4" y1="4" x2="4" y2="16" stroke="#875322" strokeWidth="0.8" />
                <line x1="9" y1="4" x2="9" y2="16" stroke="#875322" strokeWidth="0.8" />
                <line x1="14" y1="4" x2="14" y2="16" stroke="#875322" strokeWidth="0.8" />
                <line x1="0" y1="8" x2="18" y2="8" stroke="#875322" strokeWidth="0.8" />
                <line x1="0" y1="12" x2="18" y2="12" stroke="#875322" strokeWidth="0.8" />
                <polygon points="-2,4 10,-3 14,-2 2,5" fill="#a36b35" stroke="#5c3614" strokeWidth="0.7" />
                <polygon points="1,4 8,0 12,6 3,7" fill="#fffaf5" />
                <path d="M 3,4 Q 9,-4 15,4" fill="none" stroke="#694119" strokeWidth="1.2" strokeLinecap="round" />
              </g>
              <g transform="translate(210, 656)">
                <ellipse cx="0" cy="5" rx="7" ry="3" fill="#182315" opacity="0.35" />
                <ellipse cx="0" cy="0" rx="6" ry="4.8" fill="#ea580c" stroke="#9a3412" strokeWidth="0.7" />
                <ellipse cx="0" cy="-4" rx="3.2" ry="1.4" fill="#fed7aa" stroke="#9a3412" strokeWidth="0.5" />
                <circle cx="0" cy="-5" r="0.9" fill="#c2410c" />
                <path d="M 5,-1 Q 9,-3 10,-5" fill="none" stroke="#9a3412" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M -5,1 Q -9,0 -7,-3 Q -5,-3 -5,-1" fill="none" stroke="#9a3412" strokeWidth="1.2" />
                <g transform="translate(-10, 6)">
                  <rect x="-2.5" y="-2" width="5" height="4" rx="1.2" fill="#fffaf0" stroke="#a89a85" strokeWidth="0.5" />
                  <ellipse cx="0" cy="-2" rx="2.4" ry="1" fill="#92400e" />
                </g>
                <g transform="translate(10, 8)">
                  <rect x="-2.5" y="-2" width="5" height="4" rx="1.2" fill="#fffaf0" stroke="#a89a85" strokeWidth="0.5" />
                  <ellipse cx="0" cy="-2" rx="2.4" ry="1" fill="#92400e" />
                </g>
              </g>
              <g transform="translate(185, 672)">
                <polygon points="0,0 26,-6 32,8 6,14" fill="#a16207" stroke="#713f12" strokeWidth="0.7" />
                <polygon points="2,1 25,-5 29,7 7,12" fill="#ca8a04" />
                <ellipse cx="12" cy="3" rx="7" ry="4.5" fill="#b45309" stroke="#78350f" strokeWidth="0.7" />
                <ellipse cx="23" cy="5" rx="3.5" ry="2.5" fill="#fef3c7" stroke="#92400e" strokeWidth="0.5" />
                <polygon points="20,8 26,6 28,11 21,12" fill="#facc15" stroke="#ca8a04" strokeWidth="0.5" />
              </g>
              <g transform="translate(235, 680)">
                <ellipse cx="0" cy="2" rx="13" ry="6.5" fill="#152014" opacity="0.32" />
                <ellipse cx="0" cy="0" rx="12" ry="6" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.6" />
                <ellipse cx="0" cy="-1.5" rx="6" ry="3.5" fill="#eab308" stroke="#a16207" strokeWidth="0.6" />
                <ellipse cx="0" cy="-0.2" rx="6.2" ry="3.2" fill="none" stroke="#3f6212" strokeWidth="1.2" />
                <path d="M 5,2 Q 9,6 8,10" fill="none" stroke="#3f6212" strokeWidth="1.2" strokeLinecap="round" />
              </g>
            </g>
            <g id="asset-gnarled-apple-tree">
              <ellipse cx="50" cy="728" rx="26" ry="8" fill="#10190e" opacity="0.5" />
              <path d="M 42,722 Q 28,728 18,730 M 58,722 Q 70,727 78,729" stroke="#26170d" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M 38,725 C 34,700 40,675 50,650 C 56,634 66,618 75,595 L 86,600 C 76,622 64,640 58,660 C 48,685 44,702 48,725 Z" fill="url(#oldAppleBarkGrad)" stroke="#1c1209" strokeWidth="1.2" />
              <ellipse cx="75" cy="590" rx="36" ry="24" fill="#2b522d" />
              <ellipse cx="115" cy="625" rx="28" ry="18" fill="#346337" />
              <ellipse cx="70" cy="580" rx="30" ry="18" fill="#467e49" />
            </g>
          </defs>
  </>;
}

export const WorldDefs = React.memo(WorldDefsAsset);
