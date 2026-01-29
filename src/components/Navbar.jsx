import { useAuthStore } from "../store/auth.store";
import styled from "styled-components";

const Header = styled.header `

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  border-bottom: 1px solid #eee;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-radius: 0 0 12px 12px;
`;

const Title = styled.h1 `
  font-size: 20px;
  margin: 0;
`;
const Div = styled.div `

  display: flex;
  align-items: center;
  gap: 16px;
`;

const Role = styled.span `
  font-size: 14px;
  color: #555;
`;

const LogoutBtn = styled.button `

  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background-color: #e74c3c;
  color: white;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background-color: #c0392b;
  }
`;


export default function Navbar() {
  const logout = useAuthStore((s) => s.logout);
  const role = useAuthStore((s) => s.role);

  return (
    <Header>
      <Title>Attendance System</Title>
      <Div>
        <Role>Role: {role || "-"}</Role>
        <LogoutBtn onClick={logout}>Logout</LogoutBtn>
      </Div>
    </Header>
  );
}
