import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Jobs.css";

function MyApplications() {
  const navigate = useNavigate();

  const [token] = useState(() => localStorage.getItem("token"));

  const [student] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token || !student || student.role !== "student") {
      navigate("/student-login");
      return;
    }

    async function loadApplications() {
      try {
        const response = await fetch(
          "/api/applications/mine",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load applications");
        }

        setApplications(data.applications || []);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, [navigate, student, token]);

  function formatDate(date) {
    if (!date) {
      return "Not specified";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="jobs-page">
      <div className="jobs-header">
        <div>
          <h1>My Applications</h1>
          <p>Track the progress of all your job applications.</p>
        </div>

        <button onClick={() => navigate("/student-dashboard")}>
          Back to Dashboard
        </button>
      </div>

      {loading && <p className="jobs-message">Loading applications...</p>}

      {message && <p className="jobs-message">{message}</p>}

      {!loading && (
        <div className="jobs-grid">
          {applications.length === 0 ? (
            <p>
              You have not applied for any jobs yet.
              <br />
              Visit Browse Jobs to find opportunities.
            </p>
          ) : (
            applications.map((application) => {
              const job = application.job;

              if (!job) {
                return null;
              }

              return (
                <div className="job-card application-card" key={application._id}>
                  <span
                    className={`application-status ${application.status.toLowerCase()}`}
                  >
                    {application.status}
                  </span>

                  <h2>{job.title}</h2>
                  <h3>{job.company}</h3>

                  <p>
                    <strong>Job type:</strong> {job.jobType}
                  </p>

                  <p>
                    <strong>Location:</strong> {job.location}
                  </p>

                  <p>
                    <strong>Salary:</strong>{" "}
                    {job.salary || "Not disclosed"}
                  </p>

                  <p>
                    <strong>Deadline:</strong>{" "}
                    {formatDate(job.applicationDeadline)}
                  </p>

                  <p className="application-date">
                    Applied on {formatDate(application.createdAt)}
                  </p>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default MyApplications;