// Packages
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Icons
import { GrNext } from "react-icons/gr";

// Components
import LoginDetails from "../Shared/LoginDetails";
import PersonalDetails from "../Shared/PersonalDetails";

// API
import { api } from "../../services/api";

// Format date function
const formatDate = (dateStr: string) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const UserOverview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [originalUser, setOriginalUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;

      try {
        const response = await api.post("/get-candidate-info", { userId: id });
        const userData = { ...response.data, password: "********" };
        console.log("Fetched User Data:", response.data);
        setUser(userData);
        setOriginalUser(userData);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUser();
  }, [id]);

  const isEdited = () => {
    if (!originalUser || !user) return false;

    const fieldsToCheck = [
      "candidate_name",
      "phone_number",
      "blood_group",
      "height",
      "weight",
      "gender",
      "instructor",
      "candidate_type",
      "goal",
      "address",
      "dietPlan",
      "workoutPlan",
      "username",
      "password",
      "email",
    ];

    for (let field of fieldsToCheck) {
      if ((user[field] || "") !== (originalUser[field] || "")) {
        return true;
      }
    }

    return false;
  };

  const handleClick = () => {
    navigate(`/membership-update/${id}`);
  };

  const handleSave = async () => {
    try {
      const payload = {
        userId: user.user_id,
        candidate_name: user.candidate_name,
        phone_number: user.phone_number,
        blood_group: user.blood_group,
        height: user.height,
        weight: user.weight,
        gender: user.gender,
        instructor: user.instructor,
        candidate_type: user.candidate_type,
        goal: user.goal,
        address: user.address,
        email: user.email,
        username: user.username,
        password: user.password !== "********" ? user.password : undefined,
        dietPlan: user.dietPlan,
        workoutPlan: user.workoutPlan,
      };

      await api.post("/update-details", payload);

      setOriginalUser({ ...user });
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving user info:", error);
      alert("Failed to save changes.");
    }
  };

  if (!user) return <div>Loading...</div>;

  const latestWeight = user?.lastTwoWeights?.[0]?.weight_kg || null;
  const previousWeight = user?.lastTwoWeights?.[1]?.weight_kg || null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-md:p-0">
      {/* Left Column */}
      <div className="space-y-6">
        {/* User Info Card */}
        <div className="flex items-center justify-between bg-white shadow rounded-lg border border-[#E6E6E6] p-8 max-sm:p-2">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 flex items-center justify-center font-days bg-white text-black border-[3px] border-[#A4A4A4] rounded-full text-xl font-bold">
              {user.candidate_name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </div>

            <div>
              <h3 className="text-xl font-semibold">{user.candidate_name}</h3>
              <p className="text-sm text-gray-700">User id: {user.user_id}</p>
            </div>
          </div>
          {/* <span className="bg-gray-200 text-gray-700 px-3 py-2 rounded-xl text-sm font-medium">
            {user.status
              ? user.status.charAt(0).toUpperCase() + user.status.slice(1)
              : "N/A"}
          </span> */}
        </div>

        {/* Membership Details Card */}
        <div className="bg-white shadow rounded-lg border border-[#E6E6E6] p-7 max-sm:p-2">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-sm max-md:text-[14px]">
              Membership Details
            </h4>
            <button
              className="flex items-center text-blue-500"
              onClick={handleClick}
            >
              View More <GrNext />
            </button>
          </div>
          <div className="space-y-4">
            <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex justify-between">
                <p className="text-sm font-medium">Membership</p>
              </div>
              <h3 className="font-bold text-lg">
                {user.duration || "N/A"} Months
              </h3>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-500">Membership Amount</p>
              <h3 className="font-bold text-lg">
                {user.amount ? `₹${user.amount}` : "N/A"}
              </h3>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-500">Start Date</p>
              <h3 className="font-bold text-lg">
                {formatDate(user.start_date)}
              </h3>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-500">End Date</p>
              <h3 className="font-bold text-lg">{formatDate(user.end_date)}</h3>
            </div>
          </div>
        </div>

        {/* Diet & Workout Plans */}
        <div className="bg-white shadow rounded-lg border border-[#E6E6E6] p-6">
          <div className="mb-4 mt-4">
            <div className="flex items-center justify-between ">
              <h4 className="font-semibold">View Diet Plan</h4>
              <p className="text-sm text-gray-400 mt-4 mb-4 p-3">
                {user.dietPlan || "keto diet"}
              </p>
            </div>
            <div className="flex items-center justify-between ">
              <h4 className="font-semibold">View Workout Plan</h4>
              <p className="text-sm text-gray-400 mt-4 mb-4 ">
                {user.workoutPlan || "strength training"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div>
        {/* Progress Section */}
        <div className="bg-white shadow rounded-lg border flex flex-col gap-3 border-[#E6E6E6] p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-lg">Progress</h4>
            <button
              className="flex items-center text-blue-500"
              onClick={() => navigate("/progress", { state: { user } })}
            >
              View More <GrNext />
            </button>
          </div>
          <div className="mt-3 space-y-2">
            <p className="text-xl">
              Latest Weight:{" "}
              <span>{latestWeight ? `${latestWeight} kg` : "N/A"}</span>
            </p>
            <p className="text-xl">
              Previous Weight:{" "}
              <span>{previousWeight ? `${previousWeight} kg` : "N/A"}</span>
            </p>
          </div>
        </div>

        {/* Personal & Login Details */}
        <PersonalDetails user={user} />
        <LoginDetails user={user} />

        {/* Save Changes Button */}
        {isEdited() && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOverview;
