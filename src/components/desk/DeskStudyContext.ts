import { createContext, useContext } from 'react';
import type { DeskSurfaceStudy } from './deskStudyModel';

// A transient authoring override. The default world never receives study geometry.
export const DeskStudyContext = createContext<{ surface: DeskSurfaceStudy; guides: boolean } | null>(null);
export const useDeskStudy = () => useContext(DeskStudyContext);
