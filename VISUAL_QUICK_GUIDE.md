# 📱 Notification & Language - Visual Quick Guide

## 🔔 Notifications - Where to Find

### In the App
```
┌─────────────────────────────────────────────────┐
│  Navbar                                         │
│  ├─ Check-In/Out Button  [🔔 3]  [🌍]  [👤▼]  │
│  └─ (Admin only)          ↓                     │
│     ┌─────────────────────────────────────────┐ │
│     │ Notifications        [Clear All]        │ │
│     ├─────────────────────────────────────────┤ │
│     │ ✓ Task Assigned                     [✕] │ │
│     │   You have a new task          2h ago   │ │
│     ├─────────────────────────────────────────┤ │
│     │ ✓ Meeting Scheduled                 [✕] │ │
│     │   Team meeting at 10 AM          1d ago │ │
│     ├─────────────────────────────────────────┤ │
│     │ ✓ Attendance Approved              [✕]  │ │
│     │   Your attendance approved       3d ago │ │
│     └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Only Admin Sees This
- 👤 Employee: No bell icon
- 👨‍💼 Admin: Bell icon with count badge

---

## 🌍 Language - Where to Find

### In the App
```
┌─────────────────────────────────────────────────┐
│  Navbar                                         │
│  ├─ Check-In/Out Button  [🔔 3]  [🌍]  [👤▼]  │
│  └─ (All users)                   ↓             │
│     ┌─────────────────────────────────────────┐ │
│     │ 🇺🇸 English              ✓             │ │
│     ├─────────────────────────────────────────┤ │
│     │ 🇮🇳 Hindi                              │ │
│     ├─────────────────────────────────────────┤ │
│     │ 🇪🇸 Spanish                            │ │
│     ├─────────────────────────────────────────┤ │
│     │ 🇫🇷 French                             │ │
│     └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Everyone Can Use This
- Employees can change language
- Admins can change language
- Language saves automatically

---

## 💻 How to Add Notifications in Code

### Basic Example
```javascript
// Step 1: Import the store
import { useNotificationStore } from "../store/notification.store";

// Step 2: Use in component
function MyComponent() {
  const addNotification = useNotificationStore((s) => s.addNotification);
  
  const handleClick = () => {
    // Step 3: Add notification
    addNotification({
      title: "Success!",
      message: "Task created successfully",
      autoClose: true
    });
  };
  
  return <button onClick={handleClick}>Create Task</button>;
}
```

### With Pre-built Templates
```javascript
import { notifications } from "../config/notification.config";
import { useNotificationStore } from "../store/notification.store";

function MyComponent() {
  const addNotification = useNotificationStore((s) => s.addNotification);
  
  const handleCreate = () => {
    // Use pre-built template
    addNotification(
      notifications.taskCreated("Quarterly Review", "John Doe")
    );
  };
  
  return <button onClick={handleCreate}>Create Task</button>;
}
```

### Pre-built Types Available
```javascript
notifications.success(title, message)     // Green
notifications.error(title, message)       // Red
notifications.info(title, message)        // Blue
notifications.warning(title, message)     // Yellow
notifications.taskCreated(name, assignee)
notifications.taskDeleted(name)
notifications.checkedIn(time)
notifications.checkedOut(time, duration)
notifications.meetingScheduled(name, time)
notifications.leaveApproved(type)
notifications.leaveRejected(type)
```

---

## 🌐 How to Use Language in Code

### Get Current Language
```javascript
import { useLanguageStore } from "../store/language.store";

function MyComponent() {
  const language = useLanguageStore((s) => s.language);
  console.log(language); // "en", "hi", "es", or "fr"
}
```

### Translate Text
```javascript
import { useLanguageStore } from "../store/language.store";
import { getTranslation } from "../utils/language";

function MyButton() {
  const language = useLanguageStore((s) => s.language);
  
  const text = getTranslation(language, "checkIn");
  // Returns: "Check-In" (en), "चेक-इन" (hi), etc.
  
  return <button>{text}</button>;
}
```

### Change Language
```javascript
const setLanguage = useLanguageStore((s) => s.setLanguage);
setLanguage("hi");  // Switch to Hindi
```

---

## 📚 Translation Keys Cheat Sheet

```javascript
getTranslation(language, "notifications")    // "Notifications"
getTranslation(language, "clearAll")         // "Clear All"
getTranslation(language, "noNotifications")  // "No notifications"
getTranslation(language, "language")         // "Language"
getTranslation(language, "myProfile")        // "My Profile"
getTranslation(language, "logout")           // "Logout"
getTranslation(language, "checkIn")          // "Check-In"
getTranslation(language, "checkOut")         // "Check-Out"
getTranslation(language, "adminPanel")       // "Admin Panel"
getTranslation(language, "employeePortal")   // "Employee Portal"
getTranslation(language, "english")          // "English"
getTranslation(language, "hindi")            // "Hindi"
getTranslation(language, "spanish")          // "Spanish"
getTranslation(language, "french")           // "French"
```

---

## 🎯 Real-World Example

### Scenario: Admin Creates a Task

