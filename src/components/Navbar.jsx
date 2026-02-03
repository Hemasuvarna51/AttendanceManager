import { useMemo, useState } from "react";
import styled from "styled-components";
import { useAuthStore } from "../store/auth.store";
import { Bell, Globe, Menu, ChevronDown } from "lucide-react";

const Header = styled.header`
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

const MenuBtn = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid #eee;
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  @media (min-width: 980px) {
    display: none; /* hide hamburger on desktop */
  }
`;

const Brand = styled.div`
  font-weight: 600;
  color: #222;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Timer = styled.div`
  border: 1px solid #b9e6c7;
  color: #1a9b4a;
  padding: 10px 12px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  min-width: 110px;
  display: flex;
  justify-content: center;

  @media (max-width: 560px) {
    display: none; /* keep clean on mobile */
  }
`;

const IconBtn = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1px solid #eee;
  background: #fff;
  position: relative;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #fafafa;
  }
`;

const Badge = styled.span`
  position: absolute;
  right: 8px;
  top: 8px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: #ff4d4f;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: grid;
  place-items: center;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 12px;
  border-left: 1px solid #eee;
`;

const Avatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: #eaeaea;
`;

const NameRole = styled.div`
  line-height: 1.1;

  .name {
    font-size: 14px;
    font-weight: 600;
    color: #222;
  }
  .role {
    font-size: 12px;
    color: #666;
    margin-top: 2px;
    text-transform: capitalize;
  }

  @media (max-width: 720px) {
    display: none; /* hide name on smaller screens */
  }
`;

const LogoutBtn = styled.button`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #eee;
  background: #fff;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: #fafafa;
  }

  @media (max-width: 560px) {
    display: none;
  }
`;

export default function Navbar({
  title = "Horilla",
  onMenu = () => {},
  notificationCount = 4,
}) {
  const logout = useAuthStore((s) => s.logout);
  const role = useAuthStore((s) => s.role);

  // Replace this with your real user name if you have it in store
  const userName = useMemo(() => "Hema Suvarna", []);

  // optional: timer display demo
  const [time] = useState("00:00:01");

  return (
    <Header>
      <Left>
        <MenuBtn onClick={onMenu} aria-label="Open sidebar">
          <Menu size={18} />
        </MenuBtn>
        <Brand>{title}</Brand>
      </Left>

      <Right>
        <Timer>⏱ {time}</Timer>

    

        <IconBtn aria-label="Language">
          <Globe size={18} />
        </IconBtn>

        <Profile>
          <Avatar />
          <NameRole>
            <div className="name">{userName}</div>
            <div className="role">{role || "-"}</div>
          </NameRole>
          <ChevronDown size={16} />
        </Profile>

        <LogoutBtn onClick={logout}>Logout</LogoutBtn>
      </Right>
    </Header>
  );
}
