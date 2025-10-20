import  create  from 'zustand'

export const useUIStore = create((set, get) => ({
  isTestConsoleOpen: false,
  toggleTestConsole: () => set({ isTestConsoleOpen: !get().isTestConsoleOpen }),
}))
