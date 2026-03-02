import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useLeaveStore } from "../../store/leave.store";
import { getRecords } from "../../utils/attendanceLocalDb";
import {
  Users,
  XCircle,
  CheckCircle2,
  ClipboardList,
  LogIn,
  LogOut,
  UserCheck,
  ChevronRight,
} from "lucide-react";

/* ================= THEME ================= */

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 26px 22px 44px;
  background: #f6f8fc;
  min-height: calc(100vh - 60px);
`;

const Header = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 18px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  letter-spacing: -0.3px;
  color: #0f172a;
`;

const Subtle = styled.div`
  font-size: 13px;
  color: #64748b;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 18px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  border-radius: 18px;
  padding: 18px 18px 16px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(2, 6, 23, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.6);
  color: #fff;

  background: ${({ variant }) => {
    if (variant === "blue")
      return "linear-gradient(135deg, #2f6dff 0%, #5aa1ff 100%)";
    if (variant === "red")
      return "linear-gradient(135deg, #e34c4c 0%, #ff7a7a 100%)";
    if (variant === "green")
      return "linear-gradient(135deg, #2e8b78 0%, #6fc3a5 100%)";
    return "linear-gradient(135deg, #f49b36 0%, #ffc06a 100%)";
  }};

  &:after {
    content: "";
    position: absolute;
    inset: -40px -60px auto auto;
    width: 180px;
    height: 180px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.15);
    filter: blur(0.2px);
  }
`;

const StatTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  position: relative;
  z-index: 1;
`;

const StatLabel = styled.div`
  font-size: 13px;
  opacity: 0.92;
  font-weight: 600;
  letter-spacing: 0.1px;
`;

const StatValue = styled.div`
  margin-top: 10px;
  font-size: 34px;
  font-weight: 900;
  letter-spacing: -0.6px;
  position: relative;
  z-index: 1;
`;

const IconChip = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.24);
  position: relative;
  z-index: 1;
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 18px;
  margin-bottom: 18px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid #e8edf6;
  border-radius: 18px;
  box-shadow: 0 18px 44px rgba(2, 6, 23, 0.06);
  padding: 18px;
`;

const PanelTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
`;

const PanelRightHint = styled.div`
  font-size: 12px;
  color: #64748b;
`;

const MiniStats = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const MiniStat = styled.div`
  background: #ffffff;
  border: 1px solid #eef2f7;
  border-radius: 14px;
  padding: 12px 12px;
  min-width: 150px;
  box-shadow: 0 12px 24px rgba(2, 6, 23, 0.04);
`;

const MiniTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MiniLabel = styled.div`
  font-size: 12px;
  color: #64748b;
  font-weight: 700;
`;

const MiniValue = styled.div`
  margin-top: 8px;
  font-size: 22px;
  font-weight: 900;
  color: #0f172a;
`;

const ChartArea = styled.div`
  margin-top: 14px;
  height: 170px;
  border-radius: 14px;
  border: 1px dashed #e2e8f0;
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.9), #ffffff);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-weight: 700;
  font-size: 13px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ListRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid #eef2f7;
  box-shadow: 0 10px 20px rgba(2, 6, 23, 0.04);
`;

const ListLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const Name = styled.div`
  font-weight: 800;
  color: #0f172a;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Muted = styled.div`
  color: #94a3b8;
  font-size: 12px;
  margin-top: 2px;
`;

const StatusBadge = styled.span`
  font-weight: 800;
  font-size: 13px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid;

  color: ${({ status }) =>
    status === "Approved" ? "#166534" : status === "Rejected" ? "#991b1b" : "#92400e"};

  background: ${({ status }) =>
    status === "Approved"
      ? "#dcfce7"
      : status === "Rejected"
      ? "#fee2e2"
      : "#ffedd5"};

  border-color: ${({ status }) =>
    status === "Approved"
      ? "#86efac"
      : status === "Rejected"
      ? "#fca5a5"
      : "#fdba74"};
`;

const Chevron = styled.div`
  color: #94a3b8;
  display: inline-flex;
  align-items: center;
