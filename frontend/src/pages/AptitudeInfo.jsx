import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Check,
  Loader2,
  RefreshCcw,
  Edit,
  BookOpen,
  EyeOff,
} from "lucide-react";

export default function AptitudeInfo() {
  const navigate = useNavigate();
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [showPreGenerated, setShowPreGenerated] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [showExistingQuestions, setShowExistingQuestions] = useState(false);
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [loader, setLoader] = useState(false);

  const [existingQuizzes, setExistingQuizzes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [quizzesPerPage] = useState(10);

  // Then, move the pagination logic after the state declarations and add null checks
  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = existingQuizzes
    ? existingQuizzes.slice(indexOfFirstQuiz, indexOfLastQuiz)
    : [];
  const totalPages = existingQuizzes
    ? Math.ceil(existingQuizzes.length / quizzesPerPage)
    : 0;

  const [preGeneratedQuizzes, setPreGeneratedQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState({
    que: "",
    a: "",
    b: "",
    c: "",
    d: "",
    ans: "",
  });
  const [passingMarks, setPassingMarks] = useState(0);
  const [quizGenerationType, setQuizGenerationType] = useState("");

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Add these pagination handler functions
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePreGeneratedSelect = (quiz) => {
    // Update the local pre-generated quizzes state to track selection
    const updatedQuizzes = preGeneratedQuizzes.map((q) =>
      q.uniqueKey === quiz.uniqueKey ? { ...q, selected: !q.selected } : q
    );
    setPreGeneratedQuizzes(updatedQuizzes);

    // Update selected quizzes - now properly removing if already selected
    setSelectedQuizzes((prevSelectedQuizzes) => {
      const existingQuiz = prevSelectedQuizzes.find((q) => q.que === quiz.que);
      if (existingQuiz) {
        // Remove the quiz if it already exists
        return prevSelectedQuizzes.filter((q) => q.que !== quiz.que);
      }
      // Add the quiz if it doesn't exist
      return [
        ...prevSelectedQuizzes,
        {
          ...quiz,
          uniqueKey: `pre-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
        },
      ];
    });
  };

  const handleExistingQuestionSelect = (quiz) => {
    // Update the local existing quizzes state to track selection
    const updatedQuizzes = existingQuizzes?.map((q) =>
      q.uniqueKey === quiz.uniqueKey ? { ...q, selected: !q.selected } : q
    );
    setExistingQuizzes(updatedQuizzes);

    // Update selected quizzes - now properly removing if already selected
    setSelectedQuizzes((prevSelectedQuizzes) => {
      const existingQuiz = prevSelectedQuizzes.find((q) => q.que === quiz.que);
      if (existingQuiz) {
        // Remove the quiz if it already exists
        return prevSelectedQuizzes.filter((q) => q.que !== quiz.que);
      }
      // Add the quiz if it doesn't exist
      return [
        ...prevSelectedQuizzes,
        {
          ...quiz,
          uniqueKey: `exist-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
        },
      ];
    });
  };

  const handleManualQuizSubmit = (e) => {
    e.preventDefault();

    // Validate all fields are filled
    if (
      !newQuiz.que ||
      !newQuiz.a ||
      !newQuiz.b ||
      !newQuiz.c ||
      !newQuiz.d ||
      !newQuiz.ans
    ) {
      alert("Please fill in all fields for the question.");
      return;
    }

    const newQuizWithId = {
      ...newQuiz,
      uniqueKey: `manual-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      selected: true,
    };

    setSelectedQuizzes([...selectedQuizzes, newQuizWithId]);

    // Reset form
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
      .get(`${BACKEND_URL}/generateQuiz`, {
        params: { quizType: quizGenerationType },
      })
      .then((response) => {
        const quizzesWithUniqueKeys = response.data.map((quiz) => ({
          ...quiz,
          uniqueKey: `gen-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          selected: false,
        }));
        setPreGeneratedQuizzes(quizzesWithUniqueKeys);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching quizzes:", error);
        setLoader(false);
        alert("Failed to generate quizzes. Please try again.");
      });
  };

  const getAlreadyGeneratedQuiz = () => {
    setLoader(true);
    axios
      .get(`${BACKEND_URL}/getQuiz`)
      .then((response) => {
        const quizzesWithUniqueKeys = response.data.map((quiz) => ({
          ...quiz,
          uniqueKey: `exist-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          selected: false,
        }));
        setExistingQuizzes(quizzesWithUniqueKeys);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching quizzes:", error);
        setLoader(false);
        alert("Failed to fetch existing quizzes. Please try again.");
      });
  };

  async function nextRound() {
    const userID = localStorage.getItem("userId");

    if (!userID) {
      console.error("User ID not found in localStorage");
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/updateUser`, {
        userId: userID,
        passingMarks,
      });

      const isTechnical = localStorage.getItem("technical");
      const isHr = localStorage.getItem("hrRound");

      if (isTechnical === "true") {
        navigate("/technicalInfo");
      } else if (isHr === "true") {
        navigate("/hrInfo");
      } else {
        navigate("/dashboard");
      }

      const quizResponse = await axios.post(`${BACKEND_URL}/addQuiz`, {
        questions: selectedQuizzes.map((quiz) => ({
          que: quiz.que,
          a: quiz.a,
          b: quiz.b,
          c: quiz.c,
          d: quiz.d,
          ans: quiz.ans,
        })),
        userId: userID,
        passingMarks,
      });
      console.log(quizResponse.data);
    } catch (error) {
      console.error("Error updating user or adding quiz:", error);
      alert("Failed to process quiz. Please try again.");
    }
  }

  useEffect(() => {
    setPassingMarks(Math.ceil(selectedQuizzes.length / 2));
  }, [selectedQuizzes.length]);

  const renderQuizSection = () => {
    if (loader) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] w-full">
          <div className="flex items-center gap-2">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full bg-blue-500 animate-bounce`}
                style={{
                  animationDelay: `${index * 0.2}s`,
                }}
              />
            ))}
          </div>
          <p className="mt-6 text-lg text-gray-600 animate-pulse">
            Generating questions just like you want...
          </p>
        </div>
      );
    }




    if (showPreGenerated) {
      return (
        <div className="grid md:grid-cols-2 gap-4">
          {preGeneratedQuizzes.map((quiz) => (
            <div
              key={quiz.uniqueKey}
              onClick={() => handlePreGeneratedSelect(quiz)}
              className={`cursor-pointer p-4 border rounded-lg transition-all shadow-sm ${quiz.selected
                ? "bg-blue-50 border-blue-500"
                : "bg-white hover:bg-gray-50"
                }`}
            >
              <h3 className="font-semibold mb-2 text-gray-800">{quiz.que}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                {["a", "b", "c", "d"].map((option) => (
                  <div key={option}>
                    {option.toUpperCase()}: {quiz[option]}
                  </div>
                ))}
              </div>
              {quiz.selected && (
                <div className="mt-2 text-green-600 text-sm flex items-center">
                  <Check className="mr-1" size={16} /> Selected
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (showExistingQuestions) {
      return (
        <div>
          <div className="grid md:grid-cols-2 gap-4">
            {currentQuizzes.map((quiz) => (
              <div
                key={quiz.uniqueKey}
                onClick={() => handleExistingQuestionSelect(quiz)}
                className={`cursor-pointer p-4 border rounded-lg transition-all shadow-sm ${quiz.selected
                  ? "bg-purple-50 border-purple-500"
                  : "bg-white hover:bg-gray-50"
                  }`}
              >
                <h3 className="font-semibold mb-2 text-gray-800">{quiz.que}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                  {["a", "b", "c", "d"].map((option) => (
                    <div key={option}>
                      {option.toUpperCase()}: {quiz[option]}
                    </div>
                  ))}
                </div>
                {quiz.selected && (
                  <div className="mt-2 text-purple-600 text-sm flex items-center">
                    <Check className="mr-1" size={16} /> Selected
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="mt-6 flex items-center justify-between bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${currentPage === 1
                  ? "bg-gray-100 text-gray-400"
                  : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
              >
                Previous
              </button>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${currentPage === totalPages
                  ? "bg-gray-100 text-gray-400"
                  : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstQuiz + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastQuiz, existingQuizzes?.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{existingQuizzes?.length}</span>{" "}
                  questions
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-l-md px-4 py-2 text-sm font-medium ${currentPage === 1
                      ? "bg-gray-100 text-gray-400"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    Previous
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center rounded-r-md px-4 py-2 text-sm font-medium ${currentPage === totalPages
                      ? "bg-gray-100 text-gray-400"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (showManualForm) {
      return (
        <form onSubmit={handleManualQuizSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question
            </label>
            <input
              type="text"
              value={newQuiz.que}
              onChange={(e) => setNewQuiz({ ...newQuiz, que: e.target.value })}
              placeholder="Enter your question"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {["a", "b", "c", "d"].map((option) => (
              <div key={option}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Option {option.toUpperCase()}
                </label>
                <input
                  type="text"
                  value={newQuiz[option]}
                  onChange={(e) =>
                    setNewQuiz({ ...newQuiz, [option]: e.target.value })
                  }
                  placeholder={`Enter option ${option.toUpperCase()}`}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correct Answer
            </label>
            <select
              value={newQuiz.ans}
              onChange={(e) => setNewQuiz({ ...newQuiz, ans: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Correct Option</option>
              <option value="a">Option A</option>
              <option value="b">Option B</option>
              <option value="c">Option C</option>
              <option value="d">Option D</option>
            </select>
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-all"
            >
              Add Question
            </button>
          </div>
        </form>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-800 text-center flex items-center justify-center">
          <BookOpen className="mr-3 text-blue-500" size={36} />
          Aptitude Question Hub
        </h1>
        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={() => {
              setShowPreGenerated(true);
              setShowManualForm(false);
              setShowExistingQuestions(false);
            }}
            className="flex items-center py-3 px-6 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all group"
          >
            <RefreshCcw className="mr-2 group-hover:animate-spin" size={18} />
            Generate New Questions
          </button>
          <button
            onClick={() => {
              setShowManualForm(true);
              setShowPreGenerated(false);
              setShowExistingQuestions(false);
            }}
            className="flex items-center py-3 px-6 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all"
          >
            <Edit className="mr-2" size={18} />
            Create Questions Manually
          </button>
          <button
            onClick={() => {
              setShowExistingQuestions(true);
              setShowPreGenerated(false);
              getAlreadyGeneratedQuiz();
              setShowManualForm(false);
            }}
            className="flex items-center py-3 px-6 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-all"
          >
            <BookOpen className="mr-2" size={18} />
            View Existing Questions
          </button>
        </div>
        {showPreGenerated && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specify Aptitude Question Type and difficulty
            </label>
            <div className="flex">
              <input
                type="text"
                value={quizGenerationType}
                onChange={(e) => setQuizGenerationType(e.target.value)}
                placeholder="e.g., Reasoning, Numeric difficult, Logical easy ..."
                className="flex-grow p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={generateQuiz}
                className="bg-blue-500 text-white px-6 rounded-r-lg hover:bg-blue-600 transition-all"
              >
                Generate
              </button>
            </div>
          </div>
        )}
        {(showManualForm || showPreGenerated || showExistingQuestions) && (
          <div className="mt-4">{renderQuizSection()}</div>
        )}
        {selectedQuizzes.length > 0 && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg flex justify-between items-center">
            <div className="flex items-center space-x-4">
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
                  className="border rounded px-2 py-1 w-20 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-600 text-sm">
                  ({passingMarks}/{selectedQuizzes.length})
                </span>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setReviewModalOpen(true)}
                className="flex items-center bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 transition-all"
              >
                <BookOpen className="mr-2" size={18} />
                Review Selected Questions
              </button>
              <button
                onClick={nextRound}
                className="flex items-center bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-all"
              >
                Next Round
                <ChevronRight className="ml-2" size={18} />
              </button>
            </div>
          </div>
        )}
        {reviewModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
              <div className="p-6 border-b sticky top-0 bg-white z-10">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Selected Aptitude Questions
                  </h2>
                  <button
                    onClick={() => setReviewModalOpen(false)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <EyeOff size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto">
                {selectedQuizzes.map((quiz, index) => (
                  <div
                    key={quiz.uniqueKey}
                    className="border-b py-3 last:border-b-0"
                  >
                    <h3 className="font-semibold text-lg mb-2">{`Q${index + 1
                      }. ${quiz.que}`}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {["a", "b", "c", "d"].map((option) => (
                        <div
                          key={option}
                          className={`p-2 rounded ${quiz.ans === option
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-700"
                            }`}
                        >
                          {option.toUpperCase()}: {quiz[option]}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="mt-4 flex justify-between items-center bg-gray-100 p-3 rounded">
                  <span className="font-medium text-gray-700">
                    Passing Marks:
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    {passingMarks} / {selectedQuizzes.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
