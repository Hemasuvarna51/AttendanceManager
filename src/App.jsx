import { useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ScrollToTop from "./components/ScrollToTop";

const NAV_H = 64;
const SIDEBAR_W = 200;
const SIDEBAR_COLLAPSED = 80;

const Shell = styled.div`
  min-height: 100vh;
  background: #f3f4f8;
`;

const ContentArea = styled.div`
  margin-left: ${({ $collapsed, $sidebarHover }) =>
    $collapsed && !$sidebarHover
      ? `${SIDEBAR_COLLAPSED}px`
      : `${SIDEBAR_W}px`};
  padding-top: ${NAV_H}px;
  transition: margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 979px) {
    margin-left: 0;
  }
`;

const Main = styled.main`
  height: calc(100vh - ${NAV_H}px);
  overflow-y: auto;
  padding: 18px 24px;
`;

export default function App() {
  const [collapsed, setCollapsed] = useState(false); // expanded by default
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);

  const mainRef = useRef(null);

  const handleMenuClick = () => {
    if (window.innerWidth <= 979) {
      setOpen(true);
      return;
    }

    setCollapsed((prev) => !prev);
  };

  return (
    <Shell>
      <Sidebar
        open={open}
        collapsed={collapsed}
        onClose={() => setOpen(false)}
        
      />

      <Navbar
        onMenu={handleMenuClick}
        collapsed={collapsed}
        sidebarHover={hover}
      />

      <ContentArea $collapsed={collapsed} $sidebarHover={hover}>
        <Main ref={mainRef}>
          <ScrollToTop containerRef={mainRef} />
          <Outlet />
        </Main>
      </ContentArea>
    </Shell>
  );
}