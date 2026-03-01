import { useMemo, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import styled from "styled-components";

/* =========================
   LAYOUT (same as Login)
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
  width: min(800px, 80%);
  min-height: 400px;
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

const Title = styled.h2`
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
  padding: 12px 12px;
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

const PrimaryBtn = styled.button`
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

/* =========================
   COMPONENT
========================= */

export default function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();

  // Optional: if later you add /admin/signup, this will still work.
  const panel = location.pathname.startsWith("/admin") ? "admin" : "employee";

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const copy = useMemo(() => {
    return {
      brand: panel === "admin" ? "Stark…" : "Employee Portal",
      leftTitle: "Create your account",
      leftText:
        "Sign up to access your dashboard, manage tasks, view attendance, and stay updated with meetings—all in one place.",
      leftImg:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=700&q=80",
      title: "Create account",
      subtitle: "Fill in the details to create your account.",
    };
  }, [panel]);

  const handleSignUp = () => {
    if (!username || !email || !password || !confirm) {
      alert("All fields required");
      return;
    }

    if (username.trim().length < 3) {
      alert("Username must be at least 3 characters");
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();

    if (!cleanEmail.includes("@")) {
      alert("Enter valid email");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    const existingUsers =
      JSON.parse(localStorage.getItem("registered_users")) || [];

    const userExists = existingUsers.some((u) => u.email === cleanEmail);

    if (userExists) {
      alert("User already exists");
      return;
    }

    const newUser = {
      username: cleanUsername,
      email: cleanEmail,
      password,
      role: "employee",
      name: cleanUsername, // optional convenience for your app
    };

    localStorage.setItem(
      "registered_users",
      JSON.stringify([...existingUsers, newUser])
    );

    alert("Registration successful!");
    navigate("/employee/login");
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
              <Title>{copy.title}</Title>
              <Sub>{copy.subtitle}</Sub>
            </Brand>

            <DividerRow>
              <DividerLine />
              <span>Sign up</span>
              <DividerLine />
            </DividerRow>

            <Field>
              <Label>Username*</Label>
              <InputWrap>
                <Input
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </InputWrap>
            </Field>

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
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </InputWrap>
            </Field>

            <Field>
              <Label>Confirm Password*</Label>
              <InputWrap>
                <Input
                  type="password"
                  placeholder="Re-enter password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </InputWrap>
            </Field>

            <PrimaryBtn type="button" onClick={handleSignUp}>
              Create account
            </PrimaryBtn>

            <Bottom>
              Already have an account? <Link to="/employee/login">Login</Link>
            </Bottom>

            <Footer>© {new Date().getFullYear()} Stark</Footer>
          </Form>
        </Right>
      </Shell>
    </Page>
  );
}