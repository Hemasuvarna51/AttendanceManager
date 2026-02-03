import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { clearRecords, getRecords } from "../../utils/attendanceLocalDb";

const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 28px 18px 40px;

  /* subtle app background feel */
  min-height: calc(100vh - 60px);
`;

const Surface = styled.div`
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 40%, #fafafa 100%);
  border: 1px solid #f1f1f1;
  border-radius: 20px;
  padding: 22px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.04);
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
  transition: transform 0.08s ease, box-shadow 0.15s ease, border-color 0.15s ease;

  &:hover {
    border-color: ${({ $danger }) => ($danger ? "#fca5a5" : "#111")};
    box-shadow: 0 10px 20px rgba(0,0,0,0.06);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0px);
    box-shadow: 0 6px 14px rgba(0,0,0,0.05);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 4px rgba(17, 17, 17, 0.12);
  }
`;

const Toolbar = styled.div`
  margin-top: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  padding-top: 14px;
  border-top: 1px solid #f2f2f2;
`;

const Segments = styled.div`
  display: inline-flex;
  border: 1px solid #eaeaea;
  border-radius: 999px;
  overflow: hidden;
  background: #fff;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.9);
`;

const SegBtn = styled.button`
  border: 0;
  padding: 9px 14px;
  cursor: pointer;
  background: ${({ $active }) => ($active ? "#111" : "transparent")};
  color: ${({ $active }) => ($active ? "#fff" : "#111")};
  font-size: 13px;
  font-weight: 700;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: ${({ $active }) => ($active ? "#111" : "#f6f6f6")};
  }

  &:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px rgba(17,17,17,0.35);
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Stat = styled.div`
  border: 1px solid #ededed;
  border-radius: 16px;
  padding: 12px 14px;
  background: #fff;
  box-shadow: 0 8px 18px rgba(0,0,0,0.04);
  min-width: 140px;

  .k {
    font-size: 12px;
    color: #6b7280;
    font-weight: 600;
  }

  .v {
    font-size: 18px;
    font-weight: 800;
    margin-top: 4px;
    color: #0b0b0f;
    letter-spacing: -0.2px;
  }
`;

const Group = styled.div`
  margin-top: 18px;
`;

const GroupHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 6px;
  margin-top: 8px;

  border-top: 1px solid #f2f2f2;

  h3 {
    margin: 0;
    font-size: 14px;
    letter-spacing: 0.2px;
    color: #111;
    text-transform: uppercase;
  }

  span {
    font-size: 13px;
    color: #6b7280;
    font-weight: 600;
  }
`;

const Grid = styled.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  border: 1px solid #ededed;
  border-radius: 18px;
  padding: 14px;
  background: #fff;
  box-shadow: 0 10px 22px rgba(0,0,0,0.05);
  transition: transform 0.12s ease, box-shadow 0.18s ease, border-color 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 30px rgba(0,0,0,0.08);
    border-color: #e2e2e2;
  }
`;

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`;

const TypeChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.2px;

  border: 1px solid ${({ $type }) => ($type === "CHECK_IN" ? "#b7ebc6" : "#cfe2ff")};
  background: ${({ $type }) => ($type === "CHECK_IN" ? "#f0fff4" : "#f3f8ff")};
  color: ${({ $type }) => ($type === "CHECK_IN" ? "#11643a" : "#1e4ea8")};
`;

const Meta = styled.div`
  margin-top: 10px;
  display: grid;
  gap: 6px;
`;

const Small = styled.div`
  font-size: 13px;
  color: #6b7280;

  b {
    color: #111;
  }
`;

const DistancePill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid #efefef;
  background: #fafafa;
  font-size: 12px;
  font-weight: 700;
  color: #111;
`;

const Selfie = styled.img`
  margin-top: 2px;
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid #e7e7e7;
  cursor: zoom-in;
  transition: transform 0.12s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 10px 20px rgba(0,0,0,0.12);
  }
`;

const Empty = styled.div`
  margin-top: 18px;
  border: 1px dashed #d9d9d9;
  border-radius: 18px;
  padding: 18px;
  color: #6b7280;
  background: #fafafa;
`;

const ZoomOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 12, 0.72);
  display: grid;
  place-items: center;
  padding: 18px;
  z-index: 9999;
  cursor: zoom-out;
  backdrop-filter: blur(6px);
`;

const ZoomImg = styled.img`
  max-width: min(900px, 95vw);
  max-height: 85vh;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: #fff;
  box-shadow: 0 30px 70px rgba(0,0,0,0.35);
`;

