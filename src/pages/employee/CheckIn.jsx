import { useMemo, useState } from "react";
import UploadSelfie from "../../components/UploadSelfie";
import LocationGate from "../../components/LocationGate";
import { addRecord, canCheckIn } from "../../utils/attendanceLocalDb";
import styled from "styled-components";
import { useAuthStore } from "../../store/auth.store";

const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 18px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;

  h2 {
    margin: 0;
    font-size: 28px;
  }

  p {
    margin: 0;
    color: #666;
    font-size: 14px;
  }
`;

const Alert = styled.div`
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({ $type }) => ($type === "error" ? "#ffd2d2" : "#c8f0d6")};
  background: ${({ $type }) => ($type === "error" ? "#fff5f5" : "#f3fff7")};
  color: ${({ $type }) => ($type === "error" ? "#b42318" : "#11643a")};
`;

const Grid = styled.div`
  margin-top: 18px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 16px;
  padding: 16px;
`;

const CardHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;

  h3 {
    margin: 0;
    font-size: 16px;
  }

  span {
    font-size: 12px;
    color: #666;
  }
`;

const Chip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid ${({ $ok }) => ($ok ? "#b7ebc6" : "#eee")};
  background: ${({ $ok }) => ($ok ? "#f0fff4" : "#fafafa")};
  color: ${({ $ok }) => ($ok ? "#11643a" : "#666")};
  font-size: 12px;
  white-space: nowrap;
`;

const FooterBar = styled.div`
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;

  @media (max-width: 520px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const PrimaryBtn = styled.button`
  padding: 12px 16px;
  border-radius: 12px;
  border: 0;
  font-weight: 600;
  min-width: 220px;

  background: ${({ disabled }) => (disabled ? "#9aa0a6" : "#111")};
  color: #fff;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

const Meta = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
  color: #666;
  font-size: 13px;
`;

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function CheckIn() {
  const [selfie, setSelfie] = useState(null);
  const [loc, setLoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "success" });

  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  // ✅ HOOK must be before any conditional return
  const timestampLabel = useMemo(() => {
    const d = new Date();
    return d.toLocaleString();
  }, []);

  if (!user) {
    return (
      <Page>
        <Alert $type="error">❌ You must be logged in to check in.</Alert>
      </Page>
    );
  }

  if (!userId) {
    return (
      <Page>
        <Alert $type="error">⚠️ Cannot identify user. Please log in again.</Alert>
      </Page>
    );
  }

  const selfieOk = !!selfie;
  const locOk = !!loc;
  const canSubmit = selfieOk && locOk && !loading;

  const submit = async () => {
    setMsg({ text: "", type: "success" });

    if (!canCheckIn(userId)) {
      setMsg({ text: "❌ You already checked in. Please check out first.", type: "error" });
      return;
    }

    if (!selfieOk) return setMsg({ text: "Upload selfie first.", type: "error" });
    if (!locOk) return setMsg({ text: "Pass location check first.", type: "error" });

    try {
      setLoading(true);
      const selfieBase64 = await toBase64(selfie);

      addRecord({
        id: crypto.randomUUID(),
        userId,
        type: "CHECK_IN",
        time: new Date().toISOString(),
        lat: loc.lat,
        lng: loc.lng,
        distance: loc.distance,
        selfie: selfieBase64,
      });

      window.dispatchEvent(new Event("attendance_updated"));

      setMsg({ text: "✅ Check-in saved locally (frontend-only).", type: "success" });
      setSelfie(null);
      setLoc(null);
    } catch {
      setMsg({ text: "❌ Failed to save check-in.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <TitleRow>
        <div>
          <h2>Employee: Check In</h2>
          <p>Secure check-in requires Location + Selfie verification.</p>
        </div>
        <p>🕒 {timestampLabel}</p>
      </TitleRow>

      {!!msg.text && <Alert $type={msg.type}>{msg.text}</Alert>}

      <Grid>
        <Card>
          <CardHead>
            <div>
              <h3>📍 Location Verification</h3>
              <span>Confirm you are inside office radius</span>
            </div>
          </CardHead>
          <LocationGate onPass={setLoc} />
        </Card>

        <Card>
          <CardHead>
            <div>
              <h3>📸 Selfie Verification</h3>
              <span>Upload or capture a selfie</span>
            </div>
          </CardHead>
          <UploadSelfie value={selfie} onChange={setSelfie} />
        </Card>
      </Grid>

      <FooterBar>
        <Meta>
          <Chip $ok={locOk}>Location {locOk ? "OK" : "Required"}</Chip>
          <Chip $ok={selfieOk}>Selfie {selfieOk ? "OK" : "Required"}</Chip>
          {locOk && (
            <span>
              Distance: <b>{Math.round(loc.distance)}m</b>
            </span>
          )}
        </Meta>

        <PrimaryBtn onClick={submit} disabled={!canSubmit}>
          {loading ? "Saving..." : "🔒 Secure Check-In"}
        </PrimaryBtn>
      </FooterBar>
    </Page>
  );
}