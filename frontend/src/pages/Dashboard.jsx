import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Mail,
  AlertTriangle,
  XCircle,
  Ban,
  LogOut,
  User,
  Briefcase,
  Calendar,
  Clock,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import cheateEmail from "../components/CheatingEmail";
import { useNavigate } from "react-router-dom";
import JobPostingModal from "../components/Jobposting";

// Job Listings Card
const JobListingCard = ({ jobs, onEdit, onDelete, setEditingJob, setJobPostingModalOpen }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 3;

  // Calculate the jobs to display on current page
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  // Calculate total number of pages
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl mb-6">

      <div className="border-b p-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Jobs Posting</h2>
        <button
          onClick={() => {
            setEditingJob(null);
            setJobPostingModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Create Job Posting</span>
        </button>
        <div className="text-sm text-gray-500">
          Showing {indexOfFirstJob + 1}-{Math.min(indexOfLastJob, jobs.length)} of {jobs.length} jobs
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentJobs.map((job) => (
          <div key={job._id} className="bg-gray-50 rounded-lg p-6 relative">
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => onEdit(job)}
                className="p-2 hover:bg-gray-200 rounded-full"
              >
                <Edit className="w-5 h-5 text-blue-600" />
              </button>
              <button
                onClick={() => onDelete(job._id)}
                className="p-2 hover:bg-gray-200 rounded-full"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {job.jobRole}
            </h3>
            <div className="space-y-2 text-gray-600">
              <p className="flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                {job.companyName}
              </p>
              <p className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Deadline: {new Date(job.deadline).toLocaleDateString()}
              </p>
            </div>
            <p className="mt-4 text-gray-700 line-clamp-3">{job.desc}</p>
          </div>
        ))}

        {currentJobs.length === 0 && (
          <div className=" rounded-lg text-gray-600">
            jobs not posted yet
          </div>
        )}
      </div>



      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="border-t p-4 flex justify-between items-center">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${currentPage === 1
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
          >
            Previous
          </button>

          <div className="text-gray-600">
            Page {currentPage} of {totalPages}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${currentPage === totalPages
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// Component for Recruiter Info Card
const RecruiterInfoCard = ({ recruiterInfo }) => (
  <div className="bg-white rounded-lg shadow-lg mb-6 p-6 pb-2">
    <div className="flex items-start justify-between">
      <div className="flex-1 justify-center">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {recruiterInfo.name}
            </h3>
            <p className="text-gray-600">{recruiterInfo.email}</p>
          </div>
          <div
            style={{ marginLeft: "15vw" }}
            className="flex items-center space-x-2"
          >
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700">{recruiterInfo.jobRole}</span>
          </div>

          <div
            style={{ marginLeft: "5vw" }}
            className="flex items-center space-x-2"
          >
            <Briefcase className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700">{recruiterInfo.companyName}</span>
          </div>
        </div>
      </div>

      <LogoutButton />
    </div>
  </div>
);

// Logout Button Component
const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
    >
      <LogOut className="w-5 h-5" />
      <span>Logout</span>
    </button>
  );
};

// Stats Card Component
const StatsCard = ({ candidates }) => {
  const stats = {
    total: candidates.length,
    cheating: candidates.filter((c) => c.isCheating).length,
    aptitudePassed: candidates.filter((c) => c.aptitudeStatus === "Passed")
      .length,
    techPassed: candidates.filter((c) => c.techStatus === "Passed").length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {[
        { label: "Total Candidates", value: stats.total, color: "bg-blue-500" },
        {
          label: "Cheating Detected",
          value: stats.cheating,
          color: "bg-red-500",
        },
        {
          label: "Aptitude Passed",
          value: stats.aptitudePassed,
          color: "bg-green-500",
        },
        {
          label: "Technical Passed",
          value: stats.techPassed,
          color: "bg-purple-500",
        },
      ].map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm font-medium">{stat.label}</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-3xl font-semibold text-gray-900">{stat.value}</p>
            <div
              className={`ml-2 ${stat.color} text-white text-xs px-2 py-1 rounded-full`}
            >
              {((stat.value / stats.total) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Candidate Rejection Modal
const CandidateRejectionModal = ({ isOpen, onClose, candidate, onReject }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[700px] max-h-[90vh] overflow-y-auto">
        <div className="bg-red-500 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-2xl font-bold">Candidate Cheating Evidence</h2>
          <button
            onClick={onClose}
            className="hover:bg-red-600 p-2 rounded-full"
          >
            <XCircle size={28} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex items-center space-x-4">
              <AlertTriangle className="text-red-600" size={40} />
              <div>
                <h3 className="text-xl font-semibold text-red-800">
                  {candidate.name}
                </h3>
                <p className="text-red-700">{candidate.email}</p>
              </div>
            </div>
          </div>

          {candidate.cheatImage && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <h4 className="text-lg font-semibold p-4 bg-gray-50 border-b">
                Evidence Image
              </h4>
              <div className="p-4">
                <img
                  src={candidate.cheatImage}
                  alt="Cheating Evidence"
                  className="w-full h-auto rounded-lg"
                  onError={(e) => {
                    e.target.src = "/api/placeholder/640/360";
                    e.target.alt = "Failed to load evidence image";
                  }}
                />
              </div>
            </div>
          )}

          {candidate.cheatComment && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
              <h4 className="text-lg font-semibold text-yellow-800 mb-2">
                Cheating Comment
              </h4>
              <p className="text-yellow-900">{candidate.cheatComment}</p>
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => onReject(candidate)}
              className="px-6 py-3 bg-red-600 text-white rounded-lg flex items-center space-x-2 hover:bg-red-700 transition"
            >
              <Ban size={20} />
              <span>Reject Candidate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Email Modal
const EmailModal = ({ isOpen, onClose, candidateEmail }) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = async () => {
    if (!message.trim()) {
      alert("Please enter a message");
      return;
    }

    setIsSending(true);
    try {
      await axios.post("/send-email", {
        to: candidateEmail,
        message,
      });
      alert("Email sent successfully");
      onClose();
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-[600px] p-6">
        <h2 className="text-xl font-bold mb-4">
          Send Email to {candidateEmail}
        </h2>
        <textarea
          className="w-full h-40 border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSendEmail}
            disabled={isSending}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Recruitment Dashboard
const RecruitmentDashboard = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [recruiterInfo, setRecruiterInfo] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [jobPostingModalOpen, setJobPostingModalOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const userId = localStorage.getItem("userId");
  const [candidateScores, setCandidateScores] = useState({});
  const [isLoadingScores, setIsLoadingScores] = useState(false);
  const [scoreError, setScoreError] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchJobs = async () => {
    try {
      const jobsResponse = await axios.get(`${BACKEND_URL}/jobs/${userId}`);
      setJobs(jobsResponse.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleJobSubmit = async (jobData) => {
    try {
      if (jobData._id) {
        // Job was updated - update in state
        setJobs(
          jobs.map((job) =>
            job._id === jobData._id ? { ...job, ...jobData } : job
          )
        );
        alert("Job updated successfully");
      } else {
        // Job was created - add to state
        const createdJob = {
          ...jobData,
          _id: jobData._id, // This should come from the server response
        };
        setJobs([...jobs, createdJob]);
        alert("Job created successfully");
      }
      setJobPostingModalOpen(false);
      setEditingJob(null);
    } catch (error) {
      console.error("Error saving job:", error);
      alert(error.response?.data?.message || "Failed to save job posting");
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      try {
        const response = await axios.delete(`${BACKEND_URL}/deleteJob`, {
          data: { jobId },
        });

        if (response.status === 200) {
          setJobs(jobs.filter((job) => job._id !== jobId));
          alert("Job deleted successfully");
        }
      } catch (error) {
        console.error("Error deleting job:", error);
        alert(error.response?.data?.message || "Failed to delete job posting");
      }
    }
  };

  // Fixed handleEditJob function - now it just populates the form
  const handleEditJob = (job) => {
    setEditingJob(job);
    setJobPostingModalOpen(true);
  };

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("No userId found");
          return;
        }

        const response = await axios.get(
          `${BACKEND_URL}/getUserInfo/${userId}`
        );
        setRecruiterInfo(response.data);

        const enrichedCandidates = response.data.candidateData.map(
          (candidate) => ({
            ...candidate,
            aptitudeStatus: response.data.aptitudePassesCandidates.includes(
              candidate.email
            )
              ? "Passed"
              : response.data.aptitudeFailedCandidates.includes(candidate.email)
                ? "Failed"
                : "Pending",
            techStatus: response.data.techPassesCandidates.includes(
              candidate.email
            )
              ? "Passed"
              : response.data.techFailedCandidates.includes(candidate.email)
                ? "Failed"
                : "Pending",
            hrStatus: "Pending",
            isCheating: !!(candidate.cheatImage || candidate.cheatComment),
          })
        );

        setCandidates(enrichedCandidates);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, []);

  const handleRejectCandidate = async (candidate) => {
    try {
      const templateParams = {
        to_email: candidate.email,
      };

      await cheateEmail(templateParams);
      setCandidates(candidates.filter((c) => c.email !== candidate.email));
      setRejectionModalOpen(false);
      alert(`Candidate ${candidate.name} has been rejected`);
    } catch (error) {
      console.error("Error rejecting candidate:", error);
      alert("Failed to reject candidate");
    }
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const direction = sortConfig.direction === "asc" ? 1 : -1;
    return a[sortConfig.key] > b[sortConfig.key] ? direction : -direction;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Passed":
        return "text-green-600";
      case "Failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };



  useEffect(() => {
    const fetchScores = async () => {
      const userId = localStorage.getItem('userId')

      setIsLoadingScores(true);
      setScoreError(null);

      console.log("fetch scores")

      try {
        const response = await fetch(`${BACKEND_URL}/allScores/${userId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch scores');
        }

        console.log("data: ", data)

        // Convert array of scores to object keyed by candidateEmail for easier lookup
        const scoresMap = data.reduce((acc, scoreData) => {
          acc[scoreData.candidateEmail] = {
            aptitudeScore: scoreData.aptitudeScore,
            communicationScore: scoreData.communicationScore,
            technicalScore: scoreData.technicalScore
          };
          return acc;
        }, {});

        setCandidateScores(scoresMap);
      } catch (error) {
        console.error('Error fetching scores:', error);
        setScoreError(error.message);
      } finally {
        setIsLoadingScores(false);
      }
    };

    fetchScores();
  }, [userId]);

  const getScoreDisplay = (candidateEmail, roundType) => {
    const candidateScore = candidateScores[candidateEmail];
    if (!candidateScore) return "N/A";

    const score = candidateScore[`${roundType}Score`];
    if (score === undefined || score === null) return "N/A";
    return score || 0;
  };

  const renderScoreBadge = (candidateEmail, roundType) => {
    const candidateScore = candidateScores[candidateEmail];
    if (!candidateScore) return null;

    const score = candidateScore[`${roundType}Score`];
    if (score === undefined || score === null) return null;

    const bgColor = score >= 7 ? "bg-green-100" :
      score >= 5 ? "bg-yellow-100" :
        "bg-red-100";
    const textColor = score >= 7 ? "text-green-800" :
      score >= 5 ? "text-yellow-800" :
        "text-red-800";

    return (
      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {getScoreDisplay(candidateEmail, roundType)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-7xl">
        {recruiterInfo && <RecruiterInfoCard recruiterInfo={recruiterInfo} />}
        <StatsCard candidates={candidates} />
        <JobListingCard
          jobs={jobs}
          onEdit={handleEditJob}
          onDelete={handleDeleteJob}
          setEditingJob={setEditingJob}
          setJobPostingModalOpen={setJobPostingModalOpen}
        />

        <div className="bg-white rounded-lg shadow-xl">
          <div className="border-b p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Candidate Management
              </h2>
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border rounded-lg w-80 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { key: "name", label: "Name" },
                    { key: "email", label: "Email" },
                    { key: "aptitudeStatus", label: "Aptitude Round" },
                    { key: "communicationStatus", label: "Communication Round" },
                    { key: "techStatus", label: "Technical Round" },
                    { key: "hrStatus", label: "HR Round" },
                  ].map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort(column.key)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.label}</span>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedCandidates.map((candidate) => (
                  <tr
                    key={candidate.email}
                    className={`border-b transition-colors ${candidate.isCheating
                      ? "bg-red-50 hover:bg-red-100"
                      : "hover:bg-gray-50"
                      }`}
                  >
                    <td className="px-6 py-4 font-medium flex items-center">
                      {candidate.isCheating && (
                        <button
                          onClick={() => {
                            setSelectedCandidate(candidate);
                            setRejectionModalOpen(true);
                          }}
                          className="mr-2 text-red-500 hover:text-red-700 transition"
                        >
                          <AlertTriangle size={20} />
                        </button>
                      )}
                      {candidate.name}
                    </td>
                    <td className="px-6 py-4">{candidate.email}</td>
                    <td className={`px-6 py-4 ${getStatusColor(candidate.aptitudeStatus)}`}>
                      <div className="flex items-center">
                        <span className="inline-flex items-center">
                          {candidate.aptitudeStatus}

                        </span>
                        {renderScoreBadge(candidate.email, 'aptitude')}
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${getStatusColor(candidate.communicationStatus)}`}>
                      <div className="flex items-center">
                        <span className="inline-flex items-center">
                          {getScoreDisplay(candidate.email, 'communication') > 0 ? "Completed" : "Pending"}

                        </span>
                        {renderScoreBadge(candidate.email, 'communication')}
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${getStatusColor(candidate.techStatus)}`}>
                      <div className="flex items-center">
                        <span className="inline-flex items-center">
                          {candidate.techStatus}

                        </span>
                        {renderScoreBadge(candidate.email, 'technical')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {candidate.hrStatus === "Pending" ? (
                        <button
                          onClick={() => {
                            localStorage.setItem(
                              "interviewRecruiterEmail",
                              recruiterInfo.email
                            );
                            localStorage.setItem(
                              "interviewCandidateEmail",
                              candidate.email
                            );
                            navigate(`/hrRoundEntrance`);
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Take Interview
                        </button>
                      ) : (
                        <span
                          className={`inline-flex items-center ${getStatusColor(
                            candidate.hrStatus
                          )}`}
                        >
                          {candidate.hrStatus}
                          {candidate.hrStatus === "Passed" && (
                            <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
                          )}
                          {candidate.hrStatus === "Failed" && (
                            <span className="ml-2 w-2 h-2 bg-red-500 rounded-full"></span>
                          )}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedCandidate(candidate);
                            setEmailModalOpen(true);
                          }}
                          className={`p-2 rounded-full hover:bg-gray-100 ${candidate.isCheating
                            ? "text-red-500 hover:text-red-700"
                            : "text-blue-500 hover:text-blue-700"
                            }`}
                        >
                          <Mail size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {sortedCandidates.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No candidates found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <EmailModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        candidateEmail={selectedCandidate?.email || ""}
      />

      <CandidateRejectionModal
        isOpen={rejectionModalOpen}
        onClose={() => setRejectionModalOpen(false)}
        candidate={selectedCandidate || {}}
        onReject={handleRejectCandidate}
      />

      {!recruiterInfo && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      )}

      <JobPostingModal
        isOpen={jobPostingModalOpen}
        onClose={() => {
          setJobPostingModalOpen(false);
          setEditingJob(null);
        }}
        onSubmit={handleJobSubmit}
        initialData={editingJob}
      />
    </div>
  );
};

export default RecruitmentDashboard;
