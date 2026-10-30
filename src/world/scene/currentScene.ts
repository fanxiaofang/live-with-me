/** The cumulative scene on this branch. Query parameters are explicit comparisons,
 * never prerequisites for seeing already-integrated work. Keep this module pure so
 * the app, authoring fixtures and capture tools can share the same definition. */
export interface SceneOptions {
  cottage: 'seedpod' | 'classic';
  hills: 'legacy' | 'f2';
  hillsStudy: 'baseline' | 'position20' | 'position35' | 'refined';
  hillsTransition: 'off' | 'foothill';
  foothillForm: 'source-foot' | 'meadow';
  hillsTrees: 'off' | 'sparse';
  fieldEdges: 'original' | 'rear' | 'front' | 'both';
  meadowStudy: 'original' | 'surface' | 'foreground' | 'complete';
  meadowForeground: 'points' | 'regions' | 'entrance';
}

export const CURRENT_F2_SCENE = Object.freeze({
  cottage: 'seedpod',
  hills: 'f2',
  hillsStudy: 'refined',
  hillsTransition: 'foothill',
  foothillForm: 'meadow',
  hillsTrees: 'sparse',
  fieldEdges: 'both',
  meadowStudy: 'complete',
  // The newest composition includes regions and the committed gate clearance fix.
  meadowForeground: 'entrance',
} as const satisfies SceneOptions);

export function resolveSceneOptions(search = ''): SceneOptions {
  const query = new URLSearchParams(search);
  const select = <K extends keyof SceneOptions>(key: K, choices: readonly SceneOptions[K][]): SceneOptions[K] => {
    const value = query.get(key) as SceneOptions[K] | null;
    return value !== null && choices.includes(value) ? value : CURRENT_F2_SCENE[key];
  };
  return {
    cottage: select('cottage', ['seedpod', 'classic']),
    hills: select('hills', ['legacy', 'f2']),
    hillsStudy: select('hillsStudy', ['baseline', 'position20', 'position35', 'refined']),
    hillsTransition: select('hillsTransition', ['off', 'foothill']),
    foothillForm: select('foothillForm', ['source-foot', 'meadow']),
    hillsTrees: select('hillsTrees', ['off', 'sparse']),
    fieldEdges: select('fieldEdges', ['original', 'rear', 'front', 'both']),
    meadowStudy: select('meadowStudy', ['original', 'surface', 'foreground', 'complete']),
    meadowForeground: select('meadowForeground', ['points', 'regions', 'entrance']),
  };
}

/** The accepted composition. Removed study parameters are ignored, so saved
 * preview links open the current scene instead of reviving discarded variants. */
export function requestedMeadowFoothill(search = typeof window==='undefined' ? '' : window.location.search) {
  const scene=resolveSceneOptions(search);
  return scene.hills==='f2' && scene.hillsTransition==='foothill'
    && scene.foothillForm==='meadow';
}
