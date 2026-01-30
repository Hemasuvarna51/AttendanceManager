import { useMemo, useState } from "react";
import styled from "styled-components";
import { OFFICE } from "../config/office";
import { getCurrentPosition } from "../utils/geolocation";
import { distanceMeters } from "../utils/distance";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const Wrap = styled.div`
  border: 1px solid #eee;
  border-radius: 16px;
  padding: 16px;
  background: #fff;
`;

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;

  h3 {
    margin: 0;
    font-size: 16px;
  }

  p {
    margin: 4px 0 0;
    font-size: 13px;
    color: #666;
  }
`;

const Chip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  white-space: nowrap;

  border: 1px solid
    ${({ $status }) =>
      $status === "pass"
        ? "#b7ebc6"
        : $status === "fail"
        ? "#ffd2d2"
        : $status === "checking"
        ? "#e7e7e7"
        : "#eee"};

  background: ${({ $status }) =>
    $status === "pass"
      ? "#f0fff4"
      : $status === "fail"
      ? "#fff5f5"
      : $status === "checking"
      ? "#fafafa"
      : "#fafafa"};

  color: ${({ $status }) =>
    $status === "pass"
      ? "#11643a"
      : $status === "fail"
      ? "#b42318"
      : "#666"};
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const Btn = styled.button`
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #e7e7e7;
  background: ${({ $primary }) => ($primary ? "#111" : "#fff")};
  color: ${({ $primary }) => ($primary ? "#fff" : "#111")};
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Row = styled.div`
  margin-top: 12px;
  font-size: 13px;
  color: #444;
  display: grid;
  gap: 6px;
`;

const Muted = styled.div`
  color: #666;
`;

const Warning = styled.div`
  margin-top: 12px;
  border-radius: 12px;
  border: 1px solid #ffe1a6;
  background: #fff8e6;
  padding: 10px 12px;
  color: #7a4b00;
  font-size: 13px;
`;

const DEBUG = false; // flip to true when debugging locally

export default function LocationGate({ onPass }) {
  const [status, setStatus] = useState("idle"); // idle | checking | pass | fail
  const [info, setInfo] = useState(null);

  const MAX_ACCURACY_METERS = 250;
  const READS = 3;
  const GAP_MS = 1200;

  const label = useMemo(() => {
    if (status === "checking") return "⏳ Checking...";
    if (status === "pass") return "✅ Verified";
    if (status === "fail") return "❌ Failed";
    return "⏳ Pending";
  }, [status]);

  const helper = useMemo(() => {
    if (status === "checking") return "Getting the best reading (up to 3 tries).";
    if (status === "pass") return "You are inside the allowed office radius.";
    if (status === "fail") return "We couldn’t verify your location.";
    return "Click ‘Verify Location’ to continue.";
  }, [status]);

  const checkLocation = async () => {
    try {
      setStatus("checking");
      setInfo(null);

      let best = null;

      for (let i = 1; i <= READS; i++) {
        const pos = await getCurrentPosition();
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;

        const dist = distanceMeters(OFFICE.lat, OFFICE.lng, lat, lng);

        const sample = { lat, lng, accuracy, distance: dist, attempt: i };

        if (DEBUG) {
          console.log(`READ ${i}:`, sample);
          console.log("OFFICE:", OFFICE);
        }

        if (!best || accuracy < best.accuracy) best = sample;

        if (accuracy <= MAX_ACCURACY_METERS) break;
        if (i < READS) await sleep(GAP_MS);
      }

      setInfo(best);

      // Accuracy gate
      if (best.accuracy > MAX_ACCURACY_METERS) {
        setStatus("fail");
        setInfo({
          ...best,
          error:
            `Low GPS accuracy (~${Math.round(best.accuracy)}m). ` +
            `Desktop location can be inaccurate. Enable OS location and retry, or use mobile.`,
        });
        return;
      }

      // Very large distance = likely wrong source (Wi-Fi/IP)
      if (best.distance > 1000) {
        setStatus("fail");
        setInfo({
          ...best,
          error:
            `Your device location looks off (~${Math.round(best.distance)}m away). ` +
            `This often happens on laptops using Wi-Fi/IP location. Try mobile GPS or enable High Accuracy.`,
        });
        return;
      }

      // Main office radius gate
      if (best.distance <= OFFICE.radiusMeters) {
        setStatus("pass");
        onPass?.(best);
      } else {
        setStatus("fail");
        setInfo({
          ...best,
          error:
            `You are outside the allowed office radius (~${Math.round(best.distance)}m). ` +
            `Move closer to the office location and retry.`,
        });
      }
    } catch (err) {
      setStatus("fail");
      setInfo({ error: err?.message || "Location check failed" });
    }
  };

  const reset = () => {
    setStatus("idle");
    setInfo(null);
  };

  return (
    <Wrap>
      <Head>
        <div>
          <h3>Location Gate</h3>
          <p>{helper}</p>
        </div>
        <Chip $status={status}>{label}</Chip>
      </Head>

      <Actions>
        <Btn onClick={checkLocation} disabled={status === "checking"} $primary>
          {status === "checking" ? "Verifying..." : "Verify Location"}
        </Btn>

        <Btn onClick={reset} disabled={status === "checking"}>
          Reset
        </Btn>
      </Actions>

      {/* Show clean, user-friendly metrics */}
      {info?.distance != null && (
        <Row>
          <div>
            Distance to office: <b>{Math.round(info.distance)}m</b>{" "}
            <Muted>(Allowed: {OFFICE.radiusMeters}m)</Muted>
          </div>

          {/* Only show accuracy if failed (so user knows why) */}
          {status === "fail" && info?.accuracy != null && (
            <div>
              Accuracy: <b>~{Math.round(info.accuracy)}m</b>{" "}
              <Muted>(Max allowed: {MAX_ACCURACY_METERS}m)</Muted>
            </div>
          )}
        </Row>
      )}

      {info?.error && <Warning>{info.error}</Warning>}
    </Wrap>
  );
}
