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
