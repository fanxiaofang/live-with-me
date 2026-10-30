/** Pin archived comparison scripts to their original opt-in semantics.
 * Current captures must use CURRENT_F2_SCENE and the real no-parameter app. */
export function historicalSceneUrl(input) {
  const url = new URL(input);
  if (url.pathname !== '/' && !url.pathname.startsWith('/tests/fixtures/')) return input;
  if (['morning', 'afternoon', 'rainy'].includes(url.searchParams.get('theme'))) {
    throw new Error('Archived five-theme captures require their original Git revision. Current three-period captures use verify-landscape-environment.mjs.');
  }
  const original = {
    hills: 'legacy', hillsTransition: 'off', hillsTrees: 'off', fieldEdges: 'original',
    meadowStudy: 'original', meadowForeground: 'points',
  };
  for (const [key, value] of Object.entries(original)) {
    if (!url.searchParams.has(key)) url.searchParams.set(key, value);
  }
  return url.href;
}
