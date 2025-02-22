import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowRight, User, UserRound } from "lucide-react";

function HRRoundEntrance() {
  const navigate = useNavigate();
  const [recruiterEmail, setRecruiterEmail] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [candidateEmail, setCandidateEmail] = useState("");

  const submitHandler = () => {
    localStorage.setItem("candidateEmailForMeet", candidateEmail);
    if (recruiterEmail && recruiterEmail.includes("@")) {
      navigate(`/hrRound/${recruiterEmail}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      submitHandler();
    }
  };

  useEffect(() => {
    const storedCandidateEmail = localStorage.getItem("interviewCandidateEmail");
    const storedRecruiterEmail = localStorage.getItem("interviewRecruiterEmail");
    if (storedCandidateEmail) {
      setCandidateEmail(storedCandidateEmail);
    }
    if (storedRecruiterEmail) {
      setRecruiterEmail(storedRecruiterEmail);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md transform transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full">
            <UserRound className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">
          HR Interview Setup
        </h2>

        {/* Recruiter Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <User className="w-4 h-4 mr-2" />
            You are conducting the interview as:
          </label>
          <div className="relative">
            <input
              type="email"
              value={recruiterEmail}
              onChange={(e) => setRecruiterEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Recruiter Email"
              className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 
                ${recruiterEmail && recruiterEmail.includes("@")
                  ? "border-green-500 focus:ring-green-300"
                  : "border-gray-300 focus:ring-blue-300"
                }`}
            />
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Candidate Section */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <UserRound className="w-4 h-4 mr-2" />
            You are interviewing:
          </label>
          <div className="relative">
            <input
              type="email"
              value={candidateEmail}
              onChange={(e) => setCandidateEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Candidate Email"
              className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 
                ${candidateEmail && candidateEmail.includes("@")
                  ? "border-green-500 focus:ring-green-300"
                  : "border-gray-300 focus:ring-blue-300"
                }`}
            />
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <button
          onClick={submitHandler}
          disabled={!recruiterEmail || !recruiterEmail.includes("@")}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`w-full py-4 rounded-lg text-white font-semibold transition-all duration-300 flex items-center justify-center
            ${recruiterEmail && recruiterEmail.includes("@")
              ? "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
              : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          Start Interview
          <ArrowRight
            className={`ml-2 transition-transform duration-300 
              ${isHovered && recruiterEmail && recruiterEmail.includes("@") ? "translate-x-1" : ""
              }`}
          />
        </button>

        {recruiterEmail && !recruiterEmail.includes("@") && (
          <p className="text-red-500 text-sm mt-2 text-center">
            Please enter a valid email address
          </p>
        )}
      </div>
    </div>
  );
}

export default HRRoundEntrance;