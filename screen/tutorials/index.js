"use client";
import React, { useState } from "react";

const Tutorials = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  return (
    <div className="relative w-full flex flex-col bg-[#05060f]  py-30 px-5 md:px-20 gap-10">
      <div className="w-full md:w-[90%] flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold ">
          How to Connect to Your
        </h1>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
          Exchange with API Keys
        </h1>
      </div>
      <div
        className="bg-black text-center p-8 md:p-12 flex flex-col items-center justify-center cursor-pointer"
        onClick={openModal}
      >
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-dashed border-white/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L15.09 5.09L12 8.18L8.91 5.09L12 2ZM2 12L5.09 8.91L8.18 12L5.09 15.09L2 12ZM12 15.82L8.91 18.91L12 22L15.09 18.91L12 15.82ZM18.91 8.91L22 12L18.91 15.09L15.82 12L18.91 8.91ZM12 10.5L13.5 12L12 13.5L10.5 12L12 10.5Z" />
            </svg>
          </div>
        </div>

        <h2 className="text-white text-xl md:text-2xl font-semibold mb-4">
          How to Connect Mexc with Qbots?
        </h2>

        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
          Learn how to generate an API key within Mexc and securely link it
          to Qbots for automated and seamless trading.
        </p>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-lg shadow-lg bg-gray-700 flex flex-col">
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 md:p-5 border-b border-gray-600 bg-gray-700 rounded-t">
              <h3 className="text-xl font-semibold text-white">
                Creating a New API Key in Mexc & Whitelisting IP address
              </h3>
              <button
                onClick={closeModal}
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
              <div className="max-w-3xl mx-auto p-6 space-y-6">
                <div className="bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-700">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">🪄</span>
                    <h2 className="text-xl font-semibold text-white">
                      Step 1: Log In to Your Mexc Account
                    </h2>
                  </div>
                  <ul className="mt-4 list-disc list-inside text-gray-300 space-y-2">
                    <li>
                      Go to{" "}
                      <a
                        href="https://www.mexc.co/en-IN/"
                        className="text-blue-400 underline"
                      >
                        Mexc
                      </a>{" "}
                      and log in using your credentials.
                    </li>
                    <li>
                      Complete any required{" "}
                      <strong>2FA (Two-Factor Authentication)</strong> for added
                      security.
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-700">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">🔑</span>
                    <h2 className="text-xl font-semibold text-white">
                      Step 2: Access the API Management Page
                    </h2>
                  </div>
                  <ul className="mt-4 list-disc list-inside text-gray-300 space-y-2">
                    <li>
                      Hover over your <strong>profile icon</strong> (top-right
                      corner) and select <strong>“API Management”</strong> from
                      the dropdown menu.
                    </li>
                    <li>
                      Click on <strong>“Create API”</strong>.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 z-10 flex items-center justify-center p-4 md:p-5 border-t border-gray-600 bg-gray-700 rounded-b">
              <button
                onClick={closeModal}
                className=" mt-2 px-6 py-3 bg-primary text-[white] font-semibold rounded-[10px] shadow hover:opacity-90 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tutorials;
