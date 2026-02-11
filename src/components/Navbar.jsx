import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import { useAuthStore } from "../store/auth.store";
import { Bell, Globe, Menu, ChevronDown, User, LogOut } from "lucide-react";
import { getAttendanceState } from "../utils/attendanceLocalDb";
import { useLocation, useNavigate } from "react-router-dom";

/* ===================== HELPERS ===================== */

const formatHMS = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
};

/* ===================== STYLES ===================== */

const Header = styled.header`
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  padding: 0 18px;
  justify-content: space-between;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
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
    display: none;
  }
`;

const Brand = styled.div`
  font-weight: 600;
  color: #222;
`;

const Timer = styled.div`
  border: 1px solid #b9e6c7;
  color: #1a9b4a;
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;

  @media (max-width: 560px) {
    display: none;
  }
`;

const CheckBtn = styled.button`
  height: 42px;
  padding: 0 22px;
  border-radius: 6px;
  border: 1px solid ${({ $out }) => ($out ? "#ef4444" : "#16a34a")};
  background: ${({ $out }) => ($out ? "#ef4444" : "#22c55e")};
  color: #fff;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    filter: brightness(0.95);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 560px) {
    display: none;
  }
`;

const IconBtn = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1px solid #eee;
  background: #fff;
  cursor: pointer;
  position: relative;
`;

const Badge = styled.span`
  position: absolute;
  right: 6px;
  top: 6px;
  background: #ff4d4f;
  color: #fff;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 999px;
`;

/* ===== Profile dropdown styles ===== */

const ProfileWrap = styled.div`
  position: relative;
  padding-left: 16px;
  border-left: 1px solid #eee;
`;


const ProfileBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 12px;

  &:hover {
    background: #f6f6f6;
  }
`;

const Avatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #eaeaea;
`;

const NameRole = styled.div`
  line-height: 1.1;

  .name {
    font-size: 14px;
    font-weight: 600;
  }
  .role {
    font-size: 12px;
    color: #666;
    text-transform: capitalize;
  }

  @media (max-width: 720px) {
    display: none;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  width: 220px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #eef2f7;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
  padding: 8px;
  z-index: 100;

  transform-origin: top right;
  animation: popIn 140ms ease-out forwards;

  @keyframes popIn {
    from { opacity: 0; transform: translateY(-6px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  
`;




const DropItem = styled.button`
  width: 100%;
  border: 0;
  border-radius: 12px;
  padding: 12px 14px;
  background: ${({ $danger }) => ($danger ? "#fff1f2" : "#ffffff")};
  color: ${({ $danger }) => ($danger ? "#dc2626" : "#111827")};
  cursor: pointer;

  display: flex;
  align-items: center;
  gap: 12px;

  font-weight: 600;
  font-size: 14px;
  line-height: 1;
  transition: background 0.15s ease;

  svg {
    width: 18px;
    height: 18px;
    opacity: ${({ $danger }) => ($danger ? 1 : 0.75)};
  }

  &:hover {
    background: ${({ $danger }) => ($danger ? "#ffe4e6" : "#f3f4f6")};
  }
`;



const Divider = styled.div`
  height: 1px;
  background: #e9eef5;
  margin: 8px 10px;
  border-radius: 999px;
`;





/* ===================== COMPONENT ===================== */

export default function Navbar({ onMenu = () => {}, notificationCount = 4 }) {
  const logoutAction = useAuthStore((s) => s.logout);
  const role = useAuthStore((s) => s.role);
  const user = useAuthStore((s) => s.user);

  const isEmployee = role === "employee";
  const isAdmin = role === "admin";

  const userName = useMemo(() => user?.name || "Hema Suvarna", [user]);

  const navigate = useNavigate();
  const location = useLocation();

  const CHECKIN = "/employee/checkin";
  const CHECKOUT = "/employee/checkout";

  // attendance state
  const [att, setAtt] = useState(() => getAttendanceState());

  // live timer string
  const [timer, setTimer] = useState("00:00:00");

  // profile dropdown state
  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef(null);

  // keep att updated (same tab + other tabs)
  useEffect(() => {
    const refresh = () => setAtt(getAttendanceState());

    window.addEventListener("storage", refresh);
    window.addEventListener("attendance_updated", refresh);

    refresh();

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("attendance_updated", refresh);
    };
  }, []);

  // live timer updates
  useEffect(() => {
    if (!att.checkedIn || !att.checkInTime) {
      setTimer("00:00:00");
      return;
    }

    const start = new Date(att.checkInTime).getTime();
    const tick = () => setTimer(formatHMS(Date.now() - start));
    tick();

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [att.checkedIn, att.checkInTime]);

  const disabled =
    (att.checkedIn && location.pathname === CHECKOUT) ||
    (!att.checkedIn && location.pathname === CHECKIN);

  const closeProfile = useCallback(() => setOpenProfile(false), []);

  // click outside to close
  useEffect(() => {
    const onDocClick = (e) => {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(e.target)) closeProfile();
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [closeProfile]);

  // Esc to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeProfile();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeProfile]);

  const doLogout = () => {
    closeProfile();
    logoutAction();
    navigate("/login", { replace: true });
  };

  return (
    <Header>
      <Left>
        <MenuBtn onClick={onMenu} aria-label="Open menu">
          <Menu size={18} />
        </MenuBtn>
        <Brand>{isAdmin ? "Admin Panel" : "Employee Portal"}</Brand>
      </Left>

      <Right>
        {/* ✅ show timer only when employee is checked in */}
        {isEmployee && att.checkedIn && <Timer>⏱ {timer}</Timer>}

        {/* ✅ Check-In / Check-Out button */}
        {isEmployee && (
          <CheckBtn
            $out={att.checkedIn}
            disabled={disabled}
            onClick={() => navigate(att.checkedIn ? CHECKOUT : CHECKIN)}
          >
            {att.checkedIn ? "Check-Out" : "Check-In"}
          </CheckBtn>
        )}

        {/* ✅ Admin notifications */}
        {isAdmin && (
          <IconBtn aria-label="Notifications">
            <Bell size={18} />
            {notificationCount > 0 && <Badge>{notificationCount}</Badge>}
          </IconBtn>
        )}

        {/* ✅ common language icon */}
        <IconBtn aria-label="Language">
          <Globe size={18} />
        </IconBtn>

        {/* ✅ Profile dropdown */}
        <ProfileWrap ref={profileRef}>
          <ProfileBtn
            type="button"
            onClick={() => setOpenProfile((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={openProfile}
          >
            <Avatar />
            <NameRole>
              <div className="name">{userName}</div>
              <div className="role">{role}</div>
            </NameRole>
            <ChevronDown size={16} />
          </ProfileBtn>

          {openProfile && (
            <Dropdown role="menu">
              <DropItem
                role="menuitem"
                onClick={() => {
                  closeProfile();
                  navigate("/profile");
                }}
              >
                <User size={16} />
                My Profile
              </DropItem>

              <Divider />

              <DropItem role="menuitem" $danger onClick={doLogout}>
                <LogOut size={16} />
                Logout
              </DropItem>
            </Dropdown>
          )}
        </ProfileWrap>
        
      </Right>
    </Header>
  );
}
