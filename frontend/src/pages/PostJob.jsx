import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "./JobForm.css";

const initialForm = {
  title: "",
  company: "",
  location: "",
  jobType: "Full-time",
  description: "",
  skills: "",
  salary: "",
  applicationDeadline: "",
};

function PostJob() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  if (!token || user?.role !== "hr") {
    return <Navigate to="/hr-login" replace />;
  }

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          skills: form.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsError(true);
        setMessage(data.message || "Unable to post job");
        return;
      }

      setIsError(false);
      setMessage("Job posted successfully");
      setForm(initialForm);
    } catch {
      setIsError(true);
      setMessage("Cannot connect to the backend server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="job-form-page">
      <header className="job-form-header">
        <div className="dashboard-logo">
          Career<span>Bridge</span>
        </div>

        <Link to="/hr-dashboard">← Back to dashboard</Link>
      </header>

      <section className="job-form-container">
        <div className="job-form-title">
          <p>HR RECRUITMENT</p>
          <h1>Post a new job</h1>
          <span>Provide the information students need before applying.</span>
        </div>

        <form className="job-form-card" onSubmit={handleSubmit}>
          <div className="job-form-grid">
            <div>
              <label htmlFor="job-title">Job title</label>
              <input
                id="job-title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="company">Company</label>
              <input
                id="company"
                name="company"
                value={form.company}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="job-type">Job type</label>
              <select
                id="job-type"
                name="jobType"
                value={form.jobType}
                onChange={handleChange}
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
                <option>Contract</option>
              </select>
            </div>

            <div>
              <label htmlFor="salary">Salary</label>
              <input
                id="salary"
                name="salary"
                placeholder="Example: 3.5-5 LPA"
                value={form.salary}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="deadline">Application deadline</label>
              <input
                id="deadline"
                name="applicationDeadline"
                type="date"
                value={form.applicationDeadline}
                onChange={handleChange}
              />
            </div>

            <div className="full-width">
              <label htmlFor="skills">Required skills</label>
              <input
                id="skills"
                name="skills"
                placeholder="JavaScript, React, Node.js"
                value={form.skills}
                onChange={handleChange}
              />
            </div>

            <div className="full-width">
              <label htmlFor="description">Job description</label>
              <textarea
                id="description"
                name="description"
                rows="6"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {message && (
            <p className={`job-message ${isError ? "error" : "success"}`}>
              {message}
            </p>
          )}

          <button className="post-job-button" type="submit" disabled={loading}>
            {loading ? "Posting job..." : "Post Job"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default PostJob;