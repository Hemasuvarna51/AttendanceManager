import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Clock, Sparkles, CalendarDays, ListTodo } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { getAttendanceState, getRecords } from "../../utils/attendanceLocalDb";

// ✅ Recharts
import {
  ResponsiveContainer,
  BarChart,
  Bar as RBar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

/* ===================== HELPERS ===================== */

const safeParse = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : fallback;
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const pad = (n) => String(n).padStart(2, "0");

const formatHMS = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = pad(Math.floor(s / 3600));
  const m = pad(Math.floor((s % 3600) / 60));
  const sec = pad(s % 60);
  return `${h}:${m}:${sec}`;
};

const findTodayTimes = (records) => {
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
};

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const fmtDay = (d) => d.toLocaleDateString(undefined, { weekday: "short" });

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const parseDueDate = (due) => {
  if (!due) return null;

  const d1 = new Date(due);
  if (!Number.isNaN(d1.getTime())) return d1;

  const s = String(due).trim();
  const m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m) {
    const dd = Number(m[1]);
    const mm = Number(m[2]) - 1;
    const yyyy = Number(m[3]);
    const d2 = new Date(yyyy, mm, dd);
    return Number.isNaN(d2.getTime()) ? null : d2;
  }

  return null;
};

/* ===================== STYLES ===================== */

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 26px 18px 40px;
`;

const Top = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 18px;
`;

const TitleWrap = styled.div``;

const Title = styled.h2`
  margin: 0;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #0f172a;
`;

const SubText = styled.p`
  margin: 8px 0 0;
  color: #64748b;
  font-weight: 700;
`;

const Pills = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Pill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 999px;
  background: #ffffff;
  border: 1px solid #eef2f7;
  color: #334155;
  font-weight: 800;
  box-shadow: 0 12px 22px rgba(2, 6, 23, 0.04);
  font-size: 13px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 18px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #eef2f7;
  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 18px 40px rgba(2, 6, 23, 0.06);
  backdrop-filter: blur(6px);
  transition: transform 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 22px 50px rgba(2, 6, 23, 0.08);
  }
`;

const CardHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.01em;
`;

const Hint = styled.div`
  font-size: 12px;
  font-weight: 800;
  color: #64748b;
  background: #f8fafc;
  border: 1px solid #eef2f7;
  padding: 6px 10px;
  border-radius: 999px;
`;

const StatGrid = styled.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Stat = styled.div`
  border: 1px solid #eef2f7;
  background: #f8fafc;
  border-radius: 14px;
  padding: 12px;

  .label {
    font-size: 12px;
    color: #64748b;
    font-weight: 800;
  }

  .value {
    margin-top: 6px;
    font-size: 15px;
    font-weight: 950;
    color: #0f172a;
    letter-spacing: -0.01em;
  }
`;

const EmptyState = styled.div`
  border: 1px dashed #e2e8f0;
  background: #fbfdff;
  border-radius: 16px;
  padding: 14px;
  color: #64748b;
  font-weight: 800;
  font-size: 13px;
`;

const Chip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 13px;
  font-weight: 900;
  border: 1px solid #dbeafe;
`;

const ProgressBar = styled.div`
  height: 8px;
  border-radius: 999px;
  background: #e2e8f0;
  margin-top: 10px;
  overflow: hidden;

  div {
    height: 100%;
    background: #2563eb;
    border-radius: 999px;
    transition: width 0.35s ease;
  }
`;

const ChartWrap = styled.div`
  margin-top: 10px;
  height: 240px;
  padding: 12px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #eef2f7;
`;

const CircleWrap = styled.div`
  margin-top: 14px;
  display: flex;
  align-items: center;
  gap: 14px;
`;

const PerformanceCircle = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 999px;
  background: conic-gradient(
    #2563eb ${(props) => props.value}%,
    #e2e8f0 ${(props) => props.value}% 100%
  );
  display: grid;
  place-items: center;
`;

const CircleInner = styled.div`
  width: 74px;
  height: 74px;
  border-radius: 999px;
  background: #fff;
  display: grid;
  place-items: center;
  font-weight: 950;
  color: #0f172a;
  border: 1px solid #eef2f7;
`;

const CircleMeta = styled.div`
  .big {
    font-size: 14px;
    font-weight: 950;
    color: #0f172a;
    letter-spacing: -0.01em;
  }
  .small {
    margin-top: 4px;
    font-size: 12px;
    font-weight: 800;
    color: #64748b;
  }
`;

const TaskItem = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid #eef2f7;

  &:last-child {
    border-bottom: none;
  }

  .title {
    font-weight: 950;
    font-size: 14px;
    color: #0f172a;
    letter-spacing: -0.01em;
  }

  .meta {
    font-size: 12px;
    color: #64748b;
    margin-top: 6px;
    font-weight: 800;
  }
