import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

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

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div>
      <h2>Login</h2>

      <div>
        <label>Email:</label>
        <br />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <br />

      <div>
        <label>Password:</label>
        <br />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <br />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleLogin}>Login</button>
      <br /><br />

      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;
