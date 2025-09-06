import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdOutlineArrowBackIos } from "react-icons/md";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Map routes to sidebar display names
  const routeTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/new-member": "Candidate Management System",
    "/member-list": "User List",
    "/progress": "Progress",
    "/diet-chart": "Diet Chart",
    "/logout": "Log Out",
    "/user-overview":"Candidate Information",

    "/membership-details": "Membership Details"

  };

  // Pick the matching title for the current route
  const pageTitle = routeTitles[location.pathname];

  const handleBackClick = () => {
    navigate(-1); // Go back
  };

  return (
    <div className="bg-black text-white px-6 py-4 m-[16px] flex justify-between items-center rounded-lg shadow-md max-[768px]:hidden">
      {/* Back Button */}
      <div className="w-10 h-10 bg-white flex justify-center items-center rounded-lg">
        <button
          className="text-black font-bold text-2xl"
          onClick={handleBackClick}
        >
          <MdOutlineArrowBackIos />
        </button>
      </div>

      {/* Center Title */}

      <div className="pl-5 block max-[500px]:hidden">
        <p className="font-inter font-semibold text-lg">{pageTitle}</p>
      </div>

      {/* Profile Info (Right) */}
      <div className="ml-auto flex items-center gap-3   max-[500px]:hidden">
        <div className="w-[50px] h-[50px] rounded-full bg-white" />
        <div>
          <p className="font-inter font-semibold text-lg">Admin</p>
          <p className="font-inter text-sm">User Name</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
