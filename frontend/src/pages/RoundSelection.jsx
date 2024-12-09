import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RoundSelection = () => {
  const [selectedRounds, setSelectedRounds] = useState({
    aptitude: false,
    technical: false,
    hrRound: false,
  });

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

  const [roundDurations, setRoundDurations] = useState({
    aptitude: "30", // Default duration
    technical: "60", // Default duration
    hrRound: "60", // Default duration
  });

  const navigate = useNavigate();

  const handleRoundChange = (round) => {
    setSelectedRounds((prev) => ({
      ...prev,
      [round]: !prev[round],
    }));
    // Clear duration when deselecting a round
    if (selectedRounds[round]) {
      setRoundDurations((prev) => ({
        ...prev,
        [round]: "0",
      }));
    }
  };

  const handleDurationChange = (round, value) => {
    setRoundDurations((prev) => ({
      ...prev,
      [round]: value,
    }));
  };

  const handleSubmit = () => {
    try {
      const response = axios.post(`${BACKEND_URL}/updateUser`, {
        userId: localStorage.getItem("userId"),
        roundDurations,
      })

      console.log("Sucessfully updated round durations in DB", response);
    } catch (error) {
      console.error("Error updating round durations:", error);
      
    }
    if (selectedRounds.aptitude === true) {
      localStorage.setItem("aptitude", true);
      localStorage.setItem("aptitudeDuration", roundDurations.aptitude || "0");
    }
    if (selectedRounds.technical === true) {
      localStorage.setItem("technical", true);
      localStorage.setItem(
        "technicalDuration",
        roundDurations.technical || "0"
      );
    }
    if (selectedRounds.hrRound === true) {
      localStorage.setItem("hrRound", true);
      localStorage.setItem("hrRoundDuration", roundDurations.hrRound || "0");
    }

    if (selectedRounds.aptitude === true) {
      navigate("/aptitudeInfo");
    } else if (selectedRounds.technical === true) {
      navigate("/technicalInfo");
    } else if (selectedRounds.hrRound === true) {
      navigate("/hrInfo");
    } else {
      alert("Please select at least one round.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl p-8">
        <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Rounds Selection
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Choose which interview rounds you would like to conduct for the
          recruitment process. Specify the duration for each round as well.
        </p>

        <div className="space-y-6 bg-white p-8 rounded-lg border-2 border-gray-200">
          {/* Aptitude Round */}
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                id="aptitude"
                checked={selectedRounds.aptitude}
                onChange={() => handleRoundChange("aptitude")}
                className="w-5 h-5 border-2 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label
                htmlFor="aptitude"
                className="text-xl font-medium text-gray-800 cursor-pointer"
              >
                Aptitude/Reasoning Round
              </label>
            </div>
            {selectedRounds.aptitude && (
              <div className="ml-8">
                <label
                  htmlFor="aptitudeTime"
                  className="block text-gray-600 text-sm font-medium"
                >
                  Duration (in minutes):
                </label>
                <input
                  type="number"
                  id="aptitudeTime"
                  step="5" 
                  value={roundDurations.aptitude}
                  onChange={(e) =>
                    handleDurationChange("aptitude", e.target.value)
                  }
                  className="mt-1 bg-gray-200 p-2 border rounded-md w-24"
                />
              </div>
            )}
          </div>

          {/* Technical Round */}
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                id="technical"
                checked={selectedRounds.technical}
                onChange={() => handleRoundChange("technical")}
                className="w-5 h-5 border-2 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label
                htmlFor="technical"
                className="text-xl font-medium text-gray-800 cursor-pointer"
              >
                Technical Round
              </label>
            </div>
            {selectedRounds.technical && (
              <div className="ml-8">
                <label
                  htmlFor="technicalTime"
                  className="block text-gray-600 text-sm font-medium"
                >
                  Duration (in minutes):
                </label>
                <input
                  type="number"
                  id="technicalTime"
                  min="0"
                  step="5" // Increment by 5
                  value={roundDurations.technical}
                  onChange={(e) =>
                    handleDurationChange("technical", e.target.value)
                  }
                  className="mt-1 p-2 bg-gray-200 border rounded-md w-24"
                />
              </div>
            )}
          </div>

          {/* HR Round */}
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                id="hrRound"
                checked={selectedRounds.hrRound}
                onChange={() => handleRoundChange("hrRound")}
                className="w-5 h-5 border-2 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label
                htmlFor="hrRound"
                className="text-xl font-medium text-gray-800 cursor-pointer"
              >
                HR Round/Final Interview
              </label>
            </div>
            {selectedRounds.hrRound && (
              <div className="ml-8">
                <label
                  htmlFor="hrTime"
                  className="block text-gray-600 text-sm font-medium"
                >
                  Duration (in minutes):
                </label>
                <input
                  type="number"
                  id="hrTime"
                  min="0"
                  step="5" // Increment by 5
                  value={roundDurations.hrRound}
                  onChange={(e) =>
                    handleDurationChange("hrRound", e.target.value)
                  }
                  className="mt-1 bg-gray-200 p-2 border rounded-md w-24"
                />
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-6 py-3 px-6 text-lg text-white font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Confirm Selection
        </button>
      </div>
    </div>
  );
};

export default RoundSelection;
