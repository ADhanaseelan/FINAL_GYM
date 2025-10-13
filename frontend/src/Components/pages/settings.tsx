import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PositiveButton } from "../Shared/Components";
import { api } from "../../services/api";

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(false);

  // separate edit modes for each section
  const [isEditableGym, setIsEditableGym] = useState(false);
  const [isEditableCardio, setIsEditableCardio] = useState(false);

  // Gym prices
  const [gymPrices, setGymPrices] = useState({
    personal: { month1: 6000, month3: 18000, month6: 30000, year1: 50000 },
    general: { month1: 6000, month3: 18000, month6: 30000, year1: 50000 },
  });

  // Cardio prices
  const [cardioPrices, setCardioPrices] = useState({
    personal: { month1: 0, month3: 0, month6: 0, year1: 0 },
    general: { month1: 0, month3: 0, month6: 0, year1: 0 },
  });

  // handle input changes dynamically
  const handleChange = (
    plan: "gym" | "cardio",
    type: "personal" | "general",
    field: keyof typeof gymPrices.personal,
    value: string
  ) => {
    const parsedValue = Number(value.replace(/[^0-9]/g, "")) || 0;
    if (plan === "gym") {
      setGymPrices((prev) => ({
        ...prev,
        [type]: { ...prev[type], [field]: parsedValue },
      }));
    } else {
      setCardioPrices((prev) => ({
        ...prev,
        [type]: { ...prev[type], [field]: parsedValue },
      }));
    }
  };

  // toggle Gym save/edit
  const handleGymToggle = async () => {
    if (!isEditableGym) {
      setIsEditableGym(true);
    } else {
      setLoading(true);
      try {
        await api.post("/settings/gym", gymPrices);
        toast.success("Gym settings saved successfully", { autoClose: 1500 });
        setIsEditableGym(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to save Gym settings");
      } finally {
        setLoading(false);
      }
    }
  };

  // toggle Cardio save/edit
  const handleCardioToggle = async () => {
    if (!isEditableCardio) {
      setIsEditableCardio(true);
    } else {
      setLoading(true);
      try {
        await api.post("/settings/cardio", cardioPrices);
        toast.success("Cardio settings saved successfully", { autoClose: 1500 });
        setIsEditableCardio(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to save Cardio settings");
      } finally {
        setLoading(false);
      }
    }
  };

  // helper to format label
  const formatLabel = (key: string) =>
    key === "month1"
      ? "1 Month"
      : key === "month3"
      ? "3 Months"
      : key === "month6"
      ? "6 Months"
      : "1 Year";

  return (
    <div className="w-full min-h-screen bg-white p-8">
      <ToastContainer />
      <h1 className="text-lg font-semibold mb-6">Membership Plans</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* === Gym Card === */}
        <div className="border rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Gym</h2>
            <PositiveButton
              label={isEditableGym ? "Save" : "Edit"}
              disabled={loading}
              onClick={handleGymToggle}
            />
          </div>

          {/* Personal Instructor */}
          <p className="font-semibold text-gray-700 mb-2">Personal Instructor</p>
          <div className="space-y-2 text-gray-600">
            {Object.entries(gymPrices.personal).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span>{formatLabel(key)}</span>
                {isEditableGym ? (
                  <input
                    type="text"
                    value={`₹${value}`}
                    onChange={(e) =>
                      handleChange("gym", "personal", key as any, e.target.value)
                    }
                    className="border rounded px-2 py-1 text-right w-28"
                  />
                ) : (
                  <span>₹{value.toLocaleString()}</span>
                )}
              </div>
            ))}
          </div>

          {/* General Instructor */}
          <p className="font-semibold text-gray-700 mt-4 mb-2">
            General Instructor
          </p>
          <div className="space-y-2 text-gray-600">
            {Object.entries(gymPrices.general).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span>{formatLabel(key)}</span>
                {isEditableGym ? (
                  <input
                    type="text"
                    value={`₹${value}`}
                    onChange={(e) =>
                      handleChange("gym", "general", key as any, e.target.value)
                    }
                    className="border rounded px-2 py-1 text-right w-28"
                  />
                ) : (
                  <span>₹{value.toLocaleString()}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* === Cardio Card === */}
        <div className="border rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Cardio</h2>
            <PositiveButton
              label={isEditableCardio ? "Save" : "Edit"}
              disabled={loading}
              onClick={handleCardioToggle}
            />
          </div>

          {/* Personal Instructor */}
          <p className="font-semibold text-gray-700 mb-2">Personal Instructor</p>
          <div className="space-y-2 text-gray-600">
            {Object.entries(cardioPrices.personal).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span>{formatLabel(key)}</span>
                {isEditableCardio ? (
                  <input
                    type="text"
                    value={`₹${value}`}
                    onChange={(e) =>
                      handleChange(
                        "cardio",
                        "personal",
                        key as any,
                        e.target.value
                      )
                    }
                    className="border rounded px-2 py-1 text-right w-28"
                  />
                ) : (
                  <span>₹{value.toLocaleString()}</span>
                )}
              </div>
            ))}
          </div>

          {/* General Instructor */}
          <p className="font-semibold text-gray-700 mt-4 mb-2">
            General Instructor
          </p>
          <div className="space-y-2 text-gray-600">
            {Object.entries(cardioPrices.general).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span>{formatLabel(key)}</span>
                {isEditableCardio ? (
                  <input
                    type="text"
                    value={`₹${value}`}
                    onChange={(e) =>
                      handleChange(
                        "cardio",
                        "general",
                        key as any,
                        e.target.value
                      )
                    }
                    className="border rounded px-2 py-1 text-right w-28"
                  />
                ) : (
                  <span>₹{value.toLocaleString()}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;