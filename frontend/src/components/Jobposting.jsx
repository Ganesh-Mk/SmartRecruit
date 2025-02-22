import React, { useState, useEffect } from "react";
import { XCircle, Plus, Briefcase, Edit } from "lucide-react";
import axios from "axios";

const JobPostingModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    jobRole: "",
    companyName: "",
    description: "",
    deadline: "",
    userId: localStorage.getItem("userId"),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Determine if we're editing an existing job
  const isEditing = !!initialData;

  // Update form when initialData changes or modal opens
  useEffect(() => {
    if (initialData) {
      // Convert ISO date string to YYYY-MM-DD format for input field
      const deadlineDate = initialData.deadline ?
        new Date(initialData.deadline).toISOString().split('T')[0] : '';

      setFormData({
        jobRole: initialData.jobRole || '',
        companyName: initialData.companyName || '',
        description: initialData.description || '',
        deadline: deadlineDate,
        userId: localStorage.getItem("userId"),
      });
    } else {
      // Reset form when creating a new job
      setFormData({
        jobRole: "",
        companyName: "",
        description: "",
        deadline: "",
        userId: localStorage.getItem("userId"),
      });
    }
  }, [initialData, isOpen, onSubmit]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let response;

      // Handle either create or update based on whether we have initialData
      if (isEditing) {
        response = await axios.put(`${BACKEND_URL}/updateJob`, {
          jobId: initialData._id,
          jobRole: formData.jobRole,
          companyName: formData.companyName,
          desc: formData.description,
          deadline: formData.deadline,
        });

        if (response.status === 200) {
          console.log("Job updated successfully");
          if (onSubmit) {
            onSubmit({
              ...formData,
              desc: formData.description, // Map description to desc for consistency
              _id: initialData._id
            });
          }
        }
      } else {
        response = await axios.post(`${BACKEND_URL}/createJob`, {
          ...formData,
          desc: formData.description, // Map description to desc for API
        });

        if (response.status === 200 || response.status === 201) {
          console.log("Job created successfully");
          if (onSubmit) {
            onSubmit({
              ...formData,
              desc: formData.description, // Map description to desc for consistency
              _id: response.data.job._id
            });
          }
        }
      }

      onClose();
    } catch (error) {
      console.error(isEditing ? "Error updating job posting:" : "Error creating job posting:", error);
      alert(isEditing ? "Failed to update job posting" : "Failed to create job posting");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-[600px]">
        <div className="bg-blue-500 text-white p-4 rounded-t-xl flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            {isEditing ? (
              <>
                <Edit className="w-5 h-5" />
                Edit Job Posting
              </>
            ) : (
              <>
                <Briefcase className="w-5 h-5" />
                Create New Job Posting
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-blue-600 p-2 rounded-full"
          >
            <XCircle size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Role
            </label>
            <input
              type="text"
              name="jobRole"
              required
              placeholder="e.g. Software Engineer"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.jobRole}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              required
              placeholder="e.g. Tech Solutions Inc"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.companyName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description
            </label>
            <textarea
              name="description"
              required
              rows="3"
              placeholder="Enter detailed job description..."
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Application Deadline
            </label>
            <input
              type="date"
              name="deadline"
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.deadline}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>{isEditing ? "Updating..." : "Creating..."}</span>
              ) : (
                <>
                  {isEditing ? <Edit size={18} /> : <Plus size={18} />}
                  <span>{isEditing ? "Update Job Posting" : "Create Job Posting"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobPostingModal;