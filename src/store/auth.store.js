import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      role: null, // "admin" | "employee"
      hasHydrated: false,

      isLoggedIn: () => !!get().token,

      login: ({ user, token, role }) => {
        // normalize role just in case
        const safeRole =
          role === "Admin" ? "admin" :
          role === "Employee" ? "employee" :
          role;

        set({ user, token, role: safeRole });
      },

      logout: () => {
        set({ user: null, token: null, role: null });
      },

      updateUser: (updatedUserData) => {
        const current = get();
        if (!current.user) return;

        set({
          user: { ...current.user, ...updatedUserData },
        });
      },
    }),
    {
      name: "attendance_auth",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // called after rehydration
        state?.hasHydrated && state.hasHydrated; // no-op safe
      },
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        role: state.role,
      }),
      // ✅ set hydration flag once loaded
      merge: (persisted, current) => ({
        ...current,
        ...persisted,
        hasHydrated: true,
      }),
    }
  )
);