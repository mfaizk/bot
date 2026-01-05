"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginMutation, useHandleGoogleSignup } from "../../queries/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";
import { setCookie } from "cookies-next";

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const googleLogin = useHandleGoogleSignup();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const { mutateAsync: loginMutate, isPending: mutatePending } = useMutation({
    mutationFn: async () => {
      return loginMutation({
        email: formData?.email,
        password: formData?.password,
      });
    },
    onSuccess: (data) => {
      if (data?.data?.responseCode == 200) {
        if (data?.data?.result?.userType === "ADMIN") {
          toast.success(data?.data?.responseMessage);
          router.push(
            `/ad-otp-screen?email=${encodeURIComponent(formData.email)}`
          );
          // toast.success(data?.data?.responseMessage);
          // setCookie("token", data?.data?.result?.token);
          // setCookie("userType", "admin");
          // router.replace("/admin/home");
        } else {
          toast.success(data?.data?.responseMessage);
          router.push(
            `/login-otp-screen?email=${encodeURIComponent(formData.email)}`
          );
        }
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

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form Submitted:", formData);
      loginMutate();
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center md:flex-row bg-[#030b1f] ">
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
          <h2 className="text-4xl font-semibold mb-2">Login</h2>
          <p className="text-sm text-gray-400 mb-6">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign Up
            </Link>
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
            <div className="mb-4 relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 bg-[#1A1A24] rounded focus:outline-none pr-10 ${
                  errors.password ? "border border-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className={`absolute right-3 flex items-center  text-gray-400 hover:text-white ${
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
            <div className="flex items-center justify-between text-sm mb-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="mr-2"
                />
                Remember me
              </label>
              <Link
                href="/forgot-screen"
                className="text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full bg-primary  font-semibold  text-white py-3 rounded-[10px] hover:opacity-90 transition-opacity"
              disabled={mutatePending}
            >
              {mutatePending ? `LOGIN...` : `LOGIN`}
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

export default Login;
