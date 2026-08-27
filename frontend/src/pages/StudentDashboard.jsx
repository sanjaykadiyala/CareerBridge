import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./Dashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();

  const [token] = useState(() => localStorage.getItem("token"));

  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  const [stats, setStats] = useState({
    profileCompletion: 0,
    jobsApplied: 0,
    shortlisted: 0,
  });

  const [loadingStats, setLoadingStats] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token || user?.role !== "student") {
      setLoadingStats(false);
      return;
    }

    const controller = new AbortController();

    async function loadDashboardStats() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/dashboard/student",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/student-login", { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load dashboard statistics"
          );
        }

        setStats(data.stats);
      } catch (error) {
        if (error.name !== "AbortError") {
          setMessage(error.message);
        }
      } finally {
        setLoadingStats(false);
      }
    }

    loadDashboardStats();

    return () => {
      controller.abort();
    };
  }, [navigate, token, user]);

  if (!token || user?.role !== "student") {
    return <Navigate to="/student-login" replace />;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-nav">
        <div
          className="dashboard-logo"
          onClick={() => navigate("/student-dashboard")}
        >
          Career<span>Bridge</span>
        </div>

        <div className="dashboard-account">
          <span>{user.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-welcome">
          <p>STUDENT DASHBOARD</p>

          <h1>Welcome, {user.name}</h1>

          <span>
            Build your profile and discover new opportunities.
          </span>
        </section>

        {message && (
          <div className="dashboard-error-message">
            {message}
          </div>
        )}

        <section className="dashboard-stats">
          <article>
            <strong>
              {loadingStats
                ? "..."
                : `${stats.profileCompletion}%`}
            </strong>
            <span>Profile completed</span>
          </article>

          <article>
            <strong>
              {loadingStats ? "..." : stats.jobsApplied}
            </strong>
            <span>Jobs applied</span>
          </article>

          <article>
            <strong>
              {loadingStats ? "..." : stats.shortlisted}
            </strong>
            <span>Shortlisted</span>
          </article>
        </section>

        <section className="dashboard-section">
          <h2>What would you like to do?</h2>

          <div className="dashboard-actions">
            <button onClick={() => navigate("/student/profile")}>
              My Profile
            </button>

            <button onClick={() => navigate("/student/jobs")}>
              Browse Available Jobs
            </button>

            <button
              onClick={() => navigate("/student/applications")}
            >
              My Applications
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default StudentDashboard;