import { useMemo, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import styled from "styled-components";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import {
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

/* =========================
   LAYOUT
========================= */

const Page = styled.div`
  min-height: 100vh;
  background: radial-gradient(
      1200px 600px at 20% 10%,
      rgba(255, 255, 255, 0.45),
      rgba(255, 255, 255, 0) 60%
    ),
    linear-gradient(135deg, #cfd8ff, #b9c7ff, #9fb9ff);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 26px;
`;

const Shell = styled.div`
  width: min(1100px, 94%);
  min-height: 650px;
  border-radius: 32px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  background: rgba(255, 255, 255, 0.32);
  border: 1px solid rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(18px);
  box-shadow: 0 60px 140px rgba(2, 6, 23, 0.25);
`;

/* =========================
   LEFT PANEL
========================= */

const Left = styled.div`
  position: relative;
  overflow: hidden;
  background: #0b1020;

  @media (max-width: 980px) {
    display: none;
  }
`;

const Illustration = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(1.05) contrast(1.05);
  transform: scale(1.02);
`;

const DarkOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(2, 6, 23, 0.92) 0%,
    rgba(2, 6, 23, 0.55) 55%,
    rgba(2, 6, 23, 0.25) 100%
  );
`;

const GlowWave = styled.div`
  position: absolute;
  left: -15%;
  bottom: -10%;
  width: 140%;
  height: 240px;
  background: radial-gradient(
      600px 180px at 35% 45%,
      rgba(59, 130, 246, 0.55),
      rgba(59, 130, 246, 0) 70%
    ),
    radial-gradient(
      420px 140px at 70% 55%,
      rgba(0, 210, 255, 0.35),
      rgba(0, 210, 255, 0) 70%
    );
  filter: blur(0.2px);
`;

const LeftTop = styled.div`
  position: relative;
  z-index: 2;
  padding: 34px 34px 0;
  display: flex;
  gap: 12px;
  align-items: center;
  color: white;
`;

const BrandMark = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #22d3ee);
  box-shadow: 0 18px 40px rgba(34, 211, 238, 0.2);
`;

const BrandText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.1;
`;

const BrandName = styled.div`
  font-weight: 900;
  letter-spacing: 0.2px;
  font-size: 18px;
`;

const BrandSub = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
`;

const LeftBody = styled.div`
  position: relative;
  z-index: 2;
  padding: 64px 34px 0;
`;

const LeftWelcome = styled.div`
  font-size: 34px;
  color: rgba(255, 255, 255, 0.88);
  margin-bottom: 6px;
`;

const LeftPortal = styled.div`
  font-size: 42px;
  font-weight: 900;
  letter-spacing: -0.6px;
  margin-bottom: 10px;

  span {
    color: #4cc3ff;
  }
  color: #fff;
`;

const LeftUnderline = styled.div`
  width: 78px;
  height: 3px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.65);
  margin: 14px 0 18px;
`;

const LeftText = styled.p`
  margin: 0;
  max-width: 420px;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.65;
  font-size: 14.5px;
`;

const LeftList = styled.div`
  margin-top: 26px;
  display: grid;
  gap: 12px;
  max-width: 360px;
`;

const LeftItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 650;
  font-size: 13.5px; /* slightly smaller */

  .icon {
    width: 40px;      /* was 42 */
    height: 40px;
    border-radius: 14px;
    display: grid;
    place-items: center;
    background: rgba(255, 255, 255, 0.06); /* lighter */
    border: 1px solid rgba(255, 255, 255, 0.10);
  }
`;
/* =========================
   RIGHT PANEL
========================= */

const Right = styled.div`
  background: rgba(255, 255, 255, 0.96);
  padding: 50px 56px;        /* was 60+ */
  display: flex;
  align-items: center;
  border-left: 1px solid #e8edf6;

  @media (max-width: 980px) {
    padding: 34px 22px;
  }
`;

const Form = styled.div`
  width: 100%;
  max-width: 410px;
  margin: 0 auto;
`;

const PortalChip = styled.div`
  width: fit-content;
  margin: 0 auto 14px;
  padding: 9px 14px;
  border-radius: 999px;
  background: #eef2ff;
  border: 1px solid #dbeafe;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1e3a8a;
  font-weight: 800;
  font-size: 13px;
`;

const Headline = styled.h2`
  margin: 0;
  text-align: center;
  font-size: 38px;
  font-weight: 900;
  letter-spacing: -0.8px;
  color: #0b1220;
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", serif;
`;

const Sub = styled.p`
  margin: 8px 0 22px;
  text-align: center;
  color: #64748b;
  font-size: 14px;
`;

const Field = styled.div`
  margin-top: 14px;
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  color: #0f172a;
  font-weight: 800;
  margin-bottom: 8px;
`;

const InputWrap = styled.div`
  position: relative;
`;

const LeftIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #475569;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 46px 16px 56px;
  border-radius: 16px;
  border: 1px solid #e6ebf5;
  background: #f8fafc;
  font-size: 14px;
  box-shadow: 0 10px 22px rgba(2, 6, 23, 0.04); /* ✅ add */

  &:focus {
    background: #fff;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
  }
`;

const EyeBtn = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 12px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  display: grid;
  place-items: center;
  color: #64748b;

  &:hover {
    background: #f3f4f6;
  }
`;

const ForgotRow = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
`;

const MutedLink = styled(Link)`
  font-size: 13px;
  color: #1d4ed8;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const GoogleBtn = styled.button`
  width: 100%;
  border-radius: 999px;
  border: 1px solid #e6ebf5;
  background: #ffffff;
  padding: 12px 14px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 26px rgba(2, 6, 23, 0.08);
  }
