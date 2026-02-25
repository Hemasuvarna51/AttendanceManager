import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import { useAuthStore } from "../store/auth.store";
import {
  Bell,
  Globe,
  Menu,
  ChevronDown,
  User,
  LogOut,
  Check,
  Trash2,
} from "lucide-react";
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





const SIDEBAR_W = 200;

const Header = styled.header`
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  

  padding-left: calc(24px + ${SIDEBAR_W}px);

  z-index: 3000; /* ✅ lower than sidebar */

  @media (max-width: 979px) {
    padding-left: 24px;
  }
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
`;

const MenuBtn = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 1px solid #eee;
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: #f6f6f6;
  }

  @media (min-width: 980px) {
    display: none;
  }
`;

const Brand = styled.div`
  font-weight: 700;
  color: #111;
  font-size: 18px;
  margin-left: 20px;
`;

const Timer = styled.div`
  border: 1px solid #b9e6c7;
  color: #1a9b4a;
  padding: 8px 12px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 13px;

  @media (max-width: 560px) {
    display: none;
  }
`;

const CheckBtn = styled.button`
  height: 42px;
  padding: 0 18px;
  border-radius: 12px;
  border: 1px solid ${({ $out }) => ($out ? "#ef4444" : "#16a34a")};
  background: ${({ $out }) => ($out ? "#ef4444" : "#22c55e")};
  color: #fff;
  font-weight: 700;
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

const IconWrap = styled.div`
  position: relative;
`;

const IconBtn = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 1px solid #eee;
  background: #fff;
  cursor: pointer;
  position: relative;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f6f6f6;
  }
`;

const Dot = styled.span`
  position: absolute;
  right: 9px;
  top: 9px;
  width: 9px;
  height: 9px;
  background: #ff3b30;
  border-radius: 999px;
  box-shadow: 0 0 0 2px #fff;
`;

/* ===== Profile dropdown styles ===== */

const ProfileWrap = styled.div`
  position: relative;
  padding-left: 14px;
  border-left: 1px solid #eee;
`;

const ProfileBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 14px;

  &:hover {
    background: #f6f6f6;
  }
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
    font-weight: 700;
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
  top: calc(100% + 8px);
  right: 0;
  width: 220px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #eef2f7;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
  padding: 8px;
  z-index: 3000;

  transform-origin: top right;
  animation: popIn 140ms ease-out forwards;

  @keyframes popIn {
    from {
      opacity: 0;
      transform: translateY(-6px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
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

  font-weight: 700;
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

/* ===== Notification Dropdown Styles ===== */

const NotificationDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 360px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #eef2f7;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
  z-index: 3000;
  max-height: 400px;
  overflow-y: auto;

  transform-origin: top right;
  animation: popIn 140ms ease-out forwards;

  @keyframes popIn {
    from {
      opacity: 0;
      transform: translateY(-6px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const NotificationHeader = styled.div`
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  font-weight: 700;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ClearBtn = styled.button`
  background: transparent;
  border: none;
  color: #256aeb;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;

  &:hover {
    opacity: 0.7;
  }
`;

const NotificationItem = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
  display: flex;
  gap: 10px;
  align-items: flex-start;

  &:hover {
    background: #f9f9f9;
  }
`;

const NotifContent = styled.div`
  flex: 1;
`;

const NotifTitle = styled.div`
  font-weight: 700;
  font-size: 13px;
  color: #222;
`;

const NotifMessage = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 4px;
`;

const NotifTime = styled.div`
  font-size: 11px;
  color: #999;
  margin-top: 4px;
`;

const RemoveNotifBtn = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: #ccc;
  padding: 0;
  display: flex;
  align-items: center;

  &:hover {
    color: #ef4444;
  }
`;

const EmptyNotif = styled.div`
  padding: 24px 16px;
  text-align: center;
  color: #999;
  font-size: 13px;
