import { useMemo, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  deleteUser,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import {
  authorizeEmployeeAccess,
  bindEmployeeToUser,
} from "../../utils/employeeAuth";
import {
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  Zap,
  Headphones,
} from "lucide-react";

/* =========================
   LAYOUT & SHELL
========================= */

const Page = styled.div`
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: -20px;
    background: url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80");
    background-size: cover;
    background-position: center;
    filter: blur(15px) brightness(0.9);
    z-index: 0;
  }
`;

const Shell = styled.div`
  width: 100%;
  max-width: 680px;
  min-height: 360px;
  background: white;
  border-radius: 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  position: relative;
  z-index: 1;
  box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.2);

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
    max-width: 440px;
    min-height: auto;
  }
`;

/* =========================
   LEFT PANEL
========================= */

const Left = styled.div`
  position: relative;
  background: #f7fbff;
  padding: 48px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 920px) {
    display: none;
  }
`;

const Illustration = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.6;
`;

const DarkOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(17, 19, 25, 0.95) 0%,
    rgba(30, 58, 138, 0.4) 100%
  );
`;

const LeftContent = styled.div`
  position: relative;
  z-index: 2;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 80px;
`;

const BrandIcon = styled.div`
  width: 32px;
  height: 32px;
  background: white;
  color: #1e40af;
  border-radius: 8px;
  display: grid;
  place-items: center;
  font-weight: 900;
`;

const WelcomeHeadline = styled.h1`
  font-size: 32px;
  font-weight: 500;
  margin: 0;

  span {
    display: block;
    font-weight: 800;
    color: #60a5fa;
    font-size: 42px;
  }
`;

const LeftText = styled.p`
  margin: 24px 0 40px;
  font-size: 15px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
  max-width: 340px;
`;

const FeatureList = styled.div`
  display: grid;
  gap: 20px;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.95);
`;

/* =========================
   RIGHT PANEL (FORM)
========================= */

const Right = styled.div`
  padding: 34px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: white;

  @media (max-width: 500px) {
    padding: 28px 22px;
  }
`;

const FormBox = styled.div`
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
  --fieldW: 100%;

  @media (max-width: 500px) {
    max-width: 100%;
  }
`;

const PortalChip = styled.div`
  background: #2563eb;
  color: white;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  width: fit-content;
  margin: 0 auto 20px;
`;

const Headline = styled.h2`
  text-align: center;
  font-size: 28px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 8px 0;
`;

const SubText = styled.p`
  text-align: center;
  color: #64748b;
  font-size: 14px;
  margin: 0 0 30px 0;
`;

const InputGroup = styled.div`
  margin: 0 auto 16px;
  position: relative;
  width: min(100%, var(--fieldW));
`;

const StyledInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 14px 46px 14px 42px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
  outline: none;
  font-size: 14px;
  color: #0f172a;
  transition: all 0.25s ease;

  &::placeholder {
    color: #94a3b8;
  }

  &:hover {
    border-color: #cbd5f5;
  }

  &:focus {
    border-color: #2563eb;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
  }
`;

const PrefixIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  display: flex;
  align-items: center;
`;

const Row = styled.div`
  width: min(100%, var(--fieldW));
  margin: 10px auto 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const Check = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #475569;
  font-size: 13px;
  font-weight: 600;

  input {
    width: 16px;
    height: 16px;
  }
`;

const GoogleBtn = styled.button`
  width: 100%;
  margin: 0 auto;
  padding: 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f8fafc;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const GoogleLogo = styled.div`
  width: 18px;
  height: 18px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath fill='%23EA4335' d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'/%3E%3Cpath fill='%234285F4' d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'/%3E%3Cpath fill='%23FBBC05' d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'/%3E%3Cpath fill='%2334A853' d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'/%3E%3Cpath fill='none' d='M0 0h48v48H0z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: contain;
`;

const Divider = styled.div`
  width: min(100%, var(--fieldW));
  margin: 20px auto;
  display: flex;
  align-items: center;
  color: #cbd5e1;
  font-size: 12px;
  font-weight: 700;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #f1f5f9;
    margin: 0 12px;
  }
