import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Calendar, Briefcase, Clock, Users, Search, ExternalLink } from "lucide-react";

const AllJobsDisplay = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/allJob`);
        const jobData = Array.isArray(response.data) ? response.data : [];
        setJobs(jobData);
        setFilteredJobs(jobData);
      } catch (err) {
        setError(err.message || "Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [BACKEND_URL]);

  const handleApply = (jobId) => navigate(`/jobApplication/${jobId}`);

  useEffect(() => {
    const results = jobs.filter((job) =>
      job?.jobRole?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job?.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(results);
  }, [searchTerm, jobs]);

  const getCompanyColor = (companyName) => {
    const colors = [
      "bg-blue-500", "bg-purple-500", "bg-green-500", "bg-yellow-500",
      "bg-pink-500", "bg-indigo-500", "bg-red-500", "bg-teal-500"
    ];
    let hash = 0;
    for (let i = 0; i < companyName?.length; i++) {
      hash = companyName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-16 w-16 border-t-4 border-b-4 border-blue-500 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center flex-col">
        <h2 className="text-2xl text-red-600 mb-4">Error loading jobs</h2>
        <p className="text-gray-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Available Job Opportunities</h1>

      <motion.div className="max-w-xl mx-auto mb-12">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for jobs by role or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 px-12 bg-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
          <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
        </div>
        {filteredJobs.length === 0 && (
          <p className="mt-2 text-center text-gray-500">No jobs found matching your search</p>
        )}
      </motion.div>

      <AnimatePresence>
        {filteredJobs.length > 0 && (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <motion.div
                key={job._id}
                className="bg-white rounded-xl overflow-hidden shadow-lg"
              >
                <div className={`h-32 flex items-center justify-center ${getCompanyColor(job.companyName)}`}>
                  <span className="font-bold text-2xl text-white">{job.companyName}</span>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-3 text-gray-800">{job.jobRole}</h2>
                  <p className="text-gray-600 mb-4">{job.desc}</p>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleApply(job._id)}
                      className="py-2 px-4 bg-blue-500 text-white rounded-lg"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {jobs.length === 0 && !loading && (
        <div className="text-center py-16">
          <h2 className="text-2xl text-gray-600 mb-4">No job postings available at the moment</h2>
          <p className="text-gray-500">Please check back later for new opportunities.</p>
        </div>
      )}
    </div>
  );
};

export default AllJobsDisplay;
