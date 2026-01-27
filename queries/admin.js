import { useQuery } from "@tanstack/react-query";
import { api } from "../service/api-service";

export const useGetAdminDashboard = () => {
  return useQuery({
    queryKey: ["adminDashboard"],
    queryFn: () => {
      return getAdminDashboardDetail();
    },
  });
};

export const getAdminDashboardDetail = async () => {
  try {
    const response = await api({
      method: "GET",
      url: "/admin/dashboard",
    });
    return response?.data?.result || {};
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};

export const useAdminProfile = () => {
  return useQuery({
    queryKey: ["getAdminProfile"],
    queryFn: async () => {
      return getAdminProfile();
    },
    select: (data) => {
      if (data?.data?.responseCode == 200) {
        return data?.data?.result;
      }

      return {};
    },
  });
};

export const getAdminProfile = async () => {
  try {
    const response = await api({
      method: "GET",
      url: "/admin/getAdminProfile",
    });

    return response;
  } catch (error) {
    return error?.response;
  }
};

// user list

export const useGetAllUserList = ({ page = 1, limit = 10 }) => {
  return useQuery({
    queryKey: ["userList", page, limit],
    queryFn: () => {
      return getAllUserList({ page, limit });
    },
    select: (data) => {
      return data?.result || [];
    },
    //   keepPreviousData: true,
  });
};

export const getAllUserList = async ({ page = 1, limit = 10 }) => {
  try {
    const response = await api({
      method: "POST",
      url: `/admin/userList`,
      data: {
        page: page,
        limit: limit,
      },
    });

    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const useGetUserSubscription = ({ page = 1, limit = 10, id }) => {
  return useQuery({
    queryKey: ["userSubscription", page, limit, id],
    queryFn: () => {
      return getuserSubscription({ page, limit, id });
    },
    select: (data) => {
      return data?.result || [];
    },
    //   keepPreviousData: true,
  });
};

export const getuserSubscription = async ({ page = 1, limit = 10, id }) => {
  try {
    const response = await api({
      method: "POST",
      url: `/admin/userSubscription/${id}`,
      data: {
        page: page,
        limit: limit,
      },
    });

    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const getActiveSubscriptionCount = async () => {
  try {
    const response = await api({
      method: "GET",
      url: "/subscription/getActiveSubscriptionCount",
    });
    return response?.data?.result || {};
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};

export const useGetActiveSubscriptionCount = () => {
  return useQuery({
    queryKey: ["getActiveSubscriptionCount"],
    queryFn: () => {
      return getActiveSubscriptionCount();
    },
  });
};
