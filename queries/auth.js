import {
  googleLogout,
  useGoogleLogin,
  useGoogleOneTapLogin,
} from "@react-oauth/google";
import { api, baseUrl } from "../service/api-service";
import axios from "axios";
import { useRouter } from "next/navigation";
import { deleteCookie, setCookie } from "cookies-next";
import { toast } from "sonner";

export const signupMutation = async ({name, email, password }) => {
  try {
    const response = await api({
      method: "POST",
      url: "/user/signup",
      data: {
        name: name || undefined,
        email: email || undefined,
        password: password || undefined,
      },
    });
    return response;
  } catch (error) {
    return error?.response;
  }
};

export const VerifySignupOtp = async ({ email, otp }) => {
  try {
    const response = await api({
      method: "POST",
      url: "/user/VerifySignupOtp",
      data: {
        email: email || undefined,
        otp: otp || undefined,
      },
    });
    return response;
  } catch (error) {
    return error?.response;
  }
};

export const resendOTPSignup = async ({ email }) => {
  try {
    const response = await api({
      method: "POST",
      url: "/user/resendOTP",
      data: {
        email: email || undefined,
      },
    });
    return response;
  } catch (error) {
    return error?.response;
  }
};

export const loginMutation = async ({ email, password }) => {
  try {
    const response = await api({
      method: "POST",
      url: "/user/login",
      data: {
        email: email || undefined,
        password: password || undefined,
      },
    });
    return response;
  } catch (error) {
    return error?.response;
  }
};

export const verifyLoginOtp = async ({ email, otp }) => {
  try {
    const response = await api({
      method: "POST",
      url: "/user/verifyLoginOtp",
      data: {
        email: email || undefined,
        otp: otp || undefined,
      },
    });
    return response;
  } catch (error) {
    return error?.response;
  }
};

export const useHandleGoogleSignup = () => {
  const router = useRouter();
  const handleApiLogin = async ({ idToken }) => {
    try {
      const response = await api({
        method: "POST",
        url: "/user/googleLogin",
        data: {
          idToken: idToken || undefined,
        },
      });
      if (response?.data?.token) {
        toast.success(response?.data?.message);
        setCookie("token", response?.data?.token);
        router.replace("/dashboard/home");
      } else {
        toast.error(response?.data?.message);
      }
      return response;
    } catch (error) {
      return error?.response;
    }
  };

  const login = useGoogleOneTapLogin({
    onSuccess: async (credentialResponse) => {
      console.log(credentialResponse);
      console.log(credentialResponse, "token>>");
      handleApiLogin({ idToken: credentialResponse?.credential });
    },
    onError: () => {
      console.log("Login Failed");
    },
  });
  return handleApiLogin;
};

export const forgotPassword = async ({ email }) => {
  try {
    const response = await api({
      method: "POST",
      url: "/user/forgotPassword",
      data: {
        email: email || undefined,
      },
    });
    return response;
  } catch (error) {
    return error?.response;
  }
};
export const resetPassword = async ({ email, password }) => {
  try {
    const response = await api({
      method: "POST",
      url: "/user/resetPassword",
      data: {
        email: email || undefined,
        password: password || undefined,
      },
    });
    return response;
  } catch (error) {
    return error?.response;
  }
};

export const useLogout = () => {
  return () => {
    deleteCookie("token");
    deleteCookie("userType");
    googleLogout();
  };
};
