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
const SIDEBAR_COLLAPSED = 80;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  transition: 0.2s ease;
  z-index: 6500;

  @media (min-width: 980px) {
    display: none;
  }
`;

const Aside = styled.aside`
  width: ${({ $collapsed }) =>
    $collapsed ? `${SIDEBAR_COLLAPSED}px` : `${SIDEBAR_W}px`};
  height: 100vh;
  padding: ${({ $collapsed }) => ($collapsed ? "16px 10px" : "16px 14px")};
  color: #fff;
  background: #20315b;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 7000;
  display: flex;
  flex-direction: column;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    padding 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 979px) {
    width: ${SIDEBAR_W}px;
    padding: 16px 14px;
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
  justify-content: ${({ $collapsed }) =>
    $collapsed ? "center" : "flex-start"};
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
  flex-shrink: 0;
`;

const BrandText = styled.div`
  line-height: 1.1;
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  width: ${({ $collapsed }) => ($collapsed ? "0" : "auto")};
  overflow: hidden;
  transition: opacity 0.2s ease, width 0.2s ease;

  div:first-child {
    font-weight: 700;
    font-size: 14px;
    white-space: nowrap;
  }

  div:last-child {
    font-size: 12px;
    opacity: 0.7;
    margin-top: 3px;
    white-space: nowrap;
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
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 0.6)};
  height: ${({ $collapsed }) => ($collapsed ? "0" : "auto")};
  padding: ${({ $collapsed }) => ($collapsed ? "0" : "10px 10px 6px")};
  overflow: hidden;
  transition: opacity 0.2s ease, height 0.2s ease, padding 0.2s ease;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 4px 6px 10px;
  color: rgba(255, 255, 255, 0.92);
`;

const Item = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ $collapsed }) => ($collapsed ? "0" : "12px")};
  justify-content: ${({ $collapsed }) =>
    $collapsed ? "center" : "flex-start"};
  padding: 12px;
  border-radius: 14px;
  color: rgba(255, 255, 255, 0.86);
  text-decoration: none;
  transition: background 0.2s ease, gap 0.2s ease;

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  span {
    display: ${({ $collapsed }) => ($collapsed ? "none" : "inline")};
    white-space: nowrap;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.07);
  }

  &.active {
    background: rgba(255, 255, 255, 0.12);
  }
`;

const Footer = styled.div`
  margin-top: auto;
  padding: ${({ $collapsed }) => ($collapsed ? "10px 0 4px" : "10px 6px 4px")};
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const FooterBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) =>
    $collapsed ? "center" : "flex-start"};
  gap: ${({ $collapsed }) => ($collapsed ? "0" : "12px")};
  padding: 12px;
  border-radius: 14px;
  border: 0;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.92);
  transition: background 0.2s ease, gap 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  span {
    display: ${({ $collapsed }) => ($collapsed ? "none" : "inline")};
    white-space: nowrap;
  }
`;

export default function Sidebar({
  open = false,
  collapsed = false,
  onClose = () => {},
}) {
  const role = useAuthStore((s) => s.role);
  const logout = useAuthStore((s) => s.logout);
  const location = useLocation();

  const isDesktop = window.innerWidth > 979;
  const isCollapsed = isDesktop ? collapsed : false;

  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      <Overlay $open={open} onClick={onClose} />

      <Aside $open={open} $collapsed={isCollapsed}>
        <Brand $collapsed={isCollapsed}>
          <Logo>GZ</Logo>

          <BrandText $collapsed={isCollapsed}>
            <div>Genzix</div>
            <div>My Company</div>
          </BrandText>

          <CloseBtn onClick={onClose} aria-label="Close sidebar">
            <X size={18} />
          </CloseBtn>
        </Brand>

        {role === "employee" && (
          <>
            <SectionLabel $collapsed={isCollapsed}>Employee</SectionLabel>
            <Nav>
              <Item $collapsed={isCollapsed} to="/employee/dashboard">
                <LayoutDashboard />
                <span>Dashboard</span>
              </Item>

              <Item $collapsed={isCollapsed} to="/employee/my-profile">
                <ClipboardCheck />
                <span>My Profile</span>
              </Item>

              <Item $collapsed={isCollapsed} to="/employee/leave">
                <Plane />
                <span>Leave Request</span>
              </Item>

              <Item $collapsed={isCollapsed} to="/employee/my-attendance">
                <FileText />
                <span>My Attendance</span>
              </Item>

              <Item $collapsed={isCollapsed} to="/employee/my-payroll">
                <Wallet />
                <span>Payroll</span>
              </Item>

              <Item $collapsed={isCollapsed} to="/employee/tasks">
                <ListTodo />
                <span>My Tasks</span>
              </Item>

              <Item $collapsed={isCollapsed} to="/employee/my-meetings">
                <Calendar />
                <span>My Meetings</span>
              </Item>
            </Nav>
          </>
        )}

        {role === "admin" && (
          <>
            <SectionLabel $collapsed={isCollapsed}>Admin</SectionLabel>
            <Nav>
              <Item $collapsed={isCollapsed} to="/admin/dashboard">
                <LayoutDashboard />
                <span>Dashboard</span>
              </Item>

              <Item $collapsed={isCollapsed} to="/admin/employees">
                <Users />
                <span>Employees</span>
              </Item>

              <Item $collapsed={isCollapsed} to="/admin/leave-approval">
                <CalendarCheck2 />
                <span>Leave Approval</span>
              </Item>

              <Item $collapsed={isCollapsed} to="/admin/tasks">
                <ListTodo />
                <span>All Tasks</span>
              </Item>

              <Item $collapsed={isCollapsed} to="/admin/payroll">
                <FileText />
                <span>Payroll</span>
              </Item>

              <Item $collapsed={isCollapsed} to="/admin/meetings">
                <Calendar />
                <span>Meetings</span>
              </Item>

              <Item $collapsed={isCollapsed} to="/admin/reports">
                <FileText />
                <span>Reports</span>
              </Item>
            </Nav>
          </>
        )}

        <Footer $collapsed={isCollapsed}>
          <FooterBtn
            $collapsed={isCollapsed}
            onClick={() => {
              onClose();
              logout?.();
            }}
          >
            <LogOut />
            <span>Logout</span>
          </FooterBtn>
        </Footer>
      </Aside>
    </>
  );
}