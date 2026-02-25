import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";

const SignUpCard = styled.div`
  max-width: 400px;
  margin: 80px auto;
  padding: 24px;
  border: 1px solid #eee;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const SignUpBtn = styled.button`
  width: 100%;
  margin-top: 18px;
  padding: 12px;
  font-size: 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: #4caf50;
  color: #fff;
`;

export default function SignUp() {
  const navigate = useNavigate();

  const [username, setUsername] = useState(""); // ✅ added
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSignUp = () => {
    if (!username || !email || !password || !confirm) {
      alert("All fields required");
      return;
    }

    if (username.trim().length < 3) {
      alert("Username must be at least 3 characters");
      return;
    }

    if (!email.includes("@")) {
      alert("Enter valid email");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    const existingUsers =
      JSON.parse(localStorage.getItem("registered_users")) || [];

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();

    const userExists = existingUsers.some(
      (u) => u.email === cleanEmail
    );

    if (userExists) {
      alert("User already exists");
      return;
    }

    const newUser = {
      username: cleanUsername, // ✅ added
      email: cleanEmail,
      password,
      role: "employee",
    };

    localStorage.setItem(
      "registered_users",
      JSON.stringify([...existingUsers, newUser])
    );

    alert("Registration successful!");
    navigate("/employee/login");
  };

  return (
    <SignUpCard>
      <h2>Sign Up</h2>

      {/* ✅ Username */}
      <Input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Input
        type="password"
        placeholder="Confirm Password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

      <SignUpBtn onClick={handleSignUp}>Sign Up</SignUpBtn>

      <p style={{ marginTop: 16 }}>
        Already have an account? <Link to="/employee/login">Login</Link>
      </p>
    </SignUpCard>
  );
}