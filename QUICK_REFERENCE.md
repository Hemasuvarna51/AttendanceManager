# Quick Reference - Notifications & Language

## 🔔 Notifications - Quick Examples

### Basic Notification
```javascript
import { useNotificationStore } from "../store/notification.store";

const addNotification = useNotificationStore((s) => s.addNotification);

addNotification({
  title: "Success",
  message: "Operation completed",
  autoClose: true,
});
```

### Using Pre-built Notification Types
```javascript
import { notifications } from "../config/notification.config";
import { useNotificationStore } from "../store/notification.store";

const addNotification = useNotificationStore((s) => s.addNotification);

// Success notification
addNotification(notifications.success("Task Created", '"Review Report" assigned to John'));

// Error notification
addNotification(notifications.error("Something went wrong"));

// Task notifications
addNotification(notifications.taskCreated("Quarterly Review", "Sarah"));
addNotification(notifications.taskDeleted("Pending Task"));

// Attendance notifications
addNotification(notifications.checkedIn("9:00 AM"));
addNotification(notifications.checkedOut("5:30 PM", "8h 30m"));

// Leave notifications
addNotification(notifications.leaveApproved("Sick Leave"));
addNotification(notifications.leaveRejected("Personal Leave"));
```

### Remove Notification
```javascript
const removeNotification = useNotificationStore((s) => s.removeNotification);
removeNotification(notificationId);
```

### Clear All
```javascript
const clearAll = useNotificationStore((s) => s.clearAll);
clearAll();
```

---

## 🌍 Language - Quick Examples

### Get Current Language
```javascript
import { useLanguageStore } from "../store/language.store";

const language = useLanguageStore((s) => s.language);
console.log(language); // "en", "hi", "es", or "fr"
```

### Translate Text
```javascript
import { getTranslation } from "../utils/language";
import { useLanguageStore } from "../store/language.store";

const language = useLanguageStore((s) => s.language);
const myProfile = getTranslation(language, "myProfile");
```

### Change Language Programmatically
```javascript
const setLanguage = useLanguageStore((s) => s.setLanguage);
setLanguage("hi"); // Switch to Hindi
```

### Use in Components
```javascript
function MyButton() {
  const language = useLanguageStore((s) => s.language);
  return (
    <button>
      {getTranslation(language, "checkIn")}
    </button>
  );
}
```

---

## 📋 Available Translation Keys

| Key | English | Hindi | Spanish | French |
|-----|---------|-------|---------|--------|
| notifications | Notifications | सूचनाएं | Notificaciones | Notifications |
| clearAll | Clear All | सभी साफ करें | Limpiar todo | Effacer tout |
| noNotifications | No notifications | कोई सूचना नहीं | Sin notificaciones | Pas de notifications |
| language | Language | भाषा | Idioma | Langue |
| myProfile | My Profile | मेरी प्रोफाइल | Mi Perfil | Mon Profil |
| logout | Logout | लॉग आउट | Cerrar sesión | Déconnexion |
| checkIn | Check-In | चेक-इन | Entrada | Arrivée |
| checkOut | Check-Out | चेक-आउट | Salida | Départ |
| adminPanel | Admin Panel | प्रशासन पैनल | Panel de Administración | Panneau d'Administration |
| employeePortal | Employee Portal | कर्मचारी पोर्टल | Portal de Empleados | Portail des Employés |

---

## 🎯 Common Patterns

### Pattern 1: Notification + Language
```javascript
const addNotification = useNotificationStore((s) => s.addNotification);
const language = useLanguageStore((s) => s.language);

const handleSuccess = () => {
  addNotification({
    title: getTranslation(language, "myProfile"),
    message: "Profile updated successfully",
    autoClose: true,
  });
};
```

### Pattern 2: Error Handling with Notifications
```javascript
const handleAsync = async () => {
  try {
    await someAPI();
    addNotification(notifications.success("Done", "Success message"));
  } catch (error) {
    addNotification(notifications.error("Error", error.message));
  }
};
```

### Pattern 3: Conditional Translation
```javascript
function TaskForm() {
  const language = useLanguageStore((s) => s.language);
  const addNotification = useNotificationStore((s) => s.addNotification);
  
  const submit = (task) => {
    const successMsg = getTranslation(language, "taskCreated");
    addNotification({
      title: "Success",
      message: successMsg,
      autoClose: true,
    });
  };
  
  return <form onSubmit={(e) => submit(e.target)}>...</form>;
}
```

---

## 📁 File Locations

| Feature | File |
|---------|------|
| Notification Store | `src/store/notification.store.js` |
| Language Store | `src/store/language.store.js` |
| Translations | `src/utils/language.js` |
| Notification Config | `src/config/notification.config.js` |
| Navbar Component | `src/components/Navbar.jsx` |
| Examples | `src/examples/NotificationLanguageExamples.jsx` |

---

## 🧪 Testing Tips

### Test Notifications:
1. Open browser DevTools (F12)
2. Go to Application → LocalStorage
3. Check `notifications` key for stored notifications
4. Try adding/removing notifications
5. Refresh page - notifications should persist

### Test Language:
1. Click globe icon in navbar
2. Select different language
3. Check browser console for log
4. Go to Application → LocalStorage
5. Check `appLanguage` key
6. Refresh page - language should persist

---

## 🔌 API Reference

### useNotificationStore
```javascript
{
  notifications: Array,           // All notifications
  addNotification(obj): void,     // Add notification
  removeNotification(id): void,   // Remove by ID
  clearAll(): void                // Clear all
}
```

### useLanguageStore
```javascript
{
  language: string,               // Current language ("en"|"hi"|"es"|"fr")
  setLanguage(lang): void,        // Change language
  getCurrentLanguage(): string    // Get current language
}
```

### getTranslation(language, key)
```javascript
getTranslation("en", "myProfile")  // "My Profile"
getTranslation("hi", "myProfile")  // "मेरी प्रोफाइल"
getTranslation("es", "myProfile")  // "Mi Perfil"
getTranslation("fr", "myProfile")  // "Mon Profil"
```

---

## 💡 Pro Tips

1. **Always use `autoClose: false` for errors** - Users need time to read
2. **Pre-built notifications are easier** - Use `notifications.success()` etc.
3. **Save language changes automatically** - Already handled by store
4. **Test with different languages** - Ensure UI doesn't break
5. **Keep notification messages short** - Better UX
6. **Use notifications for important updates only** - Don't spam users

---

## ⚡ Troubleshooting

| Issue | Solution |
|-------|----------|
| Notifications not showing | Check if admin is logged in |
| Language not changing | Check localStorage for `appLanguage` |
| Translations missing | Verify key exists in `src/utils/language.js` |
| Notifications not persisting | Check localStorage size limit |

---

## 📞 Need Help?

Refer to:
- **Full Documentation**: `NOTIFICATIONS_AND_LANGUAGE.md`
- **Code Examples**: `src/examples/NotificationLanguageExamples.jsx`
- **Configuration**: `src/config/notification.config.js`

---

Happy coding! 🚀
