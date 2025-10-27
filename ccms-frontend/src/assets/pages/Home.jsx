import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-white to-blue-200">
      <div className="bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4">
          College Complaint Management System
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          A centralized platform to <span className="font-semibold">submit</span>,
          <span className="font-semibold"> track</span>, and <span className="font-semibold">resolve</span> campus complaints efficiently.
        </p>

        <div className="flex justify-center space-x-6 mt-4">
          <Link
            to="/login"
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 hover:scale-105 transform transition-all duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold shadow-md hover:bg-green-700 hover:scale-105 transform transition-all duration-300"
          >
            Register
          </Link>
        </div>

        <p className="mt-8 text-gray-500 text-sm">
          Empowering Students • Simplifying Administration
        </p>
      </div>
    </div>
  );
};

export default Home;
