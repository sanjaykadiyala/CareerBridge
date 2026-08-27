import { useNavigate } from "react-router-dom";
import "./App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">
          Career<span>Bridge</span>
        </div>

        <nav>
          <a href="#about">About</a>
          <a href="#roles">Login</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="about">
          <div className="hero-content">
            <p className="tag">PROFESSIONAL NETWORKING & RECRUITMENT</p>

            <h1>Connect students with the right opportunities.</h1>

            <p className="description">
              Students can showcase their skills and apply for jobs. HR
              professionals can discover candidates and manage applications.
            </p>

            <a className="get-started" href="#roles">
              Get started
            </a>
          </div>

          <div className="hero-box">
            <div>
              <strong>Create</strong>
              <span>Your professional profile</span>
            </div>

            <div>
              <strong>Connect</strong>
              <span>With students and recruiters</span>
            </div>

            <div>
              <strong>Grow</strong>
              <span>Your career or company</span>
            </div>
          </div>
        </section>

        <section className="roles" id="roles">
          <h2>Choose your account</h2>
          <p>Select the correct login to continue.</p>

          <div className="role-container">
            <article className="role-card">
              <div className="role-icon">S</div>
              <h3>Student</h3>
              <p>Create your profile, find jobs and track applications.</p>

              <button
                type="button"
                onClick={() => navigate("/student-login")}
              >
                Student Login
              </button>

              <small>New student? Create an account</small>
            </article>

            <article className="role-card">
              <div className="role-icon hr-icon">HR</div>
              <h3>HR Professional</h3>
              <p>Post jobs, find candidates and manage applications.</p>

              <button type="button" onClick={() => navigate("/hr-login")}>
                HR Login
              </button>

              <small>New recruiter? Create an account</small>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;