import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoginForm from "../authentication/LoginForm";
import loginBg from "../../images/Login-Background.png";

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setError("Enter an email address.");
      return;
    }

    if (!password) {
      setError("Enter a password.");
      return;
    }

    if (!EMAIL_PATTERN.test(email.trim()) || typeof email !== "string") {
      setError("Enter a valid email address.");
      return;
    }

    const { user, error: loginError } = await login(email, password);
    if (user) {
      setError("");
      navigate("/products", { replace: true });
    } else {
      setError(loginError ?? "Invalid email or password.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <LoginForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        error={error}
        isLoading={isLoading}
        onSubmit={handleLogin}
      />
    </div>
  );
}
