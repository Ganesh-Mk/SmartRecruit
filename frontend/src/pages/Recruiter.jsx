import axios from "axios";
import { useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const RecruiterInfo = () => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [date, setDate] = useState(null);
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [jobrole, setjobRole] = useState(localStorage.getItem("jobRole") || "");
  const [companyName, setCompanyName] = useState(
    localStorage.getItem("companyName") || ""
  );
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !companyName || !jobrole) {
      alert("Please select both start and end times.");
      return;
    }

    const data = {
      userId: localStorage.getItem("userId"),
      name,
      email,
      companyName,
      jobrole,
      date: dayjs(date).format("DD MMM YYYY"), // Format date as "DD MMM YYYY"
      startTime: startTime
        ? dayjs(`${date}T${startTime}`).format("HH:mm")
        : null, // Format startTime as "HH:mm"
      endTime: endTime ? dayjs(`${date}T${endTime}`).format("HH:mm") : null, // Format endTime as "HH:mm"
    };

    console.log(data);

    try {
      const response = await axios.post(`${BACKEND_URL}/updateUser`, data, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        console.log("response: ", response);

        localStorage.setItem("companyName", companyName);
        localStorage.setItem("jobRole", jobrole);
        localStorage.setItem("startTime", startTime);
        localStorage.setItem("endTime", endTime);
        localStorage.setItem("date", date);

        setName("");
        setEmail("");
        setCompanyName("");
        setjobRole("");
        setStartTime(null);
        setEndTime(null);
        setDate(null);

        navigate("/candidateUpload");
      } else {
        alert("Failed to schedule interview time");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred while scheduling the interview");
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="min-h-screen p-6">
        <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Recruiter Information
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Please add your recruiting details below
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl mx-auto">
          {" "}
          {/* Updated max width */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 text-sm border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 text-sm border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700"
            >
              Company Name
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              placeholder="Enter your company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-2 text-sm border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700"
            >
              Job Role (for what position you are recruiting)
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              placeholder="Enter your company name"
              value={jobrole}
              onChange={(e) => setjobRole(e.target.value)}
              className="w-full px-4 py-2 text-sm border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSubmit}
            type="submit"
            className="w-full py-3 px-4 text-sm text-white font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecruiterInfo;
