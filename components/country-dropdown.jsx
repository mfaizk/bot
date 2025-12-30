
"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function CountryDropdown({
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

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll on mobile when dropdown is open (optional)
  useEffect(() => {
    if (open) {
      // add style to prevent background scroll
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSelect = (option) => {
    setOpen(false);
    onSelect?.(option.value);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  const isImageIcon = (icon) =>
    typeof icon === "string" &&
    (icon.startsWith("http") || icon.startsWith("data:") || icon.includes("/"));

  return (
    <div
      className={`relative inline-block text-left ${className}`}
      ref={dropdownRef}
    >
      <button
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-5 py-3 rounded-md text-md font-medium text-white focus:outline-none focus:border-primary transition capitalize`}
        style={{ backgroundColor: bgColor || "#1a1a25" }}
      >
        {selectedOption ? `${selectedOption.label}` : label}
        {!disabled && (
          <ChevronDown
            className={`w-4 h-4 ml-2 transition-transform ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {open && (
        <div
          role="listbox"
          aria-activedescendant={selectedOption ? `opt-${selectedOption.value}` : undefined}
          // key fixes: maxHeight + overflow to make dropdown scrollable independently
          style={{
            maxHeight: "300px", // keeps it inside viewport
            overflowY: "auto",
            WebkitOverflowScrolling: "touch", // smooth scrolling on iOS
          }}
          className="absolute z-30 mt-2 w-full bg-[#1a1a25] border border-gray-700 rounded-lg shadow-lg"
        >
          <ul className="py-2 text-md text-gray-300">
            {options?.map((option) => (
              <li
                key={option.value}
                id={`opt-${option.value}`}
                className="flex flex-row items-center pl-2"
                role="option"
                aria-selected={value === option.value}
              >
                {option?.icon && isImageIcon(option.icon) && (
                  <img
                    src={option.icon}
                    alt={`${option.label} flag`}
                    className="w-6 h-6 rounded-full object-contain mr-2"
                  />
                )}
                {option?.icon && !isImageIcon(option.icon) && (
                  <span className="text-lg mr-2" aria-hidden>
                    {option.icon}
                  </span>
                )}

                <button
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-2 py-2 rounded-md transition capitalize ${
                    value === option.value ? "text-white" : "hover:bg-primary/80 hover:text-white"
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