`;

const GoogleLogo = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: conic-gradient(
    from 45deg,
    #ea4335 0 90deg,
    #fbbc05 90deg 180deg,
    #34a853 180deg 270deg,
    #4285f4 270deg 360deg
  );
`;

const DividerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 16px 0 14px;
  color: #94a3b8;
  font-size: 13px;
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: #e6ebf5;
`;

const LoginBtn = styled.button`
  width: 100%;
  margin-top: 18px;
  padding: 16px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(90deg, #0b2a5c, #0a3e8c);
  color: #ffffff;
  font-weight: 900;
  font-size: 16px;
  cursor: pointer;
  position: relative;

  &:hover {
    box-shadow: 0 20px 36px rgba(10, 62, 140, 0.35);
    transform: translateY(-2px);
  }
`;

const BtnArrow = styled.div`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 42px;
  height: 42px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.16);
`;

const Bottom = styled.p`
  margin: 14px 0 0;
  text-align: center;
  font-size: 13px;
  color: #64748b;

  a {
    color: #1d4ed8;
    font-weight: 800;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

const Footer = styled.div`
  margin-top: 18px;
  text-align: center;
  color: #94a3b8;
  font-size: 12px;
  display: grid;
  gap: 8px;
`;

const SecureLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #64748b;
  font-weight: 700;
`;

/* =========================
   COMPONENT
========================= */

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);

  const panel = location.pathname.startsWith("/admin") ? "admin" : "employee";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const from = location.state?.from?.pathname;

  const copy = useMemo(() => {
    if (panel === "admin") {
      return {
        chip: "Admin Portal",
        leftWelcome: "Welcome to the",
        leftPortal: "Admin Portal",
        leftText:
          "Manage employees, meetings, attendance, and payroll — all in one place with secure access.",
        leftImg:
          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
      };
    }
    return {
      chip: "Employee Portal",
      leftWelcome: "Welcome to the",
      leftPortal: "Employee Portal",
      leftText:
        "Manage your attendance, meetings, tasks, and leave requests — all in one place.",
      leftImg:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    };
  }, [panel]);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const idToken = await fbUser.getIdToken();

      const ADMIN_EMAILS = ["admin@gmail.com"]; // TODO: later from DB
      const role = ADMIN_EMAILS.includes((fbUser.email || "").toLowerCase())
        ? "admin"
        : "employee";

      login({
        user: {
          email: fbUser.email || "",
          username: fbUser.displayName || "",
          name: fbUser.displayName || "",
          photoURL: fbUser.photoURL || "",
        },
        token: idToken,
        role,
      });

      navigate(role === "admin" ? "/admin/dashboard" : "/employee/dashboard", {
        replace: true,
      });
    } catch (e) {
      console.error("Google login error:", e);
      alert(`${e.code || "error"}: ${e.message || "Google login failed"}`);
    }
  };

  const handleLogin = () => {
    if (!email || !password) {
      alert("Enter credentials");
      return;
    }

    const registeredUsers =
      JSON.parse(localStorage.getItem("registered_users")) || [];

    const adminUser = {
      email: "admin@gmail.com",
      password: "admin123",
      role: "admin",
      username: "admin",
      name: "Admin",
    };

    const allUsers = [...registeredUsers, adminUser];

    const inputEmail = email.trim().toLowerCase();
    const inputPass = password;

    const found = allUsers.find(
      (u) =>
        (u.email || "").toLowerCase() === inputEmail && u.password === inputPass
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
      user: {
        id: found.email.toLowerCase(),
        email: found.email,
        username: found.username || "",
        name: found.name || "",
      },
      token: "demo-token",
      role: found.role,
    });

    if (from) navigate(from, { replace: true });
    else
      navigate(found.role === "admin" ? "/admin/dashboard" : "/employee/dashboard", {
        replace: true,
      });
  };

  return (
    <Page>
      <Shell>
        {/* LEFT */}
        <Left>
          <Illustration src={copy.leftImg} alt="Cover" />
          <DarkOverlay />
          <GlowWave />

          <LeftTop>
            <BrandMark />
            <BrandText>
              <BrandName>Genzix</BrandName>
              <BrandSub>My Company</BrandSub>
            </BrandText>
          </LeftTop>

          <LeftBody>
            <LeftWelcome>{copy.leftWelcome}</LeftWelcome>
            <LeftPortal>
              <span>{copy.leftPortal.split(" ")[0]}</span>{" "}
              {copy.leftPortal.split(" ").slice(1).join(" ")}
            </LeftPortal>
            <LeftUnderline />
            <LeftText>{copy.leftText}</LeftText>

            <LeftList>
              <LeftItem>
                <div className="icon">
                  <Lock size={18} />
                </div>
                Secure Login
              </LeftItem>
              <LeftItem>
                <div className="icon">
                  <ArrowRight size={18} />
                </div>
                Quick Access
              </LeftItem>
              <LeftItem>
                <div className="icon">
                  <KeyRound size={18} />
                </div>
                24/7 Support
              </LeftItem>
            </LeftList>
          </LeftBody>
        </Left>

        {/* RIGHT */}
        <Right>
          <Form>
            <PortalChip>
              <Lock size={16} />
              {copy.chip}
            </PortalChip>

            <Headline>Sign in to your account</Headline>
            <Sub>Enter your credentials to continue</Sub>

            <Field>
              <Label>Email Address</Label>
              <InputWrap>
                <LeftIcon>
                  <Mail size={16} />
                </LeftIcon>
                <Input
                  type="email"
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputWrap>
            </Field>

            <Field>
              <Label>Password</Label>
              <InputWrap>
                <LeftIcon>
                  <KeyRound size={16} />
                </LeftIcon>
                <Input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <EyeBtn
                  type="button"
                  aria-label={showPass ? "Hide password" : "Show password"}
                  onClick={() => setShowPass((v) => !v)}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </EyeBtn>
              </InputWrap>
            </Field>

            {panel === "employee" && (
              <ForgotRow>
                <MutedLink to="#">Forgot Password?</MutedLink>
              </ForgotRow>
            )}

            <GoogleBtn type="button" onClick={handleGoogleLogin}>
              <GoogleLogo />
              Continue with Google
            </GoogleBtn>

            <DividerRow>
              <DividerLine />
              <span>OR</span>
              <DividerLine />
            </DividerRow>

            <LoginBtn type="button" onClick={handleLogin}>
              Sign In
              <BtnArrow>
                <ArrowRight size={18} />
              </BtnArrow>
            </LoginBtn>

            {panel === "employee" && (
              <Bottom>
                Don&apos;t have an account? <Link to="/signup">Register here</Link> →
              </Bottom>
            )}

            <Footer>
              <SecureLine>
                <Lock size={14} /> Secure &amp; Encrypted Login
              </SecureLine>
              © {new Date().getFullYear()} Genzix. All rights reserved.
            </Footer>
          </Form>
        </Right>
      </Shell>
    </Page>
  );
}