```javascript
import { useNotificationStore } from "../store/notification.store";
import { useLanguageStore } from "../store/language.store";
import { notifications } from "../config/notification.config";

function CreateTaskForm() {
  const addNotification = useNotificationStore((s) => s.addNotification);
  const language = useLanguageStore((s) => s.language);
  
  const handleSubmit = async (taskData) => {
    try {
      // Create task in database...
      await saveTask(taskData);
      
      // Show success notification
      addNotification(
        notifications.taskCreated(
          taskData.title,
          taskData.assignedTo
        )
      );
    } catch (error) {
      // Show error notification
      addNotification(
        notifications.error("Failed to create task", error.message)
      );
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields... */}
      <button type="submit">
        {getTranslation(language, "createTask")}
      </button>
    </form>
  );
}
```

---

## 🚨 Common Mistakes to Avoid

### ❌ Wrong
```javascript
// Don't forget to import
addNotification({ title: "Hi", message: "Hello" });

// Don't use without Zustand
const notifications = [];  // ❌ Wrong

// Don't forgot dependency array for re-render
useEffect(() => {
  // Language change won't trigger this
}, []);
```

### ✅ Correct
```javascript
// Always import
import { useNotificationStore } from "../store/notification.store";

// Use the store hook
const addNotification = useNotificationStore((s) => s.addNotification);

// Include dependencies if using language
useEffect(() => {
  // Update when language changes
}, [language]);
```

---

## 🧪 Test These Features

### Test 1: Notifications (Admin)
```
1. Log in as Admin
2. Click bell icon (🔔)
3. See notifications list
4. Click X to remove one
5. Click "Clear All"
6. Refresh page - should be empty
```

### Test 2: Notifications (Employee)
```
1. Log in as Employee
2. You should NOT see bell icon
3. Only admin can manage notifications
```

### Test 3: Language Switching
```
1. Click globe icon (🌍)
2. Select "Hindi" (हिन्दी)
3. Notice checkmark on Hindi
4. Click "Spanish"
5. Language changes
6. Refresh page - should stay Spanish
```

### Test 4: Add Notification via Code
```javascript
// In browser console
const store = window.__notificationStore;
store.addNotification({
  title: "Test",
  message: "This is a test notification"
});
// Should see notification appear in navbar
```

---

## 📁 Quick File Reference

```
Need to add notifications?
└─ Use: src/store/notification.store.js

Need to translate text?
└─ Use: src/utils/language.js + useLanguageStore

Need pre-built notifications?
└─ Use: src/config/notification.config.js

Need examples?
└─ Check: src/examples/NotificationLanguageExamples.jsx

Need documentation?
└─ Read: QUICK_REFERENCE.md
```

---

## 🎨 Styling the Notifications

### Custom Colors
Edit `src/components/Navbar.jsx` styled components:
```javascript
const NotificationItem = styled.div`
  // Change these colors
  background: #ffffff;  // Item background
  color: #222;         // Text color
  border-bottom: #f5f5f5;  // Divider color
`;
```

### Custom Duration
Edit `src/config/notification.config.js`:
```javascript
export const notificationConfig = {
  autoCloseDuration: 5000,  // Change to 10000 for 10 seconds
  // ...
};
```

---

## 🔗 File Connections

```
┌─ Navbar.jsx (UI)
│  └─ uses ─→ notification.store.js (state)
│         └─ uses ─→ localStorage (persistence)
│
│  └─ uses ─→ language.store.js (state)
│         └─ uses ─→ language.js (translations)
│         └─ saves to ─→ localStorage
│
└─ Any Component (usage)
   └─ imports ─→ notification.store.js
   └─ imports ─→ language.store.js
   └─ imports ─→ getTranslation from language.js
```

---

## 💾 Data Persistence

### What Gets Saved Automatically
```javascript
localStorage.setItem("notifications", [...])  // Notification list
localStorage.setItem("appLanguage", "hi")     // Current language
```

### Data Survives
✅ Page refresh  
✅ Browser close and reopen  
✅ Tab closing  
✅ Computer restart  

### Data Lost When
❌ Browser cache cleared  
❌ Incognito/Private mode closed  
❌ localStorage disabled  

---

## 📞 Getting Help

### Quick Answers
→ Check **QUICK_REFERENCE.md**

### Code Examples
→ Check **src/examples/NotificationLanguageExamples.jsx**

### Full Details
→ Read **NOTIFICATIONS_AND_LANGUAGE.md**

### How It Works
→ See **ARCHITECTURE_DIAGRAM.md**

### What's New
→ Read **IMPLEMENTATION_SUMMARY.md**

---

## 🎯 Most Useful Imports

```javascript
// For notifications
import { useNotificationStore } from "../store/notification.store";
import { notifications } from "../config/notification.config";

// For language
import { useLanguageStore } from "../store/language.store";
import { getTranslation } from "../utils/language";
```

---

## ✨ Pro Tips

1. **Always use pre-built notifications** - Consistency and ease
2. **Wrap translations in components** - Triggers re-render on language change
3. **Use autoClose: false for errors** - Gives user time to read
4. **Keep messages short** - Better UX in dropdown
5. **Test in different languages** - Ensure UI doesn't break
6. **Check localStorage in DevTools** - Debug persistence

---

## 🚀 Next: Get Started!

1. **Open your project**
2. **Check QUICK_REFERENCE.md** for examples
3. **Copy a notification example** to your code
4. **Test it in the browser**
5. **Add more features** as needed

---

**You're all set! Happy coding! 🎉**

All files are ready to use. No additional setup needed!
