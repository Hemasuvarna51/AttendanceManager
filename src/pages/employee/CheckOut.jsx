import { useMemo, useState } from "react";
import styled from "styled-components";
import LocationGate from "../../components/LocationGate";
import { addRecord, canCheckOut } from "../../utils/attendanceLocalDb";
import { useAuthStore } from "../../store/auth.store";
const Page = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 18px;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;

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
  margin-top: 14px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid ${({ $type }) => ($type === "error" ? "#ffd2d2" : "#c8f0d6")};
  background: ${({ $type }) => ($type === "error" ? "#fff5f5" : "#f3fff7")};
  color: ${({ $type }) => ($type === "error" ? "#b42318" : "#11643a")};
`;

const Card = styled.div`
  margin-top: 18px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 16px;
  padding: 16px;
`;

const FooterBar = styled.div`
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
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

export default function CheckOut() {
  const [loc, setLoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "success" });

  const canSubmit = !!loc && !loading;
  const timestampLabel = useMemo(() => new Date().toLocaleString(), []);

  const user = useAuthStore((s) => s.user); // adjust if your store shape differs
  const userId = user?.id;

  if (!userId) {
    return (
      <Page>
        <Alert $type="error">⚠️ Cannot identify user. Please log in again.</Alert>
      </Page>
    );
  }

  const submit = async () => {
    setMsg({ text: "", type: "success" });

    if (!canCheckOut(userId)) {
      setMsg({ text: "❌ You must check in before checking out.", type: "error" });
      return;
    }

    if (!loc) {
      setMsg({ text: "Verify location first.", type: "error" });
      return;
    }

    try {
      setLoading(true);

      addRecord({
        id: crypto.randomUUID(),
        userId,                 // ✅ add this
        type: "CHECK_OUT",
        time: new Date().toISOString(),
        lat: loc.lat,
        lng: loc.lng,
        distance: loc.distance,
      });

      window.dispatchEvent(new Event("attendance_updated"));

      setMsg({ text: "✅ Check-out completed.", type: "success" });
      setLoc(null);
    } catch {
      setMsg({ text: "❌ Failed to save check-out.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <TitleRow>
        <div>
          <h2>Employee: Check Out</h2>
          <p>Verify location and submit to end your workday.</p>
        </div>
        <p>🕒 {timestampLabel}</p>
      </TitleRow>

      {!!msg.text && <Alert $type={msg.type}>{msg.text}</Alert>}

      <Card>
        <LocationGate onPass={setLoc} />
      </Card>

      <FooterBar>
        <PrimaryBtn onClick={submit} disabled={!canSubmit}>
          {loading ? "Saving..." : "🔓 Submit Check-Out"}
        </PrimaryBtn>
      </FooterBar>
    </Page>
  );
}
