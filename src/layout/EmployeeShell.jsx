import { useState } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const SIDEBAR_W = 200;
const NAV_H = 64;

const Shell = styled.div`
  min-height: 100vh;
  background: #f3f4f8;
`;

const ContentArea = styled.div`
  margin-left: ${SIDEBAR_W}px;
  padding-top: ${NAV_H}px;

  @media (max-width: 979px) {
    margin-left: 0;
  }
`;

const Main = styled.main`
  padding: 18px 24px;
`;

export default function EmployeeShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Shell>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Navbar onMenu={() => setSidebarOpen(true)} />

      <ContentArea>
        <Main>
          <Outlet />
        </Main>
      </ContentArea>
    </Shell>
  );
}