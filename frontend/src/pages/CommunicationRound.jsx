import React, { useState, useEffect } from "react";
import ReadAndSpeakRound from "../components/ReadAndSpeakRound";
import ListenAndSpeakRound from "../components/ListenAndSpeakRound";
import TopicAndSpeakRound from "../components/TopicAndSpeakRound";
import CommunicationLogin from "../components/CommunicationLogin";
import sendEmailComm from "../components/CommunicationEmail";
import { useNavigate } from "react-router-dom";

const CommunicationRound = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [currentRound, setCurrentRound] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [roundData, setRoundData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const userId = localStorage.getItem("userId");
  const [scores, setScores] = useState({
    round1: null,
    round2: null,
    round3: null,
  });
  const navigate = useNavigate()

  useEffect(() => {
    fetchRoundData();
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setIsLoggedIn(true);
    }
  }, []);

  const fetchRoundData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${BACKEND_URL}/getCommunication/${userId}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error("Failed to fetch round data");
      }

      setRoundData(result.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching round data:", error);
      setError("Failed to load assessment data. Please try again.");
      localStorage.removeItem("userId");
      setLoading(false);
    }
  };

  const handleRoundComplete = (roundNumber, score) => {
    setScores((prev) => ({
      ...prev,
      [`round${roundNumber}`]: score,
    }));
    if (roundNumber < 3) {
      setCurrentRound(roundNumber + 1);
    }
  };

  const handleSubmit = async () => {
    const templateParams = {
      companyName: localStorage.getItem('name'),
      to_email: localStorage.getItem('candidateEmail'), // Send email to the candidate's email
    };

    try {
      await sendEmailComm(templateParams); // Attempt to send the email
      alert('You have completed now, please leve this tab')
      console.log(`Email sent successfully to ${email}`);
    } catch (error) {
      console.error(`Error sending email to ${email}:`, error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <CommunicationLogin onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="text-red-600 text-center mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
            <p className="text-gray-600">{error}</p>
          </div>
          <button
            onClick={fetchRoundData}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
            Communication Assessment
          </h1>
          <div className="flex justify-between items-center bg-white rounded-xl p-6 shadow-lg">
            {[1, 2, 3].map((round) => (
              <div key={round} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${currentRound === round
                      ? "bg-indigo-600 text-white"
                      : currentRound > round
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                >
                  {round}
                </div>
                <span className="mt-2 text-sm font-medium text-gray-600">
                  {round === 1
                    ? "Read & Speak"
                    : round === 2
                      ? "Listen & Speak"
                      : "Topic & Speak"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {currentRound === 1 && roundData && (
          <ReadAndSpeakRound
            questions={roundData.readAndSpeak}
            onComplete={(score) => handleRoundComplete(1, score)}
          />
        )}
        {currentRound === 2 && roundData && (
          <ListenAndSpeakRound
            questions={roundData.listenAndSpeak}
            onComplete={(score) => handleRoundComplete(2, score)}
          />
        )}
        {currentRound === 3 && roundData && (
          <TopicAndSpeakRound
            topics={roundData.topicAndSpeech}
            onComplete={(score) => handleRoundComplete(3, score)}
          />
        )}

        {/* {scores.round3 !== null && (
          <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Assessment Complete!</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span>Read & Speak Score:</span>
                <span className="font-bold text-indigo-600">{scores.round1}%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span>Listen & Speak Score:</span>
                <span className="font-bold text-indigo-600">{scores.round2}%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span>Topic & Speak Score:</span>
                <span className="font-bold text-indigo-600">{scores.round3}%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-indigo-100 rounded-lg">
                <span className="font-bold">Overall Score:</span>
                <span className="font-bold text-indigo-600">
                  {Math.round((scores.round1 + scores.round2 + scores.round3) / 3)}%
                </span>
              </div>
              <button
                onClick={handleSubmit}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg mt-4 transition-colors duration-200"
              >
                Submit Assessment
              </button>
            </div>
          </div>
        )} }

        

        {/* Completion Modal */}

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg mt-4 transition-colors duration-200"
        >
          Submit Assessment
        </button>
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Assessment Completed!
                </h3>
                <p className="text-gray-600 mb-6">
                  You have successfully completed all rounds of the
                  Communication Assessment. You may now leave this page.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunicationRound;
