"use client";
import { invoiceAtom } from "@/const/atoms";
import { IconCircleDashedCheck } from "@tabler/icons-react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { formatCurrency } from "@/utils";

const SuccessPayment = () => {
  const router = useRouter();
  const [invoiceData, setInvoiceAtom] = useAtom(invoiceAtom);

  const profitCaptrimValue = useMemo(() => {
    const result = invoiceData?.permission?.find((item) =>
      item.includes("Profitcap:")
    );
    const value = result?.split(":")[1]?.trim();

    return value;
  }, [invoiceData]);
  const exchangeType = useMemo(() => {
    const result = invoiceData?.permission?.find((item) =>
      item.includes("Exchange:")
    );
    const value = result?.split(":")[1]?.trim();

    return value;
  }, [invoiceData]);

  const trunkData = (text) => {
    if (!text || text.length <= 6) return text;
    return text.slice(0, 3) + "*****" + text.slice(-3);
  };

  console.log(invoiceData, "invoiceData>>");
  useEffect(() => {
    if (Object.keys(invoiceData)?.length < 1) {
      router.replace("/dashboard/pricing");
    }
    return () => {
      console.log("cleaned<>>>>");

      // setInvoiceAtom({});
    };
  }, []);

  return (
    <div className="container mx-auto flex items-center justify-center mt-20">
      <div className="flex flex-col ">
        <h3 className="font-bold text-3xl">Payment Successful</h3>
        <div className="flex flex-col lg:flex-row  mt-6 gap-4">
          <div className="flex flex-col bg-primary/10 lg:min-w-sm rounded-2xl p-4 gap-4 py-6 border border-primary/20">
            <p className="font-semibold text-xl">Your Plan</p>
            <div className="flex gap-2 flex-col border-t border-t-primary">
              <p className="font-semibold text-xl mt-4">
                {invoiceData?.name} Plan
              </p>
              <div className="flex gap-6 font-medium text-lg">
                <div className="flex gap-1 flex-col w-full">
                  <div className="flex flex-row justify-between w-full">
                    <p>Duration:</p>
                    <p>
                      {invoiceData?.duration || ""} {"days"}
                    </p>
                  </div>
                  <div className="flex flex-row justify-between w-full">
                    <p>Profit Cap:</p>
                    <p>{profitCaptrimValue || ""}</p>
                  </div>
                  <div className="flex flex-row justify-between w-full">
                    <p>Exchange:</p>
                    <p>{exchangeType || ""}</p>
                  </div>
                  <div className="flex flex-row justify-between w-full">
                    <p>Payment Method:</p>
                    <p>
                      {invoiceData?.invoiceData?.txHash
                        ? "QIE Wallet"
                        : "PayPal"}
                    </p>
                  </div>
                  <div className="flex flex-row justify-between w-full">
                    <p>
                      {invoiceData?.invoiceData?.txHash
                        ? "TX Hash:"
                        : "Transaction ID:"}
                    </p>
                    <p>
                      {trunkData(invoiceData?.invoiceData?.txHash) ||
                        invoiceData?.invoiceData?.id}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:max-w-sm lg:min-w-sm rounded-2xl  p-4 gap-4 py-6 h-fit items-center text-center">
            <IconCircleDashedCheck
              size={200}
              className="text-purple-500 drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]"
            />
            <p className="text-3xl">Payment Successful</p>
            <p>
              Your membership is live. You now have access to exclusive trading
              tools, advanced analytics, and priority support.
            </p>
            <p> 📊 Let’s elevate your trading journey!</p>
            <button
              className="h-10 rounded bg-primary w-full"
              onClick={() => {
                router.replace("/dashboard/home");
              }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPayment;
