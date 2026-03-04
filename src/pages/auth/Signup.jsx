import { useMemo, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import styled from "styled-components";
import { Mail, KeyRound, User, Eye, EyeOff, Lock, Zap, Headphones } from "lucide-react";

/* =========================
   LAYOUT (matches Login)
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
    background: url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80");
    background-size: cover;
    background-position: center;
    filter: blur(16px) brightness(0.9);
    z-index: 0;
  }
`;

const Shell = styled.div`
  width: 100%;
  max-width: 1000px;
  min-height: 640px;
  background: white;
  border-radius: 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  position: relative;
  z-index: 1;
  box-shadow: 0 40px 100px -20px rgba(195, 168, 72, 0.2);

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
    max-width: 480px;
    min-height: auto;
  }
`;

/* =========================
   LEFT PANEL
========================= */

const Left = styled.div`
  position: relative;
  overflow: hidden;
  background: #0b1020;

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
  opacity: 0.65;
`;

const DarkOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(17, 19, 25, 0.92) 0%,
    rgba(30, 58, 138, 0.4) 100%
  );
`;

const LeftInner = styled.div`
  position: relative;
  z-index: 2;
  padding: 48px;
  color: white;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 800;
  font-size: 18px;
  margin-bottom: 80px;
`;

const BrandIcon = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: white;
  color: #1e40af;
  display: grid;
  place-items: center;
  font-weight: 900;
`;

const LeftTitle = styled.h1`
  margin: 0;
  font-size: 34px;
  font-weight: 600;

  span {
    display: block;
    font-size: 44px;
    font-weight: 900;
    color: #60a5fa;
    letter-spacing: -0.6px;
  }
`;

const LeftText = styled.p`
  margin: 18px 0 0;
  max-width: 360px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
  font-size: 14.5px;
`;

const FeatureList = styled.div`
  margin-top: 40px;
  display: grid;
  gap: 18px;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
`;

const GlowWave = styled.div`
  position: absolute;
  bottom: -120px;
  left: -80px;
  width: 380px;
  height: 380px;
  background: radial-gradient(circle, rgba(96,165,250,0.35) 0%, transparent 70%);
  filter: blur(60px);
  z-index: 1;
`;
/* =========================
   RIGHT PANEL
========================= */

const Right = styled.div`
  padding: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;

  @media (max-width: 520px) {
    padding: 32px 22px;
  }
`;

const Form = styled.div`
  width: 100%;
  max-width: 360px;
  margin: 0 auto;

  /* ✅ control field width (like login) */
  --fieldW: 260px;

  @media (max-width: 520px) {
    --fieldW: 100%;
  }
`;

const PortalChip = styled.div`
  background: #2563eb;
  color: white;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 900;
  width: fit-content;
  margin: 0 auto 18px;
`;

const Title = styled.h2`
  margin: 0 0 8px;
  text-align: center;
  font-size: 28px;
  font-weight: 900;
  color: #0f172a;
`;

const Sub = styled.p`
  margin: 0 0 22px;
  text-align: center;
  color: #64748b;
  font-size: 14px;
`;

const Field = styled.div`
  margin: 0 auto 16px;
  width: min(100%, var(--fieldW));
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

const PrefixIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
`;

const SuffixIcon = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  color: #94a3b8;
  display: grid;
  place-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 44px 14px 44px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  outline: none;
  font-size: 14px;
  color: #1e293b;
  transition: all 0.2s ease;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
  }
`;

const ErrorBox = styled.div`
  width: min(100%, var(--fieldW));
  margin: 8px auto 0;
  padding: 10px 12px;
  border-radius: 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  font-size: 13px;
  font-weight: 700;
