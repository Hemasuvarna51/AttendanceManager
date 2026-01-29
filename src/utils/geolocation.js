export const getCurrentPosition = (options = {}) =>
  new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation not supported in this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      ...options,
    });
  });
