import { useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ScrollToTop from "./components/ScrollToTop";

const NAV_H = 64;

const Shell = styled.div`
  min-height: 100vh;
  background: #f3f4f8;
`;

const ContentArea = styled.div`
  margin-left: ${({ $collapsed }) => ($collapsed ? "80px" : "200px")};
  padding-top: ${NAV_H}px;
  transition: margin-left 0.25s ease;

  @media (max-width: 979px) {
    margin-left: 0;
  }
`;

// ✅ THIS is the key: this must be the thing that scrolls
const Main = styled.main`
  height: calc(100vh - ${NAV_H}px);
  overflow-y: auto;
  padding: 18px 24px;
`;

export default function App() {
  const [collapsed, setCollapsed] = useState(true);
  const [hover, setHover] = useState(false);
  const sidebarExpand = !collapsed || hover;
  const [open, setOpen] = useState(false);

  const mainRef = useRef(null);

  return (
    <Shell>
      <Sidebar
        open={open}
        collapsed={collapsed}
        onClose={() => setOpen(false)}
        onHover={setHover}
      />

      <Navbar onMenu={() => setOpen(true)} collapsed={!sidebarExpand} />

      <ContentArea $collapsed={!sidebarExpand}>
        <Main ref={mainRef}>
          <ScrollToTop containerRef={mainRef} />
          <Outlet />
        </Main>
      </ContentArea>
    </Shell>
  );
}