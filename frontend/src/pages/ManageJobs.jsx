import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ManageJobs.css";

function ManageJobs() {
  const navigate = useNavigate();

  const [token] = useState(() => localStorage.getItem("token"));

  const [hrUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token || !hrUser || hrUser.role !== "hr") {
      navigate("/hr-login");
      return;
    }

    async function loadMyJobs() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/jobs/mine",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load jobs");
        }

        setJobs(data.jobs || []);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadMyJobs();
  }, [navigate, token, hrUser]);

  async function viewApplicants(job) {
    setSelectedJob(job);
    setApplications([]);
    setLoadingApplicants(true);
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/applications/job/${job._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load applicants");
      }

      setApplications(data.applications || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoadingApplicants(false);
    }
  }

  async function updateStatus(applicationId, status) {
    setUpdatingId(applicationId);
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/applications/${applicationId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update status");
      }

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application._id === applicationId
            ? { ...application, status }
            : application
        )
      );

      setMessage(`Application ${status.toLowerCase()} successfully`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setUpdatingId("");
    }
  }

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
    <div className="manage-page">
      <header className="manage-header">
        <div>
          <span className="manage-label">HR WORKSPACE</span>

          <h1>{selectedJob ? "Job Applicants" : "Manage Jobs"}</h1>

          <p>
            {selectedJob
              ? `Review candidates who applied for ${selectedJob.title}.`
              : "View your job posts and manage student applications."}
          </p>
        </div>

        <div className="manage-header-buttons">
          {selectedJob && (
            <button
              className="secondary-button"
              onClick={() => {
                setSelectedJob(null);
                setApplications([]);
                setMessage("");
              }}
            >
              Back to Jobs
            </button>
          )}

          <button
            className="secondary-button"
            onClick={() => navigate("/hr-dashboard")}
          >
            Dashboard
          </button>
        </div>
      </header>

      {message && <div className="manage-message">{message}</div>}

      {!selectedJob ? (
        <main className="manage-content">
          {loading ? (
            <div className="manage-empty">Loading your jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="manage-empty">
              <h2>No jobs posted yet</h2>
              <p>Create your first job to start receiving applications.</p>

              <button onClick={() => navigate("/hr/jobs/new")}>
                Post a Job
              </button>
            </div>
          ) : (
            <div className="manage-jobs-grid">
              {jobs.map((job) => (
                <article className="manage-job-card" key={job._id}>
                  <div className="manage-card-top">
                    <span className="manage-job-type">{job.jobType}</span>

                    <span className={`manage-job-status ${job.status}`}>
                      {job.status}
                    </span>
                  </div>

                  <h2>{job.title}</h2>
                  <h3>{job.company}</h3>

                  <div className="manage-job-details">
                    <p>
                      <span>Location</span>
                      <strong>{job.location}</strong>
                    </p>

                    <p>
                      <span>Salary</span>
                      <strong>{job.salary || "Not disclosed"}</strong>
                    </p>

                    <p>
                      <span>Deadline</span>
                      <strong>{formatDate(job.applicationDeadline)}</strong>
                    </p>
                  </div>

                  <p className="manage-description">{job.description}</p>

                  <button
                    className="view-applicants-button"
                    onClick={() => viewApplicants(job)}
                  >
                    View Applicants
                  </button>
                </article>
              ))}
            </div>
          )}
        </main>
      ) : (
        <main className="applicants-content">
          <section className="selected-job">
            <span>{selectedJob.jobType}</span>
            <h2>{selectedJob.title}</h2>
            <p>
              {selectedJob.company} • {selectedJob.location}
            </p>
          </section>

          <div className="applicants-heading">
            <h2>Applicants</h2>
            <span>{applications.length} applications</span>
          </div>

          {loadingApplicants ? (
            <div className="manage-empty">Loading applicants...</div>
          ) : applications.length === 0 ? (
            <div className="manage-empty">
              <h2>No applications yet</h2>
              <p>Students have not applied for this job yet.</p>
            </div>
          ) : (
            <div className="applicants-list">
              {applications.map((application) => (
                <article className="applicant-card" key={application._id}>
                  <div className="applicant-profile">
                    <div className="applicant-avatar">
                      {application.student?.name?.charAt(0).toUpperCase() || "S"}
                    </div>

                    <div>
                      <h3>{application.student?.name || "Student"}</h3>
                      <p>{application.student?.email}</p>
                      <small>
                        Applied on {formatDate(application.createdAt)}
                      </small>
                    </div>
                  </div>

                  <span
                    className={`applicant-status ${application.status.toLowerCase()}`}
                  >
                    {application.status}
                  </span>

                  <div className="cover-letter">
                    <strong>Cover letter</strong>
                    <p>
                      {application.coverLetter ||
                        "No cover letter was submitted."}
                    </p>
                  </div>

                  <div className="applicant-actions">
                    <button
  className="view-profile-button"
  onClick={() =>
    navigate(`/students/${application.student._id}`)
  }
>
  View Profile
</button>
                    <button
                      className="shortlist-button"
                      disabled={
                        updatingId === application._id ||
                        application.status === "Shortlisted"
                      }
                      onClick={() =>
                        updateStatus(application._id, "Shortlisted")
                      }
                    >
                      Shortlist
                    </button>

                    <button
                      className="reject-button"
                      disabled={
                        updatingId === application._id ||
                        application.status === "Rejected"
                      }
                      onClick={() =>
                        updateStatus(application._id, "Rejected")
                      }
                    >
                      Reject
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      )}
    </div>
  );
}

export default ManageJobs;