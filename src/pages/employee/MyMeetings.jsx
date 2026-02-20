import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useAuthStore } from "../../store/auth.store";

/* ===================== STORAGE HELPERS ===================== */

const MEETINGS_KEY = "meetings";

const safeRead = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : fallback;
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

/* ===================== STYLES ===================== */

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 22px 40px;
  background: #f8fafc;
  min-height: calc(100vh - 60px);
`;

const Surface = styled.div`
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 40%, #fafafa 100%);
  border: 1px solid #f1f1f1;
  border-radius: 20px;
  padding: 22px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;

  h2 {
    margin: 0;
    font-size: 28px;
    letter-spacing: -0.4px;
    color: #0b0b0f;
  }

  p {
    margin: 6px 0 0;
    color: #6b7280;
    font-size: 14px;
    line-height: 1.4;
  }
`;

const Actions = styled.div`
  margin-top: 16px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Btn = styled.button`
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid ${({ $danger }) => ($danger ? "#fecaca" : "#e7e7e7")};
  background: ${({ $danger }) => ($danger ? "#fff5f5" : "#fff")};
  color: ${({ $danger }) => ($danger ? "#b42318" : "#111")};
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: transform 0.08s ease, box-shadow 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    border-color: ${({ $danger }) => ($danger ? "#fca5a5" : "#111")};
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.06);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.05);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 4px rgba(17, 17, 17, 0.12);
  }
`;

const Grid = styled.div`
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  border: 1px solid #ededed;
  border-radius: 18px;
  padding: 14px;
  background: #fff;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.05);
  transition: transform 0.12s ease, box-shadow 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 30px rgba(0, 0, 0, 0.08);
    border-color: #e2e2e2;
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const Title = styled.div`
  font-weight: 800;
  font-size: 15px;
  color: #0b0b0f;
`;

const Meta = styled.div`
  margin-top: 10px;
  display: grid;
  gap: 6px;
  color: #6b7280;
  font-size: 13px;

  b {
    color: #111;
  }
`;

const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid #dbeafe;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 800;
  width: fit-content;
`;

const Link = styled.a`
  display: inline-flex;
  gap: 6px;
  margin-top: 10px;
  color: #2563eb;
  font-weight: 900;
  font-size: 13px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Empty = styled.div`
  margin-top: 18px;
  border: 1px dashed #d9d9d9;
  border-radius: 18px;
  padding: 18px;
  color: #6b7280;
  background: #fafafa;
  font-weight: 700;
`;

/* ===================== COMPONENT ===================== */

export default function MyMeetings() {
  const user = useAuthStore((s) => s.user);
  const userName = user?.name || "";

  const [meetings, setMeetings] = useState(() => safeRead(MEETINGS_KEY, []));

  // ✅ load + auto-refresh
  useEffect(() => {
    const load = () => setMeetings(safeRead(MEETINGS_KEY, []));

    load();
    window.addEventListener("storage", load);
    window.addEventListener("meetings_updated", load);

    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener("meetings_updated", load);
    };
  }, []);

  const myMeetings = useMemo(() => {
    // only this employee + upcoming first
    return meetings
      .filter((m) => m.employee === userName)
      .slice()
      .sort((a, b) => {
        const ad = new Date(`${a.date}T${a.time || "00:00"}`).getTime();
        const bd = new Date(`${b.date}T${b.time || "00:00"}`).getTime();
        return ad - bd; // upcoming first
      });
  }, [meetings, userName]);

  const refresh = () => setMeetings(safeRead(MEETINGS_KEY, []));

  return (
    <Page>
      <Surface>
        <TitleRow>
          <div>
            <h2>My Meetings</h2>
            <p>Meetings scheduled by Admin will show here automatically.</p>
          </div>
        </TitleRow>

        <Actions>
          <Btn onClick={refresh}>Refresh</Btn>
        </Actions>

        {myMeetings.length === 0 ? (
          <Empty>No meetings assigned to you yet.</Empty>
        ) : (
          <Grid>
            {myMeetings.map((m) => (
              <Card key={m.id ?? `${m.title}-${m.date}-${m.time}`}>
                <Top>
                  <div>
                    <Title>{m.title}</Title>
                    <Tag>📅 {m.date} • ⏰ {m.time}</Tag>
                  </div>
                </Top>

                <Meta>
                  <div>
                    <b>Agenda:</b> {m.agenda}
                  </div>
                  {m.createdAt && (
                    <div>
                      <b>Created:</b>{" "}
                      {new Date(m.createdAt).toLocaleString()}
                    </div>
                  )}
                </Meta>

                {m.link ? (
                  <Link href={m.link} target="_blank" rel="noreferrer">
                    🔗 Join Meeting
                  </Link>
                ) : null}
              </Card>
            ))}
          </Grid>
        )}
      </Surface>
    </Page>
  );
}
