const KEY = "attendance_records_v1";

export const getRecords = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
};

export const addRecord = (record) => {
  const prev = getRecords();
  const next = [record, ...prev]; // newest first
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
};

export const clearRecords = () => {
  localStorage.removeItem(KEY);
};

/* ===========================
   ✅ USER-SCOPED HELPERS
   =========================== */

export const getUserRecords = (userId) => {
  const all = getRecords();
  if (!userId) return [];
  return all.filter((r) => r.userId === userId);
};

export const getLastRecord = (userId) => {
  const mine = getUserRecords(userId);
  return mine.length ? mine[0] : null; // newest first
};

export const canCheckIn = (userId) => {
  const last = getLastRecord(userId);
  return !last || last.type === "CHECK_OUT";
};

export const canCheckOut = (userId) => {
  const last = getLastRecord(userId);
  return !!last && last.type === "CHECK_IN";
};

export const getAttendanceState = (userId) => {
  const last = getLastRecord(userId);

  if (!last) {
    return { checkedIn: false, status: "NOT_STARTED", last: null, checkInTime: null };
  }

  if (last.type === "CHECK_IN") {
    return {
      checkedIn: true,
      status: "CHECKED_IN",
      last,
      checkInTime: last.time,
    };
  }

  if (last.type === "CHECK_OUT") {
    return {
      checkedIn: false,
      status: "CHECKED_OUT",
      last,
      checkInTime: null,
    };
  }

  return { checkedIn: false, status: "NOT_STARTED", last, checkInTime: null };
};