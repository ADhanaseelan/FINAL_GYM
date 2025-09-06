import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { MdMenu, MdClose } from "react-icons/md";

const Layout: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ✅ Update on resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(true); // always open on desktop
      } else {
        setIsSidebarOpen(false); // closed by default on mobile
      }
    };

    handleResize(); // run once at mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white transition-all duration-300 
        ${isMobile 
          ? `fixed top-0 left-0 h-full z-50 ${isSidebarOpen ? "w-60" : "w-0"}`
          : "w-60 static h-auto"
        }`}
      >
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>

      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 w-full overflow-auto bg-white">
        {/* Header */}
  <div className="flex items-center justify-between border-b mt-0 mb-0">
          {/* Toggle only visible on mobile */}
          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-800"
            >
              {isSidebarOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
            </button>
          )}
          <div className="flex-1">
            <Header />
          </div>
        </div>

        {/* Page content */}
  <div className="pt-2 px-4 pb-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
