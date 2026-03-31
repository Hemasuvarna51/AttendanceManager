import { create } from "zustand";

export const useLeaveStore = create((set) => ({
  leaves: [],

  setLeaves: (leaves) => set({ leaves }),

  addLeaveLocal: (leave) =>
    set((state) => ({
      leaves: [...state.leaves, leave],
    })),

  updateLeaveLocal: (id, status) =>
    set((state) => ({
      leaves: state.leaves.map((l) =>
        l.id === id ? { ...l, status } : l
      ),
    })),

  clearLeaves: () => set({ leaves: [] }),
}));