`;

const LoginBtn = styled.button`
  width: 100%;
  margin: 0 auto;
  padding: 16px;
  background: linear-gradient(to right, #1e3a8a, #2563eb);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ArrowCircle = styled.div`
  position: absolute;
  right: 12px;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: grid;
  place-items: center;
`;

const RegisterPrompt = styled.p`
  width: min(100%, var(--fieldW));
  margin: 24px auto 0;
  text-align: center;
  font-size: 14px;
  color: #64748b;
  margin-bottom: 10px;

  a {
    color: #2563eb;
    font-weight: 700;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const SuffixIcon = styled.div`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #94a3b8;
  display: flex;
  align-items: center;
`;

/* =========================
   COMPONENT
========================= */

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const toastOnce = (msg) => toast.error(msg, { toastId: msg });

  const panel = location.pathname.startsWith("/admin") ? "admin" : "employee";
  const from = location.state?.from?.pathname;

  const copy = useMemo(
    () => ({
      chip: panel === "admin" ? "Admin Portal" : "Employee Portal",
      leftText:
        panel === "admin"
          ? "Manage employees, payroll, and company settings — all in one secure place."
          : "Manage your attendance, meetings, tasks, and leave requests — all in one place.",
      leftImg:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80",
    }),
    [panel]
  );

  const validate = () => {
    if (!email.trim()) return "Email is required";
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!ok) return "Enter a valid email";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const ADMIN_EMAIL = "admin@gmail.com";

  const handleLogin = async () => {
    const msg = validate();
    if (msg) return toastOnce(msg);

    const cleanEmail = email.trim().toLowerCase();

    if (panel === "admin" && cleanEmail !== ADMIN_EMAIL) {
      return toastOnce("Not authorized as admin");
    }

    setLoading(true);

    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );
      const user = userCred.user;

      if (panel === "employee") {
        const access = await authorizeEmployeeAccess(cleanEmail);

        if (!access.ok) {
          await signOut(auth);
          return toastOnce(access.reason);
        }

        const employee = access.employee;

        await bindEmployeeToUser(employee.docId, user, "password");

        login({
          user: {
            id: user.uid,
            uid: user.uid,
            email: user.email || "",
            username: user.displayName || employee.name || "",
            name: employee.name || user.displayName || "",
            employeeId: employee.id || "",
            role: "employee",
            employeeDocId: employee.docId,
            status: employee.status || "",
            phone: employee.phone || "",
            image: employee.image || "",
          },
          token: user.accessToken,
          role: "employee",
        });

        navigate("/employee/dashboard", { replace: true });
        return;
      }

      login({
        user: {
          id: user.uid,
          email: user.email || "",
          username: user.displayName || "",
          name: user.displayName || "",
        },
        token: user.accessToken,
        role: "admin",
      });

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      const code = err?.code || "";

      if (code.includes("auth/invalid-credential")) {
        return toastOnce("Invalid email or password");
      }
      if (code.includes("auth/user-not-found")) {
        return toastOnce("No account found with this email");
      }

      console.error(err);
      toastOnce("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (panel === "admin") {
      return toastOnce("Admin login via Google is disabled");
    }

    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const cleanEmail = (user.email || "").trim().toLowerCase();

      if (!cleanEmail) {
        await signOut(auth);
        return toastOnce("Google account email not available");
      }

      const access = await authorizeEmployeeAccess(cleanEmail);

      if (!access.ok) {
        const isNewAccount =
          user.metadata?.creationTime &&
          user.metadata?.lastSignInTime &&
          user.metadata.creationTime === user.metadata.lastSignInTime;

        if (isNewAccount) {
          try {
            await deleteUser(user);
          } catch (e) {
            await signOut(auth);
          }
        } else {
          await signOut(auth);
        }

        return toastOnce(access.reason);
      }

      const employee = access.employee;

      await bindEmployeeToUser(employee.docId, user, "google");

      login({
        user: {
          id: user.uid,
          uid: user.uid,
          email: user.email || "",
          username: user.displayName || employee.name || "",
          name: employee.name || user.displayName || "",
          employeeId: employee.id || "",
          role: "employee",
          employeeDocId: employee.docId,
          status: employee.status || "",
          phone: employee.phone || "",
          image: employee.image || user.photoURL || "",
        },
        token: user.accessToken,
        role: "employee",
      });

      navigate(from || "/employee/dashboard", { replace: true });
    } catch (err) {
      const code = err?.code || "";

      if (code.includes("auth/popup-closed-by-user")) {
        return toastOnce("Popup closed. Try again.");
      }
      if (code.includes("auth/popup-blocked")) {
        return toastOnce("Popup blocked by browser. Allow popups and try again.");
      }

      console.error(err);
      toastOnce("Google sign-in failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />

      <Shell>
        <Left>
          <Illustration src={copy.leftImg} alt="Workspace" />
          <DarkOverlay />
          <LeftContent>
            <Brand>
              <BrandIcon>G</BrandIcon>
              Genzix
            </Brand>

            <WelcomeHeadline>
              Welcome to the
              <span>{copy.chip}</span>
            </WelcomeHeadline>

            <LeftText>{copy.leftText}</LeftText>

            <FeatureList>
              <FeatureItem>
                <Lock size={18} /> Secure Login
              </FeatureItem>
              <FeatureItem>
                <Zap size={18} /> Quick Access
              </FeatureItem>
              <FeatureItem>
                <Headphones size={18} /> 24/7 Support
              </FeatureItem>
            </FeatureList>
          </LeftContent>
        </Left>

        <Right>
          <FormBox>
            <PortalChip>{copy.chip}</PortalChip>
            <Headline>Sign in to your account</Headline>
            <SubText>Enter your credentials to continue</SubText>

            <InputGroup>
              <PrefixIcon>
                <Mail size={18} />
              </PrefixIcon>
              <StyledInput
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </InputGroup>

            <InputGroup>
              <PrefixIcon>
                <KeyRound size={18} />
              </PrefixIcon>
              <StyledInput
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <SuffixIcon onClick={() => setShowPass((prev) => !prev)}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </SuffixIcon>
            </InputGroup>

            <Row>
              <Check>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </Check>

              {panel === "employee" && (
                <Link
                  to="/employee/forgot-password"
                  style={{
                    fontSize: 13,
                    color: "#2563eb",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Forgot Password?
                </Link>
              )}
            </Row>

            {panel === "employee" && (
              <>
                <GoogleBtn
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <GoogleLogo />
                  Continue with Google
                </GoogleBtn>

                <Divider>OR</Divider>
              </>
            )}

            {panel === "employee" && (
              <RegisterPrompt>
                Don't have an account? <Link to="/signup">Register here</Link>
              </RegisterPrompt>
            )}

            <LoginBtn type="button" onClick={handleLogin} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
              <ArrowCircle>
                <ArrowRight size={18} />
              </ArrowCircle>
            </LoginBtn>
          </FormBox>
        </Right>
      </Shell>
    </Page>
  );
}