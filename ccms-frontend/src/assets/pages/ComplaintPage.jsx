import React, { useEffect, useState, useContext } from "react";
import API from "../../api/api";
import { AuthContext } from "../contexts/AuthContext";

const ComplaintPage = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", category: "" });

 useEffect(() => {
  if (user?.token) {
    API.get("/api/complaints/me", {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => setComplaints(res.data))
      .catch((err) => console.error("Error loading complaints:", err));
  }
}, [user]);
console.log("Submitting form:", form);
console.log("Auth user object:", user);
console.log("Token value used:", user?.token || localStorage.getItem("token"));

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await API.post("/api/complaints", form, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    alert("Complaint added successfully!");
    setForm({ title: "", description: "", category: "" });

    const updated = await API.get("/api/complaints/me", {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setComplaints(updated.data);
  } catch (error) {
  console.error("Error submitting complaint:", error);

  // This prints full backend message if available
  if (error.response) {
    console.error("Backend response data:", error.response.data);
    console.error("Backend status:", error.response.status);
    alert("Server error: " + JSON.stringify(error.response.data));
  } else if (error.request) {
    console.error("No response received:", error.request);
    alert("No response from server");
  } else {
    console.error("Error setting up request:", error.message);
    alert("Error: " + error.message);
  }
}

};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">
          📝 Submit a Complaint
        </h1>

        {/* Complaint Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-200"
        >
          <input
            type="text"
            placeholder="Complaint Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 w-full p-3 rounded-lg outline-none transition-all"
            required
          />

          <textarea
            placeholder="Describe your issue..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 w-full p-3 rounded-lg outline-none transition-all h-28 resize-none"
            required
          ></textarea>

          <input
            type="text"
            placeholder="Category (e.g. Hostel, Academic, Transport)"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 w-full p-3 rounded-lg outline-none transition-all"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
          >
            Submit Complaint
          </button>
        </form>

        {/* My Complaints Section */}
        <h2 className="text-2xl font-semibold text-blue-800 mt-10 mb-4 text-center">
          📋 My Complaints
        </h2>

        <ul className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100">
          {complaints.length === 0 ? (
            <li className="text-gray-500 text-center italic">
              No complaints submitted yet.
            </li>
          ) : (
            complaints.map((c) => (
              <li
                key={c._id}
                className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-xl p-5 text-left"
              >
                <div className="flex justify-between items-center mb-1">
                  <strong className="text-blue-700 text-lg">{c.title}</strong>
                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      c.status === "Resolved"
                        ? "bg-green-100 text-green-700"
                        : c.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{c.description}</p>
                <small className="text-sm text-gray-500">
                  Category: <span className="font-medium">{c.category}</span>
                </small>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default ComplaintPage;
