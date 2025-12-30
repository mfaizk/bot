import { Transition } from "@headlessui/react";
import clsx from "clsx";
import React from "react";

const ComingIndicator = ({ show = false, className }) => {
  return (
    <Transition
      show={show}
      enter="transition-opacity duration-150"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="transition-opacity duration-200"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <div
        className={clsx(
          "flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-gray-50 border border-gray-200 shadow-sm",
          className
        )}
      >
        <svg
          className="h-10 w-10 text-primary mb-3 animate-pulse"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6l4 2"
          />
        </svg>
        <h2 className="text-lg font-semibold text-gray-800">
          🚧 Coming Soon
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          This feature is still under development.
        </p>
      </div>
    </Transition>
  );
};

export default ComingIndicator;
