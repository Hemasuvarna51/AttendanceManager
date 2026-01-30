import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { clearRecords, getRecords } from "../../utils/attendanceLocalDb";

const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 18px;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;

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

const Actions = styled.div`
  margin-top: 14px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Btn = styled.button`
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #e7e7e7;
  background: ${({ $danger }) => ($danger ? "#fff5f5" : "#fff")};
  color: ${({ $danger }) => ($danger ? "#b42318" : "#111")};
  cursor: pointer;

  &:hover {
    border-color: #111;
  }
`;

const Toolbar = styled.div`
  margin-top: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const Segments = styled.div`
  display: inline-flex;
  border: 1px solid #eee;
  border-radius: 999px;
  overflow: hidden;
`;

const SegBtn = styled.button`
  border: 0;
  padding: 8px 12px;
  cursor: pointer;
  background: ${({ $active }) => ($active ? "#111" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#111")};
  font-size: 13px;
`;

const Stats = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Stat = styled.div`
  border: 1px solid #eee;
  border-radius: 14px;
  padding: 10px 12px;
  background: #fff;

  .k {
    font-size: 12px;
    color: #666;
  }
  .v {
    font-size: 18px;
    font-weight: 700;
    margin-top: 2px;
  }
`;

const Grid = styled.div`
  margin-top: 16px;
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
  border: 1px solid #eee;
  border-radius: 16px;
  padding: 14px;
  background: #fff;
`;

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
`;

const TypeChip = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  border: 1px solid ${({ $type }) => ($type === "CHECK_IN" ? "#b7ebc6" : "#cfe2ff")};
  background: ${({ $type }) => ($type === "CHECK_IN" ? "#f0fff4" : "#f3f8ff")};
  color: ${({ $type }) => ($type === "CHECK_IN" ? "#11643a" : "#1e4ea8")};
`;

const Small = styled.div`
  font-size: 13px;
  color: #666;
`;

const Selfie = styled.img`
  margin-top: 8px;
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #e7e7e7;
  cursor: zoom-in;
`;

const Empty = styled.div`
  margin-top: 16px;
  border: 1px dashed #ddd;
  border-radius: 16px;
  padding: 18px;
  color: #666;
  background: #fafafa;
`;

/* =========================
   Helpers: Today Status + Work Hours
   ========================= */

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
      if (!openSessionSince) openSessionSince = r._t; // Date
    }

    if (r.type === "CHECK_OUT" && openSessionSince) {
      totalWorkedMs += Math.max(0, r._t - openSessionSince);
      openSessionSince = null;
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
    openSessionSince, // Date | null
    todayCount: today.length,
  };
};

export default function MyAttendance() {
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState("ALL"); // ALL | CHECK_IN | CHECK_OUT
  const [zoomSrc, setZoomSrc] = useState("");

  const refresh = () => setRecords(getRecords());

  useEffect(() => {
    refresh();
  }, []);

  const today = useMemo(() => computeTodaySummary(records), [records]);

  const liveWorkedMs = useMemo(() => {
    if (today.todayStatus === "CHECKED_IN" && today.openSessionSince) {
      return today.totalWorkedMs + (Date.now() - today.openSessionSince.getTime());
    }
    return today.totalWorkedMs;
  }, [today]);

  const filtered = useMemo(() => {
    if (filter === "ALL") return records;
    return records.filter((r) => r.type === filter);
  }, [records, filter]);

  const stats = useMemo(() => {
    const total = records.length;
    const ins = records.filter((r) => r.type === "CHECK_IN").length;
    const outs = records.filter((r) => r.type === "CHECK_OUT").length;
    return { total, ins, outs };
  }, [records]);

  return (
    <Page>
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

      {filtered.length === 0 ? (
        <Empty>No local attendance records yet for this filter.</Empty>
      ) : (
        <Grid>
          {filtered
            .slice()
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .map((r) => (
              <Card key={r.id}>
                <CardTop>
                  <div>
                    <TypeChip $type={r.type}>{r.type}</TypeChip>
                    <Small style={{ marginTop: 6 }}>{new Date(r.time).toLocaleString()}</Small>
                    <Small style={{ marginTop: 6 }}>
                      Distance: <b>{Math.round(r.distance)}m</b>
                    </Small>
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
      )}

      {/* Simple zoom overlay */}
      {zoomSrc && (
        <div
          onClick={() => setZoomSrc("")}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "grid",
            placeItems: "center",
            padding: 18,
            zIndex: 9999,
            cursor: "zoom-out",
          }}
        >
          <img
            src={zoomSrc}
            alt="Zoomed selfie"
            style={{
              maxWidth: "min(900px, 95vw)",
              maxHeight: "85vh",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "#fff",
            }}
          />
        </div>
      )}
    </Page>
  );
}
