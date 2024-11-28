import { useState } from "react";

export default function TechnicalInfo() {
  const [showPreGenerated, setShowPreGenerated] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [showExistingProblems, setShowExistingProblems] = useState(false);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [loader, setLoader] = useState(false);

  const [preGeneratedProblems, setPreGeneratedProblems] = useState([]);
  const [existingProblems, setExistingProblems] = useState([]);
  const [newProblem, setNewProblem] = useState({
    title: "",
    desc: "",
    expectedSolution: "",
  });

  // Simulated backend URL (replace with actual backend)
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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
      expectedSolution: "",
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
    fetch(`${BACKEND_URL}/generateTech`)
      .then((response) => response.json())
      .then((data) => {
        console.log("data: ", data);
        setPreGeneratedProblems(data);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching technical problems:", error);
        setLoader(false);

        setPreGeneratedProblems([]);
      });
  };

  const getAlreadyGeneratedProblems = () => {
    setLoader(true);
    console.log("clicked");
    // Simulated fetch
    fetch(`${BACKEND_URL}/getTech`)
      .then((response) => response.json())
      .then((data) => {
        console.log("data: ", data);
        setExistingProblems(data);
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

  const nextRound = () => {
    const isHr = localStorage.getItem("hrRound");

    // Simulated POST request to add tech entries
    fetch(`${BACKEND_URL}/addTech`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        problems: selectedProblems.map((problem) => ({
          title: problem.title,
          desc: problem.desc,
        })),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to submit tech entries");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Tech entries submitted successfully:", data);
      })
      .catch((error) => {
        console.error("Error submitting tech entries:", error);
      });

    // Navigation simulation
    if (isHr === "true") {
      window.location.href = "/hrInfo";
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          Technical Interview Problems
        </h1>

        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={() => {
              setShowPreGenerated(true);
              setShowManualForm(false);
              setShowExistingProblems(false);
              generateTechnicalProblems();
            }}
            className="py-4 px-8 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all"
          >
            Generate New Problems
          </button>
          <button
            onClick={() => {
              setShowManualForm(true);
              setShowPreGenerated(false);
              setShowExistingProblems(false);
            }}
            className="py-4 px-8 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all"
          >
            Create Problem Manually
          </button>
          <button
            onClick={() => {
              setShowExistingProblems(true);
              setShowPreGenerated(false);
              getAlreadyGeneratedProblems();
              setShowManualForm(false);
            }}
            className="py-4 px-8 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-all"
          >
            View Existing Problems
          </button>
        </div>

        {loader && (
          <div className="flex justify-center items-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
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
                  ${
                    selectedProblems.some((p) => p.id === problem.id)
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
          <div className="grid md:grid-cols-2 gap-4">
            {existingProblems.map((problem, index) => (
              <div
                key={`${problem.id}-${index}`}
                onClick={() => handleExistingProblemSelect(problem)}
                className={`
                  cursor-pointer p-4 border rounded-lg transition-all 
                  ${
                    selectedProblems.some((p) => p.id === problem.id)
                      ? "bg-purple-100 border-purple-500"
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
                  <div className="mt-2 text-purple-600 text-sm">✓ Selected</div>
                )}
              </div>
            ))}
          </div>
        )}

        {showManualForm && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleManualProblemSubmit} className="space-y-4">
              <div>
                <label className="block mb-2">Problem Title</label>
                <input
                  type="text"
                  value={newProblem.title}
                  onChange={(e) =>
                    setNewProblem({ ...newProblem, title: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Problem Description</label>
                <textarea
                  value={newProblem.desc}
                  onChange={(e) =>
                    setNewProblem({ ...newProblem, desc: e.target.value })
                  }
                  className="w-full p-2 border rounded h-32"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">
                  Expected Solution (Optional)
                </label>
                <textarea
                  value={newProblem.expectedSolution}
                  onChange={(e) =>
                    setNewProblem({
                      ...newProblem,
                      expectedSolution: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded h-32"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
              >
                Add Problem
              </button>
            </form>
          </div>
        )}

        {selectedProblems.length > 0 && (
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => setShowReviewModal(true)}
              className="bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-600"
            >
              Review Problems ({selectedProblems.length})
            </button>
            <button
              onClick={nextRound}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Next Round
            </button>
          </div>
        )}

        {showReviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  Selected Technical Problems
                </h2>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 space-y-4">
                {selectedProblems.map((problem, index) => (
                  <div
                    key={problem.id}
                    className="border p-4 rounded bg-gray-50"
                  >
                    <h3 className="font-semibold mb-2">
                      Problem {index + 1}: {problem.title}
                    </h3>
                    <p className="mb-2 whitespace-pre-wrap">{problem.desc}</p>
                    {problem.expectedSolution && (
                      <div className="mt-2 text-sm">
                        <strong>Expected Solution:</strong>
                        <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                          {problem.expectedSolution}
                        </pre>
                      </div>
                    )}
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
