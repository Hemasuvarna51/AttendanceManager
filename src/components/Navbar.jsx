import { useAuthStore } from "../store/auth.store";

export default function Navbar() {
  const logout = useAuthStore((s) => s.logout);
  const role = useAuthStore((s) => s.role);

  return (
    <header style={{ padding: 12, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between" }}>
      <b>Attendance System</b>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ fontSize: 14 }}>Role: {role || "-"}</span>
        <button onClick={logout}>Logout</button>
      </div>
    </header>
  );
}
