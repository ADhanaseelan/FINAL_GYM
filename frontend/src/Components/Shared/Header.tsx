// Packages
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Icons
import { MdOutlineArrowBackIos } from "react-icons/md";

// Function
const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Page titles mapping
  const routeTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/new-member": "Candidate Management System",
    "/member-list": "User List",
    "/Addprogress": "Add Progress",
    "/report": "Report",
    "/progress": "Progress",
    "/diet-chart": "Diet Chart",
    "/logout": "Log Out",
    "/user-overview": "Candidate Information",
    "/membership-details": "Membership Details",
  };

  // Sidebar main routes
  const sidebarMainRoutes = [
    "/dashboard",
    "/new-member",
    "/member-list",
    "/Addprogress",
    "/report",
  ];

  const currentPath = location.pathname;
  const matchedRoute = Object.keys(routeTitles).find((route) =>
    currentPath.startsWith(route)
  );
  const pageTitle = matchedRoute ? routeTitles[matchedRoute] : "Page";

  const showBackButton = !sidebarMainRoutes.includes(matchedRoute || "");

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="bg-black text-white px-6 py-4 m-[16px] flex items-center justify-between rounded-lg shadow-md max-[768px]:hidden">
      <div className="flex items-center gap-4">
        {/* Back Button */}
        {showBackButton && (
          <div className="w-10 h-10 bg-white flex justify-center items-center rounded-lg">
            <button
              className="text-black font-bold text-2xl"
              onClick={handleBackClick}
            >
              <MdOutlineArrowBackIos />
            </button>
          </div>
        )}

        {/* Page Title */}
        <p className="font-semibold text-[24px] leading-[36px] tracking-[0]">
          {pageTitle}
        </p>
      </div>

      {/* Profile Section */}
      <div className="ml-auto flex items-center gap-3 max-[500px]:hidden">
        {/* First letter "A" in a circle */}
        <div className="w-[50px] h-[50px] rounded-full bg-white flex justify-center items-center text-black font-bold text-xl">
          A
        </div>

        {/* Always show "Admin" */}
        <div>
          <p className="font-inter font-semibold text-lg">Admin</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
