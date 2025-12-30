"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";
import { forgotPassword } from "@/queries/auth";


const ChangePassword = () => {

    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
      email: "",
    });
  
    const {
      mutateAsync: forgotPasswordMutate,
      isPending: forgotPasswordMutatePending,
    } = useMutation({
      mutationFn: async () => {
        return forgotPassword({
          email: formData?.email,
        });
      },
      onSuccess: (data) => {
        if (data?.data?.responseCode == 200) {
          toast.success(data?.data?.responseMessage);
          router.push(
            `/dashboard/settings/otp-screen?email=${encodeURIComponent(formData.email)}`
          );
        } else {
          toast.error(data?.data?.responseMessage);
        }
      },
      onError: (err) => {
        console.log(err, "err>>>");
      },
    });
    const [errors, setErrors] = useState({});
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
  
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    };
  
    const validate = () => {
      let newErrors = {};
  
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }
  
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (validate()) {
        console.log("Form Submitted:", formData);
        forgotPasswordMutate();
      }
    };
  return (
    <div className="flex  h-[100%]"> <div className="w-full  flex justify-center items-center ">
    <div className="w-full max-w-md">
      <h2 className="text-4xl font-semibold mb-2">Change Password</h2>
      <p className="text-sm text-gray-400 mb-6">
        Enter your registered email below, and we'll send a verification
        code on your email.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-3 bg-[#1A1A24] rounded focus:outline-none ${
              errors.email ? "border border-red-500" : ""
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-primary  font-semibold  text-white py-3 rounded-[10px] hover:opacity-90 transition-opacity"
        >
          Next
        </button>

     

       
      </form>
    </div>
  </div></div>
  )
}

export default ChangePassword