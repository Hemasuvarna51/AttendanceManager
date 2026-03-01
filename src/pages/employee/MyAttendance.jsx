// ✅ UPDATED: MyAttendance.jsx (UI matched to the screenshot)
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { clearRecords, getUserRecords } from "../../utils/attendanceLocalDb";
import { useAuthStore } from "../../store/auth.store";

/* ===================== STYLES ===================== */

const Page = styled.div`
  padding: 26px 26px 40px;
  background: #f4f6fb;
  min-height: calc(100vh - 60px);
`;

const Shell = styled.div`
  max-width: 1180px;
  margin: 0 auto;
`;

const TopBar = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

const Heading = styled.div`
  h1 {
    margin: 0;
    font-size: 28px;
    letter-spacing: -0.4px;
    color: #0f172a;
  }
  p {
    margin: 6px 0 0;
    font-size: 14px;
    color: #64748b;
    line-height: 1.4;
  }
`;

const ActionRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
`;

const Btn = styled.button`
  height: 40px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid ${({ $variant }) =>
    $variant === "danger" ? "#fecaca" : $variant === "primary" ? "#cfe2ff" : "#e6e8ee"};
  background: ${({ $variant }) =>
    $variant === "danger" ? "#fff5f5" : $variant === "primary" ? "#f3f8ff" : "#fff"};
  color: ${({ $variant }) =>
    $variant === "danger" ? "#b42318" : $variant === "primary" ? "#1d4ed8" : "#0f172a"};
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.08s ease, box-shadow 0.15s ease, border-color 0.15s ease;

  &:hover {
    border-color: ${({ $variant }) =>
      $variant === "danger" ? "#fca5a5" : $variant === "primary" ? "#93c5fd" : "#0f172a"};
    box-shadow: 0 10px 20px rgba(2, 6, 23, 0.08);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 6px 14px rgba(2, 6, 23, 0.06);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.18);
  }
`;

const CardGrid = styled.div`
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: 14px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(180px, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: #fff;
  border: 1px solid #e6e8ee;
  border-radius: 16px;
  padding: 14px 16px;
  box-shadow: 0 10px 24px rgba(2, 6, 23, 0.06);
  min-height: 84px;

  .k {
    color: #64748b;
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 6px;
  }

  .v {
    font-size: 22px;
    font-weight: 900;
    color: #0f172a;
    letter-spacing: -0.3px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid #e6e8ee;
  background: #f8fafc;
  color: #475569;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.2px;

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: ${({ $state }) =>
      $state === "CHECKED_IN" ? "#22c55e" : $state === "CHECKED_OUT" ? "#3b82f6" : "#94a3b8"};
    box-shadow: 0 0 0 4px rgba(148, 163, 184, 0.18);
  }
`;

const Panel = styled.div`
  margin-top: 14px;
  background: #fff;
  border: 1px solid #e6e8ee;
  border-radius: 18px;
  box-shadow: 0 12px 30px rgba(2, 6, 23, 0.06);
  overflow: hidden;
`;

const PanelHead = styled.div`
  padding: 14px 16px;
  border-bottom: 1px solid #eef2f7;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const Tabs = styled.div`
  display: inline-flex;
  gap: 8px;
  padding: 6px;
  border-radius: 999px;
  background: #f1f5f9;
  border: 1px solid #e6e8ee;
`;

const Tab = styled.button`
  border: 0;
  height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 900;
  font-size: 13px;
  letter-spacing: 0.2px;
  color: ${({ $active }) => ($active ? "#fff" : "#0f172a")};
  background: ${({ $active }) => ($active ? "#2563eb" : "transparent")};
  transition: background 0.15s ease, color 0.15s ease, transform 0.08s ease;

  &:hover {
    background: ${({ $active }) => ($active ? "#2563eb" : "#e9eef9")};
  }

  &:active {
    transform: scale(0.99);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.18);
  }
`;

const PanelBody = styled.div`
  padding: 20px 16px 22px;
`;

const EmptyState = styled.div`
  min-height: 320px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #eef2f7;
  display: grid;
  place-items: center;
  padding: 20px;
`;

const EmptyInner = styled.div`
  text-align: center;
  max-width: 520px;

  h3 {
    margin: 14px 0 6px;
    font-size: 22px;
    letter-spacing: -0.2px;
    color: #0f172a;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #64748b;
  }
