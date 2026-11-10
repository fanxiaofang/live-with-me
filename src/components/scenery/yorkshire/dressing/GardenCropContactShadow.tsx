import type { GardenCrop } from '../../../../features/yard-editor/yardCrops';
import { AmbientGroundShadow, ContactGroundShadow } from '../../../../world/render/GroundShadow';

/** Three small receiving-plane cues, separate from the upright crop artwork. */
export function GardenCropContactShadow({ crop, color, variation }: {
  crop: GardenCrop; color: string; variation: number;
}) {
  const leafy=crop==='cabbage'||crop==='lettuce'||crop==='bokChoy'||crop==='shanghaiGreen'||crop==='potato'||crop==='strawberry'||crop==='cilantro'||crop==='looseLettuce';
  const tall=crop==='corn'||crop==='tomato'||crop==='bean'||crop==='pepper'||crop==='waterSpinach'||crop==='peaShoots';
  const spread=crop==='potato'||crop==='strawberry' ? 7 : 5.6;
  const side=variation%2 ? -1 : 1;
  const strawberryPose=variation%3;
  return <g data-crop-contact-shadow={leafy ? 'low-leaves' : tall ? 'upright' : 'narrow-leaves'} pointerEvents="none" aria-hidden="true">
    {leafy ? <>
      <AmbientGroundShadow cx={.7} cy={.45} rx={spread} ry={1.65} color={color} opacity={.2} />
      {crop==='strawberry' ? <>
        {/* Low outer strawberry leaves cast two separate, ground-hugging patches. */}
        <path d={`M${strawberryPose===1 ? -5.7 : -5.1},.1 Q-4.5,-.65 -3.5,-.2 Q-3,.1 -3.5,.55 Q-4.5,.85 -5.7,.1Z`}
          fill={color} opacity={strawberryPose===2 ? '.15' : '.17'} />
        <path d={`M${strawberryPose===1 ? 3.8 : 4.3},.05 Q5,-.55 5.9,-.15 Q6.35,.1 5.8,.5 Q4.9,.75 4.3,.35Z`}
          transform={`translate(${side*.18} .12)`} fill={color} opacity={strawberryPose===1 ? '.13' : '.15'} />
      </> : <>
        {/* Short shadows tuck under the outer leaves; they do not outline the whole crown. */}
        <path d={`M${-spread*.75},.1 Q${-spread*.3},-1.1 -.6,-.4 Q-1.4,.7 ${-spread*.7},.8Z`}
          fill={color} opacity=".13" />
        <path d={`M.7,-.2 Q${spread*.6},-.8 ${spread},.3 Q${spread*.65},1.1 1,.8Z`}
          transform={`translate(${side*.35} .2)`} fill={color} opacity=".11" />
      </>}
    </> : tall ? <g transform="rotate(12)">
      {/* A restrained lower-right cast, fixed to scene light rather than the plot's heading. */}
      <AmbientGroundShadow cx={3} cy={.3} rx={crop==='corn'||crop==='bean' ? 6 : 4.8} ry={1.05} color={color} opacity={.14} />
    </g> : <AmbientGroundShadow cx={.6} cy={.25} rx={3.2} ry={.95} color={color} opacity={.15} />}
    <ContactGroundShadow cx={.15} cy={.08} rx={crop==='looseLettuce' ? 2.3 : leafy ? 1.45 : tall ? .95 : .7} ry={crop==='looseLettuce' ? .65 : leafy ? .45 : .34}
      color={color} opacity={crop==='looseLettuce' ? .4 : .36} />
  </g>;
}
