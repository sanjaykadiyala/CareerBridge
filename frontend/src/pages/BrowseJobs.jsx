import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplyJobModal from "./ApplyJobModal";
import "./Jobs.css";

function BrowseJobs() {
  const navigate = useNavigate();

  const [token] = useState(() => localStorage.getItem("token"));

  const [student] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [applyingJobId, setApplyingJobId] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("All");

  const [message, setMessage] = useState({
    text: "",
    type: "success",
  });

  useEffect(() => {
    if (!token || !student || student.role !== "student") {
      navigate("/student-login");
      return;
    }

    const controller = new AbortController();

    async function loadJobsAndApplications() {
      try {
        const [jobsResponse, applicationsResponse] = await Promise.all([
          fetch("http://localhost:5000/api/jobs", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }),

          fetch("http://localhost:5000/api/applications/mine", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }),
        ]);

        const [jobsData, applicationsData] = await Promise.all([
          jobsResponse.json(),
          applicationsResponse.json(),
        ]);

        if (jobsResponse.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/student-login", { replace: true });
          return;
        }

        if (!jobsResponse.ok) {
          throw new Error(jobsData.message || "Unable to load jobs");
        }

        if (!applicationsResponse.ok) {
          throw new Error(
            applicationsData.message || "Unable to load applications"
          );
        }

        setJobs(jobsData.jobs || []);

        const jobIds = (applicationsData.applications || [])
          .filter((application) => application.job)
          .map((application) => application.job._id);

        setAppliedJobIds(new Set(jobIds));
      } catch (error) {
        if (error.name !== "AbortError") {
          setMessage({
            text: error.message,
            type: "error",
          });
        }
      } finally {
        setLoading(false);
      }
    }

    loadJobsAndApplications();

    return () => controller.abort();
  }, [navigate, student, token]);

  const jobTypes = useMemo(() => {
    const availableTypes = jobs
      .map((job) => job.jobType)
      .filter(Boolean);

    return ["All", ...new Set(availableTypes)];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    return jobs.filter((job) => {
      const searchableText = [
        job.title,
        job.company,
        job.location,
        job.description,
        ...(job.skills || []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !search || searchableText.includes(search);

      const matchesJobType =
        selectedJobType === "All" ||
        job.jobType === selectedJobType;

      return matchesSearch && matchesJobType;
    });
  }, [jobs, searchText, selectedJobType]);

  async function handleApply(jobId, coverLetter) {
    setApplyingJobId(jobId);
    setMessage({ text: "", type: "success" });

    try {
      const response = await fetch(
        `http://localhost:5000/api/applications/${jobId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            coverLetter,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setAppliedJobIds((currentIds) => {
            const updatedIds = new Set(currentIds);
            updatedIds.add(jobId);
            return updatedIds;
          });
        }

        throw new Error(
          data.message || "Unable to apply for this job"
        );
      }

      setAppliedJobIds((currentIds) => {
        const updatedIds = new Set(currentIds);
        updatedIds.add(jobId);
        return updatedIds;
      });

      setMessage({
        text: "Application submitted successfully",
        type: "success",
      });

      return true;
    } catch (error) {
      setMessage({
        text: error.message,
        type: "error",
      });

      return false;
    } finally {
      setApplyingJobId("");
    }
  }

  function clearFilters() {
    setSearchText("");
    setSelectedJobType("All");
  }

  return (
    <div className="jobs-page">
      <div className="jobs-header">
        <div>
          <h1>Available Jobs</h1>
          <p>Find opportunities that match your skills.</p>
        </div>

        <button onClick={() => navigate("/student-dashboard")}>
          Back to Dashboard
        </button>
      </div>

      <section className="jobs-controls">
        <div className="jobs-control">
          <label htmlFor="job-search">Search jobs</label>

          <input
            id="job-search"
            type="text"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search by title, company, location or skill"
          />
        </div>

        <div className="jobs-control">
          <label htmlFor="job-type">Job type</label>

          <select
            id="job-type"
            value={selectedJobType}
            onChange={(event) =>
              setSelectedJobType(event.target.value)
            }
          >
            {jobTypes.map((jobType) => (
              <option value={jobType} key={jobType}>
                {jobType}
              </option>
            ))}
          </select>
        </div>

        {(searchText || selectedJobType !== "All") && (
          <button
            className="clear-filters-button"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        )}
      </section>

      {!loading && (
        <div className="jobs-results-count">
          Showing <strong>{filteredJobs.length}</strong> of{" "}
          <strong>{jobs.length}</strong> jobs
        </div>
      )}

      {message.text && (
        <p className={`jobs-message ${message.type}`}>
          {message.text}
        </p>
      )}

      {loading ? (
        <p className="jobs-message">Loading jobs...</p>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.length === 0 ? (
            <p>
              No jobs match your search.
              <br />
              Try another keyword or job type.
            </p>
          ) : (
            filteredJobs.map((job) => {
              const hasApplied = appliedJobIds.has(job._id);

              return (
                <article className="job-card" key={job._id}>
                  <span className="job-type">
                    {job.jobType}
                  </span>

                  <h2>{job.title}</h2>
                  <h3>{job.company}</h3>

                  <p>
                    <strong>Location:</strong> {job.location}
                  </p>

                  <p>
                    <strong>Salary:</strong>{" "}
                    {job.salary || "Not disclosed"}
                  </p>

                  <p>{job.description}</p>

                  {job.skills?.length > 0 && (
                    <p>
                      <strong>Skills:</strong>{" "}
                      {job.skills.join(", ")}
                    </p>
                  )}

                  {job.applicationDeadline && (
                    <p>
                      <strong>Deadline:</strong>{" "}
                      {new Date(
                        job.applicationDeadline
                      ).toLocaleDateString("en-IN")}
                    </p>
                  )}

                  <p>
                    <strong>Posted by:</strong>{" "}
                    {job.postedBy?.name || "HR Professional"}
                  </p>

                  <button
                    className={
                      hasApplied
                        ? "apply-button applied"
                        : "apply-button"
                    }
                    disabled={hasApplied}
                    onClick={() => setSelectedJob(job)}
                  >
                    {hasApplied ? "Applied" : "Apply Now"}
                  </button>
                </article>
              );
            })
          )}
        </div>
      )}

      {selectedJob && (
        <ApplyJobModal
          job={selectedJob}
          applying={applyingJobId === selectedJob._id}
          onApply={handleApply}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}

export default BrowseJobs;