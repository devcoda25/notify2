// src/Component/store/templates/usePreviewStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const STORAGE_KEY = "notify.templates.preview.v1";

const usePreviewStore = create(
  persist(
    (set) => ({
      device: "mobile", // 'mobile' | 'desktop'
      darkMode: false,
      channel: "platform",
      locale: "en",
      themeId: "simple_box",
      sampleVars: {},

      setDevice: (d) => set({ device: d }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setChannel: (c) => set({ channel: c }),
      setLocale: (l) => set({ locale: l }),
      setThemeId: (t) => set({ themeId: t }),
      setSampleVar: (key, value) => set((s) => ({ sampleVars: { ...s.sampleVars, [key]: value } })),
      resetPreview: () =>
        set({ device: "mobile", darkMode: false, channel: "platform", locale: "en", themeId: "simple_box", sampleVars: {} }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default usePreviewStore;
