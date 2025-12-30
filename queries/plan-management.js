import { api } from "@/service/api-service";
import { useQuery } from "@tanstack/react-query";

export const useGetAllSubscription = () => {
  return useQuery({
    queryKey: ["getAllSubscription"],
    queryFn: () => {
      return getAllSubscription();
    },
    select: (data) => {
      return data?.result || [];
    },
  });
};

export const getAllSubscription = async () => {
  try {
    const response = await api({
      method: "GET",
      url: `/subscription/getAllSubscription`,
    });

    return response?.data;
  } catch (error) {
    throw error;
  }
};
