import { User, Mail, Lock } from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "./Button";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { name, email, password };

    try {
      const response = await axios.post(`${BACKEND_URL}/signup`, formData);

      if (response.status === 200) {
        localStorage.clear();

        localStorage.setItem("email", email);
        localStorage.setItem("userId", response.data.id);
        localStorage.setItem("name", name);

        setName("");
        setEmail("");
        setPassword("");
        navigate("/");
      }
    } catch (error) {
      console.log("Signup failed", error);
      alert("Error: Unable to sign up!", error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10" />

      <div className="w-full max-w-md mx-4 overflow-hidden rounded-lg shadow-2xl bg-white/95 backdrop-blur-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-6 text-center">
          <h1 className="text-2xl font-bold mb-2">SmartRecruit</h1>
          <p className="text-white/90 text-sm">
            Create your account to get started
          </p>
        </div>

        {/* Signup Form Container */}
        <div className="p-8 -mt-6">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Choose a strong password"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Create Account
              </Button>
            </form>

            {/* Footer Text */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?
                <Link to="/login">
                  <button className="ml-1 text-blue-600 hover:text-blue-800 font-medium focus:outline-none">
                    Sign In
                  </button>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
