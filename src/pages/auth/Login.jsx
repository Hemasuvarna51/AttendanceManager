import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import styled from "styled-components";

const Hero = styled.div `
  max-width: 400px;
  margin: 80px auto;  
  padding: 24px;
  border: 1px solid #eee;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

  h2 {
  margin : 0 0 12px 0;}

  `
  
  const Label = styled.label `
  display: block;
  margin-top: 12px;
  `;

const SelectRole = styled.select `
  width: 100%;
  padding: 8px;
  margin-top: 6px;
  border-radius: 6px;
  border: 1px solid #ccc;
  `;

const LoginBtn = styled.button `
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #45a049;
  }
  `;

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
    <Hero >
      <h2>Login</h2>

      <Label>Select Role (demo)</Label>
      <SelectRole value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="employee">employee</option>
        <option value="admin">admin</option>
      </SelectRole>

      <LoginBtn onClick={handleFakeLogin} style={{ width: "100%", marginTop: 14, padding: 10 }}>
        Login
      </LoginBtn>
    </Hero>
  );
}
