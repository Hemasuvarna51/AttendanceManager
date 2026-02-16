# Notification and Language Features

## Overview
This document explains how to use the notification and language features in the Attendance Manager application.

---

## 1. Notifications System

### Features
- **Admin Notifications**: Only admins can see the notification bell icon in the navbar
- **Notification Management**: View, dismiss, and clear all notifications
- **Persistent Storage**: Notifications are saved to localStorage
- **Auto-dismiss**: Optional auto-dismissal after 5 seconds

### Usage

#### Display Notifications
Notifications are shown in the navbar for admin users. Click the bell icon to open the dropdown.

#### Programmatically Add Notifications

```javascript
import { useNotificationStore } from "../store/notification.store";

function MyComponent() {
  const addNotification = useNotificationStore((s) => s.addNotification);

  const handleTaskAssign = () => {
    // Do something...
    
    // Show notification
    addNotification({
      title: "Task Assigned",
      message: "Task has been assigned to John Doe",
      autoClose: true, // Auto-dismiss after 5 seconds
    });
  };

  return <button onClick={handleTaskAssign}>Assign Task</button>;
}
```

#### Remove Specific Notification
```javascript
const removeNotification = useNotificationStore((s) => s.removeNotification);
removeNotification(notificationId);
```

#### Clear All Notifications
```javascript
const clearAll = useNotificationStore((s) => s.clearAll);
clearAll();
```

### Notification Object Structure
```javascript
{
  id: number,              // Auto-generated timestamp
  title: string,           // Main title
  message: string,         // Detailed message
  time: string,            // Timestamp (auto-generated)
  autoClose: boolean       // Optional: auto-dismiss after 5s (default: true)
}
```

---

## 2. Language/Localization System

### Features
- **Multiple Languages**: English, Hindi, Spanish, French
- **Global Language Store**: Zustand-based state management
- **Translation Utilities**: Easy translation helper functions
- **Persistent Preference**: Selected language saved to localStorage
- **Language Dropdown**: Accessible from navbar for all users

### Usage

#### Get Current Language
```javascript
import { useLanguageStore } from "../store/language.store";

function MyComponent() {
  const language = useLanguageStore((s) => s.language);
  console.log("Current language:", language); // "en", "hi", "es", "fr"
}
```

#### Change Language
```javascript
const setLanguage = useLanguageStore((s) => s.setLanguage);
setLanguage("hi"); // Switch to Hindi
```

#### Translate Text
```javascript
import { getTranslation } from "../utils/language";

function MyComponent() {
  const language = useLanguageStore((s) => s.language);
  
  const text = getTranslation(language, "myProfile"); // Returns "My Profile" or "मेरी प्रोफाइल"
}
```

### Available Translations

#### Keys:
- `notifications` - "Notifications"
- `clearAll` - "Clear All"
- `noNotifications` - "No notifications"
- `language` - "Language"
- `myProfile` - "My Profile"
- `logout` - "Logout"
- `english` - "English"
- `hindi` - "Hindi"
- `spanish` - "Spanish"
- `french` - "French"
- `adminPanel` - "Admin Panel"
- `employeePortal` - "Employee Portal"
- `checkIn` - "Check-In"
- `checkOut` - "Check-Out"

### Adding New Translations

Edit `src/utils/language.js`:

```javascript
export const translations = {
  en: {
    // ... existing translations
    newFeature: "New Feature",
  },
  hi: {
    // ... existing translations
    newFeature: "नई सुविधा",
  },
  es: {
    // ... existing translations
    newFeature: "Nueva Característica",
  },
  fr: {
    // ... existing translations
    newFeature: "Nouvelle Fonctionnalité",
  },
};
```

---

## 3. Integration Examples

### Example: Task Assignment Notification

```javascript
import { useNotificationStore } from "../store/notification.store";
import { useLanguageStore } from "../store/language.store";
import { getTranslation } from "../utils/language";

function AdminTaskForm() {
  const addNotification = useNotificationStore((s) => s.addNotification);
  const language = useLanguageStore((s) => s.language);

  const handleCreateTask = async (taskData) => {
    try {
      // Create task...
      
      addNotification({
        title: getTranslation(language, "notifications"),
        message: `Task "${taskData.title}" assigned to ${taskData.assignedTo}`,
        autoClose: true,
      });
    } catch (error) {
      addNotification({
        title: "Error",
        message: error.message,
        autoClose: false, // Keep error notification visible
      });
    }
  };

  return (
    // Form JSX
  );
}
```

### Example: Using Translations in Components

```javascript
import { useLanguageStore } from "../store/language.store";
import { getTranslation } from "../utils/language";

function CheckInButton() {
  const language = useLanguageStore((s) => s.language);
  
  return (
    <button>
      {getTranslation(language, "checkIn")}
    </button>
  );
}
```

---

## 4. File Structure

```
src/
├── store/
│   ├── notification.store.js    # Notification state management
│   └── language.store.js         # Language state management
├── utils/
│   └── language.js               # Translation data and utilities
└── components/
    └── Navbar.jsx                # Notification & language dropdowns
```

---

## 5. Browser Console Debugging

The system logs language changes:
```javascript
// When language is switched
console.log("🌍 Language changed to: hi");
```

---

## 6. Future Enhancements

- [ ] Integrate real-time notifications with WebSocket
- [ ] Add more languages
- [ ] Implement notification preferences (per user)
- [ ] Add notification categories (task, meeting, attendance)
- [ ] Create notification history/archive
- [ ] Add dark mode language support
- [ ] Implement RTL language support (Arabic, Hebrew)

---

## 7. Testing

### Test Notifications:
1. Log in as admin
2. Click the bell icon
3. You should see default notifications
4. Try removing or clearing notifications
5. Verify changes persist on page reload

### Test Language:
1. Click the globe icon in navbar
2. Select a different language
3. Check console for language change log
4. Verify language persists on page reload

---

## Support

For issues or questions, please refer to the main README or contact the development team.
