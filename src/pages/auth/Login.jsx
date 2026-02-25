import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import styled from "styled-components";

const LoginCard = styled.div`
  max-width: 400px;
  margin: 80px auto;
  padding: 24px;
  border: 1px solid #eee;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const LoginBtn = styled.button`
  width: 100%;
  margin-top: 18px;
  padding: 12px;
  font-size: 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: #4caf50;
  color: #fff;
`;

export default function Login({ panel = "employee" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const from = location.state?.from?.pathname;

  const handleLogin = () => {
    if (!username || !password) {
      alert("Enter credentials");
      return;
    }

    const registeredUsers =
      JSON.parse(localStorage.getItem("registered_users")) || [];

    const adminUser = {
      email: "admin@gmail.com",
      password: "admin123",
      role: "admin",
    };

    const allUsers = [...registeredUsers, adminUser];

    const inputEmail = username.trim().toLowerCase();
    const inputPass = password;

    const found = allUsers.find(
      (u) => u.email === inputEmail && u.password === inputPass
    );

    if (!found) {
      alert("Invalid credentials");
      return;
    }

    if (found.role !== panel) {
      alert(`You are not allowed to login as ${panel}`);
      navigate(found.role === "admin" ? "/admin/login" : "/employee/login", {
        replace: true,
      });
      return;
    }

    login({
      user: { email: found.email, username: found.username || "", name: found.name || "" },
      token: "demo-token",
      role: found.role,
    });

    navigate(
      found.role === "admin"
        ? "/admin/dashboard"
        : "/employee/dashboard",
      { replace: true }
    );
  };

  return (
    <LoginCard>
      <h2>{panel === "admin" ? "Admin Login" : "Employee Login"}</h2>

      <Input
        type="email"
        placeholder="Email"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <LoginBtn onClick={handleLogin}>Login</LoginBtn>

      {panel === "employee" && (
        <p style={{ marginTop: 16 }}>
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      )}
    </LoginCard>
  );
}