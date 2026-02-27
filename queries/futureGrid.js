import { api, futureGridBotBaseUrl } from "@/service/api-service";
import { useQuery } from "@tanstack/react-query";
/* ================= GET FUTURE BOT LIST ================= */

export const useGetFutureBotList = () =>
  useQuery({
    queryKey: ["futureBotList"],
    queryFn: async () => {
      const res = await api({
        method: "GET",
        url: `${futureGridBotBaseUrl}/bots`,
      });

      return res?.data || [];
    },
  });

  export const useFutureGridSummary = () =>
  useQuery({
    queryKey: ["futureGridSummary"],
    queryFn: async () => {
      const res = await api({
        method: "GET",
        url: `${futureGridBotBaseUrl}/dashboard/summary`,
      });

      return res?.data?.stats || {};
    },
  });
  /* ================= FUTURE LOG LIST ================= */

export const useGetFutureLogList = ({ id }) =>
  useQuery({
    queryKey: ["futureLogList", id],
    queryFn: async () => {
      const res = await api({
        method: "GET",
        url: `${futureGridBotBaseUrl}/bots/${id}/logs`,
      });
      return res?.data || [];
    },
    enabled: !!id,
  });

  /* ================= FUTURE GRID PNL ================= */

export const useFutureGridPNL = ({ id }) =>
  useQuery({
    queryKey: ["futureGridPNL", id],
    queryFn: async () => {
      const res = await api({
        method: "GET",
        url: `${futureGridBotBaseUrl}/bots/${id}/pnl`,
      });
      return res?.data || {};
    },
    enabled: !!id,
  });

  /* ================= DELETE FUTURE BOT ================= */

export const deleteFutureBot = async ({ id }) => {
  const res = await api({
    method: "DELETE",
    url: `${futureGridBotBaseUrl}/bots/${id}`,
  });

  return res?.data;
};
/* ================= CREATE BOT ================= */

export const createFutureBot = async ({
  exchange,
  symbol,
  gridLower,
  gridUpper,
  gridCount,
  investment,
  orderSize,
  leverage,
  lowerStopLossPrice,
  upperStopLossPrice,
  enableIndicators,
}) => {
  const response = await api({
    method: "POST",
    url: `${futureGridBotBaseUrl}/bots`,
    data: {
      exchange,
      symbol,
      gridLower,
      gridUpper,
      gridCount,
      investment,
      orderSize,
      leverage,
      lowerStopLossPrice,
      upperStopLossPrice,
      enableIndicators,
    },
  });

  return response?.data;
};

/* ================= GET BOT ================= */

export const useGetFutureBot = ({ id }) =>
  useQuery({
    queryKey: ["futureBot", id],
    queryFn: async () => {
      const res = await api({
        method: "GET",
        url: `${futureGridBotBaseUrl}/bots/${id}`,
      });
      return res?.data;
    },
  });

/* ================= START/STOP ================= */

export const updateFutureBotStatus = async ({ id, status }) => {
  const urlToHit =
    status === "RUNNING"
      ? `/bots/${id}/stop`
      : `/bots/${id}/start`;

  const response = await api({
    method: "POST",
    url: `${futureGridBotBaseUrl}${urlToHit}`,
  });

  return response?.data;
};
/* ================= LIQUIDATE + DELETE FUTURE BOT ================= */

export const liquidateAndDeleteFutureBot = async ({ id }) => {
  const res = await api({
    method: "POST",
    url: `${futureGridBotBaseUrl}/bots/${id}/delete-liquidate`,
  });

  return res?.data;
};
/* ================= ORDERS ================= */

export const useGetFutureOrders = ({ id, filter }) =>
  useQuery({
    queryKey: ["futureOrders", id, filter],
    queryFn: async () => {
      const res = await api({
        method: "GET",
        url: `${futureGridBotBaseUrl}/bots/${id}/orders/${filter}`,
      });
      return res?.data;
    },
  });