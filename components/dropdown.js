"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function Dropdown({
  label = "Select Option",
  options = [],
  value = null,
  onSelect,
  className = "",
  bgColor,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setOpen(false);
    onSelect?.(option.value);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div
      className={`relative inline-block text-left ${className}`}
      ref={dropdownRef}
    >
      <button
        disabled={disabled}
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-5 py-2 rounded-md text-md font-medium text-white focus:outline-none focus:border-primary transition capitalize`}
        style={{ backgroundColor: bgColor || "#1a1a25" }}
      >
        {selectedOption?.label || label}
        {!disabled && (
          <ChevronDown
            className={`w-4 h-4 ml-2 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full bg-[#1a1a25] border border-gray-700 rounded-lg shadow-lg">
          <ul className="py-2 text-md text-gray-300">
            {options.map((option) => (
              <li
                key={option.value}
                className="flex flex-row items-center pl-2"
              >
                {option?.icon && (
                  <img
                    src={option?.icon}
                    className=" w-6 rounded-full object-contain"
                  />
                )}
                <button
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-2 py-2 rounded-md transition capitalize ${
                    value === option.value
                      ? "text-white"
                      : "hover:bg-primary/80 hover:text-white"
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
