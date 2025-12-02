// Path: src/Component/store/templates/useApprovalsStore.js

import { create } from "zustand";

// NOTE: This store is now minimal. The complex graph/history logic
// has been removed as it was based on mock data and not fully integrated.
// The primary source of truth for a template's status is the `status`
// property on the template object itself, which comes from the API.

const useApprovalsStore = create((set, get) => ({
  // State can be added here as needed for real approval features.
  approvals: {},

  // Placeholder for actions if needed in the future.
  clear: (templateId) =>
    set((s) => {
      const next = { ...(s.approvals || {}) };
      delete next[templateId];
      return { approvals: next };
    }),
}));

export default useApprovalsStore;
