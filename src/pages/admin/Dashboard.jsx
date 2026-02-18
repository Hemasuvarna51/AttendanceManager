import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { Plus, Pause, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

/* ================== LAYOUT ================== */

const Page = styled.div`
  min-height: 100vh;
  background: #f3f4f6;
  display: flex;
  padding: 16px;
`;

const Main = styled.main`
  flex: 1;
  margin-left: 24px;
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

/* ================== HEADER ================== */

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const AddButton = styled.button`
  background: #77809f;
  color: #ffffff;
  padding: 10px 16px;
  border-radius: 14px;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  cursor: pointer;
`;

/* ================== CARDS ================== */

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`;

const Card = styled.button`
  padding: 20px;
  border-radius: 16px;
  background: ${(props) => (props.highlight ? "#77809f" : "#f9fafb")};
  color: ${(props) => (props.highlight ? "#ffffff" : "#000000")};
  cursor: ${(props) => (props.clickable ? "pointer" : "default")};
  transition: transform 0.2s, box-shadow 0.2s;
  border: none;
  text-align: left;
  font-family: inherit;
  font-size: inherit;

  &:hover {
    ${(props) =>
      props.clickable &&
      `
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    `}
  }
`;

const CardTitle = styled.p`
  font-size: 14px;
`;

const CardValue = styled.h3`
  font-size: 30px;
  margin-top: 8px;
`;

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
`;

const BoxTitle = styled.h3`
  font-weight: 600;
  margin-bottom: 16px;
`;

const ReminderText = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
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

const TeamList = styled.ul`
  list-style: none;
  padding: 0;
`;

/* ================== TIME TRACKER ================== */

const TimeBox = styled.div`
  background: #77809f;
  color: #ffffff;
  padding: 24px;
  border-radius: 16px;
  text-align: center;
`;

const Time = styled.p`
  font-size: 30px;
  font-weight: bold;
`;

const PauseButton = styled.button`
  margin-top: 16px;
  background: #ffffff;
  color: blue;
  padding: 10px 16px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
`;

/* ================== COMPONENT ================== */

export default function Dashboard() {
  // ✅ employees + attendance
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [presentToday, setPresentToday] = useState(0);

  // ✅ meetings
  const [meetings, setMeetings] = useState([]);

  // ✅ projects: store array in localStorage
  const [projects, setProjects] = useState(() => safeParse("projects", []));

  // timer
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

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


  /* ---------- TIMER ---------- */
  useEffect(() => {
    let timer;
    if (isRunning) timer = setInterval(() => setSeconds((p) => p + 1), 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  const formatTime = () => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  /* ---------- HANDLERS ---------- */

  const handleAddProject = () => {
    navigate("/admin/projects");
    
    saveJSON("projects", next);
    window.dispatchEvent(new Event("projects_updated")); // ✅ same-tab update
    alert("New project added!");
  };

  const toggleTimer = () => setIsRunning((v) => !v);

  const handleProjectClick = (status = null) => {
    if (status) {
      navigate(`/admin/projects?filter=${status}`);
    } else {
      navigate("/admin/projects");
    }
  };

  return (
    <Page>
      <Main>
        <Header>
          <Title>Dashboard</Title>
          <HeaderActions>
            <AddButton onClick={handleAddProject}>
              <Plus size={16} /> Add Project
            </AddButton>
          </HeaderActions>
        </Header>

        <CardGrid>
          <Card highlight clickable onClick={() => handleProjectClick()}>
            <CardTitle>Total Projects</CardTitle>
            <CardValue>{projectStats.total}</CardValue>
          </Card>

          <Card clickable onClick={() => handleProjectClick("Ended")}>
            <CardTitle>Ended Projects</CardTitle>
            <CardValue>{projectStats.ended}</CardValue>
          </Card>

          <Card clickable onClick={() => handleProjectClick("Running")}>
            <CardTitle>Running Projects</CardTitle>
            <CardValue>{projectStats.running}</CardValue>
          </Card>

          <Card clickable onClick={() => handleProjectClick("Pending")}>
            <CardTitle>Pending Projects</CardTitle>
            <CardValue>{projectStats.pending}</CardValue>
          </Card>

          <Card clickable onClick={() => navigate("/admin/employees")}>
            <CardTitle >Total Employees</CardTitle>
            <CardValue>{totalEmployees}</CardValue>
          </Card>
        </CardGrid>

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

                <FullButton onClick={() => navigate("/admin/meetings")}>
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
            <FullButton onClick={() => navigate("/admin/attendance")}>
              View Attendance
            </FullButton>
          </Box>
        </SectionGrid>

        <BottomGrid>
          <Box>
            <BoxTitle>Team Collaboration</BoxTitle>
            <TeamList />
          </Box>

          <TimeBox>
            <BoxTitle>Time Tracker</BoxTitle>
            <Time>{formatTime()}</Time>
            <PauseButton onClick={toggleTimer}>
              {isRunning ? <Pause size={16} /> : <Play size={16} />}
              {isRunning ? " Pause" : " Start"}
            </PauseButton>
          </TimeBox>
        </BottomGrid>
      </Main>
    </Page>
  );
}
