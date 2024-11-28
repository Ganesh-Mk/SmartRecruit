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
import QuizComponent from "./pages/quizRound";
import RecruitmentDashboard from "./pages/Dashboard";
import HRRoundEntrance from "./pages/HRRoundEntrance";
import HRRound from "./pages/HRRound";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/recruiter" element={<Recruiter />} />
        <Route path="/aptitudeInfo" element={<AptitudeInfo />} />
        <Route path="/technicalInfo" element={<TechnicalInfo />} />
        <Route path="/hrInfo" element={<HRRoundInfo />} />
        <Route path="/candidateUpload" element={<CandidateUpload />} />
        <Route path="/roundSelection" element={<RoundSelection />} />
        <Route path="/quizRound" element={<QuizComponent />} />
        <Route path="/dashboard" element={<RecruitmentDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/techRound" element={<TechRound />} />
        <Route path="/techInfo" element={<TechnicalInfo />} />
        <Route path="/hrRoundEntrance" element={<HRRoundEntrance />} />
        <Route path="/hrRound/:id" element={<HRRound />} />
      </Routes>
    </Router>
  );
};

export default App;
