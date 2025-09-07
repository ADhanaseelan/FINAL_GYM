// Packages
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Icons
import { FiUsers } from "react-icons/fi";
import {
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineArrowUpRight,
} from "react-icons/hi2";
import { AiOutlineBarChart } from "react-icons/ai";

// Charts
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";

// Api
import { api } from "../../services/api";

// Interfaces
interface Member {
  userId: string;
  candidateName: string;
  phoneNumber: string;
  joiningDate: string;
  bloodGroup: string;
  premiumType: string;
  endDate: string;
  expireIn: number;
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

interface DashboardGraph {
  month: string;
  total_amount: number;
}

// Function
const DashboardContent: React.FC = () => {
  const [dashboardData, setDashboardData] =
    useState<DashboardAPIResponse | null>(null);
  const [data, setData] = useState<DashboardGraph[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState<boolean>(true);

  const [showGoTop, setShowGoTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowGoTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const currentMonthIndex = new Date().getMonth();

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Dashboard Datas functions
  const fetchDashboardData = async () => {
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;

      const response = await api.post("/get-dashboard", {
        year,
        month,
      });

      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const fetchGraph = async () => {
    try {
      const response = await api.get(`/get-dashboard-graph`);
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (error) {
      console.error("API fetch error:", error);
    }
  };

  const fetchExpiringMembers = async () => {
    try {
      setLoadingMembers(true);
      const response = await api.get("/get-expiry-list");
      if (response.status === 200) {
        setMembers(response.data);
      } else {
        setMembers([]);
      }
    } catch (error) {
      console.error("Error fetching expiry members:", error);
      setMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchGraph();
    fetchExpiringMembers();
  }, []);

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
              padding: "20px 25px",
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-white text-xl">
                  <AiOutlineBarChart />
                </div>
                <p className="font-inter font-semibold text-[16px] leading-[22px] tracking-[0]">
                  Revenue
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl sm:text-3xl md:text-2xl lg:text-1xl xl:text-4xl font-bold">
                  ₹{dashboardData?.revenue.toLocaleString()}
                </h2>
                <div
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
                    !dashboardData?.isProfitRevenue
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{
                    backgroundColor: !dashboardData?.isProfitRevenue
                      ? "#ef4444"
                      : "#22c55e",
                    boxShadow: !dashboardData?.isProfitRevenue
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
            </div>

            <div className="absolute text-[#9CA3AF] font-semibold text-[14px] leading-[22px] tracking-[0] text-center rounded-md shadow-md">
              Month/{monthNames[currentMonthIndex]}
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
              padding: "20px 25px",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="text-white text-xl">
                <FiUsers />
              </div>
              <p className="font-inter font-semibold text-[16px] leading-[22px] tracking-[0]">
                Members
              </p>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1 px-1 py-1 rounded-full text-xs sm:text-sm font-medium">
                <h2 className="text-2xl sm:text-3xl md:text-2xl lg:text-1xl xl:text-4xl font-bold">
                  {dashboardData?.candidate}
                </h2>
              </div>
              <div
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
                  !dashboardData?.isProfitCandidate
                    ? "bg-red-500"
                    : "bg-green-500"
                }`}
                style={{
                  backgroundColor: !dashboardData?.isProfitCandidate
                    ? "#ef4444"
                    : "#22c55e",
                  boxShadow: !dashboardData?.isProfitCandidate
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

        {/* Revenue Chart */}
        <motion.div
          className="bg-black rounded-xl p-6 shadow-md lg:col-span-2 flex flex-col justify-between min-h-[350px]"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="font-bold text-[20px] leading-[28px] tracking-[0] text-white mb-4">
            Revenue Analysis
          </h3>

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
                    scale="point"
                    padding={{ left: 10, right: 10 }}
                    tick={{ fontSize: 12, textAnchor: "middle" }}
                  />
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
                    dataKey="total_amount"
                    stroke="#22c55e"
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                  <ReferenceDot
                    x={data?.[data.length - 1]?.month}
                    y={data?.[data.length - 1]?.total_amount}
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
          <h3 className="font-semibold mb-6 text-[20px] leading-[22px] tracking-[0]">
            Membership Expire Soon
          </h3>
        </div>
        <div className="bg-white overflow-x-auto">
          <div className="min-w-[800px]">
            <table className="w-full table-auto">
              <thead className="bg-black">
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
                {loadingMembers ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-8 text-gray-500 text-sm"
                    >
                      Loading members...
                    </td>
                  </tr>
                ) : members.length > 0 ? (
                  members.map((m, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {m.userId}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {m.candidateName}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {m.phoneNumber}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {formatDate(m.joiningDate)}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {m.bloodGroup}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {m.premiumType} Months
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {m.expireIn} days
                      </td>
                      <td className="py-4 px-6 text-gray-400 hover:text-gray-600 transition-colors">
                        <HiOutlineArrowUpRight />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-8 text-gray-500 text-sm"
                    >
                      No members expiring soon.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showGoTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors z-50"
          title="Go to top"
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default DashboardContent;
