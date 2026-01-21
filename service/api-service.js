"use client";
import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";
import React from "react";
import { toast } from "sonner";

// export const baseUrl = "https://backend.qbots.trade/api/v1"; // UAT
export const baseUrl = "https://productionb.qbots.trade/api/v1"; // live

export const DCAbaseUrl = "https://dca.qbots.trade/api"; // UAT

// socket
// export const wssBaseUrl = "wss://wsocket.qbots.trade/"; // UAT
export const wssBaseUrl = "wss://chartdata.qbots.trade"; // live

export const gridBotBaseUrl = "https://spot-grid.qbots.trade/api";

export const graphEndPoint = "https://chartdata.qbots.trade/tv/history";

export const api = axios.create({
  baseURL: baseUrl,
});

api.interceptors.request.use((config) => {
  const token = getCookie("token");

  // const token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIwLCJlbWFpbCI6Imp1YW5AcWlld2FsbGV0Lm1lIiwidXNlclR5cGUiOiJVU0VSIiwic3RhdHVzIjoiQUNUSVZFIiwiaWF0IjoxNzY4OTg5MjcyLCJleHAiOjE3NjkwNzU2NzJ9.Ey3yuZB6o6GQ-U4j3Pov5jhtYc5VUAv63fsBf9DHyeA";

  return {
    ...config,
    headers: {
      ...config.headers,
      token: token,
      Authorization: `Bearer ${token}`,
    },
  };
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error?.response?.data?.responseCode == 440 ||
      error?.response?.status == 401
    ) {
      toast.error(error?.response?.data?.responseMessage || "Session Expired");
      deleteCookie("token");
      redirect("/");
    }

    return Promise.reject(error);
  },
);
