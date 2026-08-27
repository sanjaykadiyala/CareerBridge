import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentProfile.css";

const emptyForm = {
  headline: "",
  about: "",
  location: "",
  college: "",
  degree: "",
  graduationYear: "",
  skills: "",
  githubUrl: "",
  linkedinUrl: "",
  portfolioUrl: "",
  resumeUrl: "",
};

function StudentProfile() {
  const navigate = useNavigate();

  const [token] = useState(() => localStorage.getItem("token"));

  const [student] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token || !student || student.role !== "student") {
      navigate("/student-login");
      return;
    }

    async function loadProfile() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/student-profiles/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load profile");
        }

        if (data.profile) {
          setProfile(data.profile);
          fillForm(data.profile);
        } else {
          setEditing(true);
        }
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [navigate, student, token]);

  function fillForm(profileData) {
    setForm({
      headline: profileData.headline || "",
      about: profileData.about || "",
      location: profileData.location || "",
      college: profileData.college || "",
      degree: profileData.degree || "",
      graduationYear: profileData.graduationYear || "",
      skills: profileData.skills?.join(", ") || "",
      githubUrl: profileData.githubUrl || "",
      linkedinUrl: profileData.linkedinUrl || "",
      portfolioUrl: profileData.portfolioUrl || "",
      resumeUrl: profileData.resumeUrl || "",
    });
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const skills = form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const response = await fetch(
        "http://localhost:5000/api/student-profiles/me",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            graduationYear: form.graduationYear
              ? Number(form.graduationYear)
              : undefined,
            skills,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save profile");
      }

      setProfile(data.profile);
      fillForm(data.profile);
      setEditing(false);
      setMessage("Profile saved successfully");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  function openLink(url) {
    if (!url) {
      return "#";
    }

    return url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `https://${url}`;
  }

  function cancelEditing() {
    if (profile) {
      fillForm(profile);
      setEditing(false);
    } else {
      navigate("/student-dashboard");
    }
  }

  const studentName =
    profile?.user?.name || student?.name || "Student";

  const studentEmail =
    profile?.user?.email || student?.email || "";

  return (
    <div className="student-profile-page">
      <nav className="profile-navbar">
        <button
          className="profile-brand"
          onClick={() => navigate("/student-dashboard")}
        >
          Career<span>Bridge</span>
        </button>

        <button
          className="profile-dashboard-button"
          onClick={() => navigate("/student-dashboard")}
        >
          Dashboard
        </button>
      </nav>

      {loading ? (
        <div className="profile-loading">Loading your profile...</div>
      ) : (
        <main className="profile-container">
          {message && <div className="profile-message">{message}</div>}

          {editing ? (
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="profile-form-heading">
                <div>
                  <span>STUDENT PROFILE</span>
                  <h1>{profile ? "Edit Profile" : "Create Your Profile"}</h1>
                  <p>
                    Add information that helps recruiters understand your
                    skills and education.
                  </p>
                </div>
              </div>

              <section className="profile-form-section">
                <h2>Professional introduction</h2>

                <div className="profile-form-grid">
                  <label className="full-width">
                    Professional headline
                    <input
                      type="text"
                      name="headline"
                      value={form.headline}
                      onChange={handleChange}
                      maxLength="120"
                      placeholder="Example: Computer Science Graduate | Java Developer"
                      required
                    />
                  </label>

                  <label>
                    Location
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="Example: Chennai, Tamil Nadu"
                    />
                  </label>

                  <label>
                    Graduation year
                    <input
                      type="number"
                      name="graduationYear"
                      value={form.graduationYear}
                      onChange={handleChange}
                      min="2000"
                      max="2100"
                      placeholder="2026"
                    />
                  </label>

                  <label className="full-width">
                    About you
                    <textarea
                      name="about"
                      value={form.about}
                      onChange={handleChange}
                      maxLength="1000"
                      rows="5"
                      placeholder="Write a short introduction about yourself, your interests and career goals."
                    />
                  </label>
                </div>
              </section>

              <section className="profile-form-section">
                <h2>Education and skills</h2>

                <div className="profile-form-grid">
                  <label>
                    College
                    <input
                      type="text"
                      name="college"
                      value={form.college}
                      onChange={handleChange}
                      placeholder="Enter your college name"
                    />
                  </label>

                  <label>
                    Degree
                    <input
                      type="text"
                      name="degree"
                      value={form.degree}
                      onChange={handleChange}
                      placeholder="Example: B.Tech Computer Science"
                    />
                  </label>

                  <label className="full-width">
                    Skills
                    <input
                      type="text"
                      name="skills"
                      value={form.skills}
                      onChange={handleChange}
                      placeholder="Java, Python, React, MongoDB"
                    />
                    <small>Separate each skill using a comma.</small>
                  </label>
                </div>
              </section>

              <section className="profile-form-section">
                <h2>Professional links</h2>

                <div className="profile-form-grid">
                  <label>
                    GitHub URL
                    <input
                      type="text"
                      name="githubUrl"
                      value={form.githubUrl}
                      onChange={handleChange}
                      placeholder="https://github.com/username"
                    />
                  </label>

                  <label>
                    LinkedIn URL
                    <input
                      type="text"
                      name="linkedinUrl"
                      value={form.linkedinUrl}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </label>

                  <label>
                    Portfolio URL
                    <input
                      type="text"
                      name="portfolioUrl"
                      value={form.portfolioUrl}
                      onChange={handleChange}
                      placeholder="https://yourportfolio.com"
                    />
                  </label>

                  <label>
                    Resume URL
                    <input
                      type="text"
                      name="resumeUrl"
                      value={form.resumeUrl}
                      onChange={handleChange}
                      placeholder="Google Drive resume link"
                    />
                  </label>
                </div>
              </section>

              <div className="profile-form-actions">
                <button
                  type="button"
                  className="profile-cancel-button"
                  onClick={cancelEditing}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="profile-save-button"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          ) : (
            <>
              <section className="profile-main-card">
                <div className="profile-cover"></div>

                <div className="profile-main-content">
                  <div className="profile-avatar">
                    {studentName.charAt(0).toUpperCase()}
                  </div>

                  <button
                    className="profile-edit-button"
                    onClick={() => setEditing(true)}
                  >
                    Edit Profile
                  </button>

                  <h1>{studentName}</h1>

                  <p className="profile-headline">
                    {profile?.headline || "Student"}
                  </p>

                  <p className="profile-location">
                    {profile?.location || "Location not added"}
                  </p>

                  <p className="profile-email">{studentEmail}</p>
                </div>
              </section>

              <div className="profile-content-grid">
                <div className="profile-left-column">
                  <section className="profile-information-card">
                    <h2>About</h2>

                    <p>
                      {profile?.about ||
                        "No introduction has been added yet."}
                    </p>
                  </section>

                  <section className="profile-information-card">
                    <h2>Education</h2>

                    <div className="education-item">
                      <div className="education-icon">ED</div>

                      <div>
                        <h3>{profile?.college || "College not added"}</h3>
                        <p>{profile?.degree || "Degree not added"}</p>

                        {profile?.graduationYear && (
                          <span>
                            Graduation year: {profile.graduationYear}
                          </span>
                        )}
                      </div>
                    </div>
                  </section>

                  <section className="profile-information-card">
                    <h2>Skills</h2>

                    <div className="profile-skills">
                      {profile?.skills?.length > 0 ? (
                        profile.skills.map((skill) => (
                          <span key={skill}>{skill}</span>
                        ))
                      ) : (
                        <p>No skills have been added yet.</p>
                      )}
                    </div>
                  </section>
                </div>

                <aside className="profile-links-card">
                  <h2>Professional Links</h2>

                  {profile?.githubUrl && (
                    <a
                      href={openLink(profile.githubUrl)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub Profile
                    </a>
                  )}

                  {profile?.linkedinUrl && (
                    <a
                      href={openLink(profile.linkedinUrl)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      LinkedIn Profile
                    </a>
                  )}

                  {profile?.portfolioUrl && (
                    <a
                      href={openLink(profile.portfolioUrl)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Portfolio Website
                    </a>
                  )}

                  {profile?.resumeUrl && (
                    <a
                      href={openLink(profile.resumeUrl)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Resume
                    </a>
                  )}

                  {!profile?.githubUrl &&
                    !profile?.linkedinUrl &&
                    !profile?.portfolioUrl &&
                    !profile?.resumeUrl && (
                      <p>No professional links have been added.</p>
                    )}
                </aside>
              </div>
            </>
          )}
        </main>
      )}
    </div>
  );
}

export default StudentProfile;