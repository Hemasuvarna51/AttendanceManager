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
  const next = [record, ...prev];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
};

export const clearRecords = () => {
  localStorage.removeItem(KEY);
};

// ✅ helpers
export const getLastRecord = () => {
  const all = getRecords();
  return all.length ? all[0] : null; // because we store newest first
};

export const canCheckIn = () => {
  const last = getLastRecord();
  // can check in if no records or last is CHECK_OUT
  return !last || last.type === "CHECK_OUT";
};

export const canCheckOut = () => {
  const last = getLastRecord();
  // can check out only if last is CHECK_IN
  return !!last && last.type === "CHECK_IN";
};

export const getAttendanceState = () => {
  const last = getLastRecord();

  if (!last) {
    return { checkedIn: false, status: "NOT_STARTED", last: null, checkInTime: null };
  }

  if (last.type === "CHECK_IN") {
    return {
      checkedIn: true,
      status: "CHECKED_IN",
      last,
      checkInTime: last.time, // ✅ ISO string of check-in
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


