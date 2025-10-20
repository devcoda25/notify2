import  create  from 'zustand'
import { undo as flowUndo, redo as flowRedo } from './flow';
// import { undo, redo, canUndo, canRedo } from './flow';
// then call undo(), redo(), etc.


export const useHistoryStore = create((set) => ({
  canUndo: false,
  canRedo: false,
  undo: () => {
    flowUndo();
  },
  redo: () => {
    flowRedo();
  },
  setCanUndo: (b) => set({ canUndo: b }),
  setCanRedo: (b) => set({ canRedo: b }),
}))
