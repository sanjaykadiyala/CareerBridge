import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function HRRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleRegister(event) {
    event.preventDefault();
    setMessage("");

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            role: "hr",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Registration failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/hr-dashboard");
    } catch {
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
        <h1>Create HR Account</h1>
        <p>Create an account to recruit suitable candidates.</p>

        <form onSubmit={handleRegister}>
          <label htmlFor="hr-name">Recruiter name</label>
          <input
            id="hr-name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="hr-register-email">Company email</label>
          <input
            id="hr-register-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="hr-register-password">Password</label>
          <input
            id="hr-register-password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            minLength="6"
            required
          />

          <label htmlFor="hr-confirm-password">Confirm password</label>
          <input
            id="hr-confirm-password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            minLength="6"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create HR Account"}
          </button>
        </form>

        {message && <p className="form-message error">{message}</p>}

        <p className="account-text">
          Already registered? <Link to="/hr-login">HR Login</Link>
        </p>
      </section>
    </main>
  );
}

export default HRRegister;