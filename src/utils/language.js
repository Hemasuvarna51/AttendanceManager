// Language translations
export const translations = {
  en: {
    notifications: "Notifications",
    clearAll: "Clear All",
    noNotifications: "No notifications",
    language: "Language",
    myProfile: "My Profile",
    logout: "Logout",
    english: "English",
    hindi: "Hindi",
    spanish: "Spanish",
    french: "French",
    adminPanel: "Admin Panel",
    employeePortal: "Employee Portal",
    checkIn: "Check-In",
    checkOut: "Check-Out",
  },
  hi: {
    notifications: "सूचनाएं",
    clearAll: "सभी साफ करें",
    noNotifications: "कोई सूचना नहीं",
    language: "भाषा",
    myProfile: "मेरी प्रोफाइल",
    logout: "लॉग आउट",
    english: "अंग्रेज़ी",
    hindi: "हिन्दी",
    spanish: "स्पेनिश",
    french: "फ्रेंच",
    adminPanel: "प्रशासन पैनल",
    employeePortal: "कर्मचारी पोर्टल",
    checkIn: "चेक-इन",
    checkOut: "चेक-आउट",
  },
  es: {
    notifications: "Notificaciones",
    clearAll: "Limpiar todo",
    noNotifications: "Sin notificaciones",
    language: "Idioma",
    myProfile: "Mi Perfil",
    logout: "Cerrar sesión",
    english: "Inglés",
    hindi: "Hindi",
    spanish: "Español",
    french: "Francés",
    adminPanel: "Panel de Administración",
    employeePortal: "Portal de Empleados",
    checkIn: "Entrada",
    checkOut: "Salida",
  },
  fr: {
    notifications: "Notifications",
    clearAll: "Effacer tout",
    noNotifications: "Pas de notifications",
    language: "Langue",
    myProfile: "Mon Profil",
    logout: "Déconnexion",
    english: "Anglais",
    hindi: "Hindi",
    spanish: "Espagnol",
    french: "Français",
    adminPanel: "Panneau d'Administration",
    employeePortal: "Portail des Employés",
    checkIn: "Arrivée",
    checkOut: "Départ",
  },
};

// Get translation for current language
export const getTranslation = (language = "en", key = "") => {
  const lang = translations[language] || translations.en;
  return lang[key] || key;
};

// Language metadata
export const languageList = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
];
