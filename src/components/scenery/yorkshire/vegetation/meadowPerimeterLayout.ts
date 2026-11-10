import type { SceneLayout } from '../../../../world/scene/sceneTypes';
import { frontEdgeY } from '../../../../world/scene/fieldEdges';
import { YORKSHIRE_LAYOUT } from '../landscapeLayout';

export function meadowPerimeterGroups(layout: SceneLayout) {
  const cabin = layout.wooden_cabin, pod = layout.capsule_pod;
  const tree = YORKSHIRE_LAYOUT.guardianTree;
  const pen = YORKSHIRE_LAYOUT.sheepPen.anchor;
  return [
    ...[-78, 48, 1190, 1310].map((x, i) => ({ id: `rear-${i}`, x, y: frontEdgeY(x) + (i % 2 ? 42 : 27), scale: .38, flowers: i % 2 === 0 })),
    { id: 'cabin-outer', x: cabin.position.x - 205 * cabin.scale, y: cabin.position.y + 2 * cabin.scale, scale: .62, flowers: true },
    { id: 'cabin-side', x: cabin.position.x - 235 * cabin.scale, y: cabin.position.y + 149 * cabin.scale, scale: .67, flowers: false },
    { id: 'pod-outer', x: pod.position.x + 285 * pod.scale, y: pod.position.y + 18 * pod.scale, scale: .64, flowers: true },
    { id: 'west-front', x: tree.position.x - 88, y: tree.position.y + tree.root.y * tree.scale + 76, scale: .76, flowers: true },
    { id: 'east-front', x: pen.x + 90, y: pen.y + 154, scale: .78, flowers: false },
    { id: 'east-outer', x: pen.x + 409, y: pen.y + 57, scale: .84, flowers: true },
  ];
}
