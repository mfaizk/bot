// SuccessModal (paste near OTPModal / DeleteModal)
import React, { useEffect, useState } from "react";

const SuccessModal = ({
  open,
  setOpen,
  title = "Success",
  message = "Exchange added successfully.",
  autoClose = true,      // whether modal auto-closes
  duration = 5,          // seconds before auto-close
  showOk = true,         // show OK button
  onOk,                  // optional callback when OK pressed / auto-closed
}) => {
  const [secondsLeft, setSecondsLeft] = useState(duration);

  useEffect(() => {
    if (!open) {
      setSecondsLeft(duration);
      return;
    }

    if (!autoClose) return;

    setSecondsLeft(duration);
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          // close modal when it reaches zero
          setOpen(false);
          onOk?.();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, autoClose, duration]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={() => {
              setOpen(false);
              onOk?.();
            }}
            className="text-white hover:text-gray-300 w-8 h-8 flex items-center justify-center rounded hover:bg-gray-700"
            type="button"
            aria-label="Close"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            {/* success circle icon */}
            <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M20 6L9 17l-5-5"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <p className="text-gray-100 font-medium text-lg mb-2">{message}</p>

          {autoClose && (
            <p className="text-sm text-gray-400 mb-4">
               Close in <strong>{secondsLeft}</strong> second
              {secondsLeft !== 1 ? "s" : ""}.
            </p>
          )}

          {showOk && (
            <div className="mt-2">
              <button
                onClick={() => {
                  setOpen(false);
                  onOk?.();
                }}
                className="w-full py-3 rounded-[10px] bg-primary text-white font-semibold hover:opacity-90 transition"
              >
                OK
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
