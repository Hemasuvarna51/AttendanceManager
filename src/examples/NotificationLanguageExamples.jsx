/**
 * Example Usage of Notification and Language Features
 * 
 * This file demonstrates how to use notifications and language features
 * in different parts of the application.
 */

// ============================================
// EXAMPLE 1: Adding Notifications
// ============================================

import { useNotificationStore } from "../store/notification.store";

export function AdminTaskExample() {
  const addNotification = useNotificationStore((s) => s.addNotification);

  const handleTaskAssignment = (taskTitle, employeeName) => {
    // Add success notification
    addNotification({
      title: "Task Created Successfully",
      message: `"${taskTitle}" has been assigned to ${employeeName}`,
      autoClose: true,
    });
  };

  const handleTaskError = (error) => {
    // Add error notification (won't auto-close)
    addNotification({
      title: "Error Creating Task",
      message: error.message,
      autoClose: false,
    });
  };

  return (
    <div>
      <button onClick={() => handleTaskAssignment("Review Report", "John Doe")}>
        Create Task
      </button>
    </div>
  );
}

// ============================================
// EXAMPLE 2: Using Language Translations
// ============================================

import { useLanguageStore } from "../store/language.store";
import { getTranslation } from "../utils/language";

export function CheckInButtonExample() {
  const language = useLanguageStore((s) => s.language);

  return (
    <button>
      {getTranslation(language, "checkIn")}
    </button>
  );
}

// ============================================
// EXAMPLE 3: Combining Notifications + Language
// ============================================

export function AttendanceExample() {
  const addNotification = useNotificationStore((s) => s.addNotification);
  const language = useLanguageStore((s) => s.language);

  const handleCheckIn = () => {
    // Check in logic here...

    // Show notification in current language
    const title = getTranslation(language, "checkIn");
    addNotification({
      title,
      message: "You have successfully checked in",
      autoClose: true,
    });
  };

  return (
    <button onClick={handleCheckIn}>
      {getTranslation(language, "checkIn")}
    </button>
  );
}

// ============================================
// EXAMPLE 4: Clear Notifications
// ============================================

export function NotificationControlExample() {
  const clearAll = useNotificationStore((s) => s.clearAll);
  const removeNotification = useNotificationStore((s) => s.removeNotification);

  return (
    <div>
      <button onClick={() => removeNotification(12345)}>
        Remove Specific Notification
      </button>
      <button onClick={clearAll}>Clear All Notifications</button>
    </div>
  );
}

// ============================================
// EXAMPLE 5: Building a Localized Form
// ============================================

export function LocalizedFormExample() {
  const language = useLanguageStore((s) => s.language);
  const addNotification = useNotificationStore((s) => s.addNotification);

  const labels = {
    myProfile: getTranslation(language, "myProfile"),
    logout: getTranslation(language, "logout"),
    language: getTranslation(language, "language"),
  };

  const handleSubmit = () => {
    addNotification({
      title: "Success",
      message: "Form submitted successfully",
      autoClose: true,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>{labels.myProfile}</label>
      <input type="text" placeholder="Enter name" />
      <button type="submit">Submit</button>
    </form>
  );
}

// ============================================
// EXAMPLE 6: Multilingual Notification Messages
// ============================================

export function MultilingualNotificationExample() {
  const addNotification = useNotificationStore((s) => s.addNotification);
  const language = useLanguageStore((s) => s.language);

  const messages = {
    en: {
      taskCreated: "Task has been created successfully",
      taskDeleted: "Task has been deleted",
      taskUpdated: "Task has been updated",
    },
    hi: {
      taskCreated: "कार्य सफलतापूर्वक बनाया गया है",
      taskDeleted: "कार्य हटा दिया गया है",
      taskUpdated: "कार्य को अपडेट किया गया है",
    },
    es: {
      taskCreated: "La tarea se ha creado exitosamente",
      taskDeleted: "La tarea ha sido eliminada",
      taskUpdated: "La tarea ha sido actualizada",
    },
    fr: {
      taskCreated: "La tâche a été créée avec succès",
      taskDeleted: "La tâche a été supprimée",
      taskUpdated: "La tâche a été mise à jour",
    },
  };

  const notifyTaskCreated = () => {
    addNotification({
      title: "Success",
      message: messages[language]?.taskCreated || messages.en.taskCreated,
      autoClose: true,
    });
  };

  return (
    <button onClick={notifyTaskCreated}>Create Task</button>
  );
}

// ============================================
// EXAMPLE 7: Switching Language Programmatically
// ============================================

export function LanguageSwitcherExample() {
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const language = useLanguageStore((s) => s.language);

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
    { code: "es", label: "Español" },
    { code: "fr", label: "Français" },
  ];

  return (
    <div>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ============================================
// EXAMPLE 8: Notification with Auto-Close
// ============================================

export function AutoCloseNotificationExample() {
  const addNotification = useNotificationStore((s) => s.addNotification);

  // This will auto-close after 5 seconds (default)
  const showAutoClose = () => {
    addNotification({
      title: "Info",
      message: "This notification will disappear in 5 seconds",
      autoClose: true, // Default behavior
    });
  };

  // This will NOT auto-close
  const showPersistent = () => {
    addNotification({
      title: "Important",
      message: "This notification will stay until dismissed",
      autoClose: false,
    });
  };

  return (
    <div>
      <button onClick={showAutoClose}>Show Auto-Close Notification</button>
      <button onClick={showPersistent}>Show Persistent Notification</button>
    </div>
  );
}

export default {
  AdminTaskExample,
  CheckInButtonExample,
  AttendanceExample,
  NotificationControlExample,
  LocalizedFormExample,
  MultilingualNotificationExample,
  LanguageSwitcherExample,
  AutoCloseNotificationExample,
};
