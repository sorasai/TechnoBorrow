import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "./api";
import "./auth.css";
import LoginForm from "./LoginForm";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await authApi.login({ email, password });
      
      if (typeof response === 'string' && response.startsWith('Login Failed')) {
        setError(response);
        return;
      }

      if (response && response.id) {
        authApi.setCurrentUser(response);
        navigate("/dashboard");
      } else {
        setError("Invalid credentials.");
      }
    } catch (err: any) {
      setError("An error occurred connecting to the server.");
    }
  };

  return (
    <LoginForm
      email={email}
      password={password}
      error={error}
      onEmailChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
      onPasswordChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
      onSubmit={handleLogin}
    />
  );
}

export default LoginPage;
