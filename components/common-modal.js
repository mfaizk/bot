import React from "react";

const CommonModal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-lg shadow-lg bg-gray-700 flex flex-col">
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 md:p-5 border-b border-gray-600 bg-gray-700 rounded-t">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-white rounded-[10px] w-8 h-8 inline-flex justify-center items-center hover:bg-gray-600"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 14 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>

        <div className="overflow-y-auto p-4 md:p-5 space-y-4 flex-1">
          {children}
        </div>

        <div className="sticky bottom-0 z-10 flex items-center justify-center p-4 md:p-5 border-t border-gray-600 bg-gray-700 rounded-b">
          {footer ? (
            footer
          ) : (
            <button
              onClick={onClose}
              className="mt-2 px-6 py-3 bg-primary text-white font-semibold rounded-[10px] shadow hover:opacity-90 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommonModal;
