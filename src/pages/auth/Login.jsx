import { useMemo, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import styled from "styled-components";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";

/* =========================
   LAYOUT
========================= */

const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #7c68c7, #6f92d6, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 26px;
`;

const Shell = styled.div`
  width: min(1050px, 100%);
  min-height: 620px;
  border-radius: 24px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(18px);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.28);

  @media (max-width: 940px) {
    grid-template-columns: 1fr;
    min-height: auto;
  }
`;

/* =========================
   LEFT PANEL
========================= */

const Left = styled.div`
  position: relative;
  overflow: hidden;
  background: #4f46e5;

  @media (max-width: 940px) {
    display: none;
  }
`;

const Illustration = styled.img`
  position: absolute;
  inset: 0;          /* top:0 right:0 bottom:0 left:0 */
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const LeftCard = styled.div`
  position: absolute;
  bottom: 24px;
  left: 24px;
  right: 24px;

  border-radius: 18px;
  padding: 20px;

  background: rgba(35, 48, 130, 0.55);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.25);

  color: white;
`;
const LeftTitle = styled.h3`
  margin: 0 0 10px;
  font-size: 28px;
  line-height: 1.2;
  color: #ffffff;
  letter-spacing: 0.2px;
`;

const LeftText = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
  font-size: 14.5px;
`;

/* =========================
   RIGHT PANEL
========================= */

const Right = styled.div`
  background: rgba(255, 255, 255, 0.92);
  padding: 44px 52px;
  display: flex;
  align-items: center;

  @media (max-width: 940px) {
    padding: 34px 22px;
  }
`;

const Form = styled.div`
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
`;

const Brand = styled.div`
  text-align: center;
  margin-bottom: 16px;
`;

const BrandName = styled.div`
  font-weight: 800;
  letter-spacing: 0.2px;
  color: #111827;
`;

const Welcome = styled.h2`
  margin: 10px 0 6px;
  text-align: center;
  font-size: 30px;
  color: #0f172a;
`;

const Sub = styled.p`
  margin: 0 0 18px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
`;

const GoogleBtn = styled.button`
  width: 100%;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  padding: 12px 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
  }
`;

const GIcon = styled.div`
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
  color: #9ca3af;
  font-size: 13px;
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: #e5e7eb;
`;

const Field = styled.div`
  margin-top: 14px;
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  color: #111827;
  font-weight: 700;
  margin-bottom: 6px;
`;

const InputWrap = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 44px 12px 12px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  outline: none;
  font-size: 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: #6d7df0;
    box-shadow: 0 0 0 4px rgba(109, 125, 240, 0.18);
  }
`;

const EyeBtn = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  border-radius: 10px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  display: grid;
  place-items: center;
  color: #6b7280;

  &:hover {
    background: #f3f4f6;
  }
`;

const Row = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const MutedLink = styled(Link)`
  font-size: 13px;
  color: #475569;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const LoginBtn = styled.button`
  width: 100%;
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(90deg, #7b61ff, #5b86ff);
  color: #ffffff;
  font-weight: 800;
  font-size: 15px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 30px rgba(91, 134, 255, 0.28);
  }

  &:active {
    transform: translateY(0px);
  }
`;

const Bottom = styled.p`
  margin: 14px 0 0;
  text-align: center;
  font-size: 13px;
  color: #6b7280;

  a {
    color: #4f46e5;
    font-weight: 700;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

const Footer = styled.div`
  margin-top: 26px;
  text-align: center;
  color: #9ca3af;
  font-size: 12px;
`;

const Eye = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path
      d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
      stroke="currentColor"
      strokeWidth="1.7"
    />
    {!open && (
      <path
        d="M4 4l16 16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    )}
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);

  // ✅ detect panel from URL
  const panel = location.pathname.startsWith("/admin") ? "admin" : "employee";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const from = location.state?.from?.pathname;

  const copy = useMemo(() => {
    if (panel === "admin") {
      return {
        brand: "Admin Portal",
        leftTitle: "Made for Company Owner and Admins",
        leftText:
          "Manage employees, meetings, attendance, and payroll in one place. Keep everything organized with secure access.",
        leftImg:
          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=700&q=80",
      };
    }
    return {
      brand: "Employee Portal",
      leftTitle: "Made for Employees",
      leftText:
        "Check attendance, view meetings, manage tasks and requests easily. Simple and secure experience.",
      leftImg:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=700&q=80",
    };
  }, [panel]);

  const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    const idToken = await fbUser.getIdToken();

    // 🔐 TEMP role logic (until backend exists)
    // Later this will come from backend response
    const ADMIN_EMAILS = ["admin@gmail.com"]; // change later to DB lookup

    const role = ADMIN_EMAILS.includes(
      (fbUser.email || "").toLowerCase()
    )
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

    // ✅ correct redirect
    navigate(
      role === "admin"
        ? "/admin/dashboard"
        : "/employee/dashboard",
      { replace: true }
    );
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

    // ✅ Seed one admin for demo
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

    // 🚫 prevent wrong panel login
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

    if (from) {
      navigate(from, { replace: true });
    } else {
      navigate(found.role === "admin" ? "/admin/dashboard" : "/employee/dashboard", {
        replace: true,
      });
    }
  };

  return (
    <Page>
      <Shell>
        {/* LEFT */}
        <Left>
          <Illustration src={copy.leftImg} alt="Signup Illustration" />

          <LeftCard>
            <LeftTitle>{copy.leftTitle}</LeftTitle>
            <LeftText>{copy.leftText}</LeftText>
          </LeftCard>
        </Left>

        {/* RIGHT */}
        <Right>
          <Form>
            <Brand>
              <BrandName>{copy.brand}</BrandName>
              <Welcome>Welcome back!</Welcome>
              <Sub>Please provide your details to log into your account.</Sub>
            </Brand>

            <GoogleBtn type="button" onClick={handleGoogleLogin}>
              <GIcon />
              Continue with Google
            </GoogleBtn>

            <DividerRow>
              <DividerLine />
              <span>Or with</span>
              <DividerLine />
            </DividerRow>

            <Field>
              <Label>Email*</Label>
              <InputWrap>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputWrap>
            </Field>

            <Field>
              <Label>Password*</Label>
              <InputWrap>
                <Input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <EyeBtn
                  type="button"
                  aria-label={showPass ? "Hide password" : "Show password"}
                  onClick={() => setShowPass((v) => !v)}
                >
                  <Eye open={showPass} />
                </EyeBtn>
              </InputWrap>
            </Field>

            {panel === "employee" && panel !== "admin" && (

            <Row>
              <MutedLink to="#">Forgot password?</MutedLink>
            </Row>
            )}

            <LoginBtn type="button" onClick={handleLogin}>
              Login
            </LoginBtn>

            {panel === "employee" && panel !== "admin" && (
              <Bottom>
                Don&apos;t have an account? <Link to="/signup">Register</Link>
              </Bottom>
            )}

            <Footer>© {new Date().getFullYear()} Stark</Footer>
          </Form>
        </Right>
      </Shell>
    </Page>
  );
}