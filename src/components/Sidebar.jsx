import { NavLink, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../store/auth.store";
import styled from "styled-components";
import {
  LayoutDashboard,
  Users,
  CalendarCheck2,
  ClipboardCheck,
  LogOut,
  Calendar,
  FileText,
  Plane,
  ListTodo,
  Wallet,
  X,
} from "lucide-react";

const SIDEBAR_W = 200;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  transition: 0.2s ease;

  z-index: 6500; /* ✅ above navbar, below sidebar */
  @media (min-width: 980px) {
    display: none;
  }
`;

const Aside = styled.aside`
  width: ${({ $collapsed }) => ($collapsed ? "80px" : `${SIDEBAR_W}px`)};
  height: 100vh;
  padding: 16px 14px;
  color: #fff;
  background: #20315B;

  position: fixed;
  top: 0;
  left: 0;

  z-index: 7000; /* ✅ sidebar on top of navbar */

  transform: translateX(0);
  transition: transform 0.22s ease;
  will-change: transform;
  transition: width 0.2s ease;

  @media (max-width: 979px) {
    transform: translateX(${({ $open }) => ($open ? "0" : `-${SIDEBAR_W}px`)});
  }
`;
const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 10px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 12px;
  ${({ $collapsed }) => $collapsed && `justify-content: center;`}
`;

const Logo = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: rgba(15, 15, 15, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: grid;
  place-items: center;
  font-weight: 800;
`;

const BrandText = styled.div`
  line-height: 1.1;
  transition: opacity 0.2s ease, width 0.2s ease;
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  width: ${({ $collapsed }) => ($collapsed ? 0 : "auto")};

  div:first-child {
    font-weight: 700;
    font-size: 14px;
  }
  div:last-child {
    font-size: 12px;
    opacity: 0.7;
    margin-top: 3px;
  }
`;

const CloseBtn = styled.button`
  margin-left: auto;
  background: transparent;
  border: 0;
  color: rgba(255, 255, 255, 0.75);
  display: none;
  cursor: pointer;

  @media (max-width: 979px) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`;

const SectionLabel = styled.div`
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.6;
  padding: 10px 10px 6px;
  transition: opacity 0.2s ease, height 0.2s ease;
  ${({ $collapsed }) =>
    $collapsed &&
    `
    opacity: 0;
    height: 0;
    padding: 0;
    margin: 0;
    overflow: hidden;
  `}
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 4px 6px 10px;
  color: solid rgba(255, 255, 255, 0.92);
`;

const Item = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 12px;
  border-radius: 14px;
  color: rgba(255, 255, 255, 0.86);
  text-decoration: none;
  transition: padding 0.2s ease;

  svg {
    width: 18px;
    height: 18px;
    opacity: 0.9;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.07);
  }

  /* ✅ “pill active” like screenshot */
  &.active {
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
  }

  /* hide label when collapsed */
  ${({ $collapsed }) =>
    $collapsed &&
    `
    justify-content: center;
    gap: 0;
    padding: 12px 0;
    svg { margin: 0; }
  `}
`;

const Footer = styled.div`
  margin-top: auto;
  padding: 10px 6px 4px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  ${({ $collapsed }) =>
    $collapsed &&
    `
    padding: 10px 0 4px;
  `}
`;

const FooterBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 12px;
  border-radius: 14px;
  border: 0;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.92);

  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

// added collapsed prop to allow desktop collapse behaviour
export default function Sidebar({ open = false, collapsed = false, onClose = () => { } }) {
  const role = useAuthStore((s) => s.role);
  const logout = useAuthStore((s) => s.logout);

  const location = useLocation();

  /* ✅ Close sidebar on route change (mobile UX) */
  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      <Overlay $open={open} onClick={onClose} />
      <Aside $open={open} $collapsed={collapsed}>
        <Brand $collapsed={collapsed}>
          <Logo>GZ</Logo>
          <BrandText $collapsed={collapsed}>
            <div>Genzix</div>
            <div>My Company</div>
          </BrandText>

          <CloseBtn onClick={onClose} aria-label="Close sidebar">
            <X size={18} />
          </CloseBtn>
        </Brand>

        {role === "employee" && (
          <>
            <SectionLabel $collapsed={collapsed}>Employee</SectionLabel>
            <Nav>
              <Item $collapsed={collapsed} to="/employee/dashboard">
                <LayoutDashboard /> {!collapsed && "DashBoard"}
              </Item>
              <Item $collapsed={collapsed} to="/employee/my-profile">
                <ClipboardCheck /> {!collapsed && "My Profile"}
              </Item>
              <Item $collapsed={collapsed} to="/employee/leave">
                <Plane /> {!collapsed && "Leave Request"}
              </Item>
              <Item $collapsed={collapsed} to="/employee/my-attendance">
                <FileText /> {!collapsed && "My Attendance"}
              </Item>
              <Item $collapsed={collapsed} to="/employee/my-payroll">
                <Wallet /> {!collapsed && "Payroll"}
              </Item>
              <Item $collapsed={collapsed} to="/employee/tasks">
                <ListTodo /> {!collapsed && "My Tasks"}
              </Item>
              <Item $collapsed={collapsed} to="/employee/my-meetings">
                <Calendar /> {!collapsed && "My Meetings"}
              </Item>
            </Nav>
          </>
        )}

        {role === "admin" && (
          <>
            <SectionLabel $collapsed={collapsed}>Admin</SectionLabel>
            <Nav>
              <Item $collapsed={collapsed} to="/admin/dashboard">
                <LayoutDashboard /> {!collapsed && "Dashboard"}
              </Item>
              <Item $collapsed={collapsed} to="/admin/employees">
                <Users /> {!collapsed && "Employees"}
              </Item>
              <Item $collapsed={collapsed} to="/admin/leave-approval">
                <CalendarCheck2 /> {!collapsed && "Leave Approval"}
              </Item>
              <Item $collapsed={collapsed} to="/admin/tasks">
                <ListTodo /> {!collapsed && "All Tasks"}
              </Item>
              <Item $collapsed={collapsed} to="/admin/payroll">
                <FileText /> {!collapsed && "Payroll"}
              </Item>
              <Item $collapsed={collapsed} to="/admin/meetings">
                <Calendar /> {!collapsed && "Meetings"}
              </Item>
              <Item $collapsed={collapsed} to="/admin/reports">
                <FileText /> {!collapsed && "Reports"}
              </Item>
            </Nav>
          </>
        )}

        <Footer $collapsed={collapsed}>
          <FooterBtn
            onClick={() => {
              onClose();
              logout?.();
            }}
          >
            <LogOut /> {!collapsed && "Logout"}
          </FooterBtn>
        </Footer>
      </Aside>
    </>
  );
}