import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { CapsulePodHaven, type CapsulePodHavenProps } from './CapsulePodHaven';
import { CapsulePodVariant, type CapsulePodDesign } from './CapsulePodVariants';
import { usePreviewSvgIds } from '../inspection/usePreviewSvgIds';

const DESIGNS = [
  { id:'original', label:'原版', title:'旧太空胶囊仓', subtitle:'现有方案 · 对照基准', description:'象牙白与深绿金属壳、黄铜舷窗、液压支脚和石台，保留原有机械细节。', materials:['#e6e3ce','#455f52','#bc984e'] },
  { id:'rustic', label:'方案 A', title:'农场收留的退役舱', subtitle:'废土融合 · Rustic Scrappunk', description:'原有舱壳、门、舷窗和支架保留原位；旧漆褪成泥土灰绿，锈迹落在接缝与修补处，原金属和木质踏板呈现风化质地。', materials:['#a6906b','#8e482d','#93643a'] },
  { id:'retro', label:'方案 B', title:'原子时代田园露营舱', subtitle:'复古未来 · Cute Tech', description:'沿用原舱壳和舷窗比例，以奶油白烤漆、鼠尾草绿下壳和柔和铬色收边更新同一套部件；原木踏板与暖橙舷窗光保持田园气息。', materials:['#eee2bc','#91ac91','#c6d4bf'] },
] as const;

function ScopedPreview({children}:{children:ReactNode}) {
  const ref = useRef<SVGGElement>(null);
  usePreviewSvgIds(ref, children);
  return <div inert><svg viewBox="-100 -76 200 166" className="block w-full" role="img" aria-label="胶囊仓同尺度外观预览">
    <path d="M-100,-76 H100 V90 H-100Z" fill="#a6b18a" />
    <path d="M-100,48 Q-50,37 0,48 Q53,39 100,48 V90 H-100Z" fill="#89994f" />
    <g ref={ref} style={{pointerEvents:'none'}}>{children}</g>
  </svg></div>;
}

export function CapsulePodComparison({ podProps, design, onPreview }: {
  podProps:CapsulePodHavenProps; design:CapsulePodDesign; onPreview:(design:CapsulePodDesign)=>void;
}) {
  const [open,setOpen] = useState(()=>new URLSearchParams(window.location.search).get('capsuleStudy') === 'compare');
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(()=>{
    if (open && !dialog.current?.open) dialog.current?.showModal();
    if (!open && dialog.current?.open) dialog.current?.close();
  },[open]);
  // The comparison uses one daylight setup, regardless of the world's clock.
  const previewProps = {...podProps, theme:{...podProps.theme,isNight:false,timeOfDay:'day' as const},
    onSelectRoom:()=>{},onSelectPerson:()=>{},setHoveredObject:()=>{}};
  return createPortal(<div onPointerDown={e=>e.stopPropagation()} onClick={e=>e.stopPropagation()} onKeyDown={e=>e.stopPropagation()}>
    <button type="button" onClick={()=>setOpen(true)}
      className="fixed bottom-5 left-36 z-40 rounded-lg border border-[#5b4a38] bg-[#29231b] px-3 py-2 text-xs text-[#eadfce] hover:bg-[#453626] focus-visible:outline-2 focus-visible:outline-[#d9b47d]">
      胶囊仓方案{design !== 'original' ? ` · ${design === 'rustic' ? 'A' : 'B'} 试放中` : ''}
    </button>
    <dialog ref={dialog} onCancel={()=>setOpen(false)} onClose={()=>setOpen(false)} aria-labelledby="pod-comparison-title"
      className="m-auto max-h-[92dvh] w-[min(1240px,96vw)] max-w-none overflow-y-auto rounded-2xl border border-[#66563e] bg-[#29271f] p-0 text-[#eee6d6] shadow-2xl backdrop:bg-black/55">
      <div className="flex items-start justify-between gap-5 border-b border-[#514a38] px-5 py-4 sm:px-7">
        <div>
          <p className="text-xs tracking-widest text-[#c4ae7e]">胶囊仓设计研究</p>
          <h2 id="pod-comparison-title" className="mt-1 text-xl font-medium">同一座睡眠舱，三种生活气质</h2>
          <p className="mt-2 text-sm text-[#c2bba9]">同尺度、同日光对比。选一版放回庭院，看看它和主屋的关系。</p>
        </div>
        <button type="button" aria-label="关闭胶囊仓方案对比" onClick={()=>setOpen(false)}
          className="rounded-lg border border-[#66563e] px-3 py-2 text-sm hover:bg-[#443d2e] focus-visible:outline-2 focus-visible:outline-[#d9b47d]">关闭</button>
      </div>
      <div className="grid gap-px bg-[#514a38] md:grid-cols-3">
        {DESIGNS.map(item=><section key={item.id} data-pod-comparison={item.id} className="flex flex-col bg-[#302d23]">
          <div className="px-5 pb-3 pt-5">
            <p className="text-xs text-[#c9b37e]">{item.label}{design === item.id ? ' · 当前庭院预览' : ''}</p>
            <h3 className="mt-1 text-lg font-medium">{item.title}</h3>
            <p className="mt-1 text-xs text-[#b6af9c]">{item.subtitle}</p>
          </div>
          <ScopedPreview>{item.id === 'original' ? <CapsulePodHaven {...previewProps} /> : <CapsulePodVariant {...previewProps} design={item.id} />}</ScopedPreview>
          <div className="flex flex-1 flex-col p-5">
            <div className="mb-3 flex gap-2" aria-hidden="true">{item.materials.map(c=><span key={c} className="h-3 w-8 rounded-sm" style={{background:c}} />)}</div>
            <p className="mb-5 text-sm leading-6 text-[#d0c8b5]">{item.description}</p>
            <button type="button" onClick={()=>{onPreview(item.id);setOpen(false);}}
              className="mt-auto rounded-lg border border-[#86734f] bg-[#48402e] px-3 py-2.5 text-sm hover:bg-[#5a4d34] focus-visible:outline-2 focus-visible:outline-[#d9b47d]"
              aria-label={`在庭院试看${item.label}`}>
              {item.id === 'original' ? '在庭院查看原版' : `在庭院试看${item.label}`}
            </button>
          </div>
        </section>)}
      </div>
      <p className="border-t border-[#514a38] px-5 py-3 text-xs leading-5 text-[#beb5a0]">试放仅在本次页面中生效，刷新恢复原版。选定后再确定正式方案。</p>
    </dialog>
  </div>,document.body);
}
