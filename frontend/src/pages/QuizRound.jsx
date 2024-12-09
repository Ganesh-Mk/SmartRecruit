import axios from "axios";
import { useEffect, useState } from "react";
import sendProgressEmail from "../components/NextroundEmail";
import sendRejectionEmail from "../components/RejectionEmail";

const QuizComponent = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
  });

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [existingQuizzes, setExistingQuizzes] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [companyName, setCompanyName] = useState(
    localStorage.getItem("companyName") || ""
  );
  const [candidatesEmail, setCandidatesEmails] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  
  // New state for timer
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("No userId found in localStorage.");
          return;
        }
  
        const response = await axios.get(`${BACKEND_URL}/getUserInfo/${userId}`);
        
        setTotalTime(response.data.roundDurations.aptitude);
        
        const emails = response.data.candidateData?.map((candidate) => candidate.email) || [];
        setCandidatesEmails(emails);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
  
    fetchUserInfo();
  }, []);

  // Timer logic
  useEffect(() => {
    let timer;
    if (timerActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleQuizSubmit(); // Auto submit when time is up
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeRemaining === 0 && timerActive) {
      handleQuizSubmit();
    }

    return () => clearInterval(timer);
  }, [timerActive, timeRemaining]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setScore(0);

    const candidateData = candidatesEmail;

    const candidateExists = candidateData.some(
      (candidate) => candidate === userDetails.email
    );

    if (candidateExists) {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/getQuiz`, {
          params: { userId: localStorage.getItem("userId") },
        });
        setExistingQuizzes(response.data);
        setSubmitted(true);
        setLoading(false);

        // Start timer when quiz is fetched
        setTimeRemaining(totalTime * 60); // Convert minutes to seconds
        setTimerActive(true);
      } catch (err) {
        setError("Failed to fetch quiz. Please try again.", err);
        setLoading(false);
      }
    } else {
      setErrors({ email: "This email is not registered in candidate data." });
    }
  };

  const handleAnswerSelect = (quizId, selectedOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [quizId]: selectedOption,
    }));

    const currentQuiz = existingQuizzes[quizId];
    if (currentQuiz && currentQuiz.ans === selectedOption) {
      setScore((prevScore) => prevScore + 1);
    } else if (
      currentQuiz &&
      selectedAnswers[quizId] === currentQuiz.ans
    ) {
      setScore((prevScore) => prevScore - 1);
    }
  };

  const handleQuizSubmit = async () => {
    setTimerActive(false); // Stop the timer
    const userId = localStorage.getItem("userId");
    const userEmail = userDetails.email;

    if (!userEmail) {
      setError("Email is required to send the rejection email.");
      return;
    }

    try {
      const response = await axios.get(`${BACKEND_URL}/getUserInfo/${userId}`);
      const user = response.data;
      const passingMarks = user.aptitudePassingMarks;

      await axios.post(`${BACKEND_URL}/updateUser`, {
        userId,
        userEmail,
        score,
      });

      if (passingMarks <= score) {
        const templateParams = {
          candidateName: userDetails.name,
          roundName: "Technical Round",
          linkForNextRound: "http://localhost:5173/techRound",
          companyName: companyName,
          to_email: "tejhagargi9@gmail.com",
          recipient_address: userDetails.email,
        };

        try {
          await sendProgressEmail(templateParams);
        } catch (emailError) {
          console.error("Failed to send email:", emailError);
        }
      } else {
        const templateParams = {
          candidateName: userDetails.name,
          roundName: "Technical Round",
          companyName: companyName,
          to_email: userDetails.email,
        };

        try {
          await sendRejectionEmail(templateParams);
        } catch (emailError) {
          console.error("Failed to send email:", emailError);
        }
      }

      setSubmitted(false);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  // Format time to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderUserDetailsForm = () => (
    <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Enter Your Details
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={userDetails.name}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.name
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-300"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={userDetails.email}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.email
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:from-blue-600 hover:to-purple-700 transition duration-300 ease-in-out disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Start Quiz"}
        </button>
      </form>
    </div>
  );

  const renderQuizzes = () => (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6">
      {/* Timer Display */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Quiz Questions
        </h2>
        <div 
          className={`text-xl font-bold px-4 py-2 rounded-full ${
            timeRemaining <= 60 ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
          }`}
        >
          Time Remaining: {formatTime(timeRemaining)}
        </div>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          {error}
        </div>
      )}
      {existingQuizzes.length > 0 ? (
        <>
          {existingQuizzes.map((quiz, index) => (
            <div
              key={quiz.id || index}
              className="bg-gray-50 p-5 rounded-lg shadow-sm"
            >
              <h3 className="text-xl font-semibold text-blue-600 mb-4">
                {quiz.que || `Question ${index + 1}`}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {["a", "b", "c", "d"].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswerSelect(index, option)}
                    className={`py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none ${
                      selectedAnswers[index] === option
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white text-gray-800 border border-gray-300 hover:bg-blue-100"
                    }`}
                  >
                    {option.toUpperCase()}: {quiz[option]}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={handleQuizSubmit}
            disabled={
              loading ||
              Object.keys(selectedAnswers).length !== existingQuizzes.length
            }
            className="w-full mt-6 py-3 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 ease-in-out disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Quiz"}
          </button>
        </>
      ) : (
        <p>No quizzes available</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      {!submitted ? renderUserDetailsForm() : renderQuizzes()}
    </div>
  );
};

export default QuizComponent;