import { NavLink } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import styled from "styled-components";

const NavBarLink = styled(NavLink)`
  display: block;
  padding: 10px 12px;
  text-decoration: none;
  border-radius: 8px;
  background: ${props => props.isActive ? "#f2f2f2" : "transparent"};
  color: #111;
  margin-bottom: 8px;
  &:hover {
    background: #f2f2f2;
  }
`;

const Aside = styled.aside `
  width: 220px;
  padding: 24px;
  border-right: 1px solid #ded5d5;

  div {
    font-weight: bold;
    margin-bottom: 16px;
        }
`;

export default function Sidebar() {
  const role = useAuthStore((s) => s.role);

  return (
    <Aside >
      <div>Menu</div>

      {role === "employee" && (
        <>
          <NavBarLink to="/employee/checkin" >Check In</NavBarLink>
          <NavBarLink to="/employee/checkout" >Check Out</NavBarLink>
          <NavBarLink to="/employee/enroll-face" >Enroll Face</NavBarLink>
          <NavBarLink to="/employee/my-attendance" >My Attendance</NavBarLink>
          <NavBarLink to="/employee/tasks" >My Tasks ✅</NavBarLink>
        </>
      )}


      {role === "admin" && (
        <>
          <NavLink to="/admin/dashboard" style={linkStyle}>
            Dashboard
          </NavLink>

          <NavLink to="/admin/tasks" style={linkStyle}>
            Tasks ✅
          </NavLink>

          <NavLink to="/admin/reports" style={linkStyle}>
            Reports
          </NavLink>
        </>
      )}
    </Aside>
  );
}
