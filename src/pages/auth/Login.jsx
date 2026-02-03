import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  h2 {
    margin-bottom: 16px;
  }
`;

const Label = styled.label`
  display: block;
  margin-top: 12px;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 6px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-top: 6px;
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

  &:hover {
    background: #43a047;
  }
`;

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");

  const handleLogin = () => {
    if (!username || !password) {
      alert("Credentials required");
      return;
    }

    login({
      user: { name: username },
      token: "demo-token",
      role,
    });

    navigate("/", { replace: true });

  };

  return (
    <LoginCard>
      <h2>Login</h2>

      <Input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Label>Select Role (Demo)</Label>
      <Select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="employee">Employee</option>
        <option value="admin">Admin</option>
      </Select>

      <LoginBtn type="button" onClick={handleLogin}>Login</LoginBtn>
    </LoginCard>
  );
}
