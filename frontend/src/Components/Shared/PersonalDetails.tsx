import React, { useState } from "react";

interface User {
  phone_number: string;
  blood_group: string;
  address: string;
  height: string;
  weight: string;
  gender: string;
  instructor: string;
  candidate_type: string;
  goal: string;
}

const PersonalDetails: React.FC<{ user: User }> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    mobile: user.phone_number || "",
    blood: user.blood_group || "",
    height: user.height || "",
    weight: user.weight || "",
    gender: user.gender || "",
    instructor: user.instructor || "",
    candidateType: user.candidate_type || "",
    goal: user.goal || "",
    address: user.address || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white shadow rounded-lg border border-[#E6E6E6] p-4 mt-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold">Personal Details</h4>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-sm text-black-600 bg-gray-300 pt-[10px] pb-[10px] px-[14px] rounded-lg hover:underline"
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { label: "Phone Number", name: "mobile", value: formData.mobile },
          { label: "Blood Group", name: "blood", value: formData.blood },
          { label: "Height", name: "height", value: formData.height },
          { label: "Weight", name: "weight", value: formData.weight },
          { label: "Gender", name: "gender", value: formData.gender },
          {
            label: "Trainer Type",
            name: "instructor",
            value: formData.instructor,
          },
          {
            label: "Candidate Type",
            name: "candidateType",
            value: formData.candidateType,
          },
          { label: "Goal", name: "goal", value: formData.goal },
        ].map((item, idx) => (
          <div key={idx}>
            <label className="block text-sm font-medium mb-2">
              {item.label}
            </label>
            {isEditing ? (
              <input
                type="text"
                name={item.name}
                value={item.value}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            ) : (
              <div className="border border-gray-200 rounded-lg p-3">
                <p className="text-gray-700">{item.value || "N/A"}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3">
        <label className="block text-sm font-medium mb-2">Address</label>
        {isEditing ? (
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        ) : (
          <div className="border border-gray-200 rounded-lg p-3">
            <p className="text-gray-700">{formData.address || "N/A"}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalDetails;
