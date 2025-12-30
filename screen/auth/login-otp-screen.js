"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resendOTPSignup, verifyLoginOtp } from "../../queries/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { setCookie } from "cookies-next";

const OtpScreenLogin = () => {
  const [otp, setOtp] = useState(""); // up to 4 chars
  const [timer, setTimer] = useState(120);
  const [resendDisabled, setResendDisabled] = useState(true);
  const inputsRef = useRef([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");

  const {
    mutateAsync: VerifySignupOtpMutate,
    isPending: VerifySignupOtpMutatePending,
  } = useMutation({
    mutationFn: async () => verifyLoginOtp({ email, otp }),
    onSuccess: (data) => {
      if (data?.data?.responseCode === 200) {
        toast.success(data?.data?.responseMessage);
        setCookie("token", data?.data?.result?.token);
        router.replace("/dashboard/home");
      } else {
        toast.error(data?.data?.responseMessage);
      }
    },
    onError: (err) => console.log(err),
  });

  const {
    mutateAsync: resendOTPSignupMutate,
    isPending: resendOTPSignupMutatePending,
  } = useMutation({
    mutationFn: async () => resendOTPSignup({ email }),
    onSuccess: (data) => {
      if (data?.data?.responseCode === 200) {
        toast.success(data?.data?.responseMessage);
      } else {
        toast.error(data?.data?.responseMessage);
      }
    },
    onError: (err) => console.log(err),
  });

  useEffect(() => {
    const storedTime = 120;
    if (storedTime) {
      const remaining = parseInt(storedTime, 10) - Date.now();
      if (remaining > 0) {
        startTimer(Math.ceil(remaining / 1000));
        return;
      }
    }
    startTimer(120);
    // autofocus first input shortly after mount
    setTimeout(() => inputsRef.current[0]?.focus(), 50);
  }, []);

  const startTimer = (seconds) => {
    setResendDisabled(true);
    setTimer(seconds);
    const endTime = Date.now() + seconds * 1000;
    sessionStorage.setItem("otpTimer", String(endTime));

    const interval = setInterval(() => {
      const remaining = Math.ceil((endTime - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(interval);
        setTimer(0);
        setResendDisabled(false);
        sessionStorage.removeItem("otpTimer");
      } else {
        setTimer(remaining);
      }
    }, 1000);
  };

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const updateOtpStateFromArray = (arr) => {
    setOtp(arr.slice(0, 4).join(""));
  };

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const otpArray = Array.from({ length: 4 }, (_, i) => otp[i] || "");
    otpArray[index] = value;
    updateOtpStateFromArray(otpArray);

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
      inputsRef.current[index + 1]?.select?.();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const otpArray = Array.from({ length: 4 }, (_, i) => otp[i] || "");
        otpArray[index] = "";
        updateOtpStateFromArray(otpArray);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        const otpArray = Array.from({ length: 4 }, (_, i) => otp[i] || "");
        otpArray[index - 1] = "";
        updateOtpStateFromArray(otpArray);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // handle paste into any input
  const handlePaste = (e, startIndex) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    const digits = pasted.replace(/\D/g, "");
    if (!digits) return;

    const otpArray = Array.from({ length: 4 }, (_, i) => otp[i] || "");
    for (let i = 0; i < digits.length && startIndex + i < 4; i++) {
      otpArray[startIndex + i] = digits[i];
    }

    // update state (controlled inputs will update)
    updateOtpStateFromArray(otpArray);

    // focus next empty or last filled
    const firstEmpty = otpArray.findIndex((c) => c === "");
    setTimeout(() => {
      if (firstEmpty !== -1) {
        inputsRef.current[firstEmpty]?.focus();
        inputsRef.current[firstEmpty]?.select?.();
      } else {
        const focusIndex = Math.min(3, startIndex + digits.length - 1);
        inputsRef.current[focusIndex]?.focus();
      }
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length !== 4) {
      toast.error("Please enter the complete 4-digit OTP.");
      return;
    }
    VerifySignupOtpMutate();
  };

  const resendOtp = () => {
    startTimer(120);
    resendOTPSignupMutate();
  };

  return (
    <div className="min-h-screen flex flex-col justify-center md:flex-row bg-[#030b1f]">
      <div className="hidden md:flex w-1/2 bg-[#030b1f] justify-center items-center p-1">
        <div>
          <h1 className="text-3xl font-bold mb-4">
            QUICK, <span className="text-primary">SECURE</span> &{" "}
            <span className="text-primary">RELIABLE</span>
          </h1>
          <p className="text-gray-400 mb-10 text-center">
            Your all-in-one solution for crypto trading
          </p>

          <div className="w-full h-120 bg-gradient-to-br from-gray-800 to-black rounded-lg flex justify-center items-center overflow-hidden">
            <img
              src="/assets/auth/wallet.png"
              alt="Q Dashboard"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex justify-center items-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-semibold mb-2">OTP Verification</h2>
          <p className="text-sm text-gray-400 mb-3">
            Enter the 4-digit code to continue.
          </p>
          <p className="text-sm mb-6">
            Check your email for the One-Time Password (OTP). Also look in your
            spam folder if you don’t see it.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="flex justify-between mb-6">
              {[0, 1, 2, 3].map((i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  value={otp[i] || ""}
                  onChange={(e) => handleChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  onPaste={(e) => handlePaste(e, i)}
                  className="w-14 h-14 text-center text-white text-xl bg-[#1A1A24] border-2 border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ))}
            </div>
            
            <button
              type="submit"
              className={`w-full font-semibold text-white py-3 rounded-[10px] transition-opacity ${
                otp.length === 4 && !VerifySignupOtpMutatePending
                  ? "bg-primary hover:opacity-90"
                  : "bg-primary opacity-50 cursor-not-allowed"
              }`}
              disabled={otp.length !== 4 || VerifySignupOtpMutatePending}
            >
              {VerifySignupOtpMutatePending ? `Verifying OTP` : `Verify OTP`}
            </button>

            <div className="mt-6 flex flex-col items-center">
              <button
                type="button"
                onClick={resendOtp}
                disabled={resendDisabled}
                className={`text-primary font-medium ${
                  resendDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:underline"
                }`}
              >
                {resendDisabled
                  ? `Resend OTP in ${formatTime(timer)}`
                  : "Resend OTP"}
              </button>
            </div>

            <div className="my-6 flex items-center justify-center text-gray-500 text-sm">
              <span className="border-b w-1/5 lg:w-1/4"></span>
              <span className="mx-2">Or</span>
              <span className="border-b w-1/5 lg:w-1/4"></span>
            </div>

            <Link
              href="/login"
              className="w-full flex items-center justify-center hover:text-primary transition-colors"
            >
              Go Back to Login
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpScreenLogin;
