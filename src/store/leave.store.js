import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLeaveStore = create(
  persist(
    (set) => ({
      leaves: [],
      
      addLeave: (leave) => set((state) => ({ 
        leaves: [...state.leaves, { ...leave, id: Date.now(), status: 'Pending' }] 
      })),
      
      updateLeaveStatus: (id, status) => set((state) => ({
        leaves: state.leaves.map((leave) => 
          leave.id === id ? { ...leave, status } : leave
        )
      })),
    }),
    {
      name: 'leave-storage',
    }
  )
);
