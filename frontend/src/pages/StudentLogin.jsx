import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function StudentLogin() {
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
          role: "student",
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
      navigate("/student-dashboard");
    } catch (error) {
      setIsError(true);
      setMessage("Cannot connect to the backend server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <Link to="/" className="back-home">
        ← Back to home
      </Link>

      <section className="login-card">
        <div className="login-icon">S</div>
        <h1>Student Login</h1>
        <p>Access your profile, jobs and applications.</p>

        <form onSubmit={handleLogin}>
          <label htmlFor="student-email">Email address</label>
          <input
            id="student-email"
            type="email"
            placeholder="student@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="student-password">Password</label>
          <input
            id="student-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login as Student"}
          </button>
        </form>

        {message && (
          <p className={`form-message ${isError ? "error" : "success"}`}>
            {message}
          </p>
        )}

        <p className="account-text">
          New student? <Link to="/student-register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}

export default StudentLogin;