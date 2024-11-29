import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AptitudeInfo() {
  const navigate = useNavigate();
  const [showPreGenerated, setShowPreGenerated] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [showExistingQuestions, setShowExistingQuestions] = useState(false);
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [loader, setLoader] = useState(false);

  const [preGeneratedQuizzes, setPreGeneratedQuizzes] = useState([]);
  const [existingQuizzes, setExistingQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState({
    que: "",
    a: "",
    b: "",
    c: "",
    d: "",
    ans: "",
  });
  const [passingMarks, setPassingMarks] = useState(0);

  // Replace with your actual backend URL
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handlePreGeneratedSelect = (quiz) => {
    setSelectedQuizzes((prevSelectedQuizzes) => {
      const quizIndex = prevSelectedQuizzes.findIndex((q) => q.id === quiz.id);
      return quizIndex > -1
        ? prevSelectedQuizzes.filter((q) => q.id !== quiz.id)
        : [...prevSelectedQuizzes, quiz];
    });
  };

  const handleManualQuizSubmit = (e) => {
    e.preventDefault();
    const newQuizWithId = {
      ...newQuiz,
      id: Date.now(),
    };
    setSelectedQuizzes([...selectedQuizzes, newQuizWithId]);
    setNewQuiz({
      que: "",
      a: "",
      b: "",
      c: "",
      d: "",
      ans: "",
    });
  };

  const generateQuiz = () => {
    setLoader(true);
    axios
      .get(`${BACKEND_URL}/generateQuiz`)
      .then((response) => {
        setPreGeneratedQuizzes(response.data);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching quizzes:", error);
        setLoader(false);
      });
  };

  const getAlreadyGeneratedQuiz = () => {
    setLoader(true);
    axios
      .get(`${BACKEND_URL}/getQuiz`)
      .then((response) => {
        setExistingQuizzes(response.data);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching quizzes:", error);
        setLoader(false);
      });
  };

  const updatePassingMarks = () => {
    setPassingMarks(Math.ceil(selectedQuizzes.length / 2));
  };

  async function nextRound() {
    // or however you're calculating passingMarks

    // Ensure userId exists in localStorage
    const userID = localStorage.getItem("userId");

    if (!userID) {
      console.error("User ID not found in localStorage");
      return;
    }

    try {
      // Make sure to await the response from the backend API call
      const response = await axios.post(`${BACKEND_URL}/updateUser`, {
        userId: userID,
        passingMarks,
      });

      // Navigate based on round completion status
      const isTechnical = localStorage.getItem("technical");
      const isHr = localStorage.getItem("hrRound");

      if (isTechnical === "true") {
        navigate("/technicalInfo");
      } else if (isHr === "true") {
        navigate("/hrInfo");
      } else {
        navigate("/dashboard");
      }

      // Add the quizzes with passing marks
      const quizResponse = await axios.post(`${BACKEND_URL}/addQuiz`, {
        questions: selectedQuizzes,
        userId: userID,
        passingMarks,
      });
    } catch (error) {
      console.error("Error updating user or adding quiz:", error);
    }
  }

  const handleExistingQuestionSelect = (quiz) => {
    setSelectedQuizzes((prevSelectedQuizzes) => {
      const quizIndex = prevSelectedQuizzes.findIndex((q) => q.id === quiz.id);
      const updatedQuizzes =
        quizIndex > -1
          ? prevSelectedQuizzes.filter((q) => q.id !== quiz.id)
          : [...prevSelectedQuizzes, quiz];
      // Update passing marks after selection/deselection
      updatePassingMarks(updatedQuizzes);
      return updatedQuizzes;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          Aptitude Question Addon
        </h1>

        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={() => {
              setShowPreGenerated(true);
              setShowManualForm(false);
              setShowExistingQuestions(false);
              generateQuiz();
            }}
            className="py-4 px-8 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all"
          >
            Generated New Questions
          </button>
          <button
            onClick={() => {
              setShowManualForm(true);
              setShowPreGenerated(false);
              setShowExistingQuestions(false);
            }}
            className="py-4 px-8 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all"
          >
            Create Questions Manually
          </button>
          <button
            onClick={() => {
              setShowExistingQuestions(true);
              setShowPreGenerated(false);
              getAlreadyGeneratedQuiz();
              setShowManualForm(false);
            }}
            className="py-4 px-8 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-all"
          >
            View Existing Questions
          </button>
        </div>

        {loader && (
          <div className="flex justify-center items-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        )}

        {showPreGenerated && !loader && (
          <div className="grid md:grid-cols-2 gap-4">
            {preGeneratedQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                onClick={() => handlePreGeneratedSelect(quiz)}
                className={`cursor-pointer p-4 border rounded-lg transition-all ${
                  selectedQuizzes.some((q) => q.id === quiz.id)
                    ? "bg-blue-100 border-blue-500"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <h3 className="font-semibold mb-2">{quiz.que}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>A: {quiz.a}</div>
                  <div>B: {quiz.b}</div>
                  <div>C: {quiz.c}</div>
                  <div>D: {quiz.d}</div>
                </div>
                {selectedQuizzes.some((q) => q.id === quiz.id) && (
                  <div className="mt-2 text-green-600 text-sm">✓ Selected</div>
                )}
              </div>
            ))}
          </div>
        )}

        {showExistingQuestions && !loader && (
          <div className="grid md:grid-cols-2 gap-4">
            {existingQuizzes.map((quiz, index) => (
              <div
                key={`${index}-${Date.now()}`}
                onClick={() => handleExistingQuestionSelect(quiz)}
                className={`cursor-pointer p-4 border rounded-lg transition-all ${
                  selectedQuizzes.some((q) => q.id === quiz.id)
                    ? "bg-purple-100 border-purple-500"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <h3 className="font-semibold mb-2">{quiz.que}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>A: {quiz.a}</div>
                  <div>B: {quiz.b}</div>
                  <div>C: {quiz.c}</div>
                  <div>D: {quiz.d}</div>
                </div>
                {selectedQuizzes.some((q) => q.id === quiz.id) && (
                  <div className="mt-2 text-purple-600 text-sm">✓ Selected</div>
                )}
              </div>
            ))}
          </div>
        )}

        {showManualForm && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleManualQuizSubmit} className="space-y-4">
              <div>
                <label className="block mb-2">Question</label>
                <input
                  type="text"
                  value={newQuiz.que}
                  onChange={(e) =>
                    setNewQuiz({ ...newQuiz, que: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {["a", "b", "c", "d"].map((option) => (
                  <div key={option}>
                    <label className="block mb-2">
                      Option {option.toUpperCase()}
                    </label>
                    <input
                      type="text"
                      value={newQuiz[option]}
                      onChange={(e) =>
                        setNewQuiz({ ...newQuiz, [option]: e.target.value })
                      }
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block mb-2">Correct Answer</label>
                <select
                  value={newQuiz.ans}
                  onChange={(e) =>
                    setNewQuiz({ ...newQuiz, ans: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Correct Option</option>
                  <option value="a">A</option>
                  <option value="b">B</option>
                  <option value="c">C</option>
                  <option value="d">D</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
              >
                Add Question
              </button>
            </form>
          </div>
        )}

        {selectedQuizzes.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <label className="text-gray-700 font-medium">
                  Passing Marks:
                </label>
                <input
                  type="number"
                  min="0"
                  max={selectedQuizzes.length}
                  value={passingMarks}
                  onChange={(e) =>
                    setPassingMarks(
                      Math.min(
                        Math.max(parseInt(e.target.value, 10), 0),
                        selectedQuizzes.length
                      )
                    )
                  }
                  className="border rounded px-2 py-1 w-20"
                />
                <span className="text-gray-600 text-sm">
                  ({passingMarks}/{selectedQuizzes.length})
                </span>
              </div>
              <button
                onClick={nextRound}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Next Round
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
