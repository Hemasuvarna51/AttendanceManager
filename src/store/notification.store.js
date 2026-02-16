import { create } from "zustand";

export const useNotificationStore = create((set) => {
  return {
    notifications: [],

    // Add a new notification
    addNotification: (notification) => {
      const id = Date.now();
      const newNotif = {
        id,
        title: notification.title || "Notification",
        message: notification.message || "",
        time: new Date().toLocaleTimeString(),
        ...notification,
      };

      set((state) => ({
        notifications: [newNotif, ...state.notifications],
      }));

      // Auto-remove after 5 seconds if autoClose is true
      if (notification.autoClose !== false) {
        setTimeout(() => {
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }));
        }, 5000);
      }

      return id;
    },

    // Remove a specific notification
    removeNotification: (id) => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    },

    // Clear all notifications
    clearAll: () => {
      set({ notifications: [] });
    },
  };
});
