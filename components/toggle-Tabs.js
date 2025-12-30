"use client";
import React from "react";

export default function ToggleTabs({ options = [], active, onChange }) {
  return (
    <div className="flex items-center justify-center bg-[#12121d] rounded-[10px] p-1 h-12 mb-10 md:mb-0">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-6 py-2 rounded-[10px] font-medium transition ${
            active === option.value
              ? "bg-primary text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
