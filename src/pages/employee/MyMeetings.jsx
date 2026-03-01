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

const toTs = (m) => new Date(`${m.date}T${m.time || "00:00"}`).getTime();
const isSameDay = (a, b) =>
  new Date(a).toDateString() === new Date(b).toDateString();

/* ===================== STYLES ===================== */

const Page = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  padding: 22px 22px 40px;
  background: #f6f8fc;
  min-height: calc(100vh - 64px);
`;

const Panel = styled.div`
  background: #ffffff;
  border: 1px solid #e9eef6;
  border-radius: 18px;
  box-shadow: 0 12px 32px rgba(16, 24, 40, 0.06);
  overflow: hidden;
`;

const Header = styled.div`
  padding: 18px 18px 12px;
  border-bottom: 1px solid #eef2f7;
  display: flex;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
`;

const HeaderLeft = styled.div`
  h2 {
    margin: 0;
    font-size: 22px;
    letter-spacing: -0.3px;
    color: #0f172a;
  }
  p {
    margin: 4px 0 0;
    font-size: 13px;
    color: #64748b;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const PillBtn = styled.button`
  height: 34px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #e6ebf3;
  background: #ffffff;
  color: #0f172a;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    border-color: #cfd8e6;
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
  }
`;

const PrimaryBtn = styled.button`
  height: 34px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid #1d4ed8;
  background: #2563eb;
  color: #fff;
  font-weight: 800;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    filter: brightness(0.98);
    box-shadow: 0 10px 22px rgba(37, 99, 235, 0.22);
  }
`;

const Toolbar = styled.div`
  padding: 12px 18px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const Tabs = styled.div`
  display: inline-flex;
  gap: 10px;
  align-items: center;
`;

const Tab = styled.button`
  border: none;
  background: transparent;
  font-weight: 800;
  font-size: 13px;
  color: ${({ $active }) => ($active ? "#0f172a" : "#64748b")};
  padding: 6px 4px;
  cursor: pointer;
  position: relative;

  ${({ $active }) =>
    $active
      ? `
    &::after{
      content:"";
      position:absolute;
      left:0;
      right:0;
      bottom:-6px;
      height:2px;
      border-radius:2px;
      background:#2563eb;
    }
  `
      : ""}

  &:hover {
    color: #0f172a;
  }
`;

const RightTools = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
`;

const Search = styled.input`
  height: 34px;
  width: min(320px, 75vw);
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #e6ebf3;
  background: #fff;
  font-weight: 600;
  font-size: 13px;
  color: #0f172a;

  &::placeholder {
    color: #94a3b8;
    font-weight: 600;
  }

  &:focus {
    outline: none;
    border-color: #b7c6df;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
  }
`;

const Body = styled.div`
  padding: 10px 18px 18px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  border: 1px solid #e9eef6;
  border-radius: 16px;
  padding: 14px;
  background: #ffffff;
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.06);
`;

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: flex-start;
`;

const CardTitle = styled.div`
  font-weight: 900;
  font-size: 14px;
  color: #0f172a;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid #dbeafe;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 900;
  margin-top: 8px;
  width: fit-content;
`;

const Meta = styled.div`
  margin-top: 10px;
  display: grid;
  gap: 6px;
  color: #64748b;
  font-size: 13px;

  b {
    color: #0f172a;
  }
`;

const LinkA = styled.a`
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

const EmptyWrap = styled.div`
  min-height: 360px;
  display: grid;
  place-items: center;
  border-top: 1px solid #eef2f7;
`;

const Empty = styled.div`
  text-align: center;
  max-width: 460px;
  padding: 24px 16px;
`;

const EmptyTitle = styled.div`
  margin-top: 14px;
  font-weight: 1000;
  font-size: 18px;
  color: #0f172a;
`;

const EmptySub = styled.div`
  margin-top: 6px;
  color: #64748b;
  font-weight: 650;
  font-size: 13px;
  line-height: 1.4;
`;

const FooterHint = styled.div`
  padding: 10px 18px 14px;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 700;
