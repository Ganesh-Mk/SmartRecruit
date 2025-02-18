import axios from "axios";
import {
  BookOpen,
  ChevronRight,
  Code,
  Edit,
  EyeOff,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function TechnicalInfo() {
  const [showPreGenerated, setShowPreGenerated] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [showExistingProblems, setShowExistingProblems] = useState(false);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [passingMarks, setPassingMarks] = useState(0);
  const [techInputField, setTechInputField] = useState(false);
  const [techGenerationType, setTechGenerationType] = useState("");
  const [generatedProblems, setGeneratedProblems] = useState([]);
  const [showGeneratedProblems, setShowGeneratedProblems] = useState(false);

  const [preGeneratedProblems, setPreGeneratedProblems] = useState([]);
  const [existingProblems, setExistingProblems] = useState([]);
  const [newProblem, setNewProblem] = useState({
    title: "",
    desc: "",
  });

  const [problemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastQuiz = currentPage * problemsPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - problemsPerPage;
  const currentExistingProblems = existingProblems
    ? existingProblems.slice(indexOfFirstQuiz, indexOfLastQuiz)
    : [];
  const totalPages = existingProblems
    ? Math.ceil(existingProblems.length / problemsPerPage)
    : 0;

  // Simulated backend URL (replace with actual backend)
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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

  const handlePreGeneratedSelect = (problem) => {
    setSelectedProblems((prevSelectedProblems) => {
      const problemIndex = prevSelectedProblems.findIndex(
        (p) => p.id === problem.id
      );
      return problemIndex > -1
        ? prevSelectedProblems.filter((p) => p.id !== problem.id)
        : [...prevSelectedProblems, problem];
    });
  };

  const handleManualProblemSubmit = (e) => {
    e.preventDefault();
    const newProblemWithId = {
      ...newProblem,
      id: Date.now().toString(),
    };
    setSelectedProblems([...selectedProblems, newProblemWithId]);
    setNewProblem({
      title: "",
      desc: "",
    });
  };

  const handleExistingProblemSelect = (problem) => {
    setSelectedProblems((prevSelectedProblems) => {
      const problemIndex = prevSelectedProblems.findIndex(
        (p) => p.id === problem.id
      );
      return problemIndex > -1
        ? prevSelectedProblems.filter((p) => p.id !== problem.id)
        : [...prevSelectedProblems, problem];
    });
  };

  const generateTechnicalProblems = () => {
    setLoader(true);
    // Simulated fetch
    console.log("techGenerationType: ", techGenerationType);
    axios
      .get(`${BACKEND_URL}/generateTech`, {
        timeout: 30000,
        params: { techType: techGenerationType },
      })
      .then((response) => {
        // Directly use the response data as axios already parses it
        console.log(response);
        setShowGeneratedProblems(true);
        setGeneratedProblems(response.data);
        console.log("genratedProblems: ", generatedProblems);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching technical problems:", error);
        setLoader(false);
        setGeneratedProblems([]);
      });
  };

  const getAlreadyGeneratedProblems = () => {
    setLoader(true);
    // Simulated fetch
    fetch(`${BACKEND_URL}/getTech`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.techEntries);
        setExistingProblems(data.techEntries);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching technical problems:", error);
        setLoader(false);
        // Fallback data in case of error
        setExistingProblems([
          {
            id: "E1C9Z",
            title: "Implement a Stack",
            desc: "Design a stack data structure with push, pop, and top operations.\n\nImplement methods:\n- push(x): Adds an element to the top of the stack\n- pop(): Removes and returns the top element\n- top(): Returns the top element without removing it\n- isEmpty(): Checks if the stack is empty\n\nConstraints: Implement without using built-in stack data structures.",
          },
          {
            id: "E2D7W",
            title: "Binary Search Implementation",
            desc: "Implement a binary search algorithm on a sorted array.\n\nFunctions to implement:\n- binarySearch(arr, target): Returns the index of the target element\n- If not found, return -1\n\nExample:\nInput: arr = [1, 3, 5, 7, 9], target = 5\nOutput: 2\n\nConstraints: Array is sorted in ascending order. Time complexity should be O(log n).",
          },
        ]);
      });
  };

  const nextRound = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/updateUser`, {
        userId: localStorage.getItem("userId"), // Assume recruiter is logged in and we have their email
        passingMarksofTech: passingMarks, // Send the array of candidate objects
      });

      console.log("updated passing marks in backend", response);
    } catch (error) {
      console.log("Error updating candidates:", error);
    }
    const isHr = localStorage.getItem("hrRound");

    console.log("burH: ", selectedProblems);
    /*selectedProblems : {
      burH:  
(2) [{…}, {…}]
0
: 
desc
: 
"Problem statement: Given a string, determine if it is a palindrome (reads the same forwards and backward).\nInput format: A single string s.\nOutput format: true if it's a palindrome, false otherwise.\nExample:\nInput:  \"racecar\"\nOutput: true\nConstraints: 1 <= length(s) <= 1000. The string consists of only lowercase English letters."
id
: 
"STR-002"
testCases
: 
Array(2)
0
: 
{input: 'madam', expectedOutput: true}
1
: 
{input: 'hello', expectedOutput: false}
length
: 
2
[[Prototype]]
: 
Array(0)
title
: 
"Palindrome Check"
[[Prototype]]
: 
Object
1
: 
desc
: 
"Problem statement: Given a string, reverse it.\nInput format: A single string s.\nOutput format: The reversed string.\nExample:\nInput:  \"hello\"\nOutput: \"olleh\"\nConstraints: 1 <= length(s) <= 1000. The string consists of only lowercase English letters."
id
: 
"STR-001"
testCases
: 
Array(2)
0
: 
{input: 'world', expectedOutput: 'dlrow'}
1
: 
{input: 'coding', expectedOutput: 'gnidoc'}
len
    }*/

    try {
      const response = await axios.post(`${BACKEND_URL}/addTech`, {
        problems: JSON.stringify({ problems: selectedProblems }),
        userId: localStorage.getItem("userId"),
      });

      console.log(response.data);

      console.log("Tech problems added:", response.data);
    } catch (error) {
      console.error("Error adding tech problems:", error);
      setError("There was an error adding the tech problems.");
    }

    // Simulated POST request to add tech entries

    // Navigation simulation
    if (isHr === "true") {
      window.location.href = "/hrInfo";
    } else {
      window.location.href = "/dashboard";
    }
  };

  useEffect(() => {
    setPassingMarks(Math.ceil(selectedProblems.length / 2));
  }, [selectedProblems.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-800 text-center flex items-center justify-center">
          <Code className="mr-3 text-blue-500" size={36} />
          Technical Question Hub
        </h1>

        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={() => {
              setTechInputField(true);
              setShowPreGenerated(false);
              setShowManualForm(false);
              setShowExistingProblems(false);
            }}
            className="flex items-center py-3 px-6 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all group"
          >
            <RefreshCcw className="mr-2 group-hover:animate-spin" size={18} />
            Generate New Problems
          </button>

          <button
            onClick={() => {
              setTechInputField(false);
              setShowManualForm(true);
              setShowPreGenerated(false);
              setShowExistingProblems(false);
              setShowGeneratedProblems(false);
            }}
            className="flex items-center py-3 px-6 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all"
          >
            <Edit className="mr-2" size={18} />
            Create Problem Manually
          </button>
          <button
            onClick={() => {
              setTechInputField(false);
              setShowExistingProblems(true);
              setShowPreGenerated(false);
              getAlreadyGeneratedProblems();
              setShowManualForm(false);
              setShowGeneratedProblems(false);
            }}
            className="flex items-center py-3 px-6 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-all"
          >
            <BookOpen className="mr-2" size={18} />
            View Existing Problems
          </button>
        </div>

        {techInputField && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specify technical Question Type and difficulty
            </label>
            <div className="flex">
              <input
                type="text"
                value={techGenerationType}
                onChange={(e) => setTechGenerationType(e.target.value)}
                placeholder="e.g., Arrays, Linked Lists, Easy, Difficult etc."
                className="flex-grow p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => {
                  generateTechnicalProblems();
                  setShowManualForm(false);
                  setShowExistingProblems(false);
                }}
                className="bg-blue-500 text-white px-6 rounded-r-lg hover:bg-blue-600 transition-all"
              >
                Generate
              </button>
            </div>
          </div>
        )}

        {loader && (
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
        )}

        {showGeneratedProblems && !loader && (
          <div className="grid md:grid-cols-2 gap-4">
            {generatedProblems.map((problem) => (
              <div
                key={problem.id}
                onClick={() => handlePreGeneratedSelect(problem)}
                className={`
                  cursor-pointer p-4 border rounded-lg transition-all 
                  ${selectedProblems.some((p) => p.id === problem.id)
                    ? "bg-blue-100 border-blue-500"
                    : "bg-white hover:bg-gray-50"
                  }
                `}
              >
                <h3 className="font-semibold mb-2">{problem.title}</h3>
                <p className="text-sm mb-2 text-gray-600 whitespace-pre-wrap">
                  {problem.desc.length > 200
                    ? `${problem.desc.substring(0, 200)}...`
                    : problem.desc}
                </p>
                {selectedProblems.some((p) => p.id === problem.id) && (
                  <div className="mt-2 text-green-600 text-sm">✓ Selected</div>
                )}
              </div>
            ))}
          </div>
        )}

        {showPreGenerated && !loader && (
          <div className="grid md:grid-cols-2 gap-4">
            {preGeneratedProblems.map((problem) => (
              <div
                key={problem.id}
                onClick={() => handlePreGeneratedSelect(problem)}
                className={`
                  cursor-pointer p-4 border rounded-lg transition-all 
                  ${selectedProblems.some((p) => p.id === problem.id)
                    ? "bg-blue-100 border-blue-500"
                    : "bg-white hover:bg-gray-50"
                  }
                `}
              >
                <h3 className="font-semibold mb-2">{problem.title}</h3>
                <p className="text-sm mb-2 text-gray-600 whitespace-pre-wrap">
                  {problem.desc.length > 200
                    ? `${problem.desc.substring(0, 200)}...`
                    : problem.desc}
                </p>
                {selectedProblems.some((p) => p.id === problem.id) && (
                  <div className="mt-2 text-green-600 text-sm">✓ Selected</div>
                )}
              </div>
            ))}
          </div>
        )}

        {showExistingProblems && !loader && (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              {currentExistingProblems?.map((problem) => (
                <div
                  key={problem.id}
                  onClick={() => handleExistingProblemSelect(problem)}
                  className={`
                  cursor-pointer p-4 border rounded-lg transition-all 
                  ${selectedProblems.some((p) => p.id === problem.id)
                      ? "bg-purple-100 border-purple-500"
                      : "bg-white hover:bg-gray-50"
                    }
                `}
                >
                  <h3 className="font-semibold mb-2">{problem.title}</h3>
                  <p className="text-sm mb-2 text-gray-600 whitespace-pre-wrap">
                    {problem.desc?.length > 200
                      ? `${problem.desc.substring(0, 200)}...`
                      : problem.desc}
                  </p>
                  {selectedProblems?.some((p) => p.id === problem.id) && (
                    <div className="mt-2 text-purple-600 text-sm">
                      ✓ Selected
                    </div>
                  )}
                </div>
              ))}
            </div>
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
                    <span className="font-medium">{indexOfFirstQuiz + 1}</span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastQuiz, existingProblems?.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {existingProblems?.length}
                    </span>{" "}
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
          </>
        )}

        {showManualForm && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleManualProblemSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Problem Title
                </label>
                <input
                  type="text"
                  value={newProblem.title}
                  onChange={(e) =>
                    setNewProblem({ ...newProblem, title: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Problem Description
                </label>
                <textarea
                  value={newProblem.desc}
                  onChange={(e) =>
                    setNewProblem({ ...newProblem, desc: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
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
          </div>
        )}

        {selectedProblems.length > 0 && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-gray-700 font-medium">
                  Passing Marks:
                </label>
                <input
                  type="number"
                  min="0"
                  max={selectedProblems.length}
                  value={passingMarks}
                  onChange={(e) =>
                    setPassingMarks(
                      Math.min(
                        Math.max(parseInt(e.target.value, 10), 0),
                        selectedProblems.length
                      )
                    )
                  }
                  className="border rounded px-2 py-1 w-20 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-600 text-sm">
                  ({passingMarks}/{selectedProblems.length})
                </span>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowReviewModal(true)}
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

        {showReviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
              {/* Fixed Header */}
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  Selected Technical Problems
                </h2>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <EyeOff size={24} />
                </button>
              </div>
              {/* Scrollable Content */}
              <div className="p-6 space-y-10 overflow-y-auto max-h-[70vh]">
                {selectedProblems.map((problem, index) => (
                  <div
                    key={problem.id}
                    className="border p-4 shadow-xl rounded bg-gray-50"
                  >
                    <h3 className="font-semibold text-lg mb-2">
                      Q{index + 1}. {problem.title}
                    </h3>
                    <p className="mb-2 whitespace-pre-wrap">{problem.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