`;

const EmployeeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EmployeeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid #eef2f7;
  box-shadow: 0 10px 20px rgba(2, 6, 23, 0.04);
`;

const EmployeeLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

const Avatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #eef2ff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  color: #1e3a8a;
  flex-shrink: 0;
  border: 1px solid #dbeafe;
`;

const EmployeeInfo = styled.div`
  min-width: 0;
`;

const EmployeeName = styled.div`
  font-weight: 900;
  font-size: 14px;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmployeeMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
`;

const EmptyState = styled.div`
  padding: 18px;
  text-align: center;
  color: #64748b;
  font-weight: 700;
`;

/* ================= COMPONENT ================= */

export default function AdminDashboard() {
  const { leaves } = useLeaveStore();
  const [totalEmployeesCheckedIn, setTotalEmployeesCheckedIn] = useState(0);
  const [checkedInEmployees, setCheckedInEmployees] = useState([]);
  const [todayCheckIns, setTodayCheckIns] = useState(0);
  const [todayCheckOuts, setTodayCheckOuts] = useState(0);
  const [presentNow, setPresentNow] = useState(0);

  const approvedLeaves = useMemo(
    () => leaves.filter((l) => l.status === "Approved").length,
    [leaves]
  );
  const rejectedLeaves = useMemo(
    () => leaves.filter((l) => l.status === "Rejected").length,
    [leaves]
  );
  const totalLeaves = leaves.length;

  useEffect(() => {
    const updateEmployeeCount = () => {
      const records = getRecords();

      const byUserLatestCheckIn = new Map();
      const byUserLatestOverall = new Map();

      records.forEach((r) => {
        const key =
          r.userName ||
          (r.user && r.user.name) ||
          r.userEmail ||
          r.employeeName ||
          r.id ||
          "Unknown";

        const existingOverall = byUserLatestOverall.get(key);
        if (!existingOverall || new Date(r.time) > new Date(existingOverall.time)) {
          byUserLatestOverall.set(key, r);
        }

        if (r.type === "CHECK_IN") {
          const existing = byUserLatestCheckIn.get(key);
          if (!existing || new Date(r.time) > new Date(existing.time)) {
            byUserLatestCheckIn.set(key, r);
          }
        }
      });

      setTotalEmployeesCheckedIn(byUserLatestCheckIn.size);

      setCheckedInEmployees(
        Array.from(byUserLatestCheckIn.values())
          .map((r) => ({
            key: r.userName || r.userEmail || r.employeeName || r.id || "Unknown",
            time: r.time,
            distance: r.distance,
          }))
          .sort((a, b) => new Date(b.time) - new Date(a.time))
      );

      const todayStr = new Date().toDateString();
      const isToday = (iso) => new Date(iso).toDateString() === todayStr;

      setTodayCheckIns(records.filter((r) => r.type === "CHECK_IN" && isToday(r.time)).length);
      setTodayCheckOuts(records.filter((r) => r.type === "CHECK_OUT" && isToday(r.time)).length);

      let presentCount = 0;
      byUserLatestOverall.forEach((r) => {
        if (r.type === "CHECK_IN") presentCount += 1;
      });
      setPresentNow(presentCount);
    };

    updateEmployeeCount();
    window.addEventListener("attendance_updated", updateEmployeeCount);
    return () => window.removeEventListener("attendance_updated", updateEmployeeCount);
  }, []);

  return (
    <Page>
      <Header>
        <Title>Reports</Title>
        <Subtle>Overview of attendance & leave activity</Subtle>
      </Header>

      {/* STAT CARDS */}
      <CardGrid>
        <StatCard variant="blue">
          <StatTop>
            <StatLabel>Total Employee</StatLabel>
            <IconChip>
              <Users size={18} />
            </IconChip>
          </StatTop>
          <StatValue>{totalEmployeesCheckedIn}</StatValue>
        </StatCard>

        <StatCard variant="red">
          <StatTop>
            <StatLabel>Total Rejected</StatLabel>
            <IconChip>
              <XCircle size={18} />
            </IconChip>
          </StatTop>
          <StatValue>{rejectedLeaves}</StatValue>
        </StatCard>

        <StatCard variant="green">
          <StatTop>
            <StatLabel>Total Approved</StatLabel>
            <IconChip>
              <CheckCircle2 size={18} />
            </IconChip>
          </StatTop>
          <StatValue>{approvedLeaves}</StatValue>
        </StatCard>

        <StatCard variant="orange">
          <StatTop>
            <StatLabel>Total Leave</StatLabel>
            <IconChip>
              <ClipboardList size={18} />
            </IconChip>
          </StatTop>
          <StatValue>{totalLeaves}</StatValue>
        </StatCard>
      </CardGrid>

      {/* ATTENDANCE + LEAVE */}
      <SectionGrid>
        <Panel>
          <PanelTitleRow>
            <PanelTitle>Daily Attendance Statistic</PanelTitle>
            <PanelRightHint>Real-time</PanelRightHint>
          </PanelTitleRow>

          <MiniStats>
            <MiniStat>
              <MiniTop>
                <MiniLabel>Today Check-Ins</MiniLabel>
                <LogIn size={16} color="#64748b" />
              </MiniTop>
              <MiniValue>{todayCheckIns}</MiniValue>
            </MiniStat>

            <MiniStat>
              <MiniTop>
                <MiniLabel>Today Check-Outs</MiniLabel>
                <LogOut size={16} color="#64748b" />
              </MiniTop>
              <MiniValue>{todayCheckOuts}</MiniValue>
            </MiniStat>

            <MiniStat>
              <MiniTop>
                <MiniLabel>Present Now</MiniLabel>
                <UserCheck size={16} color="#64748b" />
              </MiniTop>
              <MiniValue>{presentNow}</MiniValue>
            </MiniStat>
          </MiniStats>

          {/* Replace this with your actual chart later */}
          <ChartArea>Chart area</ChartArea>
        </Panel>

        <Panel>
          <PanelTitleRow>
            <PanelTitle>Leave Application</PanelTitle>
            <PanelRightHint>Latest</PanelRightHint>
          </PanelTitleRow>

          {leaves.length > 0 ? (
            <List>
              {leaves.slice(0, 5).map((leave) => (
                <ListRow key={leave.id}>
                  <ListLeft>
                    <div style={{ minWidth: 0 }}>
                      <Name>{leave.employee}</Name>
                      <Muted>Request status</Muted>
                    </div>
                  </ListLeft>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <StatusBadge status={leave.status}>{leave.status}</StatusBadge>
                    <Chevron>
                      <ChevronRight size={18} />
                    </Chevron>
                  </div>
                </ListRow>
              ))}
            </List>
          ) : (
            <EmptyState>No leave requests</EmptyState>
          )}
        </Panel>
      </SectionGrid>

      {/* EMPLOYEE LIST */}
      <Panel>
        <PanelTitleRow>
          <PanelTitle>Employee List</PanelTitle>
          <Chevron>
            <ChevronRight size={18} />
          </Chevron>
        </PanelTitleRow>

        <EmployeeList>
          {checkedInEmployees.length > 0 ? (
            checkedInEmployees.map((e) => (
              <EmployeeRow key={e.key}>
                <EmployeeLeft>
                  <Avatar>
                    {(e.key || "?")
                      .split(" ")
                      .map((s) => s[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </Avatar>

                  <EmployeeInfo>
                    <EmployeeName>{e.key}</EmployeeName>
                    <Muted>{new Date(e.time).toLocaleString()}</Muted>
                  </EmployeeInfo>
                </EmployeeLeft>

                <EmployeeMeta>
                  <div>{e.distance ? Math.round(e.distance) + " m" : "—"}</div>
                  <Chevron>
                    <ChevronRight size={18} />
                  </Chevron>
                </EmployeeMeta>
              </EmployeeRow>
            ))
          ) : (
            <EmptyState>No employees checked in</EmptyState>
          )}
        </EmployeeList>
      </Panel>
    </Page>
  );
}