`;

/* simple calendar illustration (no external assets) */
function EmptyIllustration() {
  return (
    <svg width="180" height="120" viewBox="0 0 180 120" fill="none">
      <rect x="34" y="24" width="92" height="70" rx="14" fill="#F1F5FF" />
      <rect x="34" y="24" width="92" height="70" rx="14" stroke="#D9E2FF" />
      <rect x="46" y="18" width="10" height="16" rx="5" fill="#2563EB" />
      <rect x="104" y="18" width="10" height="16" rx="5" fill="#2563EB" />
      <rect x="44" y="40" width="72" height="8" rx="4" fill="#D9E2FF" />
      <rect x="44" y="54" width="40" height="8" rx="4" fill="#D9E2FF" />
      <circle cx="126" cy="78" r="22" fill="#FFFFFF" stroke="#D9E2FF" />
      <path
        d="M126 66v12l8 6"
        stroke="#2563EB"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse cx="86" cy="104" rx="58" ry="8" fill="#EEF2F7" />
    </svg>
  );
}

/* ===================== COMPONENT ===================== */

export default function MyMeetings() {
  const user = useAuthStore((s) => s.user);
  const userName = user?.name || "";

  const [meetings, setMeetings] = useState(() => safeRead(MEETINGS_KEY, []));
  const [tab, setTab] = useState("upcoming"); // upcoming | today | archived
  const [query, setQuery] = useState("");

  // load + auto-refresh
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
    const now = Date.now();

    let list = meetings.filter((m) => m.employee === userName);

    // search like the screenshot’s simple UX
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((m) => {
        const hay = `${m.title} ${m.agenda} ${m.date} ${m.time}`.toLowerCase();
        return hay.includes(q);
      });
    }

    // tab filters
    if (tab === "today") {
      list = list.filter((m) => isSameDay(toTs(m), now));
    } else if (tab === "archived") {
      list = list.filter((m) => toTs(m) < now && !isSameDay(toTs(m), now));
    } else {
      // upcoming
      list = list.filter((m) => toTs(m) >= now || isSameDay(toTs(m), now));
    }

    // sort like “Upcoming” first
    list = list.slice().sort((a, b) => toTs(a) - toTs(b));

    return list;
  }, [meetings, userName, tab, query]);

  const refresh = () => setMeetings(safeRead(MEETINGS_KEY, []));

  return (
    <Page>
      <Panel>
        <Header>
          <HeaderLeft>
            <h2>Meeting Scheduler</h2>
            <p>Schedule and manage your upcoming meetings easily.</p>
          </HeaderLeft>

          <HeaderRight>
            <PillBtn onClick={() => setTab("today")}>Today</PillBtn>
            {/* Keep this button for UI match; you can wire it to your modal later */}
            <PrimaryBtn onClick={refresh}>+ Schedule a Meeting</PrimaryBtn>
          </HeaderRight>
        </Header>

        <Toolbar>
          <Tabs>
            <Tab $active={tab === "upcoming"} onClick={() => setTab("upcoming")}>
              Upcoming
            </Tab>
            <Tab $active={tab === "archived"} onClick={() => setTab("archived")}>
              Archived
            </Tab>
            <Tab $active={tab === "today"} onClick={() => setTab("today")}>
              Today
            </Tab>
          </Tabs>

          <RightTools>
            <Search
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search meetings…"
            />
            <PillBtn onClick={refresh}>Refresh</PillBtn>
          </RightTools>
        </Toolbar>

        {myMeetings.length === 0 ? (
          <EmptyWrap>
            <Empty>
              <EmptyIllustration />
              <EmptyTitle>No Meetings Scheduled</EmptyTitle>
              <EmptySub>
                No upcoming meetings. Schedule one to stay ahead of your plans.
              </EmptySub>
            </Empty>
          </EmptyWrap>
        ) : (
          <Body>
            <Grid>
              {myMeetings.map((m) => (
                <Card key={m.id ?? `${m.title}-${m.date}-${m.time}`}>
                  <CardTop>
                    <div>
                      <CardTitle>{m.title}</CardTitle>
                      <Badge>
                        📅 {m.date} &nbsp;•&nbsp; ⏰ {m.time || "—"}
                      </Badge>
                    </div>
                  </CardTop>

                  <Meta>
                    <div>
                      <b>Agenda:</b> {m.agenda || "—"}
                    </div>
                    {m.createdAt && (
                      <div>
                        <b>Created:</b>{" "}
                        {new Date(m.createdAt).toLocaleString()}
                      </div>
                    )}
                  </Meta>

                  {m.link ? (
                    <LinkA href={m.link} target="_blank" rel="noreferrer">
                      🔗 Join Meeting
                    </LinkA>
                  ) : null}
                </Card>
              ))}
            </Grid>
          </Body>
        )}

        <FooterHint>Showing {myMeetings.length} meeting(s)</FooterHint>
      </Panel>
    </Page>
  );
}