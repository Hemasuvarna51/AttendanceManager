import { create } from "zustand";
import { persist } from "zustand/middleware";

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

const normalizeStatus = (status) => {
  if (!status) return "Pending";
  const valid = ["Pending", "Approved", "Rejected"];
  return valid.includes(status) ? status : "Pending";
};

export const useLeaveStore = create(
  persist(
    (set, get) => ({
      leaves: [],

      /* ================================
         ADD LEAVE
      ================================= */
      addLeave: (leave) =>
        set((state) => ({
          leaves: [
            ...state.leaves,
            {
              ...leave,
              id: generateId(),
              status: "Pending",
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      /* ================================
         UPDATE STATUS (Admin action)
      ================================= */
      updateLeaveStatus: (id, status) =>
        set((state) => ({
          leaves: state.leaves.map((leave) =>
            leave.id === id
              ? { ...leave, status: normalizeStatus(status) }
              : leave
          ),
        })),

      /* ================================
         DELETE LEAVE (optional future use)
      ================================= */
      deleteLeave: (id) =>
        set((state) => ({
          leaves: state.leaves.filter((l) => l.id !== id),
        })),

      /* ================================
         SELECTORS
      ================================= */

      getLeavesByUser: (userId) =>
        get().leaves
          .filter((l) => l.userId === userId)
          .map((l) => ({
            ...l,
            status: normalizeStatus(l.status),
          })),

      getLeavesByStatus: (status) =>
        get().leaves.filter(
          (l) => normalizeStatus(l.status) === normalizeStatus(status)
        ),

      getAllLeaves: () =>
        get().leaves.map((l) => ({
          ...l,
          status: normalizeStatus(l.status),
        })),

      /* ================================
         RESET (dev/debug use only)
      ================================= */
      clearAllLeaves: () => set({ leaves: [] }),
    }),
    {
      name: "leave-storage",
    }
  )
);