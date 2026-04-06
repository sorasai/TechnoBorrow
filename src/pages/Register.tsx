import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";
import "../css/auth.css";
import RegisterForm from "../components/auth/RegisterForm";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");

    // Validate empty fields
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await authApi.register({ email, passwordHash: password, fullName });
      
      if (typeof response === 'string' && response.startsWith('Error:')) {
        setError(response.replace('Error: ', ''));
        return;
      }
      
      if (response && response.id) {
        authApi.setCurrentUser(response);
        navigate("/dashboard");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err: any) {
      setError("An error occurred connecting to the server.");
    }
  };

  return (
    <RegisterForm
      fullName={fullName}
      email={email}
      password={password}
      confirmPassword={confirmPassword}
      agreed={agreed}
      error={error}
      onFullNameChange={(e) => setFullName(e.target.value)}
      onEmailChange={(e) => setEmail(e.target.value)}
      onPasswordChange={(e) => setPassword(e.target.value)}
      onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
      onAgreedChange={(e) => setAgreed(e.target.checked)}
      onSubmit={handleRegister}
    />
  );
}

export default Register;
