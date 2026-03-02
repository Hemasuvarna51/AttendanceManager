import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getRecords } from "../../utils/attendanceLocalDb";
import Page from "../../layout/Page";
import StatCard from "../../components/stats/StatCard";
import StatCardGrid from "../../components/stats/StatCardGrid5";
import PageHeader from "../../components/Ui/PageHeader";

/* ================== HELPERS ================== */

const safeParse = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const saveJSON = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};




/* ================== SECTIONS ================== */

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

  
`;

const Box = styled.div`
  background: #f9fafb;
  padding: 24px;
  border-radius: 16px;
  position: relative;
  overflow: hidden;

  transition: transform 250ms ease, box-shadow 250ms ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08);
  }

  /* animated background fill */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #eef2ff, #e0e7ff);
    opacity: 0;
    transition: opacity 300ms ease;
    z-index: 0;
  }

  &:hover::before {
    opacity: 1;
  }

  /* keep content above overlay */
  & > * {
    position: relative;
    z-index: 1;
  }
`;

const BoxTitle = styled.h3`
  font-weight: 600;
  margin-bottom: 16px;

`;

const ReminderText = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 10px;
`;

const FullButton = styled.button`
  width: 100%;
  background: #77809f;
  color: #ffffff;
  padding: 10px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
`;

/* ================== BOTTOM ================== */

const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-top: 24px;
  
`;

const TeamList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  
`;

const EmployeeItem = styled.div`
  padding: 12px 16px;
  background: #fafafd;
  border-radius: 10px;
  margin-bottom: 10px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  transition: 
    transform 220ms ease,
    box-shadow 220ms ease,
    background 220ms ease;

  cursor: pointer;

  &:hover {
  transform: translateY(-3px);
  background: #b8cfe8;
  box-shadow: 0 14px 30px rgba(71, 105, 230, 0.15);
}

  &:active {
    transform: translateY(0);
  }
`;

const EmployeeName = styled.span`
  font-weight: 500;
`;

const EmployeeEmail = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

/* ================== COMPONENT ================== */

