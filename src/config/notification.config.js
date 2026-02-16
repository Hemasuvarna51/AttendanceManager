/**
 * Notification Configuration
 * 
 * Central configuration for notification behavior and styling
 */

export const notificationConfig = {
  // Default auto-close duration (in milliseconds)
  autoCloseDuration: 5000,

  // Maximum notifications to display at once
  maxNotifications: 10,

  // Notification types and their colors
  types: {
    success: {
      color: "#10b981",
      icon: "✓",
      autoClose: true,
    },
    error: {
      color: "#ef4444",
      icon: "✕",
      autoClose: false, // Errors stay visible
    },
    info: {
      color: "#3b82f6",
      icon: "ℹ",
      autoClose: true,
    },
    warning: {
      color: "#f59e0b",
      icon: "⚠",
      autoClose: false, // Warnings stay visible
    },
  },

  // Position on screen (for future enhancement)
  position: "top-right", // top-right, top-left, bottom-right, bottom-left

  // Animation settings
  animation: {
    duration: 140, // ms
    easing: "ease-out",
  },

  // Storage settings
  storage: {
    enabled: true,
    key: "notifications",
    maxStored: 50, // Keep last 50 notifications
  },

  // Notification categories for filtering
  categories: {
    TASK: "task",
    ATTENDANCE: "attendance",
    MEETING: "meeting",
    SYSTEM: "system",
    ADMIN: "admin",
  },
};

/**
 * Create a typed notification
 * 
 * @param {string} type - success, error, info, warning
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {object} options - Additional options
 * @returns {object} Notification object
 */
export const createNotification = (type, title, message, options = {}) => {
  const typeConfig = notificationConfig.types[type] || notificationConfig.types.info;

  return {
    title,
    message,
    type,
    autoClose: options.autoClose !== undefined ? options.autoClose : typeConfig.autoClose,
    category: options.category,
    priority: options.priority || "normal", // low, normal, high
    ...options,
  };
};

/**
 * Predefined notification creators
 */
export const notifications = {
  success: (title, message, options) =>
    createNotification("success", title, message, options),

  error: (title, message, options) =>
    createNotification("error", title, message, options),

  info: (title, message, options) =>
    createNotification("info", title, message, options),

  warning: (title, message, options) =>
    createNotification("warning", title, message, options),

  // Common notifications
  taskCreated: (taskName, assignee) =>
    createNotification("success", "Task Created", `"${taskName}" assigned to ${assignee}`),

  taskDeleted: (taskName) =>
    createNotification("info", "Task Deleted", `"${taskName}" has been deleted`),

  checkedIn: (time) =>
    createNotification("success", "Checked In", `You checked in at ${time}`),

  checkedOut: (time, duration) =>
    createNotification("success", "Checked Out", `You checked out at ${time} (worked ${duration})`),

  meetingScheduled: (meetingName, time) =>
    createNotification("info", "Meeting Scheduled", `${meetingName} at ${time}`),

  leaveApproved: (leaveName) =>
    createNotification("success", "Leave Approved", `Your ${leaveName} has been approved`),

  leaveRejected: (leaveName) =>
    createNotification("error", "Leave Rejected", `Your ${leaveName} has been rejected`),

  error: (message) =>
    createNotification("error", "Error", message, { autoClose: false }),

  serverError: () =>
    createNotification("error", "Server Error", "Unable to connect to server", {
      autoClose: false,
    }),
};

export default notificationConfig;
