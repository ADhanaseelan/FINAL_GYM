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
    "/user-overview": "Candidate Information", // dynamic handled
    "/membership-update": "Update Membership", // dynamic handled
    "/membership-details": "Add Membership", // dynamic handled
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

  // Match exact routes first
  let matchedRoute = Object.keys(routeTitles).find(
    (route) => currentPath === route
  );

  // Handle dynamic routes
  if (!matchedRoute) {
    if (currentPath.startsWith("/membership-update")) {
      matchedRoute = "/membership-update";
    } else if (currentPath.startsWith("/membership-details")) {
      matchedRoute = "/membership-details";
    } else if (currentPath.startsWith("/user-overview")) {
      matchedRoute = "/user-overview";
    }
  }

  const pageTitle =
    matchedRoute && routeTitles[matchedRoute]
      ? routeTitles[matchedRoute]
      : "Page";

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
        <div className="w-[50px] h-[50px] rounded-full bg-white flex justify-center items-center text-black font-bold text-xl">
          A
        </div>
        <div>
          <p className="font-inter font-semibold text-lg">Admin</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
