import { useQuery } from "@tanstack/react-query";
import { api } from "../service/api-service";

export const createPayPalOrder = async ({ amount, currency }) => {
  try {
    console.log(amount, currency, "asdasdasdsa");

    const response = await api({
      method: "POST",
      url: "/paypal/orders",
      data: {
        value: amount,
        currency: currency,
      },
    });
    console.log(response, "createPayPalOrder>>>");

    return response?.data?.id;
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    throw error;
  }
};
export const capturOrderPaypal = async ({ subscriptionId, orderID }) => {
  try {
    const response = await api({
      method: "POST",
      url: `/paypal/orders/${orderID}/capture`,
      data: {
        subscriptionId: subscriptionId,
      },
    });
    console.log(response?.data, "response>>>");

    return response?.data;
  } catch (error) {
    console.error("Error in order capture:", error);
    throw error?.response?.data;
  }
};

export const useGenerateInvoice = ({ amount, currency, subscriptionId }) => {
  return useQuery({
    queryKey: ["generateInvoice", amount, currency, subscriptionId],
    queryFn: () => {
      return generateInvoice({ amount, currency, subscriptionId });
    },
  });
};

export const generateInvoice = async ({ amount, currency, subscriptionId }) => {
  try {
    const response = await api({
      method: "POST",
      url: "/qie/generateInvoice",
      data: {
        amount: amount,
        currency: currency,
        subscriptionId: String(subscriptionId),
      },
    });

    return response?.data;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};

export const getInvoiceStatus = async ({ invoiceId, walletAddress }) => {
  try {
    const response = await api({
      method: "POST",
      url: "/qie/getInvoiceStatus",
      data: {
        invoiceId,
        walletAddress,
      },
    });

  
    
    if (response?.data?.result?.status == "COMPLETED") {
      return response?.data?.result;
    } else {
      throw new Error("Invoice not paid yet");
    }
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};
export const useHaveActiveSubscriptions = () => {
  return useQuery({
    queryKey: ["useHaveActiveSubscriptions"],
    queryFn: () => {
      return getSubscriptionDetail();
    },
    select: (data) => {
      const active = data?.some(
        (item) => item?.subscriptionDetail?.status == "ACTIVE"
      );
      return active;
    },
  });
};

export const useGetSubscriptionDetail = () => {
  return useQuery({
    queryKey: ["getSubscriptionDetail"],
    queryFn: () => {
      return getSubscriptionDetail();
    },
  });
};

export const getSubscriptionDetail = async () => {
  try {
    const response = await api({
      method: "GET",
      url: "/subscription/getSubscriptionDetail",
    });
    return response?.data?.result || [];
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};
