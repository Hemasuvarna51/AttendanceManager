import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";

export default function Login() {
  const [role, setRole] = useState("employee");
  const setAuth = useAuthStore((s) => s.setAuth);
  const nav = useNavigate();

  const onLogin = (e) => {
    e.preventDefault();

    // TEMP mock login (we’ll connect backend next)
    setAuth({
      user: { name: "Hema" },
      token: "mock-token",
      role,
    });

    nav(role === "admin" ? "/admin" : "/employee/check-in");
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Login</h2>

      <form onSubmit={onLogin} style={{ display: "grid", gap: 12, maxWidth: 320 }}>
        <label>
          Role (mock):
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="employee">employee</option>
            <option value="admin">admin</option>
          </select>
        </label>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
