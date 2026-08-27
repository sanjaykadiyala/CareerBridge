import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function StudentRegister() {
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
            role: "student",
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

      navigate("/student-dashboard");
    } catch (error) {
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
        <h1>Create Student Account</h1>
        <p>Start building your professional profile.</p>

        <form onSubmit={handleRegister}>
          <label htmlFor="student-name">Full name</label>
          <input
            id="student-name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="register-email">Email address</label>
          <input
            id="register-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            minLength="6"
            required
          />

          <label htmlFor="confirm-password">Confirm password</label>
          <input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            minLength="6"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Student Account"}
          </button>
        </form>

        {message && <p className="form-message error">{message}</p>}

        <p className="account-text">
          Already registered? <Link to="/student-login">Student Login</Link>
        </p>
      </section>
    </main>
  );
}

export default StudentRegister;