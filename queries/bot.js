import { api, DCAbaseUrl, gridBotBaseUrl } from "@/service/api-service";
import { useQuery } from "@tanstack/react-query";

export const createBot = async ({
  exchange,
  symbol,

  gridLower,
  gridUpper,
  gridCount,
  investment,
  orderSize,
  stopLossPrice,
  enableIndicators,
}) => {
  try {
    const response = await api({
      method: "POST",
      url: `${gridBotBaseUrl}/bots`,
      data: {
        exchange,
        symbol,
        gridLower,
        gridUpper,
        gridCount,
        investment,
        orderSize,
        stopLossPrice,
        enableIndicators,
      },
    });

    return response?.data;
  } catch (error) {
    console.error("Error creating bot:", error);
    throw error;
  }
};

export const useGetBot = ({ id }) => {
  return useQuery({
    queryKey: ["getBot", id],
    queryFn: () => {
      return getBot({ id });
    },
    select: (data) => {
      return data || {};
    },
  });
};

export const getBot = async ({ id }) => {
  try {
    const response = await api({
      method: "GET",
      url: `${gridBotBaseUrl}/bots/${id}`,
    });

    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const updateBotStatus = async ({ id, status }) => {
  try {
    const urlToHit =
      status == "RUNNING" ? `/bots/${id}/stop` : `/bots/${id}/start`;
    const response = await api({
      method: "POST",
      url: `${gridBotBaseUrl}${urlToHit}`,
      // params: {
      //   id,
      // },
    });

    return response?.data;
  } catch (error) {
    console.error("Error creating bot:", error);
    throw error;
  }
};

export const useGetBotList = (params = {}) => {
  const { selectExchange } = params;
  return useQuery({
    queryKey: ["getBotList", selectExchange],
    queryFn: () => {
      return getBotList(selectExchange);
    },
    select: (data) => {
      return data || [];
    },
  });
};

export const getBotList = async (selectExchange) => {
  try {
    const response = await api({
      method: "GET",
      url: `${gridBotBaseUrl}/bots`,
      params: { exchange: selectExchange },
    });

    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const useGetOrder = ({ id, filter }) => {
  return useQuery({
    queryKey: ["getOrder", id, filter],
    queryFn: () => {
      return getOrder({ id, filter });
    },
    select: (data) => {
      return data || [];
    },
  });
};

export const getOrder = async ({ id, filter }) => {
  try {
    const response = await api({
      method: "GET",
      url: `${gridBotBaseUrl}/bots/${id}/orders/${filter}`,
    });

    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const updateBot = async ({
  botName,
  exchangeKeyId,
  symbol,
  status,
  params,
  pausedUntil,
  botId,
}) => {
  try {
    const stopResponse = await updateBotStatus({
      id: botId,
      status: "running",
    });
    if (stopResponse?.responseCode == 200) {
      const response = await api({
        method: "PUT",
        url: "/bot/updateBot",
        data: {
          botId: botId,
          botName: botName || undefined,
          // exchangeKeyId: exchangeKeyId || undefined,
          // symbol: symbol || undefined,
          status: status || undefined,
          params,
          pausedUntil: pausedUntil || undefined,
        },
      });
      return response?.data;
    }
    return stopResponse?.data;
  } catch (error) {
    console.error("Error creating bot:", error);
    throw error;
  }
};

export const deleteBot = async ({ id }) => {
  try {
    const response = await api({
      method: "POSt",
      url: `${gridBotBaseUrl}/bots/${id}/delete-liquidate`,
    });

    return response?.data;
  } catch (error) {
    console.error("Error creating bot:", error);
    throw error;
  }
};

export const useGetSymbolList = ({ exchange }) => {
  return useQuery({
    queryKey: ["getSymbolList", exchange],
    queryFn: () => {
      return getSymbolList({ exchange });
    },
    select: (data) => {
      return data?.result || [];
    },
  });
};

export const getSymbolList = async ({ exchange }) => {
  try {
    const response = await api({
      method: "GET",
      url: `/keys/getSymbolList`,
      params: {
        exchange: exchange,
      },
    });

    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const useGetLogList = ({ id }) => {
  return useQuery({
    queryKey: ["getLogList", id],
    queryFn: () => {
      return getLogList({ id });
    },
    select: (data) => {
      return data || [];
    },
  });
};

export const getLogList = async ({ id }) => {
  try {
    const response = await api({
      method: "GET",
      url: `${gridBotBaseUrl}/bots/${id}/logs`,
      params: {
        botId: id,
      },
    });

    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const cancelOrder = async ({ id }) => {
  try {
    const response = await api({
      method: "PATCH",
      url: `/order/cancelOrder/${id}`,
    });
    return response?.data;
  } catch (error) {
    console.error("Error creating bot:", error);
    throw error;
  }
};

export const createDCABots = async ({
  portfolioUsd,
  perBuyPct,
  maxEntries,
  takeProfitPct,
  stopLossPct,
  minOrderUsd,
  maxAllocPct,
  enableIndicators,
  pair,
  exchangeName,
}) => {
  try {
    const response = await api({
      method: "POST",
      url: `${DCAbaseUrl}/bots`,
      data: {
        pair: pair,
        config: {
          portfolioUsd,
          perBuyPct,
          maxEntries,
          takeProfitPct,
          stopLossPct,
          minOrderUsd,
          maxAllocPct,
          enableIndicators,
          exchangeName,
        },
      },
    });

    return response?.data;
  } catch (error) {
    console.error("Error creating bot:", error);
    throw error;
  }
};

export const useGetDCABot = ({ id }) => {
  return useQuery({
    queryKey: ["getDCABot", id],
    queryFn: () => {
      return getDCABot({ id });
    },
    // select: (data) => {
    //   return data?.result || {};
    // },
  });
};

export const getDCABot = async ({ id }) => {
  try {
    const response = await api({
      method: "GET",
      url: `${DCAbaseUrl}/bots/${id}`,
    });
    console.log(response, id, "response>>>>");

    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const useGetDCABotList = (params = {}) => {
  const { selectExchange } = params;
  return useQuery({
    queryKey: ["getDCBotList", selectExchange],
    queryFn: () => {
      return getDCBotList(selectExchange);
    },
    select: (data) => {
      return data?.data || [];
    },
  });
};

export const getDCBotList = async (selectExchange) => {
  try {
    const response = await api({
      method: "GET",
      url: `${DCAbaseUrl}/bots`,
      params: { exchange: selectExchange },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteDCABot = async ({ id }) => {
  try {
    const response = await api({
      method: "DELETE",
      url: `${DCAbaseUrl}/bots/${id}`,
    });

    return response?.data;
  } catch (error) {
    console.error("Error creating bot:", error);
    throw error;
  }
};

export const updateDCABotStatus = async ({ id, status }) => {
  try {
    const urlToHit =
      status == "running" ? `/bots/${id}/stop` : `/bots/${id}/start`;
    const response = await api({
      method: "POST",
      url: `${DCAbaseUrl}${urlToHit}`,
    });
    console.log(response, "asdasdasd>>");

    return response?.data;
  } catch (error) {
    console.error("Error creating bot:", error);
    throw error;
  }
};

export const useGetDCABotPNL = ({ id }) => {
  return useQuery({
    queryKey: ["useGetDCABotPNL", id],
    queryFn: () => {
      return getDCABotPNL({ id });
    },
  });
};

export const getDCABotPNL = async ({ id }) => {
  try {
    const response = await api({
      method: "GET",
      url: `${DCAbaseUrl}/bots/${id}/pnl`,
    });

    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const useDCAGetLogList = ({ id }) => {
  return useQuery({
    queryKey: ["getDCALogList", id],
    queryFn: () => {
      return getDCALogList({ id });
    },
  });
};

export const getDCALogList = async ({ id }) => {
  try {
    const response = await api({
      method: "GET",
      url: `${DCAbaseUrl}/bot-logs/${id}/logs`,
    });

    return response?.data || [];
  } catch (error) {
    throw error;
  }
};

export const useGetDCAOrder = ({ id, filter }) => {
  return useQuery({
    queryKey: ["getDCAOrder", id, filter],
    queryFn: () => {
      return getDCAOrder({ id, filter });
    },
  });
};

export const getDCAOrder = async ({ id, filter }) => {
  try {
    const response = await api({
      method: "GET",
      url: `${DCAbaseUrl}/bots/${id}/orders`,
    });

    console.log(response, "wdfadfsdfsf");

    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const useGridPNL = ({ id }) => {
  return useQuery({
    queryKey: ["getGridPNL", id],
    queryFn: () => {
      return getGridPNL({ id });
    },
  });
};

const getGridPNL = async ({ id }) => {
  try {
    const response = await api({
      method: "GET",
      url: `${gridBotBaseUrl}/bots/${id}/pnl`,
    });

    return response?.data;
  } catch (error) {
    throw error;
  }
};
