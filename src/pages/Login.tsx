import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";
import "../css/auth.css";
import LoginForm from "../components/auth/LoginForm";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    // Validate empty fields
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
      onEmailChange={(e) => setEmail(e.target.value)}
      onPasswordChange={(e) => setPassword(e.target.value)}
      onSubmit={handleLogin}
    />
  );
}

export default Login;