`;

/* ===================== COMPONENT ===================== */

export default function DashBoard() {
  const user = useAuthStore((s) => s.user);
  const userName = user?.name || "Employee";
  const loggedInEmployee = user?.name;

  const [att, setAtt] = useState(() => getAttendanceState());
  const [records, setRecords] = useState(() => getRecords());
  const [tick, setTick] = useState(0);

  const [tasks, setTasks] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [schedule, setSchedule] = useState([]);

  // ✅ Attendance score (you were using it but not defining it)
  const attendanceScore = useMemo(() => {
    if (!records.length) return 0;

    const last7 = new Date();
    last7.setDate(last7.getDate() - 6);

    const recent = records
      .map((r) => ({ ...r, _d: new Date(r.time) }))
      .filter((r) => r._d >= last7);

    const days = new Set(recent.map((r) => r._d.toDateString())).size;
    if (!days) return 0;

    const checkIns = recent.filter((r) => r.type === "CHECK_IN").length;
    return Math.min(100, Math.round((checkIns / days) * 100));
  }, [records]);

  // ✅ Load Attendance + Records + Reminders + Schedule
  useEffect(() => {
    const load = () => {
      setAtt(getAttendanceState());
      setRecords(getRecords());
      setReminders(safeParse("employee_reminders", []));
      setSchedule(safeParse("employee_schedule", []));
    };

    load();

    window.addEventListener("storage", load);
    window.addEventListener("attendance_updated", load);
    window.addEventListener("reminders_updated", load);
    window.addEventListener("schedule_updated", load);

    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener("attendance_updated", load);
      window.removeEventListener("reminders_updated", load);
      window.removeEventListener("schedule_updated", load);
    };
  }, []);

  // ✅ Load tasks (REAL source: "tasks") + filter by employee
  useEffect(() => {
    const loadTasks = () => {
      if (!loggedInEmployee) {
        setTasks([]);
        return;
      }

      const stored = safeParse("tasks", []);

      const myTasks = stored
        .filter(
          (t) =>
            t.assignedTo &&
            t.assignedTo.toLowerCase() === loggedInEmployee.toLowerCase()
        )
        .map((t) => ({
          ...t,
          due: t.dueDate ?? t.due,
          pct:
            t.status === "Completed"
              ? 100
              : t.status === "In Progress"
              ? 50
              : 0,
        }));

      setTasks(myTasks);
    };

    loadTasks();

    window.addEventListener("storage", loadTasks);
    window.addEventListener("tasks_updated", loadTasks);

    return () => {
      window.removeEventListener("storage", loadTasks);
      window.removeEventListener("tasks_updated", loadTasks);
    };
  }, [loggedInEmployee]);

  // ✅ Live timer tick
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

  const pendingTasks = tasks.filter((t) => Number(t.pct || 0) < 100).length;

  // ✅ Chart data
  const chartData = useMemo(() => {
    const now = new Date();

    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - i));
      return startOfDay(d);
    });

    const recordDates = records
      .map((r) => ({ ...r, _d: new Date(r.time) }))
      .filter((r) => !Number.isNaN(r._d.getTime()));

    const attendanceByDay = days.map((day) => {
      const checkedIn = recordDates.some(
        (r) => r.type === "CHECK_IN" && isSameDay(r._d, day)
      );
      return checkedIn ? 100 : 0;
    });

    const tasksWithDue = tasks
      .map((t) => ({
        ...t,
        _due: parseDueDate(t.due),
        _pct: Math.max(0, Math.min(100, Number(t.pct || 0))),
      }))
      .filter((t) => t._due && !Number.isNaN(t._due.getTime()));

    const taskScoreByDay = days.map((day) => {
      const todays = tasksWithDue.filter((t) => isSameDay(t._due, day));
      if (!todays.length) return 0;
      const avg = todays.reduce((sum, t) => sum + t._pct, 0) / todays.length;
      return Math.round(avg);
    });

    const hasAnyDue = tasksWithDue.length > 0;
    const overallAvgPct =
      tasks.length > 0
        ? Math.round(
            tasks.reduce(
              (sum, t) =>
                sum + Math.max(0, Math.min(100, Number(t.pct || 0))),
              0
            ) / tasks.length
          )
        : 0;

    return days.map((day, i) => {
      const attendance = attendanceByDay[i];
      const taskScore = hasAnyDue ? taskScoreByDay[i] : overallAvgPct;

      const value = Math.round(attendance * 0.6 + taskScore * 0.4);

      return {
        day: fmtDay(day),
        value,
        attendance,
        taskScore,
      };
    });
  }, [records, tasks]);

  return (
    <Page>
      <Top>
        <TitleWrap>
          <Title>Dashboard</Title>
          <SubText>Welcome back, {userName} 👋</SubText>
        </TitleWrap>

        <Pills>
          <Pill>
            <ListTodo size={16} /> Pending: {pendingTasks}
          </Pill>
          <Pill>
            <CalendarDays size={16} /> Today: {new Date().toLocaleDateString()}
          </Pill>
          <Pill>
            <Sparkles size={16} /> Score: {attendanceScore}%
          </Pill>
        </Pills>
      </Top>

      <Grid>
        {/* Attendance */}
        <Card>
          <CardHead>
            <CardTitle>Live Attendance</CardTitle>
            <Hint>{att.checkedIn ? "LIVE" : "OFF"}</Hint>
          </CardHead>

          {att.checkedIn ? (
            <Chip>
              <Clock size={14} />
              Working: {formatHMS(liveMs)}
            </Chip>
          ) : (
            <EmptyState>
              Not checked in yet. Your live timer starts after check-in.
            </EmptyState>
          )}

          <StatGrid>
            <Stat>
              <div className="label">Check-in</div>
              <div className="value">{todayTimes.clockIn}</div>
            </Stat>
            <Stat>
              <div className="label">Check-out</div>
              <div className="value">{todayTimes.clockOut}</div>
            </Stat>
          </StatGrid>

          <CircleWrap>
            <PerformanceCircle value={attendanceScore}>
              <CircleInner>{attendanceScore}%</CircleInner>
            </PerformanceCircle>

            <CircleMeta>
              <div className="big">Attendance health</div>
              <div className="small">Last 7 days check-ins consistency</div>
            </CircleMeta>
          </CircleWrap>
        </Card>

        {/* Productivity */}
        <Card>
          <CardHead>
            <CardTitle>Weekly Productivity</CardTitle>
            <Hint>Real data</Hint>
          </CardHead>

          <ChartWrap>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={22}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={28} />
                <Tooltip
                  cursor={{ opacity: 0.15 }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #eef2f7",
                    boxShadow: "0 16px 32px rgba(2,6,23,0.10)",
                  }}
                  labelStyle={{ fontWeight: 900, color: "#0f172a" }}
                  formatter={(val) => [val, "Productivity"]}
                  labelFormatter={(label, payload) => {
                    const p = payload?.[0]?.payload;
                    if (!p) return label;
                    return `${label} • Attendance: ${p.attendance}% • Tasks: ${p.taskScore}%`;
                  }}
                />
                <RBar dataKey="value" radius={[10, 10, 10, 10]} fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrap>

          <div
            style={{
              fontSize: 12,
              marginTop: 10,
              color: "#64748b",
              fontWeight: 800,
            }}
          >
            Productivity = 60% attendance + 40% task progress
          </div>
        </Card>

        {/* Tasks */}
        <Card>
          <CardHead>
            <CardTitle>Today's Tasks</CardTitle>
            <Hint>{tasks.length} items</Hint>
          </CardHead>

          {tasks.length === 0 ? (
            <EmptyState>No tasks yet. Assigned tasks will show up here.</EmptyState>
          ) : (
            tasks.map((t, i) => (
              <TaskItem key={t.id ?? i}>
                <div className="title">{t.title}</div>
                <div className="meta">Due: {t.due || "--"}</div>

                <ProgressBar>
                  <div style={{ width: `${Number(t.pct || 0)}%` }} />
                </ProgressBar>

                <div className="meta">Progress: {Number(t.pct || 0)}%</div>
              </TaskItem>
            ))
          )}
        </Card>

        {/* Reminders */}
        <Card>
          <CardHead>
            <CardTitle>Reminders</CardTitle>
            <Hint>{reminders.length}</Hint>
          </CardHead>

          {reminders.length === 0 ? (
            <EmptyState>No reminders today. You’re chill 😌</EmptyState>
          ) : (
            reminders.map((r, i) => (
              <TaskItem key={i}>
                <div className="title">{r.time}</div>
                <div className="meta">{r.text}</div>
              </TaskItem>
            ))
          )}
        </Card>

        {/* Schedule */}
        <Card>
          <CardHead>
            <CardTitle>Schedule</CardTitle>
            <Hint>{schedule.length}</Hint>
          </CardHead>

          {schedule.length === 0 ? (
            <EmptyState>No schedule available right now.</EmptyState>
          ) : (
            schedule.map((s, i) => (
              <TaskItem key={i}>
                <div className="title">{s.time}</div>
                <div className="meta">{s.title}</div>
              </TaskItem>
            ))
          )}
        </Card>
      </Grid>
    </Page>
  );
}
