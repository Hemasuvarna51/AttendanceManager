import { NavLink } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

const linkStyle = ({ isActive }) => ({
  display: "block",
  padding: "10px 12px",
  textDecoration: "none",
  borderRadius: 8,
  background: isActive ? "#f2f2f2" : "transparent",
  color: "#111",
});

export default function Sidebar() {
  const role = useAuthStore((s) => s.role);

  return (
    <aside style={{ width: 220, padding: 12, borderRight: "1px solid #eee" }}>
      <div style={{ fontWeight: 700, marginBottom: 12 }}>Menu</div>

      {role === "employee" && (
        <>
          <NavLink to="/employee/checkin" style={linkStyle}>Check In</NavLink>
          <NavLink to="/employee/checkout" style={linkStyle}>Check Out</NavLink>
          <NavLink to="/employee/enroll-face" style={linkStyle}>Enroll Face</NavLink>
          <NavLink to="/employee/my-attendance" style={linkStyle}>My Attendance</NavLink>
          <NavLink to="/employee/tasks" style={linkStyle}>My Tasks ✅</NavLink>
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
    </aside>
  );
}
