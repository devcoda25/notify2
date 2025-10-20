/* Improved: src/Component/store/scheduling/useReminderPoliciesStore.js */
import { create } from "zustand";
import { attachPersistence } from "../../store/__persist__/persist";

const SEED = { policies: 8 };

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const id = (pfx) => `${pfx}_${Math.random().toString(36).slice(2, 9)}`;

const CHANNELS = [["email"], ["email", "sms"], ["email", "whatsapp"], ["email", "sms", "whatsapp"]];
const STEP_TEMPLATES = ["reminder_24h", "reminder_2h", "reminder_30m", "followup_no_show", "post_call_recap"];

function seedPolicies() {
  const out = [];
  for (let i = 0; i < SEED.policies; i++) {
    const stepsCount = 2 + (i % 3); // 2–4 steps
    const steps = [];
    for (let k = 0; k < stepsCount; k++) {
      const offsets = [-1440, -720, -120, -60, -30]; // min
      steps.push({
        offsetMinutes: offsets[(i + k) % offsets.length],
        channel: pick(["email", "sms", "whatsapp"]),
        template: pick(STEP_TEMPLATES),
      });
    }
    out.push({
      id: id("rem"),
      name: `Policy #${i + 1}`,
      appliesTo: { eventTypeIds: i % 2 ? ["intro_15", "demo_30"] : [] },
      channels: pick(CHANNELS),
      steps,
      reschedule: { enabled: Math.random() > 0.15 },
      cancellation: { enabled: Math.random() > 0.15 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return out;
}

const initial = {
  policies: [],
  loaded: false,
};

export const useReminderPoliciesStore = create((set, get) => ({
  ...initial,

  loadFixtures: () => {
    if (get().loaded) return;
    set({ policies: seedPolicies(), loaded: true });
  },

  createPolicy: (data) => {
    const _id = data.id || id("rem");
    set((s) => ({ policies: [{ ...data, id: _id }, ...s.policies] }));
    return _id;
  },

  updatePolicy: (idX, patch) =>
    set((s) => ({
      policies: s.policies.map((p) => (p.id === idX ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p)),
    })),

  deletePolicy: (idX) =>
    set((s) => ({ policies: s.policies.filter((p) => p.id !== idX) })),

  getById: (idX) => get().policies.find((p) => p.id === idX),
}));

attachPersistence(useReminderPoliciesStore, {
  key: "meetings.reminders",
  select: (s) => ({ policies: s.policies, loaded: s.loaded }),
});
