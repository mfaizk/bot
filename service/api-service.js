"use client";
import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";
import React from "react";
import { toast } from "sonner";

// export const baseUrl = "http://139.59.42.213:8080/api/v1"; // local
// export const baseUrl = "https://backend.qbots.trade/api/v1"; // UAT
export const baseUrl = "https://productionb.qbots.trade/api/v1"; // live

export const DCAbaseUrl = "https://dca.qbots.trade/api"; // UAT

// socket
// export const wssBaseUrl = "ws://139.59.42.213:8082";  //local
// export const wssBaseUrl = "wss://wsocket.qbots.trade/"; // UAT
export const wssBaseUrl = "wss://socket-production.qbots.trade/"; // live

export const gridBotBaseUrl = "https://spot-grid.qbots.trade/api";
// export const gridBotBaseUrl = "http://64.227.185.157:3000/api";

export const api = axios.create({
  baseURL: baseUrl,
});

api.interceptors.request.use((config) => {
  const token = getCookie("token");
  // const token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI4LCJtb2JpbGVOdW1iZXIiOiJxaWJvdDc4NzBAZ21haWwuY29tIiwidXNlclR5cGUiOiJBRE1JTiIsImlhdCI6MTc2MTY1NDE1OCwiZXhwIjoxNzYxOTEzMzU4fQ.RRqorEflCaD731PAJngYSsXH5rFQzk6J9qpvYvYJpxc";

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
  }
);