/* =========================
   Helpers
   ========================= */

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const formatDuration = (ms) => {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
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

  return {
    todayStatus,
    totalWorkedMs,
    openSessionSince,
    todayCount: today.length,
  };
};

const labelForDay = (dateObj) => {
  const today = startOfDay(new Date());
  const d = startOfDay(dateObj);
  const diffDays = Math.round((today - d) / (24 * 60 * 60 * 1000));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const groupByDay = (records) => {
  const map = new Map();
  for (const r of records) {
    const d = new Date(r.time);
    const key = startOfDay(d).toISOString();
    if (!map.has(key)) map.set(key, { date: startOfDay(d), items: [] });
    map.get(key).items.push(r);
  }
  return Array.from(map.values());
};

export default function MyAttendance() {
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [zoomSrc, setZoomSrc] = useState("");
  const [tick, setTick] = useState(0);

  const refresh = () => setRecords(getRecords());

  useEffect(() => {
    refresh();
  }, []);

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

  const grouped = useMemo(() => groupByDay(visibleRecords), [visibleRecords]);

  return (
    <Page>
      <Surface>
        <TitleRow>
          <div>
            <h2>My Attendance</h2>
            <p>Local records stored in your browser (frontend-only).</p>
          </div>

          <Stats>
            <Stat>
              <div className="k">Today Status</div>
              <div className="v">
                {today.todayStatus === "PENDING" && "⏳ Pending"}
                {today.todayStatus === "CHECKED_IN" && "✅ Checked In"}
                {today.todayStatus === "CHECKED_OUT" && "🏁 Checked Out"}
              </div>
            </Stat>

            <Stat>
              <div className="k">Work Hours (Today)</div>
              <div className="v">{formatDuration(liveWorkedMs)}</div>
            </Stat>

            <Stat>
              <div className="k">Today Records</div>
              <div className="v">{today.todayCount}</div>
            </Stat>
          </Stats>
        </TitleRow>

        <Actions>
          <Btn onClick={refresh}>Refresh</Btn>
          <Btn
            $danger
            onClick={() => {
              clearRecords();
              setRecords([]);
              setZoomSrc("");
            }}
          >
            Clear All (local)
          </Btn>
        </Actions>

        <Toolbar>
          <Segments>
            <SegBtn $active={filter === "ALL"} onClick={() => setFilter("ALL")}>
              All
            </SegBtn>
            <SegBtn $active={filter === "CHECK_IN"} onClick={() => setFilter("CHECK_IN")}>
              Check-Ins
            </SegBtn>
            <SegBtn $active={filter === "CHECK_OUT"} onClick={() => setFilter("CHECK_OUT")}>
              Check-Outs
            </SegBtn>
          </Segments>

          <Stats>
            <Stat>
              <div className="k">Total</div>
              <div className="v">{stats.total}</div>
            </Stat>
            <Stat>
              <div className="k">Check-Ins</div>
              <div className="v">{stats.ins}</div>
            </Stat>
            <Stat>
              <div className="k">Check-Outs</div>
              <div className="v">{stats.outs}</div>
            </Stat>
          </Stats>
        </Toolbar>

        {visibleRecords.length === 0 ? (
          <Empty>No local attendance records yet for this filter.</Empty>
        ) : (
          <>
            {grouped.map((g) => (
              <Group key={g.date.toISOString()}>
                <GroupHeader>
                  <h3>{labelForDay(g.date)}</h3>
                  <span>{g.items.length} record(s)</span>
                </GroupHeader>

                <Grid>
                  {g.items.map((r) => (
                    <Card key={r.id}>
                      <CardTop>
                        <div>
                          <TypeChip $type={r.type}>{r.type}</TypeChip>

                          <Meta>
                            <Small>{new Date(r.time).toLocaleString()}</Small>

                            <DistancePill>
                              📍 {Math.round(r.distance)}m
                            </DistancePill>
                          </Meta>
                        </div>

                        {r.selfieBase64 && (
                          <Selfie
                            src={r.selfieBase64}
                            alt="selfie"
                            onClick={() => setZoomSrc(r.selfieBase64)}
                            title="Click to enlarge"
                          />
                        )}
                      </CardTop>
                    </Card>
                  ))}
                </Grid>
              </Group>
            ))}
          </>
        )}

        {zoomSrc && (
          <ZoomOverlay onClick={() => setZoomSrc("")}>
            <ZoomImg src={zoomSrc} alt="Zoomed selfie" />
          </ZoomOverlay>
        )}
      </Surface>
    </Page>
  );
}