`;

const EmptyIcon = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 24px;
  background: radial-gradient(circle at 30% 30%, #dbeafe, #f8fafc);
  border: 1px solid #e6e8ee;
  display: grid;
  place-items: center;
  box-shadow: 0 16px 34px rgba(2, 6, 23, 0.08);

  svg {
    width: 44px;
    height: 44px;
    opacity: 0.85;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;

  th,
  td {
    padding: 12px 12px;
    border-bottom: 1px solid #eef2f7;
    text-align: left;
    font-size: 14px;
    color: #0f172a;
  }

  th {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.35px;
    color: #64748b;
    background: #f8fafc;
  }

  tbody tr:hover {
    background: #fbfdff;
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 12px;
  border: 1px solid ${({ $type }) => ($type === "CHECK_IN" ? "#bbf7d0" : "#bfdbfe")};
  background: ${({ $type }) => ($type === "CHECK_IN" ? "#f0fdf4" : "#eff6ff")};
  color: ${({ $type }) => ($type === "CHECK_IN" ? "#166534" : "#1d4ed8")};
`;

const Selfie = styled.img`
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #e6e8ee;
  cursor: zoom-in;
  transition: transform 0.12s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.06);
    box-shadow: 0 10px 22px rgba(2, 6, 23, 0.18);
  }
`;

const ZoomOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.72);
  display: grid;
  place-items: center;
  padding: 18px;
  z-index: 9999;
  cursor: zoom-out;
  backdrop-filter: blur(6px);
`;

const ZoomImg = styled.img`
  max-width: min(920px, 96vw);
  max-height: 86vh;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: #fff;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.35);
`;

/* ===================== HELPERS ===================== */

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const formatDuration = (ms) => {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
};

const computeTodaySummary = (records) => {
  const now = new Date();

  const today = records
    .map((r) => ({ ...r, _t: new Date(r.time) }))
    .filter((r) => isSameDay(r._t, now))
    .sort((a, b) => a._t - b._t);

  let totalWorkedMs = 0;
  let openSessionSince = null;

  for (const r of today) {
    if (r.type === "CHECK_IN") {
      if (!openSessionSince) openSessionSince = r._t;
    }
    if (r.type === "CHECK_OUT") {
      if (openSessionSince) {
        totalWorkedMs += Math.max(0, r._t - openSessionSince);
        openSessionSince = null;
      }
    }
  }

  let todayStatus = "PENDING";
  if (today.length > 0) {
    const last = today[today.length - 1];
    if (last.type === "CHECK_IN") todayStatus = "CHECKED_IN";
    if (last.type === "CHECK_OUT") todayStatus = "CHECKED_OUT";
  }

  return { todayStatus, totalWorkedMs, openSessionSince, todayCount: today.length };
};

const downloadCSV = (rows, filename = "attendance_report.csv") => {
  const headers = ["date", "type", "time", "has_selfie"];
  const csv = [
    headers.join(","),
    ...rows.map((r) => {
      const t = new Date(r.time);
      const date = t.toLocaleDateString();
      const time = t.toLocaleTimeString();
      const hasSelfie = r.selfie ? "yes" : "no";
      const safe = (v) => `"${String(v).replaceAll('"', '""')}"`;
      return [safe(date), safe(r.type), safe(time), safe(hasSelfie)].join(",");
    }),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

/* ===================== COMPONENT ===================== */

