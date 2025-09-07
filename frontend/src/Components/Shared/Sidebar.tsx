// Packages
import { useRef, useEffect } from "react";

// Icons
import { MdOutlineLogout, MdFitnessCenter } from "react-icons/md";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { GiNetworkBars } from "react-icons/gi";
import { FiUsers, FiHome } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";

// Authenticate
import { useAuthStore } from "../../store/authStore";

// Interface
interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Function
const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const logout = useAuthStore((state) => state.logout);

  const isMemberListActive =
    location.pathname.startsWith("/member-list") ||
    location.pathname.startsWith("/user-overview");

  const linkClass = ({ isActive }: { isActive: boolean }, isLogout = false) =>
    `flex items-center gap-3 px-4 py-3 text-[16px] font-medium transition-colors
    ${
      isLogout
        ? "text-red-500 hover:bg-gray-800"
        : isActive
        ? "bg-teal-400 text-black"
        : "text-white hover:bg-gray-800"
    }`;

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  // Logout on click
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      navigate("/login");
      if (window.innerWidth < 768) setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        window.innerWidth < 768
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  return (
    <aside
      ref={sidebarRef}
      className={`bg-black h-screen fixed top-0 left-0 z-40 flex flex-col pt-6 transition-all duration-300 overflow-hidden
        ${isOpen ? "w-60" : "w-0"}
      `}
    >
      {/* User Profile */}
      <div className="flex items-center justify-center gap-3 px-4 mb-8">
        <div className="w-10 h-10 bg-white rounded-lg" />
        {isOpen && (
          <div>
            <p className="text-white font-semibold text-lg">STAR</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        <NavLink
          to="/dashboard"
          className={linkClass}
          onClick={handleLinkClick}
        >
          <FiHome className="w-5 h-5" /> {isOpen && "Dashboard"}
        </NavLink>

        <NavLink
          to="/new-member"
          className={linkClass}
          onClick={handleLinkClick}
        >
          <FaPlus className="w-5 h-5" /> {isOpen && "New Member"}
        </NavLink>

        <NavLink
          to="/member-list"
          className={({ isActive }) =>
            linkClass({ isActive: isActive || isMemberListActive })
          }
          onClick={handleLinkClick}
        >
          <FiUsers className="w-5 h-5" /> {isOpen && "Member List"}
        </NavLink>

        <NavLink
          to="/Addprogress"
          className={linkClass}
          onClick={handleLinkClick}
        >
          <MdFitnessCenter className="w-5 h-5" /> {isOpen && "Add Progress"}
        </NavLink>

        <NavLink to="/report" className={linkClass} onClick={handleLinkClick}>
          <GiNetworkBars className="w-5 h-5" /> {isOpen && "Report"}
        </NavLink>

        {/* Logout now calls handleLogout */}
        <button
          onClick={handleLogout}
          className={linkClass({ isActive: false }, true)}
        >
          <MdOutlineLogout className="w-5 h-5 text-red-500" />
          {isOpen && "Log Out"}
        </button>
      </nav>

      {/* Mobile-only Profile Info */}
      <div className="mt-auto hidden items-center gap-3 max-[500px]:flex p-4">
        <div className="w-[50px] h-[50px] rounded-full bg-white flex justify-center items-center text-black font-bold text-xl">
          A
        </div>
        <div>
          <p className="font-inter font-semibold text-lg">Admin</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
