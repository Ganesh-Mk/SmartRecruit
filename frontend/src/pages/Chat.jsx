import  { useState, useEffect } from "react";
import {
  Play,
  AlertCircle,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Send,
  MessageCircle,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import axios from "axios";

const LANGUAGE_VERSIONS = {
  python: "3.10.0",
  javascript: "18.15.0",
  java: "15.0.2",
  cpp: "10.2.0",
  c: "10.2.0",
  go: "1.16.2",
  ruby: "3.0.1",
  rust: "1.68.2",
  php: "8.2.3",
};

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

const executeCode = async (language, sourceCode) => {
  const response = await API.post("/execute", {
    language: language,
    version: LANGUAGE_VERSIONS[language],
    files: [{ content: sourceCode }],
  });
  return response.data;
};

const Chat = ({ userType = "candidate" }) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [problems, setProblems] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isProblemDescriptionOpen, setIsProblemDescriptionOpen] =
    useState(false);

  // Chat-related states
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Store code for each problem separately
  const [codeStore, setCodeStore] = useState({});

  // Real-time code and chat syncing using SSE
  useEffect(() => {
    const codeEventSource = new EventSource(`${BACKEND_URL}/api/events`);
    const chatEventSource = new EventSource(`${BACKEND_URL}/api/chat-events`);

    codeEventSource.onmessage = (event) => {
      const { text: newCode } = JSON.parse(event.data);
      setCode(newCode);
    };

    chatEventSource.onmessage = (event) => {
      const { messages } = JSON.parse(event.data);
      setChatMessages(messages);
    };

    return () => {
      codeEventSource.close();
      chatEventSource.close();
    };
  }, []);

  // Update code in backend on change
  const handleCodeChange = async (newCode) => {
    setCode(newCode);
    await axios.post(`${BACKEND_URL}/api/update`, { text: newCode });
  };

  // Send chat message
  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const newMessage = {
      sender: userType === "candidate" ? "candidate" : "recruiter",
      text: currentMessage,
      timestamp: new Date().toISOString(),
    };

    try {
      await axios.post(`${BACKEND_URL}/api/send-message`, {
        message: newMessage,
      });
      setCurrentMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/getTech`, {
          params: { userId: localStorage.getItem("userId") },
          headers: { "Content-Type": "application/json" },
        });
        setProblems(response.data.techEntries || []);

        // Initialize code store for all problems
        const initialCodeStore = {};
        response.data.techEntries.forEach((_, index) => {
          initialCodeStore[index] = "";
        });
        setCodeStore(initialCodeStore);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tech:", error);
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const handleRunCode = async () => {
    setIsRunning(true);
    setError(null);
    setOutput("");

    try {
      const result = await executeCode(selectedLanguage, code);
      setOutput(result.run.output || "No output");
    } catch (err) {
      setError(err.message || "An error occurred while executing the code");
    } finally {
      setIsRunning(false);
    }
  };

  const formatDescription = (desc) => {
    return desc.split("\n").map((line, index) => {
      const isExample = line.trim().toLowerCase().startsWith("example");
      const isConstraint = line.trim().toLowerCase().startsWith("constraints");
      const isInput = line.trim().toLowerCase().startsWith("input:");
      const isOutput = line.trim().toLowerCase().startsWith("output:");
      const isBulletPoint = line.trim().startsWith("•");

      const className = `mb-2 ${
        isDarkMode
          ? isExample
            ? "text-blue-400"
            : isConstraint
            ? "text-purple-400"
            : isInput
            ? "text-emerald-400"
            : isOutput
            ? "text-orange-400"
            : isBulletPoint
            ? "text-gray-300"
            : "text-gray-200"
          : isExample
          ? "text-blue-600"
          : isConstraint
          ? "text-purple-600"
          : isInput
          ? "text-emerald-600"
          : isOutput
          ? "text-orange-600"
          : isBulletPoint
          ? "text-gray-600"
          : "text-gray-800"
      } ${
        isExample || isConstraint
          ? "font-semibold text-lg mt-4"
          : isInput || isOutput
          ? "font-medium ml-4"
          : isBulletPoint
          ? "ml-6"
          : ""
      }`;

      return (
        <p key={index} className={className}>
          {line.trim()}
        </p>
      );
    });
  };

  const handleProblemChange = (newIndex) => {
    // Save current code to store
    setCodeStore((prev) => ({
      ...prev,
      [currentProblemIndex]: code,
    }));

    // Set new problem index
    setCurrentProblemIndex(newIndex);

    // Load code for new problem
    setCode(codeStore[newIndex] || "");

    // Reset output and error
    setOutput("");
    setError(null);
  };

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
    document.body.classList.toggle("light", !isDarkMode);
  }, [isDarkMode]);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
        }`}
      >
        Loading problems...
      </div>
    );
  }

  if (!problems.length) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
        }`}
      >
        No problems found.
      </div>
    );
  }

  const currentProblem = problems[currentProblemIndex];

  // Rest of the existing setup code remains the same (fetchProblems, event sources, etc.)

  return (
    <div
      className={`min-h-screen min-w-full p-4 flex flex-col relative ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200"
      }`}
    >
      {/* Problem Title and Controls */}
      <div
        className={`w-full rounded-t-xl p-4 flex justify-between items-center ${
          isDarkMode
            ? "bg-gray-800 border-b border-gray-700"
            : "bg-white border-b border-gray-200"
        }`}
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleProblemChange(currentProblemIndex - 1)}
            disabled={currentProblemIndex === 0}
            className={`p-2 rounded-full ${
              currentProblemIndex === 0
                ? "opacity-50 cursor-not-allowed"
                : isDarkMode
                ? "hover:bg-gray-700"
                : "hover:bg-gray-200"
            }`}
          >
            <ChevronLeft
              className={isDarkMode ? "text-gray-300" : "text-gray-600"}
            />
          </button>

          <span
            className={`text-lg font-semibold ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {currentProblem.title}
          </span>

          <button
            onClick={() => handleProblemChange(currentProblemIndex + 1)}
            disabled={currentProblemIndex === problems.length - 1}
            className={`p-2 rounded-full ${
              currentProblemIndex === problems.length - 1
                ? "opacity-50 cursor-not-allowed"
                : isDarkMode
                ? "hover:bg-gray-700"
                : "hover:bg-gray-200"
            }`}
          >
            <ChevronRight
              className={isDarkMode ? "text-gray-300" : "text-gray-600"}
            />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() =>
              setIsProblemDescriptionOpen(!isProblemDescriptionOpen)
            }
            className={`p-2 rounded-full ${
              isDarkMode
                ? "hover:bg-gray-700 text-gray-300"
                : "hover:bg-gray-200 text-gray-600"
            }`}
          >
            {isProblemDescriptionOpen ? <ChevronUp /> : <ChevronDown />}
          </button>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600 text-yellow-400"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Problem Description (Collapsible) */}
      {isProblemDescriptionOpen && (
        <div
          className={`w-full p-4 ${
            isDarkMode
              ? "bg-gray-800/80 border-b border-gray-700"
              : "bg-white/90 border-b border-gray-200"
          }`}
        >
          <div className="prose max-w-none overflow-y-auto pr-2">
            {formatDescription(currentProblem.desc)}
          </div>
        </div>
      )}

      {/* Code Editor */}
      <div className="flex-1 flex flex-col">
        <div
          className={`w-full p-4 flex justify-between items-center ${
            isDarkMode
              ? "bg-gray-800/80 border-b border-gray-700"
              : "bg-white/90 border-b border-gray-200"
          }`}
        >
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className={`w-48 p-2 rounded-md ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-200"
                : "bg-gray-100 border-gray-300 text-gray-800"
            }`}
          >
            {Object.keys(LANGUAGE_VERSIONS).map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>

          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              isDarkMode
                ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            }`}
          >
            <Play className="h-4 w-4" />
            {isRunning ? "Running..." : "Run Code"}
          </button>
        </div>

        {/* Code Textarea */}
        <div
          className={`flex-1 p-4 ${
            isDarkMode
              ? "bg-gray-900/50 border-b border-gray-700"
              : "bg-gray-50 border-b border-gray-300"
          }`}
        >
          <textarea
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              handleCodeChange(e.target.value);
            }}
            className={`w-full h-full p-4 font-mono text-sm resize-none focus:outline-none bg-transparent ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}
            spellCheck="false"
            placeholder="Write your code here..."
          />
        </div>

        {/* Output Panel */}
        <div
          className={`p-4 ${
            isDarkMode
              ? "bg-gray-800/80 border-b border-gray-700"
              : "bg-white/90 border-b border-gray-200"
          }`}
        >
          <h2
            className={`text-xl font-semibold mb-4 ${
              isDarkMode
                ? "text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400"
                : "text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600"
            }`}
          >
            Output
          </h2>

          {error && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                isDarkMode
                  ? "bg-red-900/50 border-red-700"
                  : "bg-red-100 border-red-200"
              }`}
            >
              <div className="flex items-center">
                <AlertCircle
                  className={`h-4 w-4 ${
                    isDarkMode ? "text-red-400" : "text-red-600"
                  }`}
                />
                <div
                  className={`ml-2 font-semibold ${
                    isDarkMode ? "text-red-400" : "text-red-600"
                  }`}
                >
                  Error
                </div>
              </div>
              <div
                className={`mt-2 ${
                  isDarkMode ? "text-red-200" : "text-red-700"
                }`}
              >
                {error}
              </div>
            </div>
          )}

          <pre
            className={`p-4 rounded-lg h-32 overflow-auto font-mono text-sm ${
              isDarkMode
                ? "bg-gray-900/50 border border-gray-700 text-gray-200"
                : "bg-gray-50 border border-gray-300 text-gray-800"
            }`}
          >
            {output || "Run your code to see the output here..."}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Chat;