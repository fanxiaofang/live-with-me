import React, { useCallback, useRef, useState } from 'react';
import type { StoveColorVariant } from '../../components/CastIronWoodStove';
import { useTimerScope } from '../../shared/timers/useTimerScope';
import type { InteractionTarget } from './interactionTypes';
const ALIEN_TRANSMISSIONS = [
  '📡 [SETI 频率 1420.405 MHz · 宇宙中性氢波段] 正在捕获来自猎户座大星云的微弱脉冲信号，信噪比极佳...',
  '✦ [深空信号解码] “01001100... 无论跨越多少光年，请在你们温柔的小世界里好好生活。”',
  '🛸 [地外引力波回响] 接收到一段来自半人马座阿尔法星的温和音频脉冲，如同浩瀚星海中的一声低语。',
  '🌌 [微波背景回响] “今夜你们地球麦浪的气息很安详，我们正用引力透镜安静守望。”',
  '✨ [宇宙无线电] 示波器上跳跃出一段舒缓的正弦波形——这是星系给守望者谱写的晚安曲。',
];

export function useWorldFeedback() {
  const timers = useTimerScope();
  const [hoveredObject, setHoveredObject] = useState<InteractionTarget | null>(null);
  const alienMsgIndex = useRef(0);
  const [alienPulseEffect, setAlienPulseEffect] = useState(false);
  const [alienTransmissionText, setAlienTransmissionText] = useState<string | null>(null);
  const [sofaSquish, setSofaSquish] = useState(false);
  const [sofaThought, setSofaThought] = useState<string | null>(null);

  // Freestanding Cast-Iron Stove Color Variant (支持陶土红砖、焦糖胡桃、柔和草席绿、经典炭黑等全套同色系)
  const [stoveColor, setStoveColor] = useState<StoveColorVariant>(() => {
    try {
      const saved = localStorage.getItem('storybook_stove_color');
      if (
        saved === 'terracotta' ||
        saved === 'walnut' ||
        saved === 'sage' ||
        saved === 'charcoal' ||
        saved === 'forest_green'
      ) {
        return saved as StoveColorVariant;
      }
    } catch {}
    return 'terracotta'; // 默认优先采用与室外红砖烟囱、红瓦屋顶 100% 呼应的同色系暖陶土红
  });

  // Click on alien signal dish triggers cosmic transmission & decoded message
  const triggerAlienSignal = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setAlienPulseEffect(true);
    timers.schedule('feedback-0', () => setAlienPulseEffect(false), 1400);
    const msg = ALIEN_TRANSMISSIONS[alienMsgIndex.current];
    setAlienTransmissionText(msg);
    alienMsgIndex.current = (alienMsgIndex.current + 1) % ALIEN_TRANSMISSIONS.length;
  }, [timers]);

  // Click on lazy beanbag sofa triggers cozy squish & thoughts
  const triggerSofaSquish = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSofaSquish(true);
    timers.schedule('feedback-1', () => setSofaSquish(false), 500);
    const thoughts = [
      '整个人陷在懒人沙发里，好像被温暖的云朵抱住了...',
      '陷在沙发深处，连翻书的节奏都变轻慢了。',
      '超软的豆袋大面包，窝着看一整个下午的书...',
      '窗外微风拂过，这里的凹陷坐感刚刚好。',
      '深陷在懒人沙发里，感觉骨头都完全放松了...',
    ];
    setSofaThought(thoughts[Math.floor(Math.random() * thoughts.length)]);
    timers.schedule('feedback-2', () => setSofaThought(null), 3600);
  }, [timers]);

  return { hoveredObject, setHoveredObject, alienPulseEffect, alienTransmissionText, setAlienTransmissionText, sofaSquish, sofaThought, stoveColor, setStoveColor, triggerAlienSignal, triggerSofaSquish };
}
