import { useEffect, useState } from "react";
import { clearRecords, getRecords } from "../../utils/attendanceLocalDb";

export default function MyAttendance() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    setRecords(getRecords());
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>My Attendance</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <button onClick={() => setRecords(getRecords())}>Refresh</button>
        <button
          onClick={() => {
            clearRecords();
            setRecords([]);
          }}
        >
          Clear All (local)
        </button>
      </div>

      {records.length === 0 ? (
        <p>No local attendance records yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {records.map((r) => (
            <div key={r.id} style={{ border: "1px solid #eee", padding: 12, borderRadius: 12 }}>
              <b>{r.type}</b> — {new Date(r.time).toLocaleString()}
              <div style={{ fontSize: 13, opacity: 0.8 }}>Distance: {Math.round(r.distance)}m</div>

              {r.selfieBase64 && (
                <img
                  src={r.selfieBase64}
                  alt="selfie"
                  style={{ marginTop: 10, width: 220, borderRadius: 12, border: "1px solid #ddd" }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
