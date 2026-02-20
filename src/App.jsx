import { useState } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const SIDEBAR_W = 200;

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
`;

const ContentArea = styled.div`
  flex: 1;
  margin-left: ${SIDEBAR_W}px;   /* 👈 THIS IS THE FIX */

  @media (max-width: 979px) {
    margin-left: 0;
  }
`;

const Main = styled.main`
  padding: 10px 24px;
`;

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Layout>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <ContentArea>
        <Navbar
          title="Horilla"
          onMenu={() => setSidebarOpen(true)}
          notificationCount={4}
        />

        <Main>
          <Outlet />
        </Main>
      </ContentArea>
    </Layout>
  );
}