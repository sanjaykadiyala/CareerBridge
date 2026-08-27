import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./StudentProfile.css";

function ViewStudentProfile() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    async function loadStudentProfile() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/student-profiles/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load student profile");
        }

        setProfile(data.profile);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadStudentProfile();
  }, [navigate, token, userId]);

  function openLink(url) {
    if (!url) {
      return "#";
    }

    return url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `https://${url}`;
  }

  const studentName = profile?.user?.name || "Student";
  const studentEmail = profile?.user?.email || "";

  return (
    <div className="student-profile-page">
      <nav className="profile-navbar">
        <button className="profile-brand" onClick={() => navigate("/")}>
          Career<span>Bridge</span>
        </button>

        <button
          className="profile-dashboard-button"
          onClick={() => navigate(-1)}
        >
          Back to Applicants
        </button>
      </nav>

      {loading ? (
        <div className="profile-loading">Loading student profile...</div>
      ) : (
        <main className="profile-container">
          {message ? (
            <div className="profile-message error">
              {message}
            </div>
          ) : (
            <>
              <section className="profile-main-card">
                <div className="profile-cover"></div>

                <div className="profile-main-content">
                  <div className="profile-avatar">
                    {studentName.charAt(0).toUpperCase()}
                  </div>

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
                        "The student has not added an introduction."}
                    </p>
                  </section>

                  <section className="profile-information-card">
                    <h2>Education</h2>

                    <div className="education-item">
                      <div className="education-icon">ED</div>

                      <div>
                        <h3>
                          {profile?.college || "College not added"}
                        </h3>

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
                        <p>The student has not added any skills.</p>
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
                      <p>No professional links were added.</p>
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

export default ViewStudentProfile;