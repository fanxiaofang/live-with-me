import React, { useState } from 'react';
import { svgAction } from '../world/interactions/svgAction';
import { IsoGizmo } from './layout-gizmo/IsoGizmo';

export interface NyankoSenseiCatProps {
  x: number;
  y: number;
  isInspectorOpen?: boolean;
  effectiveGizmoId?: string | null;
  onSelectGizmo?: (id: string | null) => void;
  onDragGizmoDelta?: (dx: number, dy: number) => void;
  onDragGizmoEnd?: () => void;
  onTriggerToast?: (msg: string) => void;
  setHoveredObject?: (obj: { kind: 'entity'; id: string } | null) => void;
}

/**
 * NyankoSenseiCat (夏目友人帐 · 猫咪老师与日式软垫猫窝)
 * 核心设计：
 * 1. 软萌专属猫窝：参考原作中猫咪老师专属的抹茶绿厚软垫/甜甜圈窝垫，微陷凹度与厚度层次
 * 2. 纯净极简小脸：去除红色妖纹，保持干净纯洁的大白脸、清秀闭目笑缝、粉嫩小鼻与害羞腮红
 * 3. 经典招财猫配色：额头正中双色斑（焦糖橙/瓦灰）、红项圈与悬挂金色圆铃铛、背部双色斑块
 * 4. 偏小紧凑体型：小巧玲珑的大福团子身躯，服帖蜷在猫窝中央
 * 5. 舒缓打盹动效：轻柔呼吸起伏、梦乡微光气泡与点击互动台词
 */
