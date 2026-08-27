import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./Dashboard.css";

function HRDashboard() {
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
    activeJobs: 0,
    applications: 0,
    shortlisted: 0,
  });

  const [loadingStats, setLoadingStats] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token || user?.role !== "hr") {
      setLoadingStats(false);
      return;
    }

    const controller = new AbortController();

    async function loadDashboardStats() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/dashboard/hr",
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
          navigate("/hr-login", { replace: true });
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

  if (!token || user?.role !== "hr") {
    return <Navigate to="/hr-login" replace />;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <div className="dashboard-page hr-dashboard">
      <header className="dashboard-nav">
        <div
          className="dashboard-logo"
          onClick={() => navigate("/hr-dashboard")}
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
          <p>HR DASHBOARD</p>

          <h1>Welcome, {user.name}</h1>

          <span>
            Find suitable candidates and manage your job openings.
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
              {loadingStats ? "..." : stats.activeJobs}
            </strong>
            <span>Active jobs</span>
          </article>

          <article>
            <strong>
              {loadingStats ? "..." : stats.applications}
            </strong>
            <span>Applications</span>
          </article>

          <article>
            <strong>
              {loadingStats ? "..." : stats.shortlisted}
            </strong>
            <span>Shortlisted</span>
          </article>
        </section>

        <section className="dashboard-section">
          <h2>Recruitment actions</h2>

          <div className="dashboard-actions">
            <button onClick={() => navigate("/hr/jobs/new")}>
              Post a New Job
            </button>

            <button onClick={() => navigate("/hr/jobs/manage")}>
              Manage Jobs & Applicants
            </button>

            <button onClick={() => navigate("/hr/profile")}>
              Company Profile
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HRDashboard;