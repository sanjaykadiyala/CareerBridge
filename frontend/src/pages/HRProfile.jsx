import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentProfile.css";

const emptyForm = {
  designation: "",
  companyName: "",
  industry: "",
  companyLocation: "",
  companySize: "",
  aboutCompany: "",
  companyWebsite: "",
  companyLinkedin: "",
  companyLogoUrl: "",
};

function HRProfile() {
  const navigate = useNavigate();

  const [token] = useState(() => localStorage.getItem("token"));

  const [hrUser] = useState(() => {
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
  const [logoFailed, setLogoFailed] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    type: "success",
  });

  useEffect(() => {
    if (!token || !hrUser || hrUser.role !== "hr") {
      navigate("/hr-login");
      return;
    }

    async function loadProfile() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/hr-profiles/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load HR profile");
        }

        if (data.profile) {
          setProfile(data.profile);
          fillForm(data.profile);
        } else {
          setEditing(true);
        }
      } catch (error) {
        setMessage({
          text: error.message,
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [navigate, token, hrUser]);

  function fillForm(profileData) {
    setForm({
      designation: profileData.designation || "",
      companyName: profileData.companyName || "",
      industry: profileData.industry || "",
      companyLocation: profileData.companyLocation || "",
      companySize: profileData.companySize || "",
      aboutCompany: profileData.aboutCompany || "",
      companyWebsite: profileData.companyWebsite || "",
      companyLinkedin: profileData.companyLinkedin || "",
      companyLogoUrl: profileData.companyLogoUrl || "",
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
    setMessage({ text: "", type: "success" });

    try {
      const response = await fetch(
        "http://localhost:5000/api/hr-profiles/me",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save HR profile");
      }

      setProfile(data.profile);
      fillForm(data.profile);
      setLogoFailed(false);
      setEditing(false);

      setMessage({
        text: "HR profile saved successfully",
        type: "success",
      });
    } catch (error) {
      setMessage({
        text: error.message,
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  function cancelEditing() {
    if (profile) {
      fillForm(profile);
      setEditing(false);
    } else {
      navigate("/hr-dashboard");
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

  const recruiterName =
    profile?.user?.name || hrUser?.name || "HR Professional";

  const recruiterEmail =
    profile?.user?.email || hrUser?.email || "";

  const companyName = profile?.companyName || "Company";

  return (
    <div className="student-profile-page">
      <nav className="profile-navbar">
        <button
          className="profile-brand"
          onClick={() => navigate("/hr-dashboard")}
        >
          Career<span>Bridge</span>
        </button>

        <button
          className="profile-dashboard-button"
          onClick={() => navigate("/hr-dashboard")}
        >
          Dashboard
        </button>
      </nav>

      {loading ? (
        <div className="profile-loading">Loading company profile...</div>
      ) : (
        <main className="profile-container">
          {message.text && (
            <div className={`profile-message ${message.type}`}>
              {message.text}
            </div>
          )}

          {editing ? (
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="profile-form-heading">
                <div>
                  <span>HR PROFILE</span>
                  <h1>
                    {profile ? "Edit Company Profile" : "Create Company Profile"}
                  </h1>
                  <p>
                    Add your company information so students can understand
                    your organisation.
                  </p>
                </div>
              </div>

              <section className="profile-form-section">
                <h2>Recruiter and company information</h2>

                <div className="profile-form-grid">
                  <label>
                    Your designation
                    <input
                      type="text"
                      name="designation"
                      value={form.designation}
                      onChange={handleChange}
                      placeholder="Example: Talent Acquisition Specialist"
                    />
                  </label>

                  <label>
                    Company name
                    <input
                      type="text"
                      name="companyName"
                      value={form.companyName}
                      onChange={handleChange}
                      placeholder="Enter the company name"
                      required
                    />
                  </label>

                  <label>
                    Industry
                    <input
                      type="text"
                      name="industry"
                      value={form.industry}
                      onChange={handleChange}
                      placeholder="Example: Information Technology"
                    />
                  </label>

                  <label>
                    Company location
                    <input
                      type="text"
                      name="companyLocation"
                      value={form.companyLocation}
                      onChange={handleChange}
                      placeholder="Example: Chennai, Tamil Nadu"
                    />
                  </label>

                  <label>
                    Company size
                    <select
                      name="companySize"
                      value={form.companySize}
                      onChange={handleChange}
                    >
                      <option value="">Select company size</option>
                      <option value="1-10 employees">1–10 employees</option>
                      <option value="11-50 employees">11–50 employees</option>
                      <option value="51-200 employees">51–200 employees</option>
                      <option value="201-500 employees">
                        201–500 employees
                      </option>
                      <option value="501-1000 employees">
                        501–1000 employees
                      </option>
                      <option value="1000+ employees">1000+ employees</option>
                    </select>
                  </label>

                  <label>
                    Company logo URL
                    <input
                      type="text"
                      name="companyLogoUrl"
                      value={form.companyLogoUrl}
                      onChange={handleChange}
                      placeholder="Paste an online image URL"
                    />
                  </label>

                  <label className="full-width">
                    About the company
                    <textarea
                      name="aboutCompany"
                      value={form.aboutCompany}
                      onChange={handleChange}
                      rows="6"
                      maxLength="1500"
                      placeholder="Describe the company, its work, culture and opportunities."
                    />
                  </label>
                </div>
              </section>

              <section className="profile-form-section">
                <h2>Company links</h2>

                <div className="profile-form-grid">
                  <label>
                    Company website
                    <input
                      type="text"
                      name="companyWebsite"
                      value={form.companyWebsite}
                      onChange={handleChange}
                      placeholder="https://company.com"
                    />
                  </label>

                  <label>
                    Company LinkedIn
                    <input
                      type="text"
                      name="companyLinkedin"
                      value={form.companyLinkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/company/company-name"
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
                  <div className="profile-avatar company-avatar">
                    {profile?.companyLogoUrl && !logoFailed ? (
                      <img
                        src={profile.companyLogoUrl}
                        alt={`${companyName} logo`}
                        onError={() => setLogoFailed(true)}
                      />
                    ) : (
                      companyName.charAt(0).toUpperCase()
                    )}
                  </div>

                  <button
                    className="profile-edit-button"
                    onClick={() => setEditing(true)}
                  >
                    Edit Profile
                  </button>

                  <h1>{companyName}</h1>

                  <p className="profile-headline">
                    {profile?.industry || "Industry not added"}
                  </p>

                  <p className="profile-location">
                    {profile?.companyLocation || "Location not added"}
                  </p>
                </div>
              </section>

              <div className="profile-content-grid">
                <div className="profile-left-column">
                  <section className="profile-information-card">
                    <h2>About the Company</h2>

                    <p>
                      {profile?.aboutCompany ||
                        "No company description has been added."}
                    </p>
                  </section>

                  <section className="profile-information-card">
                    <h2>Company Information</h2>

                    <div className="company-details-grid">
                      <div>
                        <span>Industry</span>
                        <strong>
                          {profile?.industry || "Not specified"}
                        </strong>
                      </div>

                      <div>
                        <span>Location</span>
                        <strong>
                          {profile?.companyLocation || "Not specified"}
                        </strong>
                      </div>

                      <div>
                        <span>Company size</span>
                        <strong>
                          {profile?.companySize || "Not specified"}
                        </strong>
                      </div>
                    </div>
                  </section>

                  <section className="profile-information-card">
                    <h2>Recruiter Information</h2>

                    <div className="recruiter-details">
                      <h3>{recruiterName}</h3>

                      <p>
                        {profile?.designation ||
                          "HR Professional"}
                      </p>

                      <span>{recruiterEmail}</span>
                    </div>
                  </section>
                </div>

                <aside className="profile-links-card">
                  <h2>Company Links</h2>

                  {profile?.companyWebsite && (
                    <a
                      href={openLink(profile.companyWebsite)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Company Website
                    </a>
                  )}

                  {profile?.companyLinkedin && (
                    <a
                      href={openLink(profile.companyLinkedin)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Company LinkedIn
                    </a>
                  )}

                  {!profile?.companyWebsite &&
                    !profile?.companyLinkedin && (
                      <p>No company links have been added.</p>
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

export default HRProfile;