export const NyankoSenseiCat: React.FC<NyankoSenseiCatProps> = ({
  x,
  y,
  isInspectorOpen = false,
  effectiveGizmoId = null,
  onSelectGizmo,
  onDragGizmoDelta,
  onDragGizmoEnd,
  onTriggerToast,
  setHoveredObject,
}) => {
  const [isWiggle, setIsWiggle] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (isInspectorOpen) {
      e.stopPropagation();
      onSelectGizmo?.(effectiveGizmoId === 'hearth-cat' ? null : 'hearth-cat');
      return;
    }
    e.stopPropagation();
    setIsWiggle(true);
    setTimeout(() => setIsWiggle(false), 800);

    const quotes = [
      'ฅ\'ω\'ฅ「呼噜噜… 猫窝里好软好舒服… 夏目那家伙，今天还没有给我买七辻屋的豆沙包吗？呼噜噜…」🐾 猫咪老师在软垫窝里舒舒服服地伸了个懒腰 ✨',
      'ฅ( =•ω•= )ฅ「喂！凡人，不要打扰本座在专属暖窝里就寝！除非… 你拿上好的羊羹和温热清酒来供奉！喵呜~」🐾 猫咪老师抖了抖圆滚滚的耳朵继续烤火 🔥',
      'ฅ\'﹃\'ฅ「呼… 呼噜… 这个猫窝铺得刚刚好… 本座先睡个回笼觉，等豆沙包买回来了记得第一时间叫醒本座…」🐾 白胖的小猫蜷在软垫中央，暖呼呼地打着小呼噜 💤',
    ];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    onTriggerToast?.(quote);
  };

  return (
    <g
      {...svgAction('抚摸猫窝里的猫咪老师')}
      id="hearth-rug-cat"
      transform={`translate(${x}, ${y})`}
      className="cursor-pointer group/cat select-none"
      onClick={handleClick}
      onMouseEnter={() => setHoveredObject?.({ kind: 'entity', id: 'hearth-cat' })}
      onMouseLeave={() => setHoveredObject?.(null)}
    >
      <title>炉火旁猫窝里打盹的猫咪老师 · 暖烘烘地蜷在软垫里梦见七辻屋豆沙包 🐾✨</title>

      {/* ========================================================
          1. 舒适猫窝体系 (Cozy Japanese Zabuton / Pet Bed Cushion)
          ======================================================== */}
      <g id="nyanko-bed">
        {/* 1.1 地面柔和环境投影 (纯矢量无滤镜高清平滑阴影，彻底消除滤镜模糊噪点) */}
        <ellipse cx="0.5" cy="7.2" rx="16.5" ry="6.8" fill="#24160c" opacity="0.14" />
        <ellipse cx="0.5" cy="7.0" rx="14.8" ry="5.8" fill="#1e1008" opacity="0.22" />
        <ellipse cx="0" cy="6.6" rx="12.5" ry="4.8" fill="#140a05" opacity="0.32" />

        {/* 1.2 猫窝厚实底座与立面厚度 (Bed 3D rim base in cozy olive green) */}
        <ellipse cx="0.5" cy="3.6" rx="15.8" ry="8.4" fill="#3b4d38" />
        <path
          d="M-15.3,3.6 C-15.3,9.2 16.3,9.2 16.3,3.6 C16.3,6.2 14.8,10.0 0.5,10.0 C-13.8,10.0 -15.3,6.2 -15.3,3.6 Z"
          fill="#31402e"
        />

        {/* 1.3 猫窝饱满软垫外圈 (Padded cushion roll rim) */}
        <ellipse
          cx="0.5"
          cy="2.8"
          rx="15.4"
          ry="8.0"
          fill="#52694e"
          stroke="#42553f"
          strokeWidth="0.45"
        />

        {/* 1.4 猫窝滚边柔和采光层 (Top rim soft warm highlight) */}
        <path
          d="M-13.5,1.6 C-7.5,-1.2 8.5,-1.2 14.5,1.6 C9.5,0.4 -4.5,0.4 -13.5,1.6 Z"
          fill="#6b8767"
          opacity="0.65"
        />

        {/* 1.5 软窝内凹陷垫芯 (Inner sunken mattress cavity) */}
        <ellipse cx="0.5" cy="2.2" rx="12.2" ry="6.0" fill="#3c4c39" />
        <ellipse cx="0.5" cy="1.8" rx="11.5" ry="5.4" fill="#485c45" />

        {/* 1.6 窝内蓬松压痕褶皱 (Soft cushion tufting/depression creases) */}
        <path d="M-8.5,1.0 Q0,2.6 8.5,1.0" stroke="#364534" strokeWidth="0.55" fill="none" opacity="0.55" />
        <path d="M-6.5,2.6 Q0,4.2 6.5,2.6" stroke="#364534" strokeWidth="0.5" fill="none" opacity="0.45" />

        {/* 1.7 猫咪体重陷沉阴影 (Depression shadow where the chubby cat settles in) */}
        <ellipse cx="0.2" cy="2.8" rx="9.8" ry="4.5" fill="#253123" opacity="0.6" />

        {/* 1.8 猫窝前缘可爱皮质小布标 (Cute leather logo tag on the rim) */}
        <g id="nyanko-bed-tag" transform="translate(0, 7.8)">
          <rect x="-2.2" y="-1.2" width="4.4" height="2.2" rx="0.6" fill="#8c6239" stroke="#684724" strokeWidth="0.2" />
          <circle cx="-0.8" cy="-0.1" r="0.25" fill="#fef3c7" opacity="0.9" />
          <circle cx="0" cy="-0.3" r="0.25" fill="#fef3c7" opacity="0.9" />
          <circle cx="0.8" cy="-0.1" r="0.25" fill="#fef3c7" opacity="0.9" />
          <circle cx="0" cy="0.4" r="0.4" fill="#fef3c7" opacity="0.9" />
        </g>
      </g>

      {/* ========================================================
          2. 猫咪老师 (白胖大福身躯，无红纹无腮红，体型偏小紧凑，画面纯净稳固)
          ======================================================== */}
      <g
        className={`origin-center ${isWiggle ? 'animate-bounce' : ''}`}
      >
        {/* 2.1 主身体底座：白胖软糯大福身躯 (Base White Dumpling Body) */}
        <path
          d="M-6,0.5 C-8.5,-3.8 -3.5,-7.5 2.5,-7 C7.8,-6.5 10.5,-2.8 10,2.2 C9.5,5.6 2.5,6.5 -1.8,5.8 C-5.2,5.2 -7,3.5 -6,0.5 Z"
          fill="#fbfaf7"
          stroke="#dedad1"
          strokeWidth="0.45"
          strokeLinejoin="round"
        />

        {/* 2.2 背腹部层次微阴影 (增添立体厚度，保持极简) */}
        <path
          d="M-5.2,1.8 C-4,4.2 0,5.6 4.5,5.2 C7.5,4.9 9.2,3.8 9.6,2.2 C8.8,4.5 4.5,5.4 0,5 C-3.2,4.8 -4.8,3.6 -5.2,1.8 Z"
          fill="#ebe3d7"
          opacity="0.75"
        />

        {/* 2.3 猫咪老师标志性背部大斑块 (Distinctive Calico Back Patches) */}
        {/* 斑块一：背部/后腰暖焦糖橙色斑块 (Orange patch) */}
        <path
          d="M2.5,-6.8 C4.5,-6.6 7.5,-4.5 7.8,-1.5 C6.5,-1.2 4.2,-2.2 2.8,-4.2 C1.8,-5.5 2.0,-6.5 2.5,-6.8 Z"
          fill="#e07a38"
        />
        {/* 斑块二：后侧瓦灰色/炭青色斑块 (Grey/Slate patch) */}
        <path
          d="M6.2,-4.2 C8.2,-3.5 9.8,-1.2 9.5,1.8 C8.5,0.8 7.2,-0.5 6.0,-1.8 C5.5,-2.8 5.6,-3.6 6.2,-4.2 Z"
          fill="#6b7785"
        />

        {/* 2.4 短小软萌的白色圆尾巴 (Stubby Round Tail) */}
        <circle cx="9.6" cy="1.2" r="1.6" fill="#fbfaf7" stroke="#dedad1" strokeWidth="0.4" />

        {/* 2.5 露在外侧的小脚脚与粉红肉球垫 (Tiny Paw & Pink Paw Pads) */}
        <g id="nyanko-rear-paw" transform="translate(4.8, 3.6)">
          <ellipse cx="0" cy="0" rx="1.8" ry="1.3" fill="#ffffff" stroke="#e5ded3" strokeWidth="0.35" />
          {/* 粉嫩肉垫掌心 */}
          <ellipse cx="0.1" cy="0.1" rx="0.75" ry="0.55" fill="#f472b6" opacity="0.85" />
          {/* 小脚趾粉球 */}
          <circle cx="-0.8" cy="-0.2" r="0.25" fill="#f472b6" opacity="0.85" />
          <circle cx="0.1" cy="-0.5" r="0.25" fill="#f472b6" opacity="0.85" />
          <circle cx="0.9" cy="-0.2" r="0.25" fill="#f472b6" opacity="0.85" />
        </g>

        {/* 2.6 前胸垫伏的乖巧小前爪 (Front Paw resting in front) */}
        <g id="nyanko-front-paw" transform="translate(-2.4, 4.2)">
          <ellipse cx="0" cy="0" rx="1.7" ry="1.2" fill="#ffffff" stroke="#dedad1" strokeWidth="0.35" />
          <circle cx="-0.5" cy="0.2" r="0.22" fill="#f472b6" opacity="0.8" />
          <circle cx="0.2" cy="0.3" r="0.22" fill="#f472b6" opacity="0.8" />
        </g>
      </g>

      {/* ========================================================
          3. 猫咪老师头部 (圆润大脸蛋、额头双色斑、红项圈小金铃铛、无红纹极简脸庞)
          ======================================================== */}
      <g id="nyanko-head">
        {/* 3.1 头部底胚：圆滚滚的大白脸颊 */}
        <circle cx="-5.6" cy="-1.4" r="4.8" fill="#fbfaf7" stroke="#ded8cf" strokeWidth="0.45" />

        {/* 3.2 耳朵：左耳与右耳 (圆润短三角耳，内耳粉嫩) */}
        {/* 左耳 (从猫咪视角看) */}
        <polygon
          points="-9.8,-2.6 -9.2,-7.0 -6.2,-4.5"
          fill="#fbfaf7"
          stroke="#ded8cf"
          strokeWidth="0.4"
          strokeLinejoin="round"
        />
        <polygon points="-9.2,-2.9 -8.8,-6.0 -6.8,-4.4" fill="#fbcfe8" />

        {/* 右耳 */}
        <polygon
          points="-5.2,-4.8 -2.4,-7.2 -1.4,-2.5"
          fill="#fbfaf7"
          stroke="#ded8cf"
          strokeWidth="0.4"
          strokeLinejoin="round"
        />
        <polygon points="-4.8,-4.5 -2.7,-6.2 -1.8,-2.8" fill="#fbcfe8" />

        {/* 3.3 经典标志：额头正中两分色块！(Iconic Split Forehead Patches) */}
        {/* 左侧焦糖暖橙斑块 */}
        <path
          d="M-5.6,-5.9 C-7.2,-5.7 -7.8,-4.2 -7.5,-2.8 C-6.8,-3.0 -6.0,-3.2 -5.6,-3.4 Z"
          fill="#e07a38"
        />
        {/* 右侧沉稳瓦灰斑块 */}
        <path
          d="M-5.6,-5.9 C-4.0,-5.7 -3.4,-4.2 -3.7,-2.8 C-4.4,-3.0 -5.2,-3.2 -5.6,-3.4 Z"
          fill="#6b7785"
        />

        {/* 3.4 惬意打盹眯眯眼 (Slit peaceful sleeping eyes: 纯净微笑眼缝) */}
        <path
          d="M-7.6,-1.1 Q-6.5,-0.3 -5.7,-1.0"
          stroke="#262626"
          strokeWidth="0.55"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M-4.7,-1.0 Q-3.9,-0.3 -2.8,-1.1"
          stroke="#262626"
          strokeWidth="0.55"
          strokeLinecap="round"
          fill="none"
        />

        {/* 3.5 粉嫩可爱的小小三角鼻与猫猫嘴 (Tiny pink nose & gentle smile) */}
        <polygon points="-5.3,-0.1 -4.7,-0.1 -5.0,0.4" fill="#f43f5e" />
        <path
          d="M-5.5,0.7 Q-5.0,1.1 -5.0,0.5 Q-5.0,1.1 -4.5,0.7"
          stroke="#525252"
          strokeWidth="0.4"
          strokeLinecap="round"
          fill="none"
        />

        {/* 3.6 极简纯净红项圈细绳（无铃铛，纯净大方） */}
        <path
          d="M-7.0,1.8 C-5.5,2.5 -2.8,2.2 -1.5,1.2"
          stroke="#b91c1c"
          strokeWidth="0.85"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* ========================================================
          4. 梦乡浮升气泡与忽明忽暗飘动 z 符号 (Floating Slumber Bubbles & Breathing zZ)
          真实还原打盹时气泡缓慢升起飘散与 z 呼吸律动
          ======================================================== */}
      <g id="nyanko-slumber-bubbles" transform="translate(0, -2)" className="pointer-events-none">
        {/* 第1朵缓慢升起并消散的气泡 */}
        <g className="animate-sleep-bubble-1">
          <circle cx="-2.5" cy="-6" r="1.3" fill="#fed7aa" opacity="0.85" />
          <circle cx="-2.8" cy="-6.3" r="0.4" fill="#ffffff" opacity="0.95" />
        </g>

        {/* 第2朵缓慢升起并消散的气泡 */}
        <g className="animate-sleep-bubble-2">
          <circle cx="1.5" cy="-9" r="2.0" fill="#fef08a" opacity="0.8" />
          <circle cx="1.0" cy="-9.6" r="0.6" fill="#ffffff" opacity="0.95" />
        </g>

        {/* 第3朵缓慢升起并消散的气泡 */}
        <g className="animate-sleep-bubble-3">
          <circle cx="6.5" cy="-14" r="2.7" fill="#fed7aa" opacity="0.7" />
          <circle cx="5.8" cy="-14.8" r="0.8" fill="#ffffff" opacity="0.9" />
        </g>

        {/* 忽明忽暗并轻微浮动的打盹 z 符号 */}
        <g className="animate-sleep-z" transform="translate(-1, -10)">
          <text
            x="0"
            y="0"
            fill="#d97706"
            fontSize="3.8"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="bold"
            textRendering="geometricPrecision"
            className="select-none"
          >
            z
          </text>
        </g>

        {/* 缓慢向上飘散的稍大号 Z 符号 */}
        <g className="animate-sleep-z-float" transform="translate(4, -14)">
          <text
            x="0"
            y="0"
            fill="#b45309"
            fontSize="4.8"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="bold"
            textRendering="geometricPrecision"
            className="select-none"
          >
            Z
          </text>
        </g>
      </g>

      {/* ========================================================
          5. 2.5D 轴测校准交互把手 (Gizmo Inspector 微调支持)
          ======================================================== */}
      {effectiveGizmoId === 'hearth-cat' && (
        <IsoGizmo
          pos={{ x: 0, y: 5 }}
          displayCoords={{ x, y }}
          fixedW={0}
          label="炉边猫窝与猫咪老师"
          onDragDelta={(dx, dy) => onDragGizmoDelta?.(dx, dy)}
          onDragEnd={() => onDragGizmoEnd?.()}
        />
      )}
    </g>
  );
};
