import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist/webpack";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const JobApplicationForm = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    resume: null,
  });
  const [pdfText, setPdfText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [loader, setLoader] = useState(false);
  const [jobInfo, setJobInfo] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setIsLoading(true);
      setFileName(file.name);
      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          const pdfData = new Uint8Array(event.target.result);
          const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
          let text = "";

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map((item) => item.str).join(" ") + " ";
          }

          setPdfText(text);
          setFormData((prev) => ({ ...prev, resume: file }));
          setIsLoading(false);
        } catch (error) {
          console.error("Error processing PDF:", error);
          setIsLoading(false);
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const response = await fetch(`${BACKEND_URL}/scanResume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          name: formData.fullName,
          email: formData.email,
          resumeContent: pdfText,
          jobDesc: jobInfo.description
        }),
      });
      const data = await response.json();
      console.log(data);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error submitting application:", error);
    } finally {
      setLoader(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/jobs');
  };

  const getJobInfo = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/getJob?jobId=${jobId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log("job info: ", data);
      setJobInfo(data);
    } catch (error) {
      console.error("Error fetching job info:", error);
    }
  };

  useEffect(() => {
    getJobInfo();
  }, [jobId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-md m-4 rounded-xl shadow-2xl transform transition-all">
            <div className="p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Application Submitted Successfully!</h3>
              <p className="text-center text-gray-600 mb-6">
                Your application for {jobInfo?.jobRole} at {jobInfo?.companyName} has been received. We'll notify you about the next steps.
              </p>
              <button
                onClick={handleCloseModal}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Great, thanks!
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        {jobInfo && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90"></div>
              <div className="relative px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-2">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full">
                      {jobInfo.companyName}
                    </span>
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                      {jobInfo.jobRole}
                    </h1>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white">
                      <span className="text-white/80 text-sm">Application Deadline</span>
                      <div className="font-semibold">{formatDate(jobInfo.deadline)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-8 py-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Description</h3>
              <p className="text-gray-600 leading-relaxed">{jobInfo.description}</p>
            </div>
          </div>
        )}

        <div className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Submit Your Application</h2>
                <p className="text-gray-500">Fill in your details to apply for this position</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 gap-8">
              <div className="group">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition-all duration-200 outline-none text-gray-700 bg-white group-hover:border-gray-300"
                  />
                  <div className="absolute inset-0 w-1 bg-gradient-to-b from-blue-600 to-purple-600 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </div>
              </div>

              <div className="group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition-all duration-200 outline-none text-gray-700 bg-white group-hover:border-gray-300"
                  />
                  <div className="absolute inset-0 w-1 bg-gradient-to-b from-blue-600 to-purple-600 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resume (PDF)</label>
                <div className="relative group">
                  <label className="flex flex-col items-center px-6 py-8 rounded-lg border-2 border-dashed border-gray-300 
                                  bg-white hover:bg-gray-50 transition-colors duration-200 cursor-pointer group-hover:border-blue-500">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">
                          {fileName ? (
                            <span className="text-blue-600 font-medium">{fileName}</span>
                          ) : (
                            <>
                              <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
                              <br />your resume (PDF)
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="application/pdf"
                      onChange={handlePdfUpload}
                      required
                    />
                  </label>
                </div>
              </div>
            </div>

            {isLoading && (
              <div className="flex items-center justify-center py-4 px-6 bg-blue-50 rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <span className="ml-3 text-blue-700 font-medium">Processing your resume...</span>
              </div>
            )}

            {pdfText && (
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Extracted Resume Content
                </label>
                <div className="bg-white rounded-lg p-4 h-40 overflow-auto text-sm text-gray-600 border border-gray-200">
                  {pdfText}
                </div>
              </div>
            )}

            <div className="pt-6">
              <button
                type="submit"
                disabled={loader}
                className={`w-full px-6 py-4 font-medium rounded-lg transition-all duration-200 focus:outline-none
                  flex items-center justify-center gap-2
                  ${loader
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/50 transform hover:-translate-y-0.5"
                  }`}
              >
                {loader ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="h-24"></div>
    </div>
  );
};

export default JobApplicationForm;