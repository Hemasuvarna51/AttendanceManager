import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Search, Share2, UserPlus, Download, Clock } from "lucide-react";
import { getAttendanceState, getRecords } from "../../utils/attendanceLocalDb";

/* ===================== STYLES ===================== */

const Page = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 18px 18px 40px;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 14px;
`;

const SearchWrap = styled.div`
  flex: 1;
  min-width: 260px;
  max-width: 520px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 999px;
  padding: 10px 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);

  input {
    border: 0;
    outline: none;
    width: 100%;
    font-size: 14px;
  }
`;

const TopActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const MiniBtn = styled.button`
  height: 38px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #fafafa;
  }
`;

const ExportBtn = styled.button`
  height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  border: 0;
  background: #111;
  color: #fff;
  cursor: pointer;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    opacity: 0.92;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  margin: 10px 0 16px;

  h2 {
    margin: 0;
    font-size: 28px;
    letter-spacing: -0.4px;
  }

  p {
    margin: 6px 0 0;
    color: #6b7280;
    font-size: 14px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.3fr 1.2fr 0.9fr;
  gap: 14px;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.04);
`;

const CardHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;

  h3 {
    margin: 0;
    font-size: 14px;
    letter-spacing: 0.2px;
    text-transform: uppercase;
    color: #111;
  }

  span {
    font-size: 12px;
    color: #6b7280;
    font-weight: 600;
  }
`;

const HeroCard = styled(Card)`
  background: linear-gradient(135deg, #1f6cff 0%, #2d7cff 55%, #3b82f6 100%);
  color: #fff;
  border: 0;
  overflow: hidden;
  position: relative;
  min-height: 175px;

  .date {
    font-size: 12px;
    opacity: 0.9;
    font-weight: 700;
  }
  .hi {
    margin-top: 12px;
    font-size: 22px;
    font-weight: 900;
    letter-spacing: -0.3px;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
    padding: 8px 12px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.16);
    border: 1px solid rgba(255, 255, 255, 0.22);
    font-size: 12px;
    font-weight: 800;
  }

  /* decoration */
  &:after {
    content: "";
    position: absolute;
    right: -60px;
    top: -60px;
    width: 220px;
    height: 220px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.13);
  }
`;

const TaskGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const TaskCard = styled.div`
  border: 1px solid #eee;
  border-radius: 16px;
  padding: 12px;
  background: #fff;

  .title {
    font-weight: 900;
    font-size: 13px;
    color: #111;
    margin: 0;
  }
  .sub {
    margin: 6px 0 0;
    font-size: 12px;
    color: #6b7280;
  }

  .row {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .pct {
    font-weight: 900;
    font-size: 12px;
    color: #111;
  }

  .pill {
    font-size: 11px;
    font-weight: 900;
    padding: 5px 10px;
    border-radius: 999px;
    background: #eef2ff;
    color: #1e40af;
    white-space: nowrap;
  }

  .bar {
    margin-top: 10px;
    height: 8px;
    border-radius: 999px;
    background: #f3f4f6;
    overflow: hidden;
  }

  .fill {
    height: 100%;
    width: ${({ $pct }) => `${$pct}%`};
    background: #2563eb;
    border-radius: 999px;
  }
`;

const AttendanceBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 10px;
`;

const MiniStat = styled.div`
  border: 1px solid #eee;
  border-radius: 16px;
  padding: 12px;
  background: #fff;

  .k {
    font-size: 12px;
    color: #6b7280;
    font-weight: 700;
  }
  .v {
    margin-top: 6px;
    font-size: 16px;
    font-weight: 900;
    color: #111;
  }
`;

const Reminders = styled.div`
  display: grid;
  gap: 10px;
`;

const Reminder = styled.div`
  border: 1px solid #eee;
  border-radius: 16px;
  padding: 12px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  gap: 12px;

  .l .t {
    font-weight: 900;
    font-size: 13px;
    color: #111;
  }
  .l .s {
    margin-top: 4px;
    font-size: 12px;
    color: #6b7280;
  }

  .tag {
    font-size: 11px;
    font-weight: 900;
    padding: 6px 10px;
    border-radius: 999px;
    background: #f0fdf4;
    color: #166534;
    height: fit-content;
    white-space: nowrap;
  }
`;

const Bottom = styled(Card)`
  margin-top: 14px;
  padding: 16px;
`;

const Schedule = styled.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const Slot = styled.div`
  border: 1px dashed #e5e7eb;
  border-radius: 16px;
  padding: 14px;
  background: #fafafa;

  .time {
    font-size: 12px;
    font-weight: 800;
    color: #6b7280;
  }
  .title {
    margin-top: 8px;
    font-weight: 900;
    color: #111;
  }
  .sub {
    margin-top: 6px;
    font-size: 12px;
    color: #6b7280;
  }
`;

/* ===================== HELPERS ===================== */

const pad2 = (n) => String(n).padStart(2, "0");
const formatHMS = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return `${pad2(hh)}:${pad2(mm)}:${pad2(ss)}`;
};

const getToday = () =>
  new Date().toLocaleDateString(undefined, { weekday: "short", day: "2-digit", month: "short", year: "numeric" });

function findTodayTimes(records) {
  const now = new Date();
  const today = records
    .map((r) => ({ ...r, _t: new Date(r.time) }))
    .filter(
      (r) =>
        r._t.getFullYear() === now.getFullYear() &&
        r._t.getMonth() === now.getMonth() &&
        r._t.getDate() === now.getDate()
    )
    .sort((a, b) => a._t - b._t);

  const firstIn = today.find((r) => r.type === "CHECK_IN");
  const lastOut = [...today].reverse().find((r) => r.type === "CHECK_OUT");

  return {
    clockIn: firstIn ? firstIn._t.toLocaleTimeString() : "--:--",
    clockOut: lastOut ? lastOut._t.toLocaleTimeString() : "--:--",
    lastCheckIn: firstIn ? firstIn._t : null,
  };
}

/* ===================== COMPONENT ===================== */

export default function DashBoard() {
  // you can replace this later with your auth store user
  const userName = "Hema";

  const [att, setAtt] = useState(() => getAttendanceState());
  const [records, setRecords] = useState(() => getRecords());
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const refresh = () => {
      setAtt(getAttendanceState());
      setRecords(getRecords());
    };

    window.addEventListener("storage", refresh);
    window.addEventListener("attendance_updated", refresh);
    refresh();

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("attendance_updated", refresh);
    };
  }, []);

  // live timer while checked in
  useEffect(() => {
    if (!att.checkedIn) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [att.checkedIn]);

  const todayTimes = useMemo(() => findTodayTimes(records), [records]);

  const liveMs = useMemo(() => {
    if (!att.checkedIn || !todayTimes.lastCheckIn) return 0;
    return Date.now() - todayTimes.lastCheckIn.getTime();
  }, [att.checkedIn, todayTimes, tick]);

  // mock tasks (swap later with your real data)
  const tasks = [
    { title: "AI Website Redesign", due: "Due: 30 Nov 2024", pct: 67, tag: "On Progress" },
    { title: "Attendance UI Polishing", due: "Due: Tomorrow", pct: 45, tag: "On Hold" },
    { title: "Fix Sidebar Links", due: "Due: Today", pct: 80, tag: "On Progress" },
    { title: "Leave Request Form", due: "Due: This week", pct: 30, tag: "On Review" },
  ];

  const reminders = [
    { time: "09:00 am", text: "Check Daily Progress", tag: "Low" },
    { time: "03:00 pm", text: "Submit Task Update", tag: "Low" },
  ];

  return (
    <Page>
      {/* Top search + actions */}
      <TopBar>
        <SearchWrap>
          <Search size={16} />
          <input placeholder="Search..." />
        </SearchWrap>

        <TopActions>
          <MiniBtn>
            <Share2 size={16} /> Share
          </MiniBtn>
          <MiniBtn>
            <UserPlus size={16} /> Invite
          </MiniBtn>
          <ExportBtn>
            <Download size={16} /> Export
          </ExportBtn>
        </TopActions>
      </TopBar>

      {/* Title */}
      <TitleRow>
        <div>
          <h2>Dashboard</h2>
          <p>Manage tasks, track attendance, and stay productive.</p>
        </div>
      </TitleRow>

      {/* Main 3-column grid */}
      <Grid>
        {/* Col 1 */}
        <div style={{ display: "grid", gap: 14 }}>
          <HeroCard>
            <div className="date">{getToday()}</div>
            <div className="hi">Hi, {userName} 👋</div>
            <div className="chip">
              <Clock size={14} />
              {att.checkedIn ? `Working: ${formatHMS(liveMs)}` : "Not checked in yet"}
            </div>
          </HeroCard>

          <Card>
            <CardHead>
              <h3>Track Status</h3>
              <span>All Tasks</span>
            </CardHead>

            <Reminders>
              <Reminder>
                <div className="l">
                  <div className="t">Bella Projects</div>
                  <div className="s">Feedback requested</div>
                </div>
                <div className="tag">Active</div>
              </Reminder>

              <Reminder>
                <div className="l">
                  <div className="t">Attendance Manager</div>
                  <div className="s">UI polishing</div>
                </div>
                <div className="tag">Active</div>
              </Reminder>
            </Reminders>
          </Card>
        </div>

        {/* Col 2 - tasks grid */}
        <Card>
          <CardHead>
            <h3>Today’s Tasks</h3>
            <span>Last update: Recently</span>
          </CardHead>

          <TaskGrid>
            {tasks.map((t, idx) => (
              <TaskCard key={idx} $pct={t.pct}>
                <p className="title">{t.title}</p>
                <div className="sub">{t.due}</div>

                <div className="row">
                  <div className="pct">{t.pct}%</div>
                  <div className="pill">{t.tag}</div>
                </div>

                <div className="bar">
                  <div className="fill" />
                </div>
              </TaskCard>
            ))}
          </TaskGrid>
        </Card>

        {/* Col 3 - attendance + reminders */}
        <div style={{ display: "grid", gap: 14 }}>
          <Card>
            <CardHead>
              <h3>Daily Attendance</h3>
              <span>Daily clock-in tracking</span>
            </CardHead>

            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0" }}>
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 999,
                  background: "#eff6ff",
                  display: "grid",
                  placeItems: "center",
                  border: "1px solid #dbeafe",
                }}
              >
                <Clock size={26} />
              </div>
            </div>

            <AttendanceBox>
              <MiniStat>
                <div className="k">Clock-in</div>
                <div className="v">{todayTimes.clockIn}</div>
              </MiniStat>
              <MiniStat>
                <div className="k">Clock-out</div>
                <div className="v">{todayTimes.clockOut}</div>
              </MiniStat>
            </AttendanceBox>
          </Card>

          <Card>
            <CardHead>
              <h3>Reminders</h3>
              <span>Today</span>
            </CardHead>

            <Reminders>
              {reminders.map((r, idx) => (
                <Reminder key={idx}>
                  <div className="l">
                    <div className="t">{r.time}</div>
                    <div className="s">{r.text}</div>
                  </div>
                  <div className="tag">{r.tag}</div>
                </Reminder>
              ))}
            </Reminders>
          </Card>
        </div>
      </Grid>

      {/* Bottom schedule section */}
      <Bottom>
        <CardHead>
          <h3>Projects / Schedule</h3>
          <span>Weekly view</span>
        </CardHead>

        <Schedule>
          <Slot>
            <div className="time">08:00 am</div>
            <div className="title">Client Consultation Calls</div>
            <div className="sub">Discuss requirements + next steps</div>
          </Slot>

          <Slot>
            <div className="time">10:00 am</div>
            <div className="title">Project Management Check-in</div>
            <div className="sub">Track blockers + progress</div>
          </Slot>

          <Slot>
            <div className="time">03:00 pm</div>
            <div className="title">Attendance System Review</div>
            <div className="sub">UI + routing fixes</div>
          </Slot>
        </Schedule>
      </Bottom>
    </Page>
  );
}
