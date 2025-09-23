// Packages
import React, { useState, useEffect, useMemo, useRef } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Icons
import { FiDownload } from "react-icons/fi";

// Api
import { api } from "../../services/api";
import { useParams } from "react-router-dom";

type ProgressData = {
  date: string;
  weight: number;
  fat: number;
  vfat: number;
  bmr: number;
  bmi: number;
  bodyAge: number;
};

const ProgressTracker: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [animatedMetrics, setAnimatedMetrics] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [data, setData] = useState<ProgressData[]>([]);
  const prevMetricsRef = useRef<any[]>([]);
  const userId = id;

  const fetchProgressData = async () => {
    try {
      const response = await api.get(`progress/${userId}`);
      if (response.status === 200 && response.data?.data?.length) {
        const sortedData = response.data.data
          .map((item: any) => ({
            date: item.entry_date,
            weight: item.weight_kg,
            fat: item.fat,
            vfat: item.v_fat,
            bmr: item.bmr,
            bmi: item.bmi,
            bodyAge: item.b_age,
          }))
          .sort(
            (a: any, b: any) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        setData(sortedData);
        if (sortedData.length >= 2) {
          setFromDate(sortedData[1].date);
          setToDate(sortedData[0].date);
          setSelectedRows([sortedData[1].date, sortedData[0].date]);
        }
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("API fetch error:", error);
    }
  };

  useEffect(() => {
    fetchProgressData();
  }, [userId]);

  useEffect(() => {
    if (selectedRows.length === 2) {
      setFromDate(selectedRows[0]);
      setToDate(selectedRows[1]);
    }
  }, [selectedRows]);

  const selectedData = [fromDate, toDate]
    .map((date) => data.find((d) => d.date === date))
    .filter(Boolean) as ProgressData[];

  const defaultMetrics = [
    { label: "Weight", start: 0, end: 0, change: "0", status: "neutral" },
    { label: "Fat", start: 0, end: 0, change: "0", status: "neutral" },
    { label: "Visceral Fat", start: 0, end: 0, change: "0", status: "neutral" },
    { label: "BMR", start: 0, end: 0, change: "0", status: "neutral" },
    { label: "BMI", start: 0, end: 0, change: "0", status: "neutral" },
    { label: "Body Age", start: 0, end: 0, change: "0", status: "neutral" },
  ];

  // ✅ Formatter for floats
const formatNumber = (value: any) => {
  const num = Number(value);   // convert to number

  if (isNaN(num)) return value; // fallback if it's not a number at all

  return Number.isInteger(num) ? num : num.toFixed(2);
};


  const metrics = useMemo(() => {
    if (selectedData.length !== 2) return defaultMetrics;
    const [start, end] = [...selectedData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const getStatus = (label: string, diff: number) => {
      if (diff === 0) return "maintain-blue"; // NEW maintain case
      if (["Fat", "Visceral Fat", "Body Age"].includes(label)) {
        return diff < 0 ? "loss-green" : "gain-red";
      }
      if (["BMI", "BMR", "Weight"].includes(label)) {
        return diff >= 0 ? "gain-green" : "loss-red";
      }
      return "neutral";
    };

    return [
      {
        label: "Weight",
        start: start.weight,
        end: end.weight,
        change: `${(end.weight - start.weight).toFixed(2)}Kg`,
        status: getStatus("Weight", end.weight - start.weight),
      },
      {
        label: "Fat",
        start: start.fat,
        end: end.fat,
        change: `${(end.fat - start.fat).toFixed(2)}%`,
        status: getStatus("Fat", end.fat - start.fat),
      },
      {
        label: "Visceral Fat",
        start: start.vfat,
        end: end.vfat,
        change: `${(end.vfat - start.vfat).toFixed(2)}`,
        status: getStatus("Visceral Fat", end.vfat - start.vfat),
      },
      {
        label: "BMR",
        start: start.bmr,
        end: end.bmr,
        change: `${(end.bmr - start.bmr).toFixed(2)}`,
        status: getStatus("BMR", end.bmr - start.bmr),
      },
      {
        label: "BMI",
        start: start.bmi,
        end: end.bmi,
        change: `${(end.bmi - start.bmi).toFixed(2)}`,
        status: getStatus("BMI", end.bmi - start.bmi),
      },
      {
        label: "Body Age",
        start: start.bodyAge,
        end: end.bodyAge,
        change: `${(end.bodyAge - start.bodyAge).toFixed(2)}`,
        status: getStatus("Body Age", end.bodyAge - start.bodyAge),
      },
    ];
  }, [selectedData]);

  // Animate metrics
  useEffect(() => {
    const prevMetrics = prevMetricsRef.current.length
      ? prevMetricsRef.current
      : metrics;
    const duration = 300;
    const frameRate = 30;
    const totalFrames = duration / frameRate;
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      setAnimatedMetrics(
        metrics.map((m, i) => ({
          ...m,
          start: Math.round(
            prevMetrics[i].start +
              ((m.start - prevMetrics[i].start) * frame) / totalFrames
          ),
          end: Math.round(
            prevMetrics[i].end +
              ((m.end - prevMetrics[i].end) * frame) / totalFrames
          ),
        }))
      );
      if (frame === totalFrames) clearInterval(interval);
    }, frameRate);
    prevMetricsRef.current = metrics;
    return () => clearInterval(interval);
  }, [metrics]);

  const handleExport = () => {
    if (!data.length) return;

    const worksheetData = data.map((d) => ({
      Date: d.date,
      Weight: d.weight.toFixed(2),
      Fat: d.fat.toFixed(2),
      "V Fat": d.vfat.toFixed(2),
      BMR: d.bmr.toFixed(2),
      BMI: d.bmi.toFixed(2),
      "Body Age": d.bodyAge.toFixed(2),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Progress");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, "progress_data.xlsx");
  };

  const getColorClass = (status: string) => {
    switch (status) {
      case "gain-green":
        return "text-green-600 bg-green-500";
      case "gain-red":
        return "text-red-600 bg-red-500";
      case "loss-green":
        return "text-green-600 bg-green-500";
      case "loss-red":
        return "text-red-600 bg-red-500";
      case "maintain-blue":
        return "text-blue-600 bg-blue-500"; // NEW maintain case
      default:
        return "text-gray-500 bg-gray-300";
    }
  };

  const toggleRow = (date: string) => {
    setSelectedRows((prev) => {
      if (prev.includes(date)) {
        return prev.filter((d) => d !== date);
      } else if (prev.length < 2) {
        return [...prev, date];
      } else {
        return [prev[1], date].sort(
          (a, b) => new Date(a).getTime() - new Date(b).getTime()
        );
      }
    });
  };

  const formatDate = (date: string) => {
    if (!date) return "--/--/----";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getBarWidth = (start: number, end: number) => {
    const max = Math.max(start, end, 1);
    const startPercent = (start / max) * 100;
    const endPercent = (end / max) * 100;
    return { startPercent, endPercent };
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="text-lg font-bold mb-2">Progress Tracker</h1>
        <p className="text-sm text-gray-500 mb-6">
          * Select Date manually or tick two rows to compare progress
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {animatedMetrics.map((m, idx) => {
            const { startPercent, endPercent } = getBarWidth(m.start, m.end);
            return (
              <div
                key={idx}
                className="bg-white border rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-semibold text-sm text-gray-800">
                  {m.label}{" "}
                  {selectedData.length === 2 ? (
                    m.status === "maintain-blue" ? (
                      <span className="text-blue-600">Maintain</span>
                    ) : (
                      <span className={getColorClass(m.status).split(" ")[0]}>
                        {m.change.startsWith("-") ? "Loss" : "Gain"}:{" "}
                        {m.change.replace("-", "")}
                      </span>
                    )
                  ) : (
                    "Gain/Loss: 0"
                  )}
                </h3>
                <div className="mt-3 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{formatDate(fromDate)}</span>
                      <span className="font-semibold text-gray-900">
                        {formatNumber(m.start)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-2 ${
                          getColorClass(m.status).split(" ")[1]
                        } transition-all duration-500`}
                        style={{
                          width: `${startPercent}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{formatDate(toDate)}</span>
                      <span className="font-semibold text-gray-900">
                        {formatNumber(m.end)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-2 ${
                          getColorClass(m.status).split(" ")[1]
                        } transition-all duration-500`}
                        style={{
                          width: `${endPercent}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <div className="flex gap-4 w-full md:w-auto">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border rounded px-3 py-2 text-sm w-full md:w-auto"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border rounded px-3 py-2 text-sm w-full md:w-auto"
            />
          </div>
          <button
            onClick={handleExport}
            disabled={!data.length}
            className={`flex items-center gap-2 border px-4 py-2 rounded-md ${
              data.length
                ? "bg-white hover:bg-gray-100"
                : "bg-gray-200 cursor-not-allowed"
            }`}
          >
            <FiDownload /> Export Table
          </button>
        </div>
        <div className="overflow-x-auto border rounded-xl">
          {data.length === 0 ? (
            <p className="text-center py-6 text-gray-500">
              No progress data found.
            </p>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-black text-white text-left">
                  <th className="p-3">Select</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Weight (kg)</th>
                  <th className="p-3">Fat (%)</th>
                  <th className="p-3">V Fat</th>
                  <th className="p-3">BMR (kcal/day)</th>
                  <th className="p-3">BMI</th>
                  <th className="p-3">Body Age</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d, idx) => (
                  <tr
                    key={idx}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(d.date)}
                        onChange={() => toggleRow(d.date)}
                      />
                    </td>
                    <td className="p-3">{formatDate(d.date)}</td>
                    <td className="p-3">{formatNumber(d.weight)}Kg</td>
                    <td className="p-3">{formatNumber(d.fat)}%</td>
                    <td className="p-3">{formatNumber(d.vfat)}</td>
                    <td className="p-3">{formatNumber(d.bmr)}</td>
                    <td className="p-3">{formatNumber(d.bmi)}</td>
                    <td className="p-3">{formatNumber(d.bodyAge)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
