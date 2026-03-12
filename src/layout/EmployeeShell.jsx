import { useState } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const SIDEBAR_W = 200;
const SIDEBAR_COLLAPSED = 80;
const NAV_H = 64;
const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

const Shell = styled.div`
  min-height: 100vh;
  background: #f3f4f8;
  overflow-x: hidden;
`;

const ContentArea = styled.div`
  margin-left: ${({ $collapsed }) =>
    $collapsed ? `${SIDEBAR_COLLAPSED}px` : `${SIDEBAR_W}px`};
  padding-top: ${NAV_H}px;
  transition: margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 979px) {
    margin-left: 0;
  }
`;

const Main = styled.main`
  min-height: calc(100vh - ${NAV_H}px);
  padding: 18px 24px;
`;

export default function EmployeeShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleMenuClick = () => {
    if (window.innerWidth >= 980) {
      setCollapsed((prev) => !prev);
    } else {
      setSidebarOpen(true);
    }
  };

  return (
    <Shell>
      <Sidebar
        open={sidebarOpen}
        collapsed={collapsed}
        onClose={() => setSidebarOpen(false)}
      />

      <Navbar
        collapsed={collapsed}
        onMenu={handleMenuClick}
      />

      <ContentArea $collapsed={collapsed}>
        <Main>
          <Outlet />
        </Main>
      </ContentArea>
    </Shell>
  );
}