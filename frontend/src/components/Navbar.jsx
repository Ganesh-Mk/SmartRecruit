import { Link } from "react-router-dom";
import Button from "./Button";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [isEmail, setisEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      setisEmail(email);
    }
  }, [isEmail]);

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-10 py-2 sm:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Jobs button */}
          <Link to={"/"}>
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold text-blue-600">
                  SmartRecruit
                </span>
              </div>
            </div>
          </Link>

          {/* Right side buttons */}
          {isEmail ? (
            <div className="flex items-center space-x-4">
              <Link to={"/jobs"}>
                <Button
                  type="button"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Jobs
                </Button>
              </Link>
              <Link to={"/dashboard"}>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to={"/login"}>
                <button className="font-medium">Login</button>
              </Link>
              <Link to={"/signup"}>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;