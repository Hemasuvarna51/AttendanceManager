import React from "react";
import styled from "styled-components";


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

export default function AdminDashboard() {
  return (
    <Page>
      

      <Content>
       

        {/* STAT CARDS */}
        <CardGrid>
          <Card primary>
            <CardTitle>Total Employee</CardTitle>
            <CardValue>26</CardValue>
          </Card>

          <Card>
            <CardTitle>Total Presents</CardTitle>
            <CardValue>4</CardValue>
          </Card>

          <Card>
            <CardTitle>Total Absents</CardTitle>
            <CardValue>11</CardValue>
          </Card>

          <Card>
            <CardTitle>Total Leave</CardTitle>
            <CardValue>11</CardValue>
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
            <ul>
              <li>Maisha Lucy – Approved</li>
              <li>Zamora Peck – Rejected</li>
              <li>Amy Aphrodite – Approved</li>
            </ul>
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
