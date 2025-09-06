import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RiCoinsFill } from "react-icons/ri";
import { FiUser } from "react-icons/fi";
import { GiNetworkBars, GiWeightLiftingUp } from "react-icons/gi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import { api } from "../../services/api";

const Report: React.FC = () => {
  const [selectedRevenuePeriod, setSelectedRevenuePeriod] = useState("Month");
  const [selectedMembershipPeriod, setSelectedMembershipPeriod] =
    useState("Month");
  const [revenueGraph, setRevenueGraph] = useState<any[]>([]);
  const [membershipData, setMembershipData] = useState<any[]>([]);
  const [reportData, setReportData] = useState({
    total_revenue: "0",
    monthly_revenue: "0",
    gym_members: "0",
    cardio_members: "0",
  });

  const colorMap: any = {
    "One Year": "#06B6D4",
    "One Month": "#22C55E",
    "Six Months": "#EF4444",
    "Three Months": "#A855F7",
    Others: "#F59E0B",
  };

  const fetchReportData = async () => {
    try {
      const res = await api.get("/get-report");
      if (res.status === 200 && res.data) {
        setReportData(res.data);
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };

  const fetchRevenueGraph = async () => {
    try {
      const endpoint =
        selectedRevenuePeriod === "Month"
          ? "/revenue-month-graph"
          : "/revenue-year-graph";

      const res = await api.get(endpoint);
      if (res.status === 200 && res.data) {
        setRevenueGraph(res.data);
      }
    } catch (error) {
      console.error("Error fetching revenue graph:", error);
    }
  };

  const fetchMembershipData = async () => {
    try {
      const res = await api.get(
        `/get-pie-chart?period=${selectedMembershipPeriod}`
      );
      if (res.status === 200 && res.data) {
        const formatted = res.data.map((item: any) => ({
          ...item,
          color: colorMap[item.name] || "#3B82F6",
        }));
        setMembershipData(formatted);
      }
    } catch (error) {
      console.error("Error fetching membership pie chart:", error);
    }
  };

  useEffect(() => {
    fetchReportData();
    fetchRevenueGraph();
    fetchMembershipData();
  }, []);

  useEffect(() => {
    fetchRevenueGraph();
  }, [selectedRevenuePeriod]);

  useEffect(() => {
    fetchMembershipData();
  }, [selectedMembershipPeriod]);

  const getFilteredRevenueData = () => {
    return revenueGraph;
  };

  const getFilteredMembershipData = () => {
    const total = membershipData.reduce((sum, item) => sum + item.value, 0);
    return membershipData.map((item) => ({
      ...item,
      percentage: total > 0 ? ((item.value / total) * 100).toFixed(0) : 0,
    }));
  };

  const renderLegend = (props: any) => {
    const { payload } = props;

    return (
      <ul className="list-none p-0 m-0 flex flex-wrap gap-4 justify-center mt-4">
        {payload.map((entry: any, index: number) => (
          <li
            key={`item-${index}`}
            className="flex items-center text-sm font-medium"
            style={{ color: entry.color }}
          >
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                backgroundColor: entry.color,
                marginRight: 6,
                borderRadius: "50%",
              }}
            />
            {`${entry.payload.name} (${entry.payload.percentage}%)`}
          </li>
        ))}
      </ul>
    );
  };

  const getPeakRevenueInfo = () => {
    const data = getFilteredRevenueData();
    if (!data.length) return "";
    if (selectedRevenuePeriod === "Month") {
      const maxGym = Math.max(...data.map((d) => d.gym));
      const maxCardio = Math.max(...data.map((d) => d.cardio));
      const peakDay = data.find(
        (d) => d.gym === maxGym || d.cardio === maxCardio
      );
      return `Peak Day: ${peakDay?.day || "-"}`;
    } else {
      const maxGym = Math.max(...data.map((d) => d.gym));
      const maxCardio = Math.max(...data.map((d) => d.cardio));
      const peakMonth = data.find(
        (d) => d.gym === maxGym || d.cardio === maxCardio
      );
      return `Peak Month: ${peakMonth?.month || "-"}`;
    }
  };

  return (
    <div className="space-y-8 bg-gray-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          {
            title: "Total Revenue",
            value: `₹${reportData.total_revenue}`,
            icon: <RiCoinsFill className="text-yellow-500 text-2xl" />,
            bg: "bg-yellow-50",
          },
          {
            title: "Month Revenue",
            value: `₹${reportData.monthly_revenue}`,
            subtitle: `Current Month`,
            icon: <GiNetworkBars className="text-emerald-500 text-2xl" />,
            bg: "bg-emerald-50",
          },
          {
            title: "Gym Members",
            value: reportData.gym_members,
            icon: <FiUser className="text-blue-500 text-2xl" />,
            bg: "bg-blue-50",
          },
          {
            title: "Cardio Members",
            value: reportData.cardio_members,
            icon: <GiWeightLiftingUp className="text-rose-500 text-2xl" />,
            bg: "bg-rose-50",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            className="rounded-xl border border-gray-100 p-6 shadow-sm bg-white hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-gray-500 text-sm font-medium">{card.title}</h2>
            <div className="flex items-center justify-between mt-4">
              <div>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                {card.subtitle && (
                  <span className="text-sm text-gray-400 mt-1 block">
                    {card.subtitle}
                  </span>
                )}
              </div>
              <div
                className={`flex items-center justify-center w-14 h-14 rounded-full ${card.bg}`}
              >
                {card.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-[75%] w-full bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Revenue Analysis
            </h2>
            <div className="flex items-center space-x-6">
              <div className="flex items-center gap-2">
                <div
                  className="h-0.5 w-5"
                  style={{ backgroundColor: "#f97316" }}
                />
                <span className="text-sm font-medium text-gray-600">Gym</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-0.5 w-5 bg-blue-500"></div>
                <span className="text-sm font-medium text-gray-600">
                  Cardio
                </span>
              </div>
              <select
                value={selectedRevenuePeriod}
                onChange={(e) => setSelectedRevenuePeriod(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="Month">Month</option>
                <option value="Year">Year</option>
              </select>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="flex items-center justify-center w-full h-[300px]"
          >
            <ResponsiveContainer width={1000} height="100%">
              <LineChart
                data={getFilteredRevenueData()}
                margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey={selectedRevenuePeriod === "Month" ? "day" : "month"}
                />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="gym"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={1200}
                />
                <Line
                  type="monotone"
                  dataKey="cardio"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={1200}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <div className="flex justify-between text-sm mt-2">
            <span>Top Revenue : Gym</span>
            <span>{getPeakRevenueInfo()}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-[25%] w-full bg-white p-4 rounded-2xl shadow-md"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Top Membership Plan</h2>
            <select
              value={selectedMembershipPeriod}
              onChange={(e) => setSelectedMembershipPeriod(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="Month">Month</option>
              <option value="Year">Year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={getFilteredMembershipData()}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                isAnimationActive={true}
                animationDuration={1000}
              >
                {getFilteredMembershipData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend content={renderLegend} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default Report;
