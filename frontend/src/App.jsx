import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import Navbar from "./components/Navbar";
import AllJobsDisplay from "./pages/AllJobs";
import Dashboard from "./pages/Dashboard"


const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/jobs" element={<AllJobsDisplay />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;