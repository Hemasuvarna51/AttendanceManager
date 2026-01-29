import { useState } from "react";
import UploadSelfie from "../../components/UploadSelfie";
import LocationGate from "../../components/LocationGate";
import { addRecord, canCheckOut } from "../../utils/attendanceLocalDb";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function CheckOut() {
  const [selfie, setSelfie] = useState(null);
  const [loc, setLoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const canSubmit = !!selfie && !!loc && !loading;

  const submit = async () => {
    setMsg("");

    if (!canCheckOut()) {
      setMsg("❌ You must check in before checking out.");
      return;
    }

    if (!selfie) return setMsg("Upload selfie first.");
    if (!loc) return setMsg("Pass location check first.");

    try {
      setLoading(true);

      const selfieBase64 = await toBase64(selfie);

      addRecord({
        id: crypto.randomUUID(),
        type: "CHECK_OUT",
        time: new Date().toISOString(),
        lat: loc.lat,
        lng: loc.lng,
        distance: loc.distance,
        selfieBase64,
      });

      setMsg("✅ Check-out saved locally (frontend-only).");
      setSelfie(null);
    } catch {
      setMsg("❌ Failed to save check-out.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 16, display: "grid", gap: 14, maxWidth: 900 }}>
      <h2 style={{ margin: 0 }}>Employee: Check Out</h2>

      {msg && (
        <div style={{ padding: 12, borderRadius: 10, border: "1px solid #eee" }}>
          {msg}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <UploadSelfie value={selfie} onChange={setSelfie} />
        <LocationGate onPass={setLoc} />
      </div>

      <button
        onClick={submit}
        disabled={!canSubmit}
        style={{
          padding: "12px 14px",
          borderRadius: 10,
          border: "none",
          background: canSubmit ? "#111" : "#999",
          color: "#fff",
          cursor: canSubmit ? "pointer" : "not-allowed",
          width: 220,
        }}
      >
        {loading ? "Saving..." : "Submit Check-Out"}
      </button>
    </div>
  );
}
