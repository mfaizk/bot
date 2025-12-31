import { api, DCAbaseUrl, gridBotBaseUrl } from "@/service/api-service";
import { useQuery } from "@tanstack/react-query";
import { useGetKeysExchange } from "./exchange";

// export const useAccountDetails = () => {
//   const { data: exchangeData, isLoading: isExchangeLoading } =
//     useGetKeysExchange();

//   return useQuery({
//     queryKey: ["exchangesAccountDetails", exchangeData],
//     queryFn: async () => {
//       if (!Array.isArray(exchangeData) || exchangeData.length === 0) return [];

//       const responses = await Promise.all(
//         exchangeData.map(async (item) => {
//           try {
//             const response = await api({
//               method: "GET",
//               url: `/keys/exchangesAccountDetails/${item?.id}`,
//             });
//             return {
//               exchangeId: item?.id,
//               ...response?.data?.result?.[0],
//             };
//           } catch (error) {
//             console.error(
//               "Error fetching account details for",
//               item?.id,
//               error
//             );
//             return { exchangeId: item?.id, error: true };
//           }
//         })
//       );

//       return responses;
//     },
//     enabled:
//       Array.isArray(exchangeData) &&
//       exchangeData.length > 0 &&
//       !isExchangeLoading,
//   });
// };

export const useExchangesAccountDetails = ({ exchangeId }) => {
  return useQuery({
    queryKey: ["exchangesAccountDetails", exchangeId],
    queryFn: async () => {
      try {
        const res = await api({
          method: "GET",
          url: `/keys/exchangesAccountDetails/${exchangeId}`,
        });
        console.log(res?.data, "asdasdasdasd");

        return res?.data?.result || {};
      } catch (error) {
        throw error?.response;
      }
    },
  });
};

export const useExchangeCount = () => {
  return useQuery({
    queryKey: ["exchangeCount"],
    queryFn: () => {
      return exchangeCount();
    },
  });
};

export const exchangeCount = async () => {
  try {
    const response = await api({
      method: "GET",
      url: "/keys/exchangeCount",
    });
    return response?.data?.result?.exchangeCount || 0;
  } catch (error) {
    return 0;
  }
};

export const useTransactionCount = () => {
  return useQuery({
    queryKey: ["transactionCount"],
    queryFn: () => {
      return transactionCount();
    },
  });
};

export const transactionCount = async () => {
  try {
    const response = await api({
      method: "GET",
      url: "/keys/transactionCount",
    });
    return response?.data?.result?.transactionCount || 0;
  } catch (error) {
    return 0;
  }
};

export const useTotalProfit = () => {
  return useQuery({
    queryKey: ["totalProfit"],
    queryFn: () => {
      return totalProfit();
    },
  });
};

export const totalProfit = async () => {
  try {
    const response = await api({
      method: "GET",
      url: "/keys/totalProfit",
    });
    return response?.data?.result?.totalProfit || 0;
  } catch (error) {
    return 0;
  }
};

export const useGridSummary = () => {
  return useQuery({
    queryKey: ["gridSummary"],
    queryFn: () => {
      return gridSummary();
    },
  });
};

export const gridSummary = async () => {
  try {
    const response = await api({
      method: "GET",
      url: `${gridBotBaseUrl}/dashboard/summary `,
    });
    return response?.data?.stats || {};
  } catch (error) {
    return 0;
  }
};

export const useDcaSummary = () => {
  return useQuery({
    queryKey: ["dcaSummary"],
    queryFn: () => {
      return dcaSummary();
    },
  });
};

export const dcaSummary = async () => {
  try {
    const response = await api({
      method: "GET",
      url: `${DCAbaseUrl}/dashboard/summary `,
    });
    return response?.data || {};
  } catch (error) {
    return 0;
  }
};
