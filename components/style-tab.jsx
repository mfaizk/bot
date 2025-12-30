"use client";
import React from "react";

export default function StylesTabs({ tabs = [], active, setActive }) {
  return (
    <nav className="flex gap-6 items-end">
      {tabs?.map((t) => (
        <button
          key={t}
          onClick={() => setActive(t)}
          className={`relative pb-3 text-sm md:text-base font-medium transition-all focus:outline-none ${
            active === t
              ? "text-primary"
              : "text-gray-300 hover:text-gray-100"
          }`}
        >
          {t}
          {active === t && (
            <span className="absolute left-0 right-0 -bottom-1 mx-auto h-0.5 w-10 md:w-14 bg-primary rounded" />
          )}
        </button>
      ))}
    </nav>
  );
}
