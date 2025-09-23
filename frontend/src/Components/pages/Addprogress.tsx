import React, { useState } from "react";
import { api } from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";

interface ProgressData {
  weight: number | "";
  fat: number | "";
  vFat: number | "";
  bmr: number | "";
  bmi: number | "";
  bAge: number | "";
}

const ProgressForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [date, setDate] = useState("");
  const [progressData, setProgressData] = useState<ProgressData>({
    weight: "",
    fat: "",
    vFat: "",
    bmr: "",
    bmi: "",
    bAge: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let sanitized = value.replace(/[^0-9.]/g, "");

    if (["weight", "fat", "vFat", "bmr", "bmi"].includes(name)) {
      const [intPart, decPart] = sanitized.split(".");
      sanitized = decPart ? `${intPart}.${decPart.slice(0, 2)}` : intPart;
    }

    const val: number | "" = sanitized === "" ? "" : Number(sanitized);
    setProgressData({ ...progressData, [name]: val });
    setErrors({ ...errors, [name]: "" });
  };

  const handleReset = () => {
    setDate("");
    setProgressData({
      weight: "",
      fat: "",
      vFat: "",
      bmr: "",
      bmi: "",
      bAge: "",
    });
    setErrors({});
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!id) newErrors.selectedUserId = "User ID is missing from URL.";
    if (!date) newErrors.date = "Date is required.";

    Object.entries(progressData).forEach(([key, value]) => {
      if (value === "") newErrors[key] = `${key} is required.`;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const payload = {
        userId: id,
        date: date,
        weight: Number(progressData.weight),
        fat: Number(progressData.fat),
        vFat: Number(progressData.vFat),
        bmr: Number(progressData.bmr),
        bmi: Number(progressData.bmi),
        bAge: Number(progressData.bAge),
      };

      console.log("Payload:", payload);
      saveProgress(payload);
    }
  };

  const saveProgress = async (data: {
    userId: string;
    date: string;
    weight: number;
    fat: number;
    vFat: number;
    bmr: number;
    bmi: number;
    bAge: number;
  }) => {
    try {
      const response = await api.post("/register-progress", data);
      toast.success("Progress saved successfully!");
      console.log(response.data);
      handleReset();
    } catch (err) {
      console.error("Failed to save progress:", err);
      toast.error("Failed to save progress.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Progress Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* User ID display */}
          <div>
            <label className="block mb-1 font-medium">User ID</label>
            <input
              type="text"
              value={id}
              readOnly
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block mb-1 font-medium">Date *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setErrors({ ...errors, date: "" });
              }}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                errors.date ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>
        </div>
      </div>

      {/* Progress Inputs */}
      <div className="border border-gray-300 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Progress Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Weight (kg) *", name: "weight", maxLength: 6 },
            { label: "Fat *", name: "fat", maxLength: 6 },
            { label: "V Fat *", name: "vFat", maxLength: 6 },
            { label: "BMR *", name: "bmr", maxLength: 8 },
            { label: "BMI *", name: "bmi", maxLength: 6 },
            { label: "Body Age *", name: "bAge", maxLength: 3 },
          ].map((item) => (
            <div key={item.name}>
              <label className="block mb-1 font-medium">{item.label}</label>
              <input
                type="number"
                name={item.name}
                value={progressData[item.name as keyof ProgressData]}
                onChange={handleProgressChange}
                maxLength={item.maxLength}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  errors[item.name] ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors[item.name] && (
                <p className="text-red-500 text-sm mt-1">{errors[item.name]}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-4">
          <button
            type="button"
            onClick={handleReset}
            className="border border-teal-500 text-teal-500 px-6 py-2 rounded-md hover:bg-teal-50"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600"
          >
            Save
          </button>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ProgressForm;
