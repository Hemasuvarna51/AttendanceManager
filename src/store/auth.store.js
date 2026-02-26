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
        const safeRole =
          role === "Admin" ? "admin" :
            role === "Employee" ? "employee" :
              role;

        const normalizedUser = user
          ? {
            ...user,
            id: user.id || user.email || user.employeeId || user.username || crypto.randomUUID(),
          }
          : null;

        set({ user: normalizedUser, token, role: safeRole });
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