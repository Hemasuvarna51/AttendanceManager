import { useMemo, useState } from "react";
import UploadSelfie from "../../components/UploadSelfie";
import LocationGate from "../../components/LocationGate";
import { addRecord, canCheckIn } from "../../utils/attendanceLocalDb";
import styled from "styled-components";
import { useAuthStore } from "../../store/auth.store";
import { MapPin, Camera } from "lucide-react";


const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 22px;
  min-height: 100vh;

  background: linear-gradient(
    135deg,
    #f8fafc 0%,
    #eef2ff 50%,
    #f8fafc 100%
  );

`;

const TitleRow = styled.div`
 display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 30px;
    font-weight: 700;
    background: linear-gradient(90deg, #111827, #374151);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    margin: 4px 0 0 0;
    color: #6b7280;
    font-size: 14px;
  }
`;

const Alert = styled.div`
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({ $type }) => ($type === "error" ? "#d82424ff" : "#0b6029ff")};
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
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  padding: 22px;
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.06),
    0 2px 8px rgba(0, 0, 0, 0.04);
  transition: 0.25s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow:
      0 16px 35px rgba(0, 0, 0, 0.08),
      0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

const CardHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  h3 {
    margin: 0;
    font-size: 17px;
    font-weight: 600;
    color: #111827;
  }

  span {
    font-size: 13px;
    color: #6b7280;
  }
`;

const Chip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 16px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;

  background: ${({ $ok }) =>
    $ok
      ? "linear-gradient(135deg, #22c55e, #16a34a)"
      : "#f3f4f6"};

  color: ${({ $ok }) => ($ok ? "#fff" : "#6b7280")};

  box-shadow: ${({ $ok }) =>
    $ok
      ? "0 6px 18px rgba(34, 197, 94, 0.4)"
      : "none"};

  border: ${({ $ok }) =>
    $ok
      ? "1px solid rgba(255,255,255,0.2)"
      : "1px solid #e5e7eb"};
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
  padding: 14px 20px;
  border-radius: 14px;
  border: 0;
  font-weight: 600;
  font-size: 14px;
  min-width: 230px;
  transition: 0.25s ease;

  background: ${({ disabled }) =>
    disabled
      ? "#9ca3af"
      : "linear-gradient(90deg, #111827, #374151)"};

  color: #fff;
  cursor: ${({ disabled }) =>
    disabled ? "not-allowed" : "pointer"};

  box-shadow: ${({ disabled }) =>
    disabled
      ? "none"
      : "0 8px 18px rgba(17, 24, 39, 0.25)"};

  &:hover {
    transform: ${({ disabled }) =>
      disabled ? "none" : "translateY(-2px)"};
  }

  &:active {
    transform: ${({ disabled }) =>
      disabled ? "none" : "scale(0.98)"};
  }
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
              <h3><MapPin /> Location Verification</h3>
              <span>Confirm you are inside office radius</span>
            </div>
          </CardHead>
          <LocationGate onPass={setLoc} />
        </Card>

        <Card>
          <CardHead>
            <div>
              <h3><Camera /> Selfie Verification </h3>
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