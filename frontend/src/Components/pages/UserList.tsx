// Packages
import React, { useState, useEffect } from "react";
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

type User = {
  user_id: string;
  candidate_name: string;
  phone_number: string;
  date_of_joining: string;
  blood_group: string;
  premium_type: string;
  status: string;
};

const UserList: React.FC = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All"); // Status filter
  const [filterOpen, setFilterOpen] = useState<boolean>(false); // For animation

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/get-user-lists");

        const fetchedUsers: User[] = response.data
          .map((u: any) => ({
            user_id: u.user_id,
            candidate_name: u.candidate_name,
            phone_number: u.phone_number,
            date_of_joining: new Date(u.date_of_joining).toLocaleDateString(
              "en-GB"
            ),
            blood_group: u.blood_group,
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

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "UserList.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("User List", 14, 10);
    const tableColumn = [
      "User Id",
      "Name",
      "Mobile No",
      "Joining Date",
      "Blood Group",
      "Duration",
      "Status",
    ];
    const tableRows = users.map((user) => [
      user.user_id,
      user.candidate_name,
      user.phone_number,
      user.date_of_joining,
      user.blood_group,
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

  // Row click handler
  const handleRowClick = (user: User) => {
    navigate(`/user-overview/${user.user_id}`);
  };

  // Filter users (by search + status)
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
    <div className="p-6 space-y-6">
      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Search + Status Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-2/3">
          {/* Search box */}
          <div className="w-full sm:w-1/2">
            <SearchBox
              placeholder="Find something here..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
            />
          </div>

          {/* Status filter with icon */}
          <div className="relative flex items-center gap-2">
            <button
              onClick={() => setFilterOpen((prev) => !prev)}
              className="flex items-center gap-7 px-3 py-2 border border-gray-300 rounded-lg shadow text-sm bg-white hover:bg-gray-50 transition"
            >
              <FiFilter
                className={`transition-transform duration-300 ${
                  filterOpen ? "rotate-180 text-[#05B1B1]" : "rotate-0"
                }`}
              />
              {statusFilter}
            </button>

            {filterOpen && (
              <div className="absolute top-12 left-0 w-40 bg-white border border-gray-200 rounded shadow z-10 animate-fadeIn">
                <button
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  onClick={() => {
                    setStatusFilter("All");
                    setFilterOpen(false);
                  }}
                >
                  All
                </button>
                <button
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  onClick={() => {
                    setStatusFilter("Active");
                    setFilterOpen(false);
                  }}
                >
                  Active
                </button>
                <button
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  onClick={() => {
                    setStatusFilter("Inactive");
                    setFilterOpen(false);
                  }}
                >
                  Inactive
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Controls (Export + New Member) */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              ref={buttonRef}
              className="px-4 py-2 border-2 border-[#05B1B1] text-black rounded-lg shadow flex items-center gap-2 min-w-[160px]"
              onClick={() => setDropdownOpen((open) => !open)}
              style={{ minWidth: 160 }}
            >
              <BsBoxArrowUp /> Export Table
            </button>
            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow z-10 w-full min-w-[160px]"
                style={{ minWidth: 160 }}
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
            className="px-4 py-2 bg-[#00E0C6] text-black rounded-lg shadow hover:bg-green-600 transition"
          >
            + New Member
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
                "Blood Group",
                "Duration",
                "Status",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left font-semibold text-white uppercase tracking-wider"
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
                onClick={() => handleRowClick(user)}
                className="hover:bg-gray-50 cursor-pointer transition"
              >
                <td className="px-6 py-4">{user.user_id}</td>
                <td className="px-6 py-4">{user.candidate_name}</td>
                <td className="px-6 py-4">{user.phone_number}</td>
                <td className="px-6 py-4">{user.date_of_joining}</td>
                <td className="px-6 py-4">{user.blood_group}</td>
                <td className="px-6 py-4">{user.premium_type}</td>
                <td className="px-6 py-4 flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                  <span className="text-blue-500">↗</span>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No matching records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
