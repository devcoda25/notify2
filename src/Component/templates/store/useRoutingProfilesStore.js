// src/Component/store/templates/usePreviewStore.js

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import profilesFx from "../../templates/fixtures/routingProfiles.fixtures.json";
import defaults from "../../templates/core/routingProfiles.defaults";

const STORAGE_KEY = "notify.templates.routing.v1";

const useRoutingProfilesStore = create(
  persist(
    (set, get) => ({
      profiles: profilesFx?.profiles || defaults,

      getProfile: (type, activity) => {
        const p = get().profiles?.[type] || {};
        return activity ? p[activity] || p._default || [] : p;
      },

      setProfile: (type, activity, orderArray) =>
        set((s) => ({
          profiles: {
            ...s.profiles,
            [type]: {
              ...(s.profiles?.[type] || {}),
              [activity || "_default"]: orderArray,
            },
          },
        })),

      resetToDefaults: () => set({ profiles: defaults }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useRoutingProfilesStore;
