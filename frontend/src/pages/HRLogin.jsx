import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function HRLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role: "hr",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsError(true);
        setMessage(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setIsError(false);
      navigate("/hr-dashboard");
    } catch (error) {
      setIsError(true);
      setMessage("Cannot connect to the backend server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page hr-login-page">
      <Link to="/" className="back-home">
        ← Back to home
      </Link>

      <section className="login-card">
        <div className="login-icon hr-login-icon">HR</div>
        <h1>HR Login</h1>
        <p>Access your company, jobs and candidate applications.</p>

        <form onSubmit={handleLogin}>
          <label htmlFor="hr-email">Company email</label>
          <input
            id="hr-email"
            type="email"
            placeholder="hr@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="hr-password">Password</label>
          <input
            id="hr-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login as HR"}
          </button>
        </form>

        {message && (
          <p className={`form-message ${isError ? "error" : "success"}`}>
            {message}
          </p>
        )}

        <p className="account-text">
          New recruiter? <Link to="/hr-register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}

export default HRLogin;