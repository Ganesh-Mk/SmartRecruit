import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const [isEmail, setisEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      setisEmail(email);
    }
  }, [isEmail]);

  const handleButtonClick = () => {
    if (isEmail) {
      navigate("/recruiter");
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center space-y-8">
          {/* Main Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
            Transform Your Hiring
            <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              With AI-Powered Recruitment
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            Streamline your recruitment process with automated scheduling,
            candidate management, and seamless hiring workflows.
          </p>

          {/* CTA button */}
          <div className="mt-10">
            <button
              onClick={handleButtonClick}
              className="relative font-extrabold text-xl tracking-wide bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:from-blue-800 active:to-blue-700 text-white px-10 py-6 rounded-full shadow-lg hover:shadow-xl active:shadow-md transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0 hover:scale-[1.02] active:scale-[0.98]"
            >
              Create a Smart Recruit
            </button>
          </div>

          {/* Optional Stats or Social Proof */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600">100%</div>
              <div className="text-gray-600 mt-1">Interview Validation</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">3</div>
              <div className="text-gray-600 mt-1">interview Rounds</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">24/7</div>
              <div className="text-gray-600 mt-1">AI-Powered Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
