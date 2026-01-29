import { create } from "zustand";

const STORAGE_KEY = "attendance_auth";

const loadAuth = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create((set, get) => {
  const saved = loadAuth();

  return {
    user: saved?.user || null,
    token: saved?.token || null,
    role: saved?.role || null,

    isLoggedIn: () => !!get().token,

    login: ({ user, token, role }) => {
      const payload = { user, token, role };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      set(payload);
    },

    logout: () => {
      localStorage.removeItem(STORAGE_KEY);
      set({ user: null, token: null, role: null });
    },
  };
});
