import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [role, setRole] = useState("employee");

  const handleFakeLogin = () => {
    // For now, fake login so frontend is testable without backend
    login({
      user: { name: "Demo User" },
      token: "demo-token",
      role,
    });

    navigate(role === "admin" ? "/admin/dashboard" : "/employee/checkin");
  };

  return (
    <div style={{ maxWidth: 420, margin: "80px auto", padding: 16, border: "1px solid #eee", borderRadius: 12 }}>
      <h2>Login</h2>

      <label style={{ display: "block", marginTop: 12 }}>Select Role (demo)</label>
      <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 6 }}>
        <option value="employee">employee</option>
        <option value="admin">admin</option>
      </select>

      <button onClick={handleFakeLogin} style={{ width: "100%", marginTop: 14, padding: 10 }}>
        Login
      </button>
    </div>
  );
}
