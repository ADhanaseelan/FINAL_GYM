// Packages
import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";

// Components
import { SearchBox } from "../Shared/Components";

// API
import { api } from "../../services/api";

// Icons
import { BsBoxArrowUp } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";
import {FaPlusSquare} from "react-icons/fa";

type User = {
  user_id: string;
  candidate_name: string;
  phone_number: string;
  date_of_joining: string;
  date_of_birth: string;
  premium_type: string;
  status: string;
};

const UserList: React.FC = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const exportRef = useRef<HTMLDivElement>(null);
  const exportBtnRef = useRef<HTMLButtonElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);

  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownOpen &&
        exportRef.current &&
        !exportRef.current.contains(event.target as Node) &&
        exportBtnRef.current &&
        !exportBtnRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        filterOpen &&
        filterRef.current &&
        !filterRef.current.contains(event.target as Node) &&
        filterBtnRef.current &&
        !filterBtnRef.current.contains(event.target as Node)
      ) {
        setFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen, filterOpen]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/get-user-lists");
        console.log("Fetched users:", response.data);
        const fetchedUsers: User[] = response.data
          .map((u: any) => ({
            user_id: u.user_id,
            candidate_name: u.candidate_name,
            phone_number: u.phone_number,
            date_of_joining: new Date(u.date_of_joining).toLocaleDateString(
              "en-GB"
            ),
            date_of_birth: new Date(u.date_of_birth).toLocaleDateString(
              "en-GB"
            ),
            premium_type: u.premium_type,
            status: u.status.charAt(0).toUpperCase() + u.status.slice(1),
          }))
          .sort((a: any, b: any) => a.user_id.localeCompare(b.user_id));

        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "UserList.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("User List", 14, 10);
    const tableColumn = [
      "User Id",
      "Name",
      "Mobile No",
      "Joining Date",
      "Date of Birth",
      "Durations",
      "Status",
    ];
    const tableRows = users.map((user) => [
      user.user_id,
      user.candidate_name,
      user.phone_number,
      user.date_of_joining,
      user.date_of_birth,
      user.premium_type,
      user.status,
    ]);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("UserList.pdf");
  };

  const handleRowClick = (user: User) => {
    navigate(`/user-overview/${user.user_id}`);
  };

  const handleProgressClick = (user: User) => {
    navigate(`/Addprogress/${user.user_id}`);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.candidate_name?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (user.user_id?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-2/3">
            <div className="w-full sm:w-1/2">
              <SearchBox
                placeholder="Find something here..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative w-full sm:w-1/2">
              <button
                ref={filterBtnRef}
                onClick={() => setFilterOpen((prev) => !prev)}
                className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg shadow text-sm text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-[#05B1B1] transition"
              >
                <span className="flex items-center gap-2">
                  <FiFilter
                    className={`transition-transform duration-300 ${
                      filterOpen ? "rotate-180 text-[#05B1B1]" : "rotate-0"
                    }`}
                  />
                  {statusFilter}
                </span>
                <svg
                  className={`w-4 h-4 ml-2 transform transition-transform duration-300 ${
                    filterOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {filterOpen && (
                <div
                  ref={filterRef}
                  className="absolute top-12 left-0 w-full bg-white border border-gray-200 rounded-lg shadow z-10 animate-fadeIn"
                >
                  {["All", "Active", "Inactive"].map((status) => (
                    <button
                      key={status}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        setStatusFilter(status);
                        setFilterOpen(false);
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                ref={exportBtnRef}
                className="px-4 py-2 border-2 border-[#05B1B1] text-black rounded-lg shadow flex items-center gap-2 min-w-[160px]"
                onClick={() => setDropdownOpen((open) => !open)}
              >
                <BsBoxArrowUp /> Export Table
              </button>
              {dropdownOpen && (
                <div
                  ref={exportRef}
                  className="absolute left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow z-10 w-full min-w-[160px]"
                >
                  <button
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded-t-lg transition-colors"
                    onClick={() => {
                      setDropdownOpen(false);
                      exportToExcel();
                    }}
                  >
                    Export as Excel
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded-b-lg transition-colors"
                    onClick={() => {
                      setDropdownOpen(false);
                      exportToPDF();
                    }}
                  >
                    Export as PDF
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate("/new-member")}
              className="px-4 py-2 bg-[#00E0C6] text-black rounded-lg shadow transition"
            >
              New <span className="hidden xl:inline">Member</span>
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-black text-white">
              <tr>
                {[
                  "User Id",
                  "Name",
                  "Mobile No",
                  "Joining Date",
                  "Date of Birth",
                  "Duration",
                  "Status",
                  "Progress",
                ].map((header, idx) => (
                  <th
                    key={header}
                    className={`px-6 py-4 text-left font-semibold text-[16px] leading-[22px] tracking-[0%] whitespace-nowrap ${
                      idx === 0
                        ? "rounded-tl-lg"
                        : idx === 7
                        ? "rounded-tr-lg"
                        : ""
                    }`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr
                  key={user.user_id}
                  className="hover:bg-gray-50 cursor-pointer transition font-semibold text-[14px] leading-[22px] tracking-[0%]"
                >
                  <td className="px-6 py-4" onClick={() => handleRowClick(user)}>{user.user_id}</td>
                  <td className="px-6 py-4" onClick={() => handleRowClick(user)}>{user.candidate_name}</td>
                  <td className="px-6 py-4" onClick={() => handleRowClick(user)}>{user.phone_number}</td>
                  <td className="px-6 py-4" onClick={() => handleRowClick(user)}>{user.date_of_joining}</td>
                  <td className="px-6 py-4" onClick={() => handleRowClick(user)}>{user.date_of_birth}</td>
                  <td className="px-6 py-4" onClick={() => handleRowClick(user)}>{user.premium_type + " Months"}</td>
                  <td className="px-6 py-4" onClick={() => handleRowClick(user)}>
                    <span className={`px-2 py-1 font-semibold text-[14px] leading-[22px] tracking-[0%] ${user.status === "Active" ? "text-green-700" : "text-red-700"}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className=" w-20 h-6 flex items-center justify-center "
                      onClick={() => handleProgressClick(user)}
                    >
                      <FaPlusSquare  className="text-2xl"/>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No matching records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-[#05B1B1] text-white rounded-full shadow-lg hover:bg-[#03a1a1] transition"
        >
          ↑
        </button>
      )}
    </>
  );
};

export default UserList;
