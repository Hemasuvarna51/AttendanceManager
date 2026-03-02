import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useLeaveStore } from "../../store/leave.store";
import { getRecords } from "../../utils/attendanceLocalDb";
import StatCard from "../../components/stats/StatCard";
import StatCardGrid from "../../components/stats/StatCardGrid";
import Page from "../../layout/Page";
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

      {/* STAT CARDS */}
      <StatCardGrid $cols={4}>
        <StatCard
          variant="blue"
          label="Total Employee"
          value={totalEmployeesCheckedIn}
          icon={<Users size={18} />}
        />

        <StatCard
          variant="red"
          label="Total Rejected"
          value={rejectedLeaves}
          icon={<XCircle size={18} />}
        />

        <StatCard
          variant="green"
          label="Total Approved"
          value={approvedLeaves}
          icon={<CheckCircle2 size={18} />}
        />

        <StatCard
          variant="orange"
          label="Total Leave"
          value={totalLeaves}
          icon={<ClipboardList size={18} />}
        />
      </StatCardGrid >


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