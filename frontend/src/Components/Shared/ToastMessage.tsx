// src/components/Shared/ToastMessage.tsx
import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";

interface ToastMessageProps {
  title: string;
  description: string;
  type?: "success" | "error" | "info" | "warning";
}

const ToastMessage: React.FC<ToastMessageProps> = ({
  title,
  description,
  type = "success",
}) => {
  const getColorClasses = () => {
    switch (type) {
      case "error":
        return {
          bg: "bg-red-100",
          border: "border-red-500",
          textTitle: "text-red-800",
          textDesc: "text-red-700",
          icon: "text-red-600",
          button: "text-red-700 hover:text-red-900",
        };
      case "warning":
        return {
          bg: "bg-yellow-100",
          border: "border-yellow-500",
          textTitle: "text-yellow-800",
          textDesc: "text-yellow-700",
          icon: "text-yellow-600",
          button: "text-yellow-700 hover:text-yellow-900",
        };
      case "info":
        return {
          bg: "bg-blue-100",
          border: "border-blue-500",
          textTitle: "text-blue-800",
          textDesc: "text-blue-700",
          icon: "text-blue-600",
          button: "text-blue-700 hover:text-blue-900",
        };
      default:
        return {
          bg: "bg-green-100",
          border: "border-green-500",
          textTitle: "text-green-800",
          textDesc: "text-green-700",
          icon: "text-green-600",
          button: "text-green-700 hover:text-green-900",
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div
      className={`flex items-start gap-3 ${colors.bg} ${colors.border} rounded-lg p-4 w-full max-w-lg`}
    >
      <FaCheckCircle className={`${colors.icon} text-xl mt-1`} />
      <div className="flex-1">
        <p className={`${colors.textTitle} font-semibold`}>{title}</p>
        <p className={`${colors.textDesc} text-sm`}>{description}</p>
      </div>
      <button className={colors.button} onClick={() => toast.dismiss()}>
        <IoMdClose size={18} />
      </button>
    </div>
  );
};

export default ToastMessage;