`;

/* ===== Language Dropdown Styles ===== */

const LanguageDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 180px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #eef2f7;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
  z-index: 3000;
  padding: 8px;

  transform-origin: top right;
  animation: popIn 140ms ease-out forwards;

  @keyframes popIn {
    from {
      opacity: 0;
      transform: translateY(-6px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const LanguageItem = styled.button`
  width: 100%;
  border: 0;
  border-radius: 12px;
  padding: 12px 14px;
  background: ${({ $active }) => ($active ? "#eff6ff" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#256aeb" : "#111827")};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: ${({ $active }) => ($active ? 700 : 600)};
  font-size: 14px;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ $active }) => ($active ? "#eff6ff" : "#f3f4f6")};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

/* ===================== COMPONENT ===================== */

export default function Navbar({ onMenu = () => {} }) {
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

  const [att, setAtt] = useState(() => getAttendanceState());
  const [timer, setTimer] = useState("00:00:00");

  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef(null);

  const [openNotifications, setOpenNotifications] = useState(false);
  const notificationsRef = useRef(null);
  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem("notifications");
    return stored
      ? JSON.parse(stored)
      : [
          {
            id: 1,
            title: "Task Assigned",
            message: "You have been assigned a new task",
            time: "2 hours ago",
          },
          {
            id: 2,
            title: "Meeting Scheduled",
            message: "Team meeting scheduled for tomorrow at 10 AM",
            time: "1 day ago",
          },
          {
            id: 3,
            title: "Attendance Approved",
            message: "Your attendance has been approved",
            time: "3 days ago",
          },
        ];
  });

  const [openLanguage, setOpenLanguage] = useState(false);
  const languageRef = useRef(null);
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
  ];

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

  useEffect(() => {
    const onDocClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        closeProfile();
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target)
      )
        setOpenNotifications(false);
      if (languageRef.current && !languageRef.current.contains(e.target))
        setOpenLanguage(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [closeProfile]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        closeProfile();
        setOpenNotifications(false);
        setOpenLanguage(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeProfile]);

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => setNotifications([]);

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
        {isEmployee && att.checkedIn && <Timer>⏱ {timer}</Timer>}

        {isEmployee && (
          <CheckBtn
            $out={att.checkedIn}
            disabled={disabled}
            onClick={() => navigate(att.checkedIn ? CHECKOUT : CHECKIN)}
          >
            {att.checkedIn ? "Check-Out" : "Check-In"}
          </CheckBtn>
        )}

        {isAdmin && (
          <IconWrap ref={notificationsRef}>
            <IconBtn
              aria-label="Notifications"
              onClick={() => setOpenNotifications((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={openNotifications}
            >
              <Bell size={18} />
              {notifications.length > 0 && <Dot />}
            </IconBtn>

            {openNotifications && (
              <NotificationDropdown role="menu">
                <NotificationHeader>
                  Notifications
                  {notifications.length > 0 && (
                    <ClearBtn onClick={clearAllNotifications}>Clear All</ClearBtn>
                  )}
                </NotificationHeader>

                {notifications.length === 0 ? (
                  <EmptyNotif>No notifications</EmptyNotif>
                ) : (
                  notifications.map((notif) => (
                    <NotificationItem key={notif.id} role="menuitem">
                      <NotifContent>
                        <NotifTitle>{notif.title}</NotifTitle>
                        <NotifMessage>{notif.message}</NotifMessage>
                        <NotifTime>{notif.time}</NotifTime>
                      </NotifContent>
                      <RemoveNotifBtn
                        onClick={() => removeNotification(notif.id)}
                        aria-label="Remove notification"
                      >
                        <Trash2 size={14} />
                      </RemoveNotifBtn>
                    </NotificationItem>
                  ))
                )}
              </NotificationDropdown>
            )}
          </IconWrap>
        )}

        <IconWrap ref={languageRef}>
          <IconBtn
            aria-label="Language"
            onClick={() => setOpenLanguage((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={openLanguage}
          >
            <Globe size={18} />
          </IconBtn>

          {openLanguage && (
            <LanguageDropdown role="menu">
              {languages.map((lang) => (
                <LanguageItem
                  key={lang.code}
                  $active={language === lang.code}
                  role="menuitem"
                  onClick={() => {
                    setLanguage(lang.code);
                    setOpenLanguage(false);
                  }}
                >
                  {lang.name}
                  {language === lang.code && <Check size={14} />}
                </LanguageItem>
              ))}
            </LanguageDropdown>
          )}
        </IconWrap>

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