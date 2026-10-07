import { createContext } from 'react';
import type { EditableObjectId } from '../../components/layout-gizmo/layoutStore';

export interface LayoutGestureOwner {
  activeId:EditableObjectId|null;
  begin:()=>void;
  commit:()=>void;
  cancel:()=>void;
  markMoved:()=>void;
}
export const LayoutGestureContext=createContext<LayoutGestureOwner|null>(null);
