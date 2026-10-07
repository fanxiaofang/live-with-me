import { LayoutGestureContext } from '../../features/layout-editor/LayoutGestureContext';
import { FURNITURE_PARENTS } from '../../features/layout-editor/furnitureParents';
import React, { useRef, useState, useEffect, useContext } from 'react';
import { ISO_CONSTANTS, projectIsoToScreen, unprojectScreenToIso, IsoPoint3D } from './isoMath';

interface IsoGizmoProps {
  pos?: { x: number; y: number }; // 局部偏移坐标
  displayCoords?: { x: number; y: number }; // 真实布局坐标 (用于在提示窗中显示)
  scale?: number;
  fixedW?: number; // 当前平面高度
  objectName?: string;
  label?: string; // 兼容
  onDragDelta: (dx: number, dy: number) => void;
  onDragEnd?: () => void;
}

/**
 * 2.5D 轴测空间可视化交互 Gizmo (3D Transform Handle)
 * 渲染：
 * 1. 沿 u 轴（长边红轴）的箭头与把手
 * 2. 沿 v 轴（进深绿轴）的箭头与把手
 * 3. 沿 w 轴（垂直蓝轴）的高度箭头
 * 4. 中心自由拖拽黄色高光小轮心
 */
export const IsoGizmo: React.FC<IsoGizmoProps> = ({
  pos = { x: 0, y: 0 },
  displayCoords,
  scale = 1,
  fixedW = 0,
  objectName,
  label,
  onDragDelta,
  onDragEnd,
}) => {
  const displayName = objectName || label || '组件';
  const [activeAxis, setActiveAxis] = useState<'free' | 'u' | 'v' | 'w' | null>(null);
  const owner=useContext(LayoutGestureContext);
  const ownerRef=useRef(owner); ownerRef.current=owner;
  const drag=useRef<{id:number;axis:'free'|'u'|'v'|'w';matrix:DOMMatrix;previous:DOMPoint;dx:number;dy:number}|null>(null);
  useEffect(()=>()=>{if(drag.current) ownerRef.current?.cancel();},[]);

  // 轴线向量与长度
  const axisLen = 14;
  // u轴屏幕矢量: (cosU, sinU) = (1.0, -0.2852)
  const uVector = { x: 1.0 * axisLen, y: -0.2852 * axisLen };
  // v轴屏幕矢量: (cosV, sinV) = (0.8, 0.228)
  const vVector = { x: 0.8 * axisLen, y: 0.228 * axisLen };
  // w轴屏幕矢量: (0, -1.0)
  const wVector = { x: 0, y: -1.0 * axisLen };

  const handlePointerDown = (e: React.PointerEvent<SVGGElement>, axis: 'free'|'u'|'v'|'w') => {
    if(e.button!==0 || drag.current) return;
    e.preventDefault();e.stopPropagation();
    const id=owner?.activeId;
    const parent=id ? e.currentTarget.ownerSVGElement?.querySelector<SVGGraphicsElement>(FURNITURE_PARENTS[id].selector) : e.currentTarget.parentElement as unknown as SVGGraphicsElement;
    const matrix=parent?.getScreenCTM()?.inverse();
    if(!matrix) return;
    owner?.begin();
    drag.current={id:e.pointerId,axis,matrix,previous:new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix),dx:0,dy:0};
    e.currentTarget.setPointerCapture(e.pointerId);setActiveAxis(axis);
  };
  const handlePointerMove=(e:React.PointerEvent<SVGGElement>)=>{
    const session=drag.current;
    if(!session||session.id!==e.pointerId) return;
    e.preventDefault();e.stopPropagation();
    const point=new DOMPoint(e.clientX,e.clientY).matrixTransform(session.matrix);
    let dx=point.x-session.previous.x,dy=point.y-session.previous.y;
    session.previous=point;
    if(session.axis==='u'||session.axis==='v') {
      const x=session.axis==='u'?ISO_CONSTANTS.cosU:ISO_CONSTANTS.cosV;
      const y=session.axis==='u'?ISO_CONSTANTS.sinU:ISO_CONSTANTS.sinV;
      const dot=(dx*x+dy*y)/(x*x+y*y);dx=dot*x;dy=dot*y;
    } else if(session.axis==='w') dx=0;
    session.dx+=dx;session.dy+=dy;
    if(Math.hypot(dx,dy)>0) owner?.markMoved();
    onDragDelta(dx,dy);
  };
  const finish=(e:React.PointerEvent<SVGGElement>,cancelled=false)=>{
    const session=drag.current;
    if(!session||session.id!==e.pointerId) return;
    e.stopPropagation();drag.current=null;setActiveAxis(null);
    if(cancelled) {if(owner) owner.cancel();else onDragDelta(-session.dx,-session.dy);}
    else {if(owner) owner.commit();else onDragEnd?.();}
    if(e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };
  const handlePointerUp=(e:React.PointerEvent<SVGGElement>)=>finish(e);
  const handlePointerCancel=(e:React.PointerEvent<SVGGElement>)=>finish(e,true);
  const handleLostPointerCapture=(e:React.PointerEvent<SVGGElement>)=>{if(e.target===e.currentTarget) finish(e,true);};

  const targetPos = displayCoords || pos;
  const isoCoords: IsoPoint3D = unprojectScreenToIso(targetPos, fixedW);

  return (
    <g
      id="iso-interactive-gizmo"
      transform={`translate(${pos.x}, ${pos.y})`}
      className="cursor-move select-none"
    >
      {/* 1. 地面投影虚线基座环 */}
      <ellipse
        cx="0"
        cy="0"
        rx="8"
        ry="3.2"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="0.8"
        strokeDasharray="2 1.5"
        opacity="0.85"
      />

      {/* 2. U轴 (长边红轴: 向右下) */}
      <g
        className="cursor-ew-resize hover:opacity-100 opacity-90 transition-opacity"
        data-gizmo-axis="u"
        onPointerDown={(e) => handlePointerDown(e, 'u')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onLostPointerCapture={handleLostPointerCapture}
      >
        <line
          x1="0"
          y1="0"
          x2={uVector.x}
          y2={uVector.y}
          stroke="#ef4444"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* 箭头端头 */}
        <circle cx={uVector.x} cy={uVector.y} r="2.2" fill="#ef4444" stroke="#ffffff" strokeWidth="0.6" />
        <text
          x={uVector.x + 3}
          y={uVector.y + 1}
          fill="#ef4444"
          fontSize="4"
          fontWeight="bold"
        >
          X(u)
        </text>
      </g>

      {/* 3. V轴 (进深绿轴: 向右上) */}
      <g
        className="cursor-ns-resize hover:opacity-100 opacity-90 transition-opacity"
        data-gizmo-axis="v"
        onPointerDown={(e) => handlePointerDown(e, 'v')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onLostPointerCapture={handleLostPointerCapture}
      >
        <line
          x1="0"
          y1="0"
          x2={vVector.x}
          y2={vVector.y}
          stroke="#10b981"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx={vVector.x} cy={vVector.y} r="2.2" fill="#10b981" stroke="#ffffff" strokeWidth="0.6" />
        <text
          x={vVector.x + 2}
          y={vVector.y - 1}
          fill="#10b981"
          fontSize="4"
          fontWeight="bold"
        >
          Y(v)
        </text>
      </g>

      {/* 4. W轴 (垂直蓝轴: 向上高度) */}
      <g
        className="cursor-row-resize hover:opacity-100 opacity-90 transition-opacity"
        data-gizmo-axis="w"
        onPointerDown={(e) => handlePointerDown(e, 'w')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onLostPointerCapture={handleLostPointerCapture}
      >
        <line
          x1="0"
          y1="0"
          x2={wVector.x}
          y2={wVector.y}
          stroke="#3b82f6"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx={wVector.x} cy={wVector.y} r="2.2" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.6" />
        <text
          x={wVector.x - 3}
          y={wVector.y - 3}
          fill="#3b82f6"
          fontSize="4"
          fontWeight="bold"
        >
          Z(w)
        </text>
      </g>

      {/* 5. 中心自由拖拽核心圆点 (Free Drag Center) */}
      <g
        className="cursor-grab active:cursor-grabbing"
        data-gizmo-axis="free"
        onPointerDown={(e) => handlePointerDown(e, 'free')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onLostPointerCapture={handleLostPointerCapture}
      >
        <circle cx="0" cy="0" r="3.2" fill="#f59e0b" stroke="#ffffff" strokeWidth="0.8" />
        <circle cx="0" cy="0" r="1.4" fill="#78350f" />
      </g>

      {/* 6. 浮动标签与坐标数值面板 (实时显示及快捷键微调提示) */}
      <g transform="translate(0, -19)" className="pointer-events-none">
        <rect
          x="-38"
          y="-14"
          width="76"
          height="18"
          rx="3.5"
          fill="#1c1917"
          stroke="#d97706"
          strokeWidth="0.6"
          opacity="0.95"
        />
        <text x="0" y="-7.5" fill="#fef3c7" fontSize="4.2" fontWeight="bold" textAnchor="middle">
          {displayName}
        </text>
        <text x="0" y="-3.0" fill="#cbd5e1" fontSize="3.3" textAnchor="middle" fontFamily="monospace">
          {`u:${isoCoords.u} v:${isoCoords.v} | x:${targetPos.x.toFixed(1)} y:${targetPos.y.toFixed(1)}`}
        </text>
        <text x="0" y="1.8" fill="#f59e0b" fontSize="2.9" textAnchor="middle" fontWeight="500">
          方向键 ↑ ↓ ← → 微调 (1px) · Shift (5px)
        </text>
      </g>
    </g>
  );
};
