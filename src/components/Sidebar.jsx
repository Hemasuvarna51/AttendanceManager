import { NavLink } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import styled from "styled-components";
import {
  LayoutDashboard,
  Users,
  CalendarCheck2,
  ClipboardCheck,
  LogOut,
  FileText,
  Plane,
  ListTodo,
  X,
} from "lucide-react";

const SIDEBAR_W = 260;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(178, 173, 173, 0.45);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  transition: 0.2s ease;
  z-index: 40;

  @media (min-width: 980px) {
    display: none;
  }
`;

const Aside = styled.aside`
  width: ${SIDEBAR_W}px;
  background: linear-gradient(180deg, #77809f 0%, #141414 100%);
  color: #fff;
  height: 100vh;
  padding: 16px 14px;
  position: sticky;
  top: 0;
  z-index: 50;

  @media (max-width: 979px) {
    position: fixed;
    left: 0;
    top: 0;
    transform: translateX(${({ $open }) => ($open ? "0" : `-${SIDEBAR_W}px`)});
    transition: 0.22s ease;
    box-shadow: 10px 0 30px rgba(0, 0, 0, 0.35);
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 10px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 12px;
`;

const Logo = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: #0f0f0f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: grid;
  place-items: center;
  font-weight: 800;
`;

const BrandText = styled.div`
  line-height: 1.1;

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
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 4px 6px 10px;
`;

const Item = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 12px;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.86);
  text-decoration: none;

  svg {
    width: 18px;
    height: 18px;
    opacity: 0.9;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  &.active {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
`;

// Optional footer (like “logout” area)
const Footer = styled.div`
  margin-top: auto;
  padding: 10px 6px 4px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const FooterBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 12px;
  border-radius: 12px;
  border: 0;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.9);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export default function Sidebar({ open = false, onClose = () => {} }) {
  const role = useAuthStore((s) => s.role);
  const logout = useAuthStore((s) => s.logout); // only if you have logout

  return (
    <>
      <Overlay $open={open} onClick={onClose} />

      <Aside $open={open}>
        <Brand>
          <Logo>GZ</Logo>
          <BrandText>
            <div>Genzix</div>
            <div>My Company</div>
          </BrandText>

          <CloseBtn onClick={onClose} aria-label="Close sidebar">
            <X size={18} />
          </CloseBtn>
        </Brand>

        {role === "employee" && (
          <>
            <SectionLabel>Employee</SectionLabel>
            <Nav>
              <Item to="/employee/dashboard">
                <LayoutDashboard /> DashBoard
              </Item>
              <Item to="/employee/my-profile">
                <ClipboardCheck /> My Profile
              </Item>
              <Item to="/employee/leave">
                <Plane /> Leave Request
              </Item>
              <Item to="/employee/my-attendance">
                <FileText /> My Attendance
              </Item>
              <Item to="/employee/tasks">
                <ListTodo /> My Tasks
              </Item>
            </Nav>
          </>
        )}

        {role === "admin" && (
          <>
            <SectionLabel>Admin</SectionLabel>
            <Nav>
              <Item to="/admin/dashboard">
                <LayoutDashboard /> Dashboard
              </Item>
              <Item to="/admin/employees">
                <Users /> Employees
              </Item>
              <Item to="/admin/attendance">
                <CalendarCheck2 /> Attendance
              </Item>
              <Item to="/admin/tasks">
                <ListTodo /> Tasks
              </Item>
              <Item to="/admin/reports">
                <FileText /> Reports
              </Item>
            </Nav>
          </>
        )}

        <Footer>
          <FooterBtn onClick={() => logout && logout()}>
            <LogOut /> Logout
          </FooterBtn>
        </Footer>
      </Aside>
    </>
  );
}
