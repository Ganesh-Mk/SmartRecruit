import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";

function HRRoundEntrance() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const submitHandler = () => {
    if (input && input.includes("@")) {
      navigate(`/hrRound/${input}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      submitHandler();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md transform transition-all duration-300 hover:scale-105">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">
          HR Interview Access
        </h2>
        <div className="relative">
          <input
            type="email"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your email"
            className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 
              ${
                input && input.includes("@")
                  ? "border-green-500 focus:ring-green-300"
                  : "border-gray-300 focus:ring-blue-300"
              }`}
          />
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <button
          onClick={submitHandler}
          disabled={!input || !input.includes("@")}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`w-full mt-4 py-3 rounded-lg text-white font-semibold transition-all duration-300 flex items-center justify-center
            ${
              input && input.includes("@")
                ? "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          Join Interview
          <ArrowRight
            className={`ml-2 transition-transform duration-300 
              ${
                isHovered && input && input.includes("@") ? "translate-x-1" : ""
              }`}
          />
        </button>

        {input && !input.includes("@") && (
          <p className="text-red-500 text-sm mt-2 text-center">
            Please enter a valid email address
          </p>
        )}
      </div>
    </div>
  );
}

export default HRRoundEntrance;
