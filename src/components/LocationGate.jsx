import { useState } from "react";
import { OFFICE } from "../config/office";
import { getCurrentPosition } from "../utils/geolocation";
import { distanceMeters } from "../utils/distance";

export default function LocationGate({ onPass }) {
  const [status, setStatus] = useState("idle"); // idle | checking | pass | fail
  const [info, setInfo] = useState(null); // {lat,lng,distance}

  const checkLocation = async () => {
    try {
      setStatus("checking");
      const pos = await getCurrentPosition();
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      const d = distanceMeters(lat, lng, OFFICE.lat, OFFICE.lng);

      const payload = { lat, lng, distance: d };
      setInfo(payload);

      if (d <= OFFICE.radiusMeters) {
        setStatus("pass");
        onPass?.(payload);
      } else {
        setStatus("fail");
      }
    } catch (err) {
      setStatus("fail");
      setInfo({ error: err.message || "Location check failed" });
    }
  };

  const badge = () => {
    if (status === "checking") return "Checking location...";
    if (status === "pass") return "✅ Inside office radius";
    if (status === "fail") return "❌ Outside office radius / GPS blocked";
    return "Location not checked";
  };

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
      <h3 style={{ marginTop: 0 }}>Location Gate</h3>

      <button onClick={checkLocation} disabled={status === "checking"} style={{ padding: "10px 12px" }}>
        {status === "checking" ? "Checking..." : "Check Location"}
      </button>

      <div style={{ marginTop: 10 }}>{badge()}</div>

      {info?.distance != null && (
        <div style={{ marginTop: 8, fontSize: 13, opacity: 0.8 }}>
          Distance: {Math.round(info.distance)} meters (Allowed: {OFFICE.radiusMeters}m)
        </div>
      )}

      {info?.error && (
        <div style={{ marginTop: 8, background: "#fff3cd", padding: 8, borderRadius: 8 }}>
          {info.error}
        </div>
      )}
    </div>
  );
}