export default function Dashboard() {
  // ✅ employees + attendance
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [presentToday, setPresentToday] = useState(0);
  const [employeesList, setEmployeesList] = useState([]);

  // ✅ meetings
  const [meetings, setMeetings] = useState([]);

  // ✅ projects: store array in localStorage
  const [projects, setProjects] = useState(() => safeParse("projects", []));

  // ✅ daily attendance data for chart
  const [dailyAttendanceData, setDailyAttendanceData] = useState([]);

  const navigate = useNavigate();

  /* ---------- Projects: auto-refresh ---------- */
  useEffect(() => {
    const loadProjects = () => {
      setProjects(safeParse("projects", []));
    };

    loadProjects();
    window.addEventListener("projects_updated", loadProjects);
    window.addEventListener("storage", loadProjects);

    return () => {
      window.removeEventListener("projects_updated", loadProjects);
      window.removeEventListener("storage", loadProjects);
    };
  }, []);

  const projectStats = useMemo(() => {
    const total = projects.length;

    const ended = projects.filter((p) => p.status === "Ended").length;
    const running = projects.filter((p) => p.status === "Running").length;
    const pending = projects.filter((p) => p.status === "Pending").length;

    return { total, ended, running, pending };
  }, [projects]);

  /* ---------- Meetings: auto-refresh ---------- */
  useEffect(() => {
    const load = () => {
      const stored = safeParse("admin_meetings", []);
      setMeetings(Array.isArray(stored) ? stored : []);
    };

    load();
    window.addEventListener("meetings_updated", load);
    window.addEventListener("storage", load);

    return () => {
      window.removeEventListener("meetings_updated", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  /* ---------- Employees & Attendance ---------- */
  useEffect(() => {
    const loadEmployees = () => {
      try {
        // ✅ read employees from zustand persist key
        const persisted = safeParse("employee-storage", null);
        const employees = persisted?.state?.employees || [];
        setTotalEmployees(employees.length);
        setEmployeesList(employees);

        const today = new Date().toDateString();
        const attendance = safeParse("attendance", []);
        const todayPresent = attendance.filter(
          (a) =>
            new Date(a.date).toDateString() === today && a.status === "Present"
        ).length;

        setPresentToday(todayPresent);
      } catch {
        setTotalEmployees(0);
        setPresentToday(0);
        setEmployeesList([]);
      }
    };

    loadEmployees();

    // ✅ cross-tab updates
    window.addEventListener("storage", loadEmployees);

    // ✅ same-tab updates (optional, only if you dispatch it somewhere)
    window.addEventListener("employees_updated", loadEmployees);
    window.addEventListener("attendance_updated", loadEmployees);

    return () => {
      window.removeEventListener("storage", loadEmployees);
      window.removeEventListener("employees_updated", loadEmployees);
      window.removeEventListener("attendance_updated", loadEmployees);
    };
  }, []);

  /* ---------- Daily Attendance Chart ---------- */
  useEffect(() => {
    const updateAttendanceChart = () => {
      const records = getRecords();
      const dailyData = {};
      const today = new Date();

      // Initialize last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const fullDateStr = date.toDateString();
        dailyData[fullDateStr] = { date: dateStr, present: 0 };
      }

      // Count check-ins per day
      const checkInsByDay = {};
      records.forEach((r) => {
        if (r.type === "CHECK_IN") {
          const dateStr = new Date(r.time).toDateString();
          if (!checkInsByDay[dateStr]) {
            checkInsByDay[dateStr] = new Set();
          }
          const key = r.userName || r.userEmail || r.employeeName || r.id || "Unknown";
          checkInsByDay[dateStr].add(key);
        }
      });

      // Populate dailyData with check-in counts
      Object.keys(checkInsByDay).forEach((dateStr) => {
        if (dailyData[dateStr]) {
          dailyData[dateStr].present = checkInsByDay[dateStr].size;
        }
      });

      const chartData = Object.values(dailyData);
      setDailyAttendanceData(chartData);
    };

    updateAttendanceChart();

    // Listen for attendance updates
    window.addEventListener("attendance_updated", updateAttendanceChart);
    window.addEventListener("storage", updateAttendanceChart);

    return () => {
      window.removeEventListener("attendance_updated", updateAttendanceChart);
      window.removeEventListener("storage", updateAttendanceChart);
    };
  }, []);

  const handleProjectClick = (status = null) => {
    if (status) {
      navigate(`/admin/projects?filter=${status}`);
    } else {
      navigate("/admin/projects");
    }
  };

  return (
    <Page>

      <PageHeader
        title="Dashboard"
        subtitle="Project overview"
        buttonLabel="Add Project"
        buttonIcon={<Plus size={16} />}
        onButtonClick={() => handleProjectClick()}
      />

      <StatCardGrid $cols={5}>
        <StatCard
          label="Total Projects"
          value={projectStats.total}
          icon={<Plus size={18} />}
          bg="linear-gradient(135deg, #FD9111 0%, #FFC06A 100%)"
          onClick={() => handleProjectClick()}
        />

        <StatCard
          label="Ended Projects"
          value={projectStats.ended}
          icon={<Plus size={18} />}
          bg="linear-gradient(135deg, #3182ce 0%, #63b3ed 100%)"
          onClick={() => handleProjectClick("Ended")}
        />

        <StatCard
          label="Running Projects"
          value={projectStats.running}
          icon={<Plus size={18} />}
          bg="linear-gradient(135deg, #22c55e 0%, #86efac 100%)"
          onClick={() => handleProjectClick("Running")}
        />

        <StatCard
          label="Pending Projects"
          value={projectStats.pending}
          icon={<Plus size={18} />}
          bg="linear-gradient(135deg, #ef4444 0%, #fca5a5 100%)"
          onClick={() => handleProjectClick("Pending")}
        />

        <StatCard
          label="Total Employees"
          value={totalEmployees}
          icon={<Plus size={18} />}
          bg="linear-gradient(135deg, #77809f 0%, #a7b0c4 100%)"
          onClick={() => navigate("/admin/employees")}
        />
      </StatCardGrid>
      <SectionGrid>
        <Box>
          <BoxTitle>Reminders</BoxTitle>

          {meetings.length === 0 ? (
            <>
              <ReminderText>No meetings scheduled.</ReminderText>
              <FullButton onClick={() => navigate("/admin/meetings")}>
                Schedule Meeting
              </FullButton>
            </>
          ) : (
            <>
              {meetings.slice(0, 2).map((meeting, index) => (
                <div key={index} style={{ marginBottom: 12 }}>
                  <p style={{ fontWeight: 600, margin: 0 }}>
                    {meeting?.title || "Meeting"}
                  </p>
                  <ReminderText style={{ marginTop: 6 }}>
                    {meeting?.time || "Time not set"}
                  </ReminderText>
                </div>
              ))}

              <FullButton onClick={() => navigate("/admin/meetings")} style={{ background: "#3182ce" }}>
                View All Meetings
              </FullButton>
            </>
          )}
        </Box>

        <Box>
          <BoxTitle>Today's Attendance</BoxTitle>
          <ReminderText>
            Present: {presentToday} / {totalEmployees}
          </ReminderText>
          <FullButton onClick={() => navigate("/admin/attendance")} style={{ background: "#9c51ce" }}>
            View Attendance
          </FullButton>
        </Box>
      </SectionGrid>

      <BottomGrid>
        <Box>
          <BoxTitle>Total Employee Details</BoxTitle>
          <TeamList>
            {employeesList.length === 0 ? (
              <ReminderText>No employees added yet.</ReminderText>
            ) : (
              employeesList.map((emp) => (
                <EmployeeItem key={emp.id}>
                  <div>
                    <EmployeeName>{emp.name}</EmployeeName>
                    <br />
                    <EmployeeEmail>{emp.email}</EmployeeEmail>
                  </div>
                  <EmployeeEmail>ID: {emp.id}</EmployeeEmail>
                </EmployeeItem>
              ))
            )}
          </TeamList>
        </Box>

        <Box>
          <BoxTitle>Daily Attendance Statistic (Last 7 Days)</BoxTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyAttendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" />
              <YAxis
                domain={[0, 'dataMax + 2']}
                allowDecimals={false}
                label={{
                  value: "Employees Count",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill=" #13d782" name="Employees Present" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </BottomGrid>

    </Page>
  );
}