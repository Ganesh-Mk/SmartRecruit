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
        setJobs(response.data);
        setFilteredJobs(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch jobs");
        setLoading(false);
      }
    };

    fetchJobs();
  }, [BACKEND_URL]);

  const handleApply = (jobId) => {
    navigate(`/jobApplication/${jobId}`);
  };

  useEffect(() => {
    const results = jobs.filter(job =>
      job.jobRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(results);
  }, [searchTerm, jobs]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    },
    hover: {
      y: -10,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    exit: {
      y: 20,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  const searchBarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.1
      }
    }
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

  // Function to generate a color based on company name
  const getCompanyColor = (companyName) => {
    const colors = [
      "bg-blue-500", "bg-purple-500", "bg-green-500", "bg-yellow-500",
      "bg-pink-500", "bg-indigo-500", "bg-red-500", "bg-teal-500"
    ];

    let hash = 0;
    for (let i = 0; i < companyName.length; i++) {
      hash = companyName.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Available Job Opportunities</h1>

      <motion.div
        className="max-w-xl mx-auto mb-12 relative"
        variants={searchBarVariants}
        initial="hidden"
        animate="visible"
      >
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
        <motion.p
          animate={{ opacity: filteredJobs.length === 0 ? 1 : 0 }}
          className="absolute mt-2 text-center w-full text-gray-500"
        >
          {filteredJobs.length === 0 && "No jobs found matching your search"}
        </motion.p>
      </motion.div>

      <AnimatePresence>
        {filteredJobs.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {filteredJobs.map((job) => (
              <motion.div
                key={job._id}
                className="bg-white rounded-xl overflow-hidden shadow-lg"
                variants={cardVariants}
                whileHover="hover"
                layout
                exit="exit"
              >
                <div className={`h-32 flex items-center justify-center ${getCompanyColor(job.companyName)}`}>
                  <span className="font-bold text-2xl text-white text-center px-4">
                    {job.companyName}
                  </span>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-3 text-gray-800">{job.jobRole}</h2>
                  <div className="mb-4">
                    <div className="flex items-center mb-2 text-gray-600">
                      <Briefcase className="w-5 h-5 mr-2" />
                      <span>{job.companyName}</span>
                    </div>
                    <div className="flex items-center mb-2 text-gray-600">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span>Deadline: {formatDate(job.deadline)}</span>
                    </div>
                    {job.salary && (
                      <div className="flex items-center mb-2 text-gray-600">
                        <Clock className="w-5 h-5 mr-2" />
                        <span>{job.salary}</span>
                      </div>
                    )}
                    {job.vacancies && (
                      <div className="flex items-center mb-2 text-gray-600">
                        <Users className="w-5 h-5 mr-2" />
                        <span>{job.vacancies} {job.vacancies > 1 ? 'positions' : 'position'}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">{job.desc}</p>
                  <motion.button
                    className="mt-4 w-full py-3 bg-blue-500 text-white rounded-lg font-medium flex items-center justify-center"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleApply(job._id)}
                  >
                    <span className="mr-2">Apply Now</span>
                    <ExternalLink className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {jobs.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <h2 className="text-2xl text-gray-600 mb-4">No job postings available at the moment</h2>
          <p className="text-gray-500">Please check back later for new opportunities.</p>
        </motion.div>
      )}
    </div>
  );
};

export default AllJobsDisplay;