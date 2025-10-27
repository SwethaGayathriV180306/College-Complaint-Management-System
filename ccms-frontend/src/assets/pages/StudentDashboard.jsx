import React, { useEffect, useState } from "react";
import socket from "../../services/socket";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure socket is connected
    if (!socket.connected) {
      socket.connect();
    }

    // Listen for real-time updates
    socket.on("complaintUpdate", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("complaintUpdate");
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-3">
          🎓 Student Dashboard
        </h2>
        <p className="text-gray-600 mb-8">
          Welcome back,{" "}
          <span className="font-semibold text-blue-800">
            {user?.name || user?.email}
          </span>
          !
        </p>

        {/* Notifications Section */}
        <div className="bg-gray-50 rounded-xl shadow-inner p-6 border border-gray-200">
          <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
            🔔 Notifications
          </h3>

          <ul className="space-y-3 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100">
            {notifications.length === 0 ? (
              <li className="text-gray-500 text-center italic">
                No notifications yet.
              </li>
            ) : (
              notifications.map((n, idx) => (
                <li
                  key={idx}
                  className="border border-blue-100 bg-white rounded-lg shadow-sm p-4 text-left hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                >
                  <strong className="block text-blue-700">
                    {n.title || "Complaint Update"}
                  </strong>
                  <p className="text-sm text-gray-600 mt-1">
                    {n.message || JSON.stringify(n)}
                  </p>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Button */}
        <button
          onClick={() => navigate("/complaints")}
          className="mt-8 bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
        >
          View My Complaints
        </button>
      </div>
    </div>
  );
}
