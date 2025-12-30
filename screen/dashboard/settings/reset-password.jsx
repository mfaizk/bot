"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";
import { resetPassword } from "@/queries/auth";

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const { mutateAsync: resetPasswordMutate, isPending: resetPasswordPending } =
    useMutation({
      mutationFn: async () => {
        return resetPassword({
          email,
          password: formData.password,
        });
      },
      onSuccess: (data) => {
        if (data?.data?.responseCode === 200) {
          toast.success(
            data?.data?.responseMessage || "Password reset successful!"
          );
          router.push("/login");
        } else {
          toast.error(data?.data?.responseMessage || "Something went wrong");
        }
      },
      onError: (err) => {
        console.error(err);
        toast.error("Error resetting password");
      },
    });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      resetPasswordMutate();
    }
  };

  return (
    <div className="flex  h-[100%]">
      <div className="w-full  flex justify-center items-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-semibold mb-2">Reset Password</h2>
          <p className="text-sm text-gray-400 mb-6">
            Enter your new password below and confirm it.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Password */}
            <div className="mb-4 relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="New Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 bg-[#1A1A24] rounded focus:outline-none ${
                  errors.password ? "border border-red-500" : ""
                }`}
              />
              <span
                className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-4 relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full p-3 bg-[#1A1A24] rounded focus:outline-none ${
                  errors.confirmPassword ? "border border-red-500" : ""
                }`}
              />
              <span
                className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={resetPasswordPending}
              className={`w-full bg-primary font-semibold text-white py-3 rounded-[10px] transition-opacity ${
                resetPasswordPending
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:opacity-90"
              }`}
            >
              {resetPasswordPending ? "Resetting..." : "Reset Password"}
            </button>

         
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
