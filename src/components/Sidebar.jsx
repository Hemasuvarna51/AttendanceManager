import { NavLink } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import styled from "styled-components";

const NavBarLink = styled(NavLink)`
  display: block;
  padding: 10px 12px;
  text-decoration: none;
  border-radius: 8px;
  color: #111;
  margin-bottom: 8px;

  &:hover {
    background: #e2c077;
  }

  &.active {
    background: #f4e1e1;
    font-weight: 700;
  }
`;

const Aside = styled.aside`
  width: 220px;
  padding: 24px;
  border-right: 1px solid #ded5d5;
  background-color: #f6f6f5;
  border-radius: 0 12px 12px 0;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);

  div {
    font-weight: bold;
    margin-bottom: 16px;
    border: 2px solid #f1941b;
    padding: 8px;
    border-radius: 8px;
    text-align: center;
  }
`;

export default function Sidebar() {
  const role = useAuthStore((s) => s.role);

  return (
    <Aside>
      <div>Menu</div>

      {role === "employee" && (
        <>
          <NavBarLink to="/employee/checkin">Check In</NavBarLink>
          <NavBarLink to="/employee/checkout">Check Out</NavBarLink>
          <NavBarLink to="/employee/enroll-face">Enroll Face</NavBarLink>
          <NavBarLink to="/employee/my-attendance">My Attendance</NavBarLink>
          <NavBarLink to="/employee/tasks">My Tasks ✅</NavBarLink>
        </>
      )}

      {role === "admin" && (
        <>
          <NavBarLink to="/admin/dashboard">Dashboard</NavBarLink>
          <NavBarLink to="/admin/employees">Employees</NavBarLink>
          <NavBarLink to="/admin/attendance">Attendance</NavBarLink>
          <NavBarLink to="/admin/tasks">Tasks ✅</NavBarLink>
          <NavBarLink to="/admin/reports">Reports</NavBarLink>
        </>
      )}
    </Aside>
  );
}
