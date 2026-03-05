import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Mail, ArrowRight, Lock, Zap, Headphones } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";

/* =========================
   LAYOUT (same vibe as Login)
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
    max-width: 520px;
    min-height: auto;
  }
`;

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
   RIGHT FORM
========================= */

const Right = styled.div`
  padding: 48px;
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
  margin: 0 0 26px 0;
`;

const InputGroup = styled.div`
  margin: 0 auto 16px;
  position: relative;
  width: min(100%, var(--fieldW));
`;

const StyledInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 14px 16px 14px 42px;
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

const Btn = styled.button`
  width: 100%;
  margin: 6px auto 0;
  padding: 16px;
  background: linear-gradient(to right, #1e3a8a, #2563eb);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ArrowCircle = styled.div`
  position: absolute;
  right: 12px;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  display: grid;
  place-items: center;
`;

const Back = styled.p`
  width: 100%;
  margin: 18px auto 0;
  text-align: center;
  font-size: 14px;
  color: #64748b;

  a {
    color: #2563eb;
    font-weight: 800;
    text-decoration: none;
  }
`;

export default function ForgotPassword() {
    const location = useLocation();
    const panel = location.pathname.startsWith("/admin") ? "admin" : "employee";

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const toastOnce = (msg) => toast.error(msg, { toastId: msg });

    const copy = useMemo(
        () => ({
            chip: panel === "admin" ? "Admin Portal" : "Employee Portal",
            leftText:
                panel === "admin"
                    ? "Reset access to admin tools securely."
                    : "Reset your password securely and get back in.",
            leftImg:
                "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
        }),
        [panel]
    );

    const handleSend = async () => {
        const e = email.trim();
        if (!e) return toastOnce("Email is required");
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
        if (!ok) return toastOnce("Enter a valid email");

        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, e, {
                url: `${window.location.origin}/${panel}/login`,
                handleCodeInApp: false,
            });

            toast.success("Reset link sent! Check your email inbox.", { autoClose: 2500 });
        } catch (err) {
            console.log("RESET_ERROR_FULL:", err);
            toastOnce(`${err?.code || "error"} — ${err?.message || "unknown"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Page>
            <ToastContainer position="top-right" autoClose={3000} newestOnTop theme="light" />
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
                            Forgot your
                            <span>Password?</span>
                        </WelcomeHeadline>

                        <LeftText>{copy.leftText}</LeftText>

                        <FeatureList>
                            <FeatureItem>
                                <Lock size={18} /> Secure Reset
                            </FeatureItem>
                            <FeatureItem>
                                <Zap size={18} /> Quick Recovery
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
                        <Headline>Reset your password</Headline>
                        <SubText>We’ll email you a secure reset link.</SubText>

                        <InputGroup>
                            <PrefixIcon>
                                <Mail size={18} />
                            </PrefixIcon>
                            <StyledInput
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            />
                        </InputGroup>

                        <Btn type="button" onClick={handleSend} disabled={loading}>
                            {loading ? "Sending..." : "Send reset link"}
                            <ArrowCircle>
                                <ArrowRight size={18} />
                            </ArrowCircle>
                        </Btn>

                        <Back>
                            Back to{" "}
                            <Link to={panel === "admin" ? "/admin/login" : "/employee/login"}>
                                Login
                            </Link>
                        </Back>
                    </FormBox>
                </Right>
            </Shell>
        </Page>
    );
}