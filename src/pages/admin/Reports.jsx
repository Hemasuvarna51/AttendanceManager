import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLeaveStore } from "../../store/leave.store";
import { getRecords } from "../../utils/attendanceLocalDb";


/* ================= LAYOUT ================= */

const Page = styled.div`
  min-height: 100vh;
  background: #f4f7ff;
  display: flex;
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

export default function AdminDashboard() {
  const { leaves } = useLeaveStore();
  const [totalEmployeesCheckedIn, setTotalEmployeesCheckedIn] = useState(0);

  // Calculate leave statistics
  const approvedLeaves = leaves.filter(l => l.status === "Approved").length;
  const rejectedLeaves = leaves.filter(l => l.status === "Rejected").length;
  const totalLeaves = leaves.length;

  // Get unique employees who checked in
  useEffect(() => {
    const updateEmployeeCount = () => {
      const records = getRecords();
      const checkInRecords = records.filter(r => r.type === "CHECK_IN");
      const uniqueEmployees = new Set(checkInRecords.map(r => r.id));
      setTotalEmployeesCheckedIn(uniqueEmployees.size);
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
            {/* Chart will go here */}
            <p>Attendance Chart Placeholder</p>
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

        {/* EMPLOYEE TABLE */}
        <Box>
          <BoxTitle>Employee List</BoxTitle>
          <table width="100%">
            <thead>
              <tr>
                <th>Name</th>
                <th>ID</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Abra Nelle Barron</td>
                <td>0027</td>
                <td>wocyn@gmail.com</td>
                <td style={{ color: "green" }}>Active</td>
              </tr>
            </tbody>
          </table>
        </Box>
      </Content>
    </Page>
  );
}
