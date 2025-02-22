import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ArrowRight, ClipboardList, AlertCircle } from 'lucide-react';

const JobPosting = () => {
  const [selected, setSelected] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

  const handleSelection = (choice) => {
    setSelected(choice);
    setShowMessage(true);
  };

  const handleContinue = () => {
    if (selected === 'yes') {
      navigate('/candidateUpload');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <div className="p-3 rounded-full bg-blue-100">
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <h1 className="text-xl font-semibold text-center text-gray-800 mb-6">
            Job Posting Check
          </h1>

          <p className="text-gray-600 text-center mb-8">
            Have you already posted the job or job description somewhere?
          </p>

          <div className="grid grid-cols-1 gap-4 mb-6">
            <button
              onClick={() => handleSelection('yes')}
              className={`flex items-center justify-between px-4 py-3 border rounded-lg transition-all duration-200 ${selected === 'yes'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                }`}
            >
              <div className="flex items-center">
                <ClipboardList className="h-5 w-5 mr-3 text-blue-500" />
                <span>Yes, I've already posted the job</span>
              </div>
              {selected === 'yes' && (
                <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 1L3.5 6.5L1 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </button>

            <button
              onClick={() => handleSelection('no')}
              className={`flex items-center justify-between px-4 py-3 border rounded-lg transition-all duration-200 ${selected === 'no'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                }`}
            >
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-3 text-blue-500" />
                <span>No, I haven't posted any job yet</span>
              </div>
              {selected === 'no' && (
                <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 1L3.5 6.5L1 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </button>
          </div>

          {showMessage && (
            <div className={`mb-6 p-4 rounded-lg ${selected === 'yes' ? 'bg-green-50 text-green-800' : 'bg-blue-50 text-blue-800'
              } animate-fadeIn`}>
              {selected === 'yes' ? (
                <p>Great! You can proceed to the next step to upload your Excel file.</p>
              ) : (
                <p>You need to create a job posting from your dashboard first. Look for the "Create Job Posting" button in your dashboard. After completing your job posting duration, you can return here to continue with the next step.</p>
              )}
            </div>
          )}

          <button
            onClick={handleContinue}
            disabled={!selected}
            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-all duration-300 ${selected
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobPosting;