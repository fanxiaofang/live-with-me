import { useEffect, useRef, useState } from 'react';
import type { Camera } from '../camera/cameraMath';
import { resolveLandscapeCoverage, type LandscapeCoverage } from '../camera/parallaxMath';
import { CAMERA_SETTLE_MS } from '../camera/cameraMotion';

const union = (a: LandscapeCoverage, b: LandscapeCoverage): LandscapeCoverage => ({
  mountainFrontExtension: Math.max(a.mountainFrontExtension, b.mountainFrontExtension),
  wheatFrontExtension: Math.max(a.wheatFrontExtension, b.wheatFrontExtension),
});

export function useLandscapeCoverage(camera: Camera, isDragging: boolean) {
  const desired = resolveLandscapeCoverage(camera);
  const retained = useRef(desired);
  const [, refresh] = useState(0);

  // Keep the previous skirt until the shared camera transition has settled.
  // Pointer pans have no transition and can use their exact coverage immediately.
  useEffect(() => {
    if (isDragging) {
      retained.current = desired;
      return;
    }
    retained.current = union(retained.current, desired);
    const timer = window.setTimeout(() => {
      const previous = retained.current;
      retained.current = desired;
      if (previous.mountainFrontExtension !== desired.mountainFrontExtension
        || previous.wheatFrontExtension !== desired.wheatFrontExtension) refresh(value => value + 1);
    }, CAMERA_SETTLE_MS);
    return () => window.clearTimeout(timer);
  }, [desired.mountainFrontExtension, desired.wheatFrontExtension, isDragging]);

  return isDragging ? desired : union(retained.current, desired);
}