export default function MyAttendance() {
  const user = useAuthStore((s) => s.user);
  const userId = user?.id;

  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [zoomSrc, setZoomSrc] = useState("");
  const [tick, setTick] = useState(0);

  const refresh = () => setRecords(getUserRecords(userId));

  useEffect(() => {
    if (!userId) return;

    refresh();

    const onUpdate = () => refresh();
    window.addEventListener("attendance_updated", onUpdate);

    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("attendance_updated", onUpdate);
      window.removeEventListener("focus", onFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const today = useMemo(() => computeTodaySummary(records), [records]);

  useEffect(() => {
    if (today.todayStatus !== "CHECKED_IN") return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [today.todayStatus]);

  const liveWorkedMs = useMemo(() => {
    if (today.todayStatus === "CHECKED_IN" && today.openSessionSince) {
      return today.totalWorkedMs + (Date.now() - today.openSessionSince.getTime());
    }
    return today.totalWorkedMs;
  }, [today, tick]);

  const stats = useMemo(() => {
    const total = records.length;
    const ins = records.filter((r) => r.type === "CHECK_IN").length;
    const outs = records.filter((r) => r.type === "CHECK_OUT").length;
    return { total, ins, outs };
  }, [records]);

  const visibleRecords = useMemo(() => {
    const base = filter === "ALL" ? records : records.filter((r) => r.type === filter);
    return base.slice().sort((a, b) => new Date(b.time) - new Date(a.time));
  }, [records, filter]);

  // Daily aggregation (latest check-in/out per day)
  const dailyRecords = useMemo(() => {
    const grouped = {};
    visibleRecords.forEach((r) => {
      const d = new Date(r.time);
      const key = startOfDay(d).toISOString();
      if (!grouped[key]) grouped[key] = { date: startOfDay(d), checkIn: null, checkOut: null };
      if (r.type === "CHECK_IN") grouped[key].checkIn = r;
      if (r.type === "CHECK_OUT") grouped[key].checkOut = r;
    });
    return Object.values(grouped).sort((a, b) => b.date - a.date);
  }, [visibleRecords]);

  const todayStatusLabel =
    today.todayStatus === "CHECKED_IN"
      ? "CHECKED IN"
      : today.todayStatus === "CHECKED_OUT"
      ? "CHECKED OUT"
      : "NOT STARTED";

  if (!userId) {
    return (
      <Page>
        <Shell>
          <TopBar>
            <Heading>
              <h1>Attendance Overview</h1>
              <p>⚠️ Please login to view your attendance.</p>
            </Heading>
          </TopBar>
        </Shell>
      </Page>
    );
  }

  return (
    <Page>
      <Shell>
        <TopBar>
          <Heading>
            <h1>Attendance Overview</h1>
            <p>Monitor your daily attendance status and check-in/check-out records.</p>
          </Heading>

          <ActionRow>
            <Btn
              $variant="primary"
              onClick={() => downloadCSV(visibleRecords, "attendance_report.csv")}
              title="Download as CSV"
            >
              ⬇️ Download Report
            </Btn>

            <Btn onClick={refresh}>↻ Refresh</Btn>

            <Btn
              $variant="danger"
              onClick={() => {
                // NOTE: current util clears ALL local records.
                // If you want "clear only this user", share your localStorage key format and I'll patch attendanceLocalDb.
                clearRecords();
                setRecords([]);
                setZoomSrc("");
              }}
            >
              🗑️ Clear Records
            </Btn>
          </ActionRow>
        </TopBar>

        <CardGrid>
          <StatCard>
            <div className="k">Today Status</div>
            <div className="v">
              <StatusPill $state={today.todayStatus}>
                <span className="dot" />
                {todayStatusLabel}
              </StatusPill>
            </div>
          </StatCard>

          <StatCard>
            <div className="k">Work Hours Today</div>
            <div className="v">{formatDuration(liveWorkedMs)}</div>
          </StatCard>

          <StatCard>
            <div className="k">Total Records</div>
            <div className="v">{stats.total}</div>
          </StatCard>

          <StatCard>
            <div className="k">Check-Ins</div>
            <div className="v">{stats.ins}</div>
          </StatCard>
        </CardGrid>

        <Panel>
          <PanelHead>
            <Tabs>
              <Tab $active={filter === "ALL"} onClick={() => setFilter("ALL")}>
                All
              </Tab>
              <Tab $active={filter === "CHECK_IN"} onClick={() => setFilter("CHECK_IN")}>
                Check-Ins
              </Tab>
              <Tab $active={filter === "CHECK_OUT"} onClick={() => setFilter("CHECK_OUT")}>
                Check-Outs
              </Tab>
            </Tabs>

            {/* right side "..." like screenshot (pure UI) */}
            <div style={{ color: "#94a3b8", fontWeight: 900, letterSpacing: "2px" }}>•••</div>
          </PanelHead>

          <PanelBody>
            {visibleRecords.length === 0 ? (
              <EmptyState>
                <EmptyInner>
                  <EmptyIcon aria-hidden="true">
                    {/* simple clock-ish svg */}
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 7v6l4 2"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        stroke="currentColor"
                        strokeWidth="2.2"
                      />
                    </svg>
                  </EmptyIcon>
                  <h3>No Records Found</h3>
                  <p>Your attendance activity will appear here after check-in.</p>
                </EmptyInner>
              </EmptyState>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Check-In</th>
                    <th>Check-Out</th>
                    <th>Selfie</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyRecords.map((day, idx) => (
                    <tr key={idx}>
                      <td>
                        {day.date.toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      <td>
                        {day.checkIn ? (
                          <Badge $type="CHECK_IN">✅ {new Date(day.checkIn.time).toLocaleTimeString()}</Badge>
                        ) : (
                          <span style={{ color: "#94a3b8", fontWeight: 700 }}>—</span>
                        )}
                      </td>

                      <td>
                        {day.checkOut ? (
                          <Badge $type="CHECK_OUT">🏁 {new Date(day.checkOut.time).toLocaleTimeString()}</Badge>
                        ) : (
                          <span style={{ color: "#94a3b8", fontWeight: 700 }}>—</span>
                        )}
                      </td>

                      <td>
                        {day.checkIn?.selfie ? (
                          <Selfie
                            src={day.checkIn.selfie}
                            alt="check-in selfie"
                            onClick={() => setZoomSrc(day.checkIn.selfie)}
                            title="Check-In Selfie - Click to enlarge"
                          />
                        ) : (
                          <span style={{ color: "#94a3b8", fontWeight: 700 }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </PanelBody>
        </Panel>

        {zoomSrc && (
          <ZoomOverlay onClick={() => setZoomSrc("")}>
            <ZoomImg src={zoomSrc} alt="Zoomed selfie" />
          </ZoomOverlay>
        )}
      </Shell>
    </Page>
  );
}