import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import StudentLogin from "./pages/StudentLogin";
import HRLogin from "./pages/HRLogin";
import StudentDashboard from "./pages/StudentDashboard";
import HRDashboard from "./pages/HRDashboard";
import StudentRegister from "./pages/StudentRegister";
import HRRegister from "./pages/HRRegister";
import PostJob from "./pages/PostJob";
import BrowseJobs from "./pages/BrowseJobs";
import MyApplications from "./pages/MyApplications";
import ManageJobs from "./pages/ManageJobs";
import StudentProfile from "./pages/StudentProfile";
import ViewStudentProfile from "./pages/ViewStudentProfile";
import HRProfile from "./pages/HRProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
  <Route path="/hr/profile" element={<HRProfile />} />
  <Route path="/student/applications" element={<MyApplications />}/>
  <Route path="/students/:userId" element={<ViewStudentProfile />}/>
  <Route path="/student/profile" element={<StudentProfile />} />
  <Route path="/hr/jobs/manage" element={<ManageJobs />} />
  <Route path="/" element={<Home />} />
  <Route path="/student/jobs" element={<BrowseJobs />} />
  <Route path="/student-login" element={<StudentLogin />} />
  <Route path="/student-register" element={<StudentRegister />} />
  <Route path="/hr/jobs/new" element={<PostJob />} />
  <Route path="/hr-login" element={<HRLogin />} />
  <Route path="/hr-register" element={<HRRegister />} />
  <Route path="/student-dashboard" element={<StudentDashboard />} />
  <Route path="/hr-dashboard" element={<HRDashboard />} />
</Routes>
    </BrowserRouter>
  );
}

export default App;