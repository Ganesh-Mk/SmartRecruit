import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Recruiter from "./pages/Recruiter";
import CandidateUpload from "./pages/CandidateUpload";
import RoundSelection from "./pages/RoundSelection";
import AptitudeInfo from "./pages/AptitudeInfo";
import TechnicalInfo from "./pages/TechnicalInfo";
import HRRoundInfo from "./pages/HrRoundInfo";
import TechRound from "./pages/TechRound";
import QuizComponent from "./pages/QuizRound";
import RecruitmentDashboard from "./pages/Dashboard";
import HRRoundEntrance from "./pages/HRRoundEntrance";
import HRRound from "./pages/HRRound.jsx";
import Chat from "./pages/Chat";
import AllJobsDisplay from "./pages/AllJobs";
import CRRound from "./pages/CRRound";
import JobPosting from "./pages/JobPosting";

import JobApplication from "./pages/JobApplication";
import Navbar from "./components/Navbar";
import CommunicationRound from "./pages/CommunicationRound";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/recruiter" element={<Recruiter />} />
        <Route path="/aptitudeInfo" element={<AptitudeInfo />} />
        <Route path="/technicalInfo" element={<TechnicalInfo />} />
        <Route path="/hrInfo" element={<HRRoundInfo />} />
        <Route path="/candidateUpload" element={<CandidateUpload />} />
        <Route path="/jobs" element={<AllJobsDisplay />} />
        <Route path="/roundSelection" element={<RoundSelection />} />
        <Route path="/quizRound" element={<QuizComponent />} />
        <Route path="/dashboard" element={<RecruitmentDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/techRound" element={<TechRound />} />
        <Route path="/techInfo" element={<TechnicalInfo />} />
        <Route path="/hrRoundEntrance" element={<HRRoundEntrance />} />
        <Route path="/hrRound/:id" element={<HRRound />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/jobApplication/:jobId" element={<JobApplication />} />
        <Route path="/communicationRound" element={<CommunicationRound />} />
        <Route path="/jobPosting" element={<JobPosting />} />
      </Routes>
    </Router>
  );
};

export default App;
