import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  Cell,
} from "recharts";

export default function AdminHome() {
  const [referral, setReferral] = useState("overall");
  const [graphType, setGraphType] = useState("referral");
  const [userType, setUserType] = useState("student"); // ✅ new filter
  const [userCount, setUserCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [filterType, setFilterType] = useState("daily");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const referrals = [
    "overall",
    "DOC1",
    "DOC2",
    "DOC3",
    "DOC4",
    "DOC5",
    "DOC6",
    "DOC7",
    "DOC8",
    "DOC9",
    "DOC10",
  ];

  const colors = [
    "#1E88E5", "#43A047", "#FB8C00", "#8E24AA", "#E53935",
    "#00ACC1", "#FDD835", "#6D4C41", "#3949AB", "#00897B",
  ];
  
  
useEffect(() => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token || role !== "admin") {
    window.location.href = "/login";
  }
}, []);

  // ===== Fetch data from backend =====
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/admin/dashboard?referral=${encodeURIComponent(referral)}&user_type=${encodeURIComponent(userType)}`);
        const data = await res.json();

        if (res.ok) {
          setUserCount(data.total_users || 0);
          setUsers(data.recent_users || []);
          setGraphData(data.graph_data || []);
        } else {
          console.error("Error:", data.error || "Failed to fetch data");
          setUserCount(0);
          setUsers([]);
          setGraphData([]);
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        // ⏳ Small delay for smoother UI
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchAdminData();
  }, [referral, userType]);

  // ===== Fetch Trend Data (with smooth animation) =====
  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/admin/dashboard?period=${encodeURIComponent(filterType)}&user_type=${encodeURIComponent(userType)}`);
        const data = await res.json();

        if (res.ok) {
          setTrendData(data.trend_data || []);
        } else {
          console.error("Error:", data.error || "Failed to fetch trend data");
          setTrendData([]);
        }
      } catch (error) {
        console.error("Error fetching trend data:", error);
        setTrendData([]);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };

    fetchTrendData();
  }, [filterType, userType]);

  return (
    <main className="sm:ml-56 pt-20 pb-10 bg-[#D3EAFD] min-h-screen flex justify-center transition-all duration-300">
      <div className="w-full max-w-6xl px-4 sm:px-6">
        {/* ===== Filter Section ===== */}
        <div className="bg-[#E3F2FD] border border-[#90CAF9] p-4 rounded-md mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-3 shadow-md transition-all duration-300">
          <div className="flex flex-wrap items-center gap-4">
            {/* Referral Filter */}
            <div className="flex items-center gap-2">
              <label className="font-semibold text-[#0D47A1] text-sm sm:text-base">
                Referral:
              </label>
              <select
                value={referral}
                onChange={(e) => setReferral(e.target.value)}
                className="border border-[#90CAF9] px-2 py-[2px] rounded bg-white text-sm"
              >
                {referrals.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* ✅ New User Type Filter */}
            <div className="flex items-center gap-2">
              <label className="font-semibold text-[#0D47A1] text-sm sm:text-base">
                User Type:
              </label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="border border-[#90CAF9] px-2 py-[2px] rounded bg-white text-sm"
              >
                <option value="student">Student</option>
                <option value="employee">Employee</option>
              </select>
            </div>
          </div>

          {/* Total Users */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
            <label className="font-semibold text-[#0D47A1] text-sm sm:text-base">
              Total Users:
            </label>
            <input
              type="text"
              value={userCount}
              readOnly
              className="border border-[#90CAF9] rounded px-2 py-[2px] w-20 text-center bg-white text-sm"
            />
          </div>
        </div>

        {/* ===== Graph Switch Buttons ===== */}
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setGraphType("referral")}
            className={`px-4 py-2 rounded-l-lg text-sm font-semibold transition-all duration-300 ${
              graphType === "referral"
                ? "bg-[#3F51B5] text-white"
                : "bg-[#E3F2FD] text-[#0D47A1]"
            }`}
          >
            Referral Strategy
          </button>
          <button
            onClick={() => setGraphType("register")}
            className={`px-4 py-2 rounded-r-lg text-sm font-semibold transition-all duration-300 ${
              graphType === "register"
                ? "bg-[#3F51B5] text-white"
                : "bg-[#E3F2FD] text-[#0D47A1]"
            }`}
          >
            Best Register Strategy
          </button>
        </div>

        {/* ===== Graph Section ===== */}
        <div className="bg-[#E3F2FD] p-4 rounded-md mb-6 border border-[#90CAF9] shadow-md transition-all duration-500">
          <h3 className="font-bold text-[#0D47A1] mb-4 text-lg">
            {graphType === "referral"
              ? "Referral User Statistics"
              : "User Registration Trend"}
          </h3>

          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-600">
              Fetching graph...
            </div>
          ) : graphType === "referral" ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={graphData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="referral" tick={{ fill: "#0D47A1" }} />
                <YAxis tick={{ fill: "#0D47A1" }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" barSize={35} radius={[6, 6, 0, 0]}>
                  {graphData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div>
              {/* Filter for daily / weekly / monthly */}
              <div className="flex justify-end mb-3">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border border-[#90CAF9] px-2 py-1 rounded text-sm bg-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fill: "#0D47A1" }} />
                  <YAxis tick={{ fill: "#0D47A1" }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#1E88E5"
                    strokeWidth={3}
                    dot={{ fill: "#3F51B5", r: 5 }}
                    activeDot={{ r: 8 }}
                    isAnimationActive={true}
                    animationDuration={800}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* ===== User Information Section ===== */}
        <div className="bg-[#E3F2FD] p-4 rounded-md border border-[#90CAF9] shadow-md">
          <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-bold text-[#0D47A1] text-lg">
              User's Information :
            </h3>
            
            {/* Search Bar */}
            <div className="relative">
              <svg
                className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 text-sm bg-white border border-[#90CAF9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3F51B5] focus:border-transparent"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-10 text-center text-gray-600">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="py-10 text-center text-gray-600">
              No users found for {referral}.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {users
                .filter(user => 
                  searchQuery === "" ||
                  user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  user.mail?.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((user, index) => (
                <div
                  key={index}
                  className="bg-[#A9D2F6] rounded-md p-4 text-sm text-gray-900 shadow-sm hover:shadow-lg transition"
                >
                  <p><strong>Name:</strong> {user.name || "N/A"}</p>
                  <p><strong>Username:</strong> {user.username || "N/A"}</p>
                  <p><strong>Mail:</strong> {user.mail || "N/A"}</p>
                  <p><strong>User Type:</strong> {user.role || "N/A"}</p>
                  <p><strong>Referral:</strong> {user.referral || "N/A"}</p>
                  <p><strong>No. DOC:</strong> {user.docs ?? "0"}</p>
                  <p><strong>Date of Register:</strong> {user.register_date || "N/A"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}