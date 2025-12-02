/* TODO: stub for src/Component/store/scheduling/useConferencingStore.js */
import { create } from "zustand";
import { attachPersistence } from "../../store/__persist__/persist";
// import * as conferencing from "../../Meetings/mocks/adapters/conferencing.mock";

const initial = {
  devicePrefs: {
    cameraId: null,
    micId: null,
    speakerId: null,
    noiseSuppression: true,
    echoCancellation: true,
  },
  rooms: {}, // meetingId -> { joinUrl, dialIn, provider, token?, status, recordingUrl? }
  lastError: null,
};

export const useConferencingStore = create((set, get) => ({
  ...initial,

  setDevicePref: (key, value) =>
    set((s) => ({ devicePrefs: { ...s.devicePrefs, [key]: value } })),

  clearError: () => set({ lastError: null }),

  /** Create/join a local mock room and stash the join info by meetingId. */
  createRoomForMeeting: async (meetingId, payload) => {
    try {
      // DUMMY IMPLEMENTATION
      console.log('[DUMMY] Creating conference room for meeting:', meetingId);
      await new Promise(resolve => setTimeout(resolve, 500));
      const conf = {
        provider: 'dummy-provider',
        joinUrl: `https://dummy.conference.com/join/${meetingId}`,
        dialIn: '+1234567890',
        status: 'created',
        recordingUrl: null,
        createdAt: new Date().toISOString(),
      };
      set((s) => ({
        rooms: {
          ...s.rooms,
          [meetingId]: {
            provider: conf.provider,
            joinUrl: conf.joinUrl,
            dialIn: conf.dialIn,
            status: conf.status,
            recordingUrl: conf.recordingUrl || null,
            createdAt: conf.createdAt,
          },
        },
      }));
      return conf;
    } catch (e) {
      set({ lastError: e?.message || String(e) });
      return null;
    }
  },

  refreshRoom: async (meetingId) => {
    const r = get().rooms[meetingId];
    if (!r) return null;
    // DUMMY IMPLEMENTATION
    console.log('[DUMMY] Refreshing conference room for meeting:', meetingId);
    await new Promise(resolve => setTimeout(resolve, 500));
    const conf = {
        status: 'in-progress',
        recordingUrl: `https://dummy.recordings.com/${meetingId}.mp4`,
    };
    if (conf) {
      set((s) => ({
        rooms: {
          ...s.rooms,
          [meetingId]: {
            ...s.rooms[meetingId],
            status: conf.status,
            recordingUrl: conf.recordingUrl || s.rooms[meetingId].recordingUrl || null,
          },
        },
      }));
    }
    return get().rooms[meetingId];
  },
}));

attachPersistence(useConferencingStore, {
  key: "meetings.conferencing",
  select: (s) => ({ devicePrefs: s.devicePrefs }),
});
