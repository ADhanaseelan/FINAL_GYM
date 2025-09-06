import React, { useEffect, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FiUsers } from "react-icons/fi";
import {
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineArrowUpRight,
} from "react-icons/hi2";

import { useNavigate } from "react-router-dom";
import { AiOutlineBarChart } from "react-icons/ai";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import { motion } from "framer-motion";
import { api } from "../../services/api";

interface Member {
  id: string;
  name: string;
  mobile: string;
  joiningDate: string;
  blood: string;
  premium: string;
  expireIn: string;
  month: string;
}

interface DashboardAPIResponse {
  revenue: number;
  candidate: number;
  profitRevenue: number;
  profitCandidate: number;
  isProfitRevenue: boolean;
  isProfitCandidate: boolean;
  revenueData: { month: string; revenue: number; change: number }[];
  members: Member[];
}

const DashboardContent: React.FC = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] =
    useState<DashboardAPIResponse | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.post("/get-dashboard", {
          year: 2025,
          month: 9,
        });
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  // Revenue data
  const data = [
    { month: "Jan", revenue: 80000, change: 3 },
    { month: "Feb", revenue: 75000, change: -1 },
    { month: "Mar", revenue: 90000, change: 7 },
    { month: "Apr", revenue: 85000, change: -4 },
    { month: "May", revenue: 30000, change: -5 },
    { month: "Jun", revenue: 50000, change: 2 },
    { month: "Jul", revenue: 40000, change: -3 },
    { month: "Aug", revenue: 60000, change: 4 },
    { month: "Sep", revenue: 70000, change: 2 },
    { month: "Oct", revenue: 65000, change: -1 },
    { month: "Nov", revenue: 72000, change: 3 },
    { month: "Dec", revenue: 95000, change: 5 },
  ];

  // Member Data
  const members: Member[] = [
    {
      id: "#001",
      name: "John Doe",
      mobile: "+91 805658875",
      joiningDate: "16/12/2025",
      blood: "O+ve",
      premium: "Golden Member",
      expireIn: "2 Days",
      month: "Dec",
    },
    {
      id: "#002",
      name: "Harry",
      mobile: "+91 805658876",
      joiningDate: "16/11/2025",
      blood: "O+ve",
      premium: "Silver Member",
      expireIn: "3 Days",
      month: "Nov",
    },
    {
      id: "#003",
      name: "Willam",
      mobile: "+91 805658877",
      joiningDate: "16/10/2025",
      blood: "O+ve",
      premium: "Diamond Member",
      expireIn: "3 Days",
      month: "Oct",
    },
    {
      id: "#004",
      name: "Paul",
      mobile: "+91 805658878",
      joiningDate: "16/01/2025",
      blood: "O+ve",
      premium: "Platinum Member",
      expireIn: "3 Days",
      month: "Jan",
    },
    {
      id: "#005",
      name: "Potter",
      mobile: "+91 805658879",
      joiningDate: "16/02/2025",
      blood: "O+ve",
      premium: "Golden Member",
      expireIn: "3 Days",
      month: "Feb",
    },
    {
      id: "#006",
      name: "Smith",
      mobile: "+91 805658871",
      joiningDate: "16/03/2025",
      blood: "O+ve",
      premium: "Golden Member",
      expireIn: "3 Days",
      month: "Mar",
    },
    {
      id: "#007",
      name: "Jack",
      mobile: "+91 805658872",
      joiningDate: "16/04/2025",
      blood: "O+ve",
      premium: "Golden Member",
      expireIn: "3 Days",
      month: "Apr",
    },
    {
      id: "#008",
      name: "Pedric",
      mobile: "+91 805658873",
      joiningDate: "16/05/2025",
      blood: "O+ve",
      premium: "Golden Member",
      expireIn: "3 Days",
      month: "May",
    },
    {
      id: "#009",
      name: "Joe",
      mobile: "+91 805658874",
      joiningDate: "16/06/2025",
      blood: "O+ve",
      premium: "Golden Member",
      expireIn: "3 Days",
      month: "Jun",
    },
  ];

  // Sliding window for 6 months
  const windowSize = 6;
  const [windowStart, setWindowStart] = useState(0); // index of first visible month
  const [activeIndex, setActiveIndex] = useState(5); // Default June (index in data)
  const current = data[activeIndex];

  // Move window and activeIndex when navigating
  const handleNext = () => {
    // If at end of window, shift window right
    if (
      activeIndex === windowStart + windowSize - 1 &&
      windowStart + windowSize < data.length
    ) {
      setWindowStart(windowStart + 1);
      setActiveIndex(activeIndex + 1);
    } else if (activeIndex < data.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    // If at start of window, shift window left
    if (activeIndex === windowStart && windowStart > 0) {
      setWindowStart(windowStart - 1);
      setActiveIndex(activeIndex - 1);
    } else if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  // Only show 6 months in the chart window
  const chartData = data.slice(windowStart, windowStart + windowSize);

  // Filter members by current.month
  const filteredMembers = members.filter((m) => m.month === current.month);

  return (
    <div className="bg-white min-h-screen max-md:p-0">
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Card */}
        <motion.div
          className="flex flex-col gap-4 lg:col-span-1"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            className="bg-black rounded-xl shadow-md text-white relative w-full max-w-sm mx-auto sm:max-w-none"
            style={{
              width: "100%",
              height: "170px",
              gap: "10px",
              borderRadius: "10px",
              borderWidth: "1px",
              paddingTop: "20px",
              paddingRight: "25px",
              paddingBottom: "20px",
              paddingLeft: "25px",
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-white text-xl">
                  <AiOutlineBarChart />
                </div>
                <p className="text-lg font-medium">Revenue</p>
              </div>
              <button
                onClick={handlePrev}
                className="text-white text-lg hover:text-gray-300 transition"
              >
                <IoIosArrowUp />
              </button>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl sm:text-3xl md:text-2xl lg:text-1xl xl:text-4xl font-bold">
                  ₹{dashboardData?.revenue.toLocaleString()}
                </h2>
                <div
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
                    current.change < 0 ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{
                    backgroundColor: current.change < 0 ? "#ef4444" : "#22c55e",
                    boxShadow:
                      current.change < 0
                        ? "0 0 20px rgba(239, 68, 68, 0.4)"
                        : "0 0 20px rgba(34, 197, 94, 0.4)",
                    color: "white",
                  }}
                >
                  {!dashboardData?.isProfitRevenue ? (
                    <HiOutlineArrowTrendingDown />
                  ) : (
                    <HiOutlineArrowTrendingUp />
                  )}
                  {dashboardData?.profitRevenue}%
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-semibold">{current.month}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Month/Jul</span>
              <button
                onClick={handleNext}
                className="text-white text-lg hover:text-gray-300 transition"
              >
                <IoIosArrowDown />
              </button>
            </div>
          </div>

          {/* Members Card */}
          <div
            className="bg-black rounded-xl shadow-md text-white relative w-full max-w-sm mx-auto sm:max-w-none"
            style={{
              width: "100%",
              height: "170px",
              gap: "10px",
              borderRadius: "10px",
              borderWidth: "1px",
              paddingTop: "20px",
              paddingRight: "25px",
              paddingBottom: "20px",
              paddingLeft: "25px",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="text-white text-xl">
                <FiUsers />
              </div>
              <p className="text-lg font-medium">Members</p>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1 px-1 py-1 rounded-full text-xs sm:text-sm font-medium">
                <h2 className="text-2xl sm:text-3xl md:text-2xl lg:text-1xl xl:text-4xl font-bold">
                  {dashboardData?.candidate}
                </h2>
              </div>
              <div
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
                  current.change < 0 ? "bg-red-500" : "bg-green-500"
                }`}
                style={{
                  backgroundColor: current.change < 0 ? "#ef4444" : "#22c55e",
                  boxShadow:
                    current.change < 0
                      ? "0 0 20px rgba(239, 68, 68, 0.4)"
                      : "0 0 20px rgba(34, 197, 94, 0.4)",
                  color: "white",
                }}
              >
                {!dashboardData?.isProfitCandidate ? (
                  <HiOutlineArrowTrendingDown />
                ) : (
                  <HiOutlineArrowTrendingUp />
                )}
                {dashboardData?.profitCandidate}%
              </div>
            </div>
          </div>
        </motion.div>

        {/* Revenue Chart - Full Year */}
        <motion.div
          className="bg-black rounded-xl p-6 shadow-md lg:col-span-2 flex flex-col justify-between min-h-[350px]"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-white text-xl font-extrabold mb-4">
            Revenue Analysis
          </h3>

          {/* ✅ Scrollable wrapper for mobile */}
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={data}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    stroke="#ccc"
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    tick={{ fontSize: 12, textAnchor: "end" }}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111",
                      border: "none",
                      color: "#fff",
                    }}
                    cursor={{ stroke: "#22c55e", strokeWidth: 2 }}
                  />
                  <Area
                    type="linear"
                    dataKey="revenue"
                    stroke="#22c55e"
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                  <ReferenceDot
                    x={current.month}
                    y={current.revenue}
                    r={6}
                    fill="#22c55e"
                    stroke="#fff"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Membership Table */}
      <div className="bg-white overflow-hidden">
        <div className="px-0 py-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
            Membership Expire Soon
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-black" style={{ borderRadius: "10px" }}>
              <tr>
                {[
                  "User Id",
                  "Name",
                  "Mobile No",
                  "Joining Date",
                  "Blood Group",
                  "Premium Type",
                  "Expire In",
                ].map((head, i) => (
                  <th
                    key={i}
                    className={`py-4 px-6 text-left text-sm font-medium text-white ${
                      i === 0 ? "rounded-l-[10px]" : ""
                    }`}
                  >
                    {head}
                  </th>
                ))}
                <th className="py-4 px-6 text-left text-sm font-medium text-white w-16 rounded-r-[10px]"></th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((m, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6 text-sm text-gray-900">{m.id}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {m.name}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {m.mobile}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {m.joiningDate}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {m.blood}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {m.premium}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {m.expireIn}
                    </td>
                    <td className="py-4 px-6 text-gray-400 hover:text-gray-600 transition-colors">
                      <span className="">
                        <HiOutlineArrowUpRight />
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-8 text-gray-500 text-sm"
                  >
                    No members found for {current.month}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
