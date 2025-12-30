"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Mail, Key, UserPlus, User } from "lucide-react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { signupMutation, useHandleGoogleSignup } from "../../queries/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const googleLogin = useHandleGoogleSignup();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const { mutateAsync: signupMutate, isPending: mutatePending } = useMutation({
    mutationFn: async () => {
      return signupMutation({
        email: formData?.email,
        name: formData?.name,
        password: formData?.password,
      });
    },
    onSuccess: (data) => {
      if (data?.data?.responseCode == 200) {
        toast.success(data?.data?.responseMessage);
        router.push(`/otp-screen?email=${encodeURIComponent(formData.email)}`);
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

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!formData.name) {
      newErrors.name = "Name is required";
   
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.terms) {
      newErrors.terms = "You must accept the Terms & Conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      signupMutate();
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center md:flex-row bg-[#030b1f]  ">
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
          <h2 className="text-4xl font-semibold mb-2">Sign Up</h2>
          <p className="text-sm text-gray-400 mb-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4 relative">
              <User className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                type="name"
                name="name"
                placeholder="Enter name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-3 pl-10 bg-[#1A1A24] rounded focus:outline-none ${
                  errors.name ? "border border-red-500" : ""
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div className="mb-4 relative">
              <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 pl-10 bg-[#1A1A24] rounded focus:outline-none ${
                  errors.email ? "border border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="mb-4 relative">
              <Key className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 pl-10 pr-10 bg-[#1A1A24] rounded focus:outline-none ${
                  errors.password ? "border border-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 flex items-center text-gray-400 hover:text-white ${
                  errors.password ? "bottom-10" : "bottom-3"
                }`}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="mb-4 relative">
              <Key className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full p-3 pl-10 pr-10 bg-[#1A1A24] rounded focus:outline-none ${
                  errors.confirmPassword ? "border border-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute right-3 flex items-center text-gray-400 hover:text-white ${
                  errors.confirmPassword ? "bottom-10" : "bottom-3"
                }`}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="flex items-start text-sm cursor-pointer">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  className="mr-2 mt-1"
                />
                I accept the{" "}
                <Link
                  href="/terms-conditions"
                  className="text-primary ml-1 hover:underline"
                >
                  Terms & Conditions {" "} 
                </Link>
                <p className="text-white ml-1"> {" "} &</p>
                <Link
                  href="/privacy-policy"
                  className="text-primary ml-1 hover:underline"
                >
                  Privacy Policy
                </Link>
              </label>
              {errors.terms && (
                <p className="text-red-500 text-sm mt-1">{errors.terms}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-primary  font-semibold  text-white py-3 rounded-[10px] hover:opacity-90 transition-opacity"
              disabled={mutatePending}
            >
              {mutatePending ? `Signing Up...` : `SIGN UP`}
            </button>

            <div className="my-6 flex items-center justify-center text-gray-500 text-sm">
              <span className="border-b w-1/5 lg:w-1/4"></span>
              <span className="mx-2">Or</span>
              <span className="border-b w-1/5 lg:w-1/4"></span>
            </div>
            <div className=" flex items-center justify-center">
              <GoogleLogin
                size="large"
                className="w-full"
                // width={700}
                onSuccess={(credentialResponse) => {
                  console.log(credentialResponse);
                  googleLogin({ idToken: credentialResponse?.credential });
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
                useOneTap
              />
            </div>

           
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
