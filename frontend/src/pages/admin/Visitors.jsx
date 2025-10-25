import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  TrendingUp,
  Clock,
  RefreshCcw,
  Search,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Visitors() {
  const [data, setData] = useState({
    total_visitors: 0,
    today_visitors: 0,
    today_time_spent: 0,
    referral_stats: {},
    visitors: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVisitors, setFilteredVisitors] = useState([]);

  // ✅ Fetch Visitors Analytics
  const fetchVisitors = async () => {
    try {
      setError("");
      const res = await axios.get("http://localhost:5000/api/admin/visitors", {
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.status === 200) {
        setData(res.data);
        setFilteredVisitors(res.data.visitors);
      } else {
        setError("Failed to load data.");
      }
    } catch (err) {
      console.error("❌ Error fetching visitors:", err);
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ✅ Fetch on mount + auto-refresh every 60 sec
  useEffect(() => {
    fetchVisitors();
    const interval = setInterval(fetchVisitors, 60000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Search by referral ID
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredVisitors(data.visitors);
    } else {
      const filtered = data.visitors.filter((v) =>
        v.referral?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVisitors(filtered);
    }
  }, [searchTerm, data.visitors]);

  // ✅ Line chart data
  const referrals = Object.entries(data.referral_stats || {}).map(
    ([ref, count]) => ({
      referral: ref,
      count,
    })
  );

  const searchedReferralCount =
    searchTerm.trim() && data.referral_stats[searchTerm]
      ? data.referral_stats[searchTerm]
      : 0;

  return (
    <div className="pt-20 sm:ml-56 min-h-screen bg-[#D3EAFD] transition-all">
      <div className="px-6 pb-10">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold text-[#304FFE]">
            👁️ Site Visitors Analytics
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-[#4066E0]"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by Referral ID (e.g. DOC4)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm border border-[#1EC6D7]/40 rounded-lg shadow-sm focus:ring-2 focus:ring-[#4066E0] focus:border-transparent"
              />
            </div>

            <button
              onClick={() => {
                setRefreshing(true);
                fetchVisitors();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#4066E0] text-white rounded-lg shadow hover:opacity-90"
            >
              <RefreshCcw
                size={18}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Search Results Summary */}
        {searchTerm.trim() && (
          <div className="p-4 mb-6 text-gray-700 bg-white shadow rounded-xl">
            <span className="font-semibold text-[#4066E0]">
              {searchTerm.toUpperCase()}
            </span>{" "}
            → {searchedReferralCount}{" "}
            {searchedReferralCount === 1 ? "visitor" : "visitors"} today.
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-3">
          <div className="flex items-center gap-3 p-4 bg-white shadow rounded-xl">
            <Users className="text-[#1EC6D7]" size={32} />
            <div>
              <p className="text-sm text-gray-500">Total Visitors</p>
              <h2 className="text-xl font-bold">{data.total_visitors}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white shadow rounded-xl">
            <TrendingUp className="text-[#4066E0]" size={32} />
            <div>
              <p className="text-sm text-gray-500">Today's Visitors</p>
              <h2 className="text-xl font-bold">{data.today_visitors}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white shadow rounded-xl">
            <Clock className="text-[#6A3FD7]" size={32} />
            <div>
              <p className="text-sm text-gray-500">Time Spent Today</p>
              <h2 className="text-xl font-bold">
                {data.today_time_spent?.toFixed(2)} mins
              </h2>
            </div>
          </div>
        </div>

        {/* Line Chart Section */}
        <div className="p-6 mb-8 bg-white shadow rounded-xl">
          <h3 className="mb-4 text-lg font-semibold text-gray-700">
            📈 Today's Visitors by Referral (Line Graph)
          </h3>

          {loading ? (
            <div className="py-16 text-center text-gray-500">
              Loading visitor data...
            </div>
          ) : error ? (
            <p className="py-10 text-center text-red-500">{error}</p>
          ) : referrals.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart
                data={referrals}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="referral" tick={{ fill: "#333" }} />
                <YAxis tick={{ fill: "#333" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#00C853"
                  strokeWidth={3}
                  dot={{ r: 5, strokeWidth: 2, fill: "#00C853" }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-10 text-center text-gray-500">
              No visitors today yet.
            </p>
          )}
        </div>

        {/* Visitors Table */}
        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="mb-4 text-lg font-semibold text-gray-700">
            👥 Detailed Visitor Information
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead className="bg-[#4066E0]/10">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Referral</th>
                  <th className="px-4 py-2 text-left">Start</th>
                  <th className="px-4 py-2 text-left">End</th>
                  <th className="px-4 py-2 text-right">Duration (min)</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisitors.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-4 text-center text-gray-500">
                      No visitor data available.
                    </td>
                  </tr>
                ) : (
                  filteredVisitors.map((v, i) => (
                    <tr key={v._id || i} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{i + 1}</td>
                      <td className="px-4 py-2">{v.name}</td>
                      <td className="px-4 py-2">{v.email}</td>
                      <td className="px-4 py-2">{v.referral}</td>
                      <td className="px-4 py-2">{v.visit_start}</td>
                      <td className="px-4 py-2">{v.visit_end}</td>
                      <td className="px-4 py-2 text-right">
                        {v.duration_minutes}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