`;

const PrimaryBtn = styled.button`
  width: min(100%, var(--fieldW));
  margin: 10px auto 0;
  padding: 16px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(to right, #1e3a8a, #2563eb);
  color: #ffffff;
  font-weight: 900;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.28);
  }

  &:disabled {
    opacity: 0.75;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Bottom = styled.p`
  width: min(100%, var(--fieldW));
  margin: 18px auto 0;
  text-align: center;
  font-size: 13px;
  color: #64748b;

  a {
    color: #2563eb;
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
`;

/* =========================
   COMPONENT
========================= */

export default function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const panel = location.pathname.startsWith("/admin") ? "admin" : "employee";

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const copy = useMemo(() => {
    return {
      chip: panel === "admin" ? "Admin Portal" : "Employee Portal",
      leftTitle: "Create your",
      leftTitleBig: "Account",
      leftText:
        "Sign up to access your dashboard, manage tasks, view attendance, and stay updated with meetings — all in one place.",
      leftImg:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80",
      title: "Create account",
      subtitle: "Fill in the details to create your account.",
    };
  }, [panel]);

  const validate = () => {
    if (!username.trim() || !email.trim() || !password || !confirm)
      return "All fields are required";
    if (username.trim().length < 3) return "Username must be at least 3 characters";

    const cleanEmail = email.trim().toLowerCase();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);
    if (!ok) return "Enter a valid email";

    if (password.length < 6) return "Password must be at least 6 characters";
    if (password !== confirm) return "Passwords do not match";

    return "";
  };

  const handleSignUp = () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanUsername = username.trim();

      const existingUsers =
        JSON.parse(localStorage.getItem("registered_users")) || [];

      const userExists = existingUsers.some((u) => u.email === cleanEmail);
      if (userExists) {
        setError("User already exists");
        setLoading(false);
        return;
      }

      const newUser = {
        username: cleanUsername,
        email: cleanEmail,
        password,
        role: "employee",
        name: cleanUsername,
      };

      localStorage.setItem(
        "registered_users",
        JSON.stringify([...existingUsers, newUser])
      );

      navigate("/employee/login", { replace: true });
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Shell>
        {/* LEFT */}
        <Left>
          <Illustration src={copy.leftImg} alt="Signup Illustration" />
          <DarkOverlay />
          <GlowWave />

          <LeftInner>
            <Brand>
              <BrandIcon>G</BrandIcon>
              Genzix — My Company
            </Brand>

            <LeftTitle>
              {copy.leftTitle}
              <span>{copy.leftTitleBig}</span>
            </LeftTitle>

            <LeftText>{copy.leftText}</LeftText>

            <FeatureList>
              <FeatureItem>
                <Lock size={18} />
                Secure Account Setup
              </FeatureItem>

              <FeatureItem>
                <Zap size={18} />
                Instant Access
              </FeatureItem>

              <FeatureItem>
                <Headphones size={18} />
                24/7 Support
              </FeatureItem>
            </FeatureList>
          </LeftInner>
        </Left>

        {/* RIGHT */}
        <Right>
          <Form>
            <PortalChip>{copy.chip}</PortalChip>
            <Title>{copy.title}</Title>
            <Sub>{copy.subtitle}</Sub>

            <Field>
              <Label>Username*</Label>
              <InputWrap>
                <PrefixIcon>
                  <User size={18} />
                </PrefixIcon>
                <Input
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSignUp()}
                />
              </InputWrap>
            </Field>

            <Field>
              <Label>Email*</Label>
              <InputWrap>
                <PrefixIcon>
                  <Mail size={18} />
                </PrefixIcon>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSignUp()}
                />
              </InputWrap>
            </Field>

            <Field>
              <Label>Password*</Label>
              <InputWrap>
                <PrefixIcon>
                  <KeyRound size={18} />
                </PrefixIcon>
                <Input
                  type={showPass ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSignUp()}
                />
                <SuffixIcon type="button" onClick={() => setShowPass((v) => !v)}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </SuffixIcon>
              </InputWrap>
            </Field>

            <Field>
              <Label>Confirm Password*</Label>
              <InputWrap>
                <PrefixIcon>
                  <KeyRound size={18} />
                </PrefixIcon>
                <Input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSignUp()}
                />
                <SuffixIcon
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </SuffixIcon>
              </InputWrap>
            </Field>

            {error && <ErrorBox>{error}</ErrorBox>}

            <PrimaryBtn type="button" onClick={handleSignUp} disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </PrimaryBtn>

            <Bottom>
              Already have an account? <Link to="/employee/login">Login</Link>
            </Bottom>

            <Footer>© {new Date().getFullYear()} Genzix</Footer>
          </Form>
        </Right>
      </Shell>
    </Page>
  );
}