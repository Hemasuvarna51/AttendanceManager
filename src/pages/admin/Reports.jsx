import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLeaveStore } from "../../store/leave.store";
import { getRecords } from "../../utils/attendanceLocalDb";


/* ================= LAYOUT ================= */

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 22px 40px;
  background: #f8fafc;
  min-height: calc(100vh - 60px);
`;

const Content = styled.div`
  flex: 1;
  padding: 24px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
`;

const Card = styled.div`
  background: ${(props) => (props.primary ? "#1976ff" : "#ffffff")};
  color: ${(props) => (props.primary ? "#fff" : "#000")};
  padding: 20px;
  border-radius: 16px;
`;

const CardTitle = styled.p`
  font-size: 14px;
  opacity: 0.9;
`;

const CardValue = styled.h2`
  font-size: 28px;
  margin-top: 6px;
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
`;

const Box = styled.div`
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
`;

const BoxTitle = styled.h3`
  font-weight: 600;
  margin-bottom: 16px;
`;

const LeaveItem = styled.li`
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const StatusBadge = styled.span`
  font-weight: 600;
  color: ${(props) => 
    props.status === "Approved" ? "#166534" : 
    props.status === "Rejected" ? "#991b1b" : 
    "#92400e"};
`;

/* ================= EMPLOYEE LIST STYLES ================= */
const EmployeeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const EmployeeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #f3f4f6;
  box-shadow: 0 4px 10px rgba(9, 30, 66, 0.02);
`;

const EmployeeLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #eef2ff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #1e3a8a;
  flex-shrink: 0;
`;

const EmployeeInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const EmployeeName = styled.div`
  font-weight: 700;
  font-size: 14px;
`;

const EmployeeMeta = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  color: #6b7280;
  font-size: 13px;
`;

const EmptyState = styled.div`
  padding: 18px;
  text-align: center;
  color: #6b7280;
`;

export default function AdminDashboard() {
  const { leaves } = useLeaveStore();
  const [totalEmployeesCheckedIn, setTotalEmployeesCheckedIn] = useState(0);
  const [checkedInEmployees, setCheckedInEmployees] = useState([]);
  const [todayCheckIns, setTodayCheckIns] = useState(0);
  const [todayCheckOuts, setTodayCheckOuts] = useState(0);
  const [presentNow, setPresentNow] = useState(0);

  // Calculate leave statistics
  const approvedLeaves = leaves.filter(l => l.status === "Approved").length;
  const rejectedLeaves = leaves.filter(l => l.status === "Rejected").length;
  const totalLeaves = leaves.length;

  // Get unique employees who checked in
  useEffect(() => {
    const updateEmployeeCount = () => {
      const records = getRecords();
      const checkInRecords = records.filter((r) => r.type === "CHECK_IN");

      // group by user identifier (prefer userName/user.email if present)
      const byUserLatestCheckIn = new Map();
      const byUserLatestOverall = new Map();

      records.forEach((r) => {
        const key = r.userName || (r.user && r.user.name) || r.userEmail || r.employeeName || r.id || "Unknown";

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
        Array.from(byUserLatestCheckIn.values()).map((r) => ({
          key: r.userName || r.userEmail || r.employeeName || r.id || "Unknown",
          time: r.time,
          distance: r.distance,
        }))
          .sort((a, b) => new Date(b.time) - new Date(a.time))
      );

      // compute today metrics
      const todayStr = new Date().toDateString();
      const isToday = (iso) => new Date(iso).toDateString() === todayStr;

      const todaysCheckIns = records.filter((r) => r.type === "CHECK_IN" && isToday(r.time)).length;
      const todaysCheckOuts = records.filter((r) => r.type === "CHECK_OUT" && isToday(r.time)).length;

      // present now = users whose latest overall record is CHECK_IN
      let presentCount = 0;
      byUserLatestOverall.forEach((r) => {
        if (r.type === "CHECK_IN") presentCount += 1;
      });

      setTodayCheckIns(todaysCheckIns);
      setTodayCheckOuts(todaysCheckOuts);
      setPresentNow(presentCount);
    };

    // Initial count
    updateEmployeeCount();

    // Listen for attendance updates
    window.addEventListener("attendance_updated", updateEmployeeCount);

    return () => {
      window.removeEventListener("attendance_updated", updateEmployeeCount);
    };
  }, []);

  return (
    <Page>
      

      <Content>
       

        {/* STAT CARDS */}
        <CardGrid>
          <Card primary>
            <CardTitle>Total Employee</CardTitle>
            <CardValue>{totalEmployeesCheckedIn} </CardValue>
          </Card>

          <Card>
            <CardTitle>Total Rejected</CardTitle>
            <CardValue>{rejectedLeaves}</CardValue>
          </Card>

          <Card>
            <CardTitle>Total Approved</CardTitle>
            <CardValue>{approvedLeaves}</CardValue>
          </Card>

          <Card>
            <CardTitle>Total Leave</CardTitle>
            <CardValue>{totalLeaves}</CardValue>
          </Card>
        </CardGrid>

        {/* CHART + LEAVE */}
        <SectionGrid>
          <Box>
            <BoxTitle>Daily Attendance Statistic</BoxTitle>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ background: '#fff', padding: 12, borderRadius: 12, minWidth: 140 }}>
                <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Today Check-Ins</div>
                <div style={{ fontSize: 20, fontWeight: 800, marginTop: 6 }}>{todayCheckIns}</div>
              </div>

              <div style={{ background: '#fff', padding: 12, borderRadius: 12, minWidth: 140 }}>
                <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Today Check-Outs</div>
                <div style={{ fontSize: 20, fontWeight: 800, marginTop: 6 }}>{todayCheckOuts}</div>
              </div>

              <div style={{ background: '#fff', padding: 12, borderRadius: 12, minWidth: 140 }}>
                <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>Present Now</div>
                <div style={{ fontSize: 20, fontWeight: 800, marginTop: 6 }}>{presentNow}</div>
              </div>
            </div>
          </Box>

          <Box>
            <BoxTitle>Leave Application</BoxTitle>
            {leaves.length > 0 ? (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {leaves.map((leave) => (
                  <LeaveItem key={leave.id}>
                    {leave.employee} – <StatusBadge status={leave.status}>{leave.status}</StatusBadge>
                  </LeaveItem>
                ))}
              </ul>
            ) : (
              <p>No leave requests</p>
            )}
          </Box>
        </SectionGrid>

        {/* EMPLOYEE LIST */}
        <Box>
          <BoxTitle>Employee List</BoxTitle>

          <EmployeeList>
            {checkedInEmployees.length > 0 ? (
              checkedInEmployees.map((e) => (
                <EmployeeRow key={e.key}>
                  <EmployeeLeft>
                    <Avatar>{(e.key || "?").split(" ").map(s=>s[0]).slice(0,2).join("")}</Avatar>
                    <EmployeeInfo>
                      <EmployeeName>{e.key}</EmployeeName>
                      <div style={{ color: "#9ca3af", fontSize: 12 }}>
                        {new Date(e.time).toLocaleString()}
                      </div>
                    </EmployeeInfo>
                  </EmployeeLeft>

                  <EmployeeMeta>
                    <div>{e.distance ? Math.round(e.distance) + " m" : "—"}</div>
                  </EmployeeMeta>
                </EmployeeRow>
              ))
            ) : (
              <EmptyState>No employees checked in</EmptyState>
            )}
          </EmployeeList>
        </Box>
      </Content>
    </Page>
  );
}
