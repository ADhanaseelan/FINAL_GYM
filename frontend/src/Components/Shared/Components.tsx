import { useState, useRef, useEffect } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import React from "react";

/* ---------------- LabelInput ---------------- */
interface LabelInputProps {
  label: string;
  error?: string;
  type?: string;
  placeholder?: string;
  maxLength?: number;
}

export const LabelInput: React.FC<
  LabelInputProps & React.InputHTMLAttributes<HTMLInputElement>
> = ({ label, error, ...inputProps }) => {
  return (
    <div className="w-full max-w-md mb-4">
      <label className="block mb-2 font-semibold text-sm text-gray-900">
        {label}
      </label>
      <input
        {...inputProps}
        className={`w-full h-12 rounded-md border px-3 text-sm focus:border-teal-500 focus:ring focus:ring-teal-200 outline-none ${
          error ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

/* ---------------- RadioGroup ---------------- */
interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  legend: string;
  name: string;
  options: RadioOption[];
  selectedValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  legend,
  name,
  options,
  selectedValue,
  onChange,
  required = false,
}) => {
  return (
    <fieldset className="mb-4">
      <legend className="mb-2 font-medium text-sm text-gray-900">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-6">
        {options.map((option) => (
          <label
            key={option.value}
            className="inline-flex items-center space-x-2"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={onChange}
              required={required}
              className="w-4 h-4 border-gray-400 text-teal-500 focus:ring-teal-300"
            />
            <span className="text-sm text-gray-800">{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
};

/* ---------------- CustomDropdown ---------------- */
interface SelectOption {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  label: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  error?: string;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  options,
  value,
  onChange,
  onBlur,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (selectedValue: string) => {
    onChange?.(selectedValue);
    onBlur?.(); // inform RHF about touch
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || "Select Option";

  return (
    <div className="w-full max-w-md mb-4 relative" ref={dropdownRef}>
      <label className="block mb-2 font-medium text-sm text-gray-900">
        {label}
      </label>
      <div
        className={`relative w-full h-11 rounded-md border px-3 flex items-center justify-between cursor-pointer ${
          error ? "border-red-500" : "border-gray-300"
        } bg-white hover:border-teal-500`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="text-sm text-gray-800">{selectedLabel}</span>
        <RiArrowDropDownLine className="text-gray-500 text-lg" />
      </div>

      {isOpen && (
        <ul className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md z-10">
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className="px-3 py-2 text-sm text-gray-800 hover:bg-teal-100 cursor-pointer"
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};

/* ---------------- SearchBox ---------------- */
interface SearchBoxProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  value,
  onChange,
  placeholder = "Find something here...",
}) => {
  return (
    <div className="relative w-full max-w-sm">
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
        <CiSearch className="w-5 h-5" />
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-10 pl-3 pr-10 border border-gray-300 rounded-md text-sm text-gray-700 placeholder-gray-400 focus:border-teal-500 focus:ring focus:ring-teal-200 outline-none"
      />
    </div>
  );
};

/* ---------------- Buttons ---------------- */
interface ButtonProps {
  onClick?: () => void; // optional, only if needed
  label: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset"; // add type prop
}

export const PositiveButton: React.FC<ButtonProps> = ({
  onClick,
  label,
  disabled = false,
  type = "submit", // default to submit
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className="h-10 px-5 rounded-md bg-teal-500 text-white font-semibold text-sm hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-300"
  >
    {label}
  </button>
);

export const NegativeButton: React.FC<ButtonProps> = ({ onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    className="h-10 px-5 rounded-md border border-teal-500 text-teal-500 font-semibold text-sm hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-300"
  >
    {label}
  </button>
);
/* ---------------- DietInput ---------------- */

interface DietInputProps {
  label: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DietInput: React.FC<DietInputProps> = ({
  label,
  value,
  placeholder = "Enter details",
  onChange,
}) => {
  return (
    <div className="flex items-center gap-3">
      <label className="text-gray-800 text-sm font-semibold w-32">
        {label}
      </label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="flex-1 max-w-[450px] min-w-[150px] px-3 py-2 border border-gray-300 rounded-lg
               focus:outline-none focus:ring-2 focus:ring-teal-500
               focus:border-transparent placeholder-gray-400
               transition duration-200 ease-in-out"
      />
    </div>
  );
};

export default DietInput;
