import { api } from "@/service/api-service";
import { useMutation, useQuery } from "@tanstack/react-query";

export const sendOtpExchange = async () => {
  try {
    const response = await api({
      method: "POST",
      url: "/keys/sendOtp",
    });

    return response?.data;
  } catch (error) {
    console.error("Error in sending OTP", error);
    throw error;
  }
};

export const addKeysExchange = async ({ exchange, apiKey, apiSecret, otp }) => {
  try {
    const response = await api({
      method: "POST",
      url: "/keys/addKeys",
      data: {
        exchange: exchange,
        apiKey: apiKey,
        apiSecret: apiSecret,
        otp: otp,
      },
    });

    return response?.data;
  } catch (error) {
    console.error("Error in adding keys", error);
    throw error;
  }
};

export const useGetKeysExchange = () => {
  return useQuery({
    queryKey: ["getKeysExchange"],
    queryFn: () => {
      return getKeysExchange();
    },
    select: (data) => {
      return (
        data?.result?.map((item) => {
          const icon =
            String(item?.exchange)?.toLowerCase() == "mexc"
              ? "/assets/homepage/mexc.png"
              : "/assets/homepage/bybit.webp";

          return { ...item, icon: icon };
        }) || []
      );
    },
  });
};

export const getKeysExchange = async () => {
  try {
    const response = await api({
      method: "GET",
      url: "/keys/getKeys",
    });

    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const deleteKeysExchange = async ({ id }) => {
  try {
    const response = await api({
      method: "POST",
      url: "/keys/deleteKeys",
      data: {
        id: id,
      },
    });

    return response?.data;
  } catch (error) {
    console.error("Error in deleting keys", error);
    throw error;
  }
};
