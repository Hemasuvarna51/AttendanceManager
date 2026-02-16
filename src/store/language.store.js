import { create } from "zustand";

export const useLanguageStore = create((set, get) => {
  // Load language from localStorage
  const savedLanguage = localStorage.getItem("appLanguage") || "en";

  return {
    language: savedLanguage,

    // Set language
    setLanguage: (lang) => {
      localStorage.setItem("appLanguage", lang);
      set({ language: lang });
    },

    // Get current language
    getCurrentLanguage: () => get().language,
  };
});
