import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Bell, Mail, Plus, Pause, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

const IconWrapper = styled.div`
  color: #6b7280;
  cursor: pointer;
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
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`;

const Card = styled.div`
  padding: 20px;
  border-radius: 16px;
  background: ${(props) => (props.highlight ? "#77809f" : "#f9fafb")};
  color: ${(props) => (props.highlight ? "#ffffff" : "#000000")};
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
  const [totalProjects, setTotalProjects] = useState(0);
  const [endedProjects, setEndedProjects] = useState(0);
  const [runningProjects, setRunningProjects] = useState(0);
  const [pendingProjects, setPendingProjects] = useState(0);

  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const navigate = useNavigate();

  /* ---------- Meetings State (Auto-refresh) ---------- */
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const load = () => {
      try {
        const stored = localStorage.getItem("admin_meetings");
        setMeetings(stored ? JSON.parse(stored) : []);
      } catch {
        setMeetings([]);
      }
    };

    load();

    // ✅ same-tab updates
    window.addEventListener("meetings_updated", load);
    // ✅ cross-tab updates
    window.addEventListener("storage", load);

    return () => {
      window.removeEventListener("meetings_updated", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  /* ---------- TIMER LOGIC ---------- */
  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    }
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
    setTotalProjects((p) => p + 1);
    setRunningProjects((p) => p + 1);
    alert("New project added!");
  };

  const handleMailClick = () => alert("Opening messages...");
  const handleBellClick = () => alert("No new notifications");
  const toggleTimer = () => setIsRunning((v) => !v);

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
          <Card highlight>
            <CardTitle>Total Projects</CardTitle>
            <CardValue>{totalProjects}</CardValue>
          </Card>
          <Card>
            <CardTitle>Ended Projects</CardTitle>
            <CardValue>{endedProjects}</CardValue>
          </Card>
          <Card>
            <CardTitle>Running Projects</CardTitle>
            <CardValue>{runningProjects}</CardValue>
          </Card>
          <Card>
            <CardTitle>Pending Projects</CardTitle>
            <CardValue>{pendingProjects}</CardValue>
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
            <BoxTitle>Quick Action</BoxTitle>
            <ReminderText>Manage meetings and schedules.</ReminderText>
            <FullButton onClick={() => navigate("/admin/meetings")}>
              Go to Meetings
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
