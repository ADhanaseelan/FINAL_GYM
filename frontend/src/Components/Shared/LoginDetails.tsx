import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface User {
  username: string;
  password: string;
}

const LoginDetails: React.FC<{ user: User }> = ({ user }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<User>({
    username: user.username,
    password: user.password,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEdit = () => {
    if (isEditing) {
      // Save logic can go here (e.g., API call)
      console.log("Saved data:", formData);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="bg-white shadow rounded-lg border border-[#E6E6E6] p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold">Login Details</h4>
        <button
          onClick={toggleEdit}
          className="text-sm text-black-600 bg-gray-300 pt-[10px] pb-[10px] px-[14px] rounded-lg hover:underline"
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>

      <div>
        {/* Username */}
        <div className="mb-4">
          <label className="block mb-2">User Name</label>
          {isEditing ? (
            <input
              type="text"
              name="username"
              className="border border-gray-300 rounded-md p-3  w-full"
              value={formData.username}
              onChange={handleChange}
            />
          ) : (
            <div className="border border-gray-200 rounded-lg p-3  w-full ">
              <p className="text-gray-600">{formData.username || "user1"}</p>
            </div>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block mb-2">Password</label>
          <div className="relative">
            {isEditing ? (
              <input
                type={!showPassword ? "password" : "text"}
                name="password"
                className="border border-gray-300 rounded-md p-3 w-full pr-10"
                value={formData.password}
                onChange={handleChange}
              />
            ) : (
              <div className="border border-gray-200 rounded-lg p-3 pr-10">
                <p className="text-gray-600">
                  {showPassword ? formData.password : "••••••••"}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginDetails;
