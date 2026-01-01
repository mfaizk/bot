"use client";
import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Dropdown from "@/components/dropdown";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { createBot, useGetSymbolList } from "@/queries/bot"; // <-- import your API function
import { toast } from "sonner";
import { useGetKeysExchange } from "@/queries/exchange";
import { Info } from "lucide-react";
const TradingViewWidget = dynamic(
  () => import("@/components/trading-view-widget"),
  { ssr: false }
);

const validationSchema = Yup.object({
  gridLower: Yup.number()
    .typeError("Low price must be a number")
    .positive("Must be positive")
    .required("Low price is required"),
  gridLower: Yup.number()
    .typeError("Low price must be a number")
    .positive("Must be positive")
    .required("Low price is required"),
  gridUpper: Yup.number()
    .typeError("High price must be a number")
    .positive("Must be positive")
    .required("High price is required"),
  investment: Yup.number()
    .typeError("Quantity must be a number")
    .positive("Must be positive")
    .min(10, "Minimum must be 10 USD")
    .required("Quantity per grid is required"),
  gridCount: Yup.number()
    .typeError("Grid levels must be a number")
    .integer("Must be an integer")
    .required("Grid levels are required"),
  investment: Yup.number()
    .typeError("Investment must be a number")
    .integer("Must be an integer")
    .required("Investment are required"),
  orderSize: Yup.number()
    .typeError("orderSize must be a number")
    // .integer("Must be an integer")
    .required("orderSize are required"),
  stopLossPrice: Yup.number()
    .typeError("stopLossPrice must be a number")
    // .integer("Must be an integer")
    .required("stopLossPrice are required"),
});

export default function CreateGridBot() {
  const router = useRouter();
  const [selectedExchange, setSelectedExchange] = useState("");
  const [pair, setPair] = useState("");
  const { data: exchangeList, isPending: exchangeListPending } =
    useGetKeysExchange();
  const { data: pairData, isPending: pairDataPending } = useGetSymbolList({
    exchange: selectedExchange,
  });

  const { mutateAsync: handleCreateBot, isPending } = useMutation({
    mutationFn: createBot,
    onSuccess: (data) => {
      router.push(
        `/dashboard/bot/start-grid-bot/?botId=${encodeURIComponent(data?.id)}`
      );
      toast.success("Bot created successfully.");
    },
    onError: (error) => {
      console.log(error, "errorerror");

      toast.error(error?.response?.data?.message || "Failed to create bot!");
      console.error("Error creating bot:", error);
    },
  });

  const formik = useFormik({
    initialValues: {
      gridLower: "",
      gridUpper: "",
      investment: 10,
      gridCount: 6,
      orderSize: 2,
      enableIndicators: false,
      stopLossPrice: "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      if (!selectedExchange || !pair) {
        toast.error("Please select an exchange and pair");
        return;
      }

      const payload = {
        exchange: selectedExchange,
        symbol: pair,
        gridLower: Number(values.gridLower),
        gridUpper: Number(values.gridUpper),
        gridCount: Number(values.gridCount),
        investment: Number(values.investment),
        orderSize: Number(values.orderSize),
        enableIndicators: values.enableIndicators,
        stopLossPrice: values.stopLossPrice,
      };

      await handleCreateBot(payload);
    },
  });

  const buySellValue = useMemo(() => {
    const level = Number(formik?.values?.gridCount || 0);
    if (level > 0) {
      const equalDivide = level / 2;
      const buy = Math.ceil(equalDivide);
      const sell = Math.floor(equalDivide);
      return {
        buy,
        sell,
      };
    }

    return {
      buy: 0,
      sell: 0,
    };
  }, [formik?.values?.gridCount]);

  const Toggle = ({ name, label, tooltip }) => {
    const value = formik.values[name];

    return (
      <div className="flex items-center justify-between bg-[#191921] border border-[#17171a] rounded-xl p-3">
        <div>
          <div className="flex flex-row gap-2">
            <div className="text-xs text-gray-400">{label}</div>
            <div className="relative group">
              <Info
                size={16}
                className="text-gray-400 cursor-pointer hover:text-gray-200"
              />
              <div className="absolute left-1/2 -translate-x-1/2 top-6 hidden group-hover:block bg-gray-800 text-gray-200 text-xs p-2 rounded-md shadow-lg w-64 z-10">
                {tooltip}
              </div>
            </div>
          </div>
          <div className="font-medium mt-1">{value ? "Yes" : "No"}</div>
        </div>

        <button
          type="button"
          onClick={() => formik.setFieldValue(name, !value)}
          aria-pressed={value}
          className="relative inline-flex h-7 w-14 cursor-pointer rounded-full transition-colors duration-300 focus:outline-none"
          style={{
            backgroundColor: value ? "#ee3379" : "#151518",
            boxShadow: !value
              ? "0 0 0 4px rgba(244,63,94,0.06)"
              : "0 0 10px rgba(225,29,72,0.4)",
          }}
        >
          <span
            className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white transform transition-transform duration-300 ${
              value ? "translate-x-7" : ""
            }`}
            style={{
              boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
            }}
          />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen text-gray-200">
      <div className="">
        <div className="flex flex-col gap-6 py-10">
          <main className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="col-span-1 lg:col-span-2 bg-[#0f0f11] rounded-2xl p-6 shadow-lg border border-[#1b1b1e]">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Create Grid Bot</h1>
                <div className="flex-col md:flex space-x-4 items-center gap-3">
                  <Dropdown
                    label="Exchange"
                    options={exchangeList?.map((item) => {
                      return {
                        label: item?.exchange,
                        value: item?.exchange,
                        icon: item?.icon,
                      };
                    })}
                    value={selectedExchange || ""}
                    onSelect={(val) => setSelectedExchange(val)}
                    className="w-50"
                  />
                  <Dropdown
                    label="Pair"
                    options={pairData?.map((item) => {
                      return {
                        label: item?.symbol,
                        value: item?.symbol,
                      };
                    })}
                    value={pair || ""}
                    disabled={!selectedExchange}
                    onSelect={(val) => {
                      setPair(val);
                    }}
                    className="w-50"
                  />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-1 gap-6">
                <div className="lg:col-span-2">
                  <div className="h-[500px]">
                    <TradingViewWidget symbol={pair || "BTC/USDT"} />
                  </div>
                </div>
              </div>
            </section>

            <aside className="bg-[#0f0f11] rounded-2xl p-6 shadow-lg border border-[#1b1b1e]">
              <form onSubmit={formik.handleSubmit}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-semibold">Fast Form</div>
                  {/* <div className="text-sm text-gray-400">Advanced form</div> */}
                </div>

                <div className="space-y-4">
                  {[
                    {
                      name: "gridLower",
                      label: "Grid Lower",
                      tooltipInfo:
                        "This is the lowest price level where the bot is allowed to place buy orders. The bot is long-only and will never buy above the current market price. All buy orders are placed between the current market price and this lower limit. This value defines how far downward the bot is willing to accumulate the asset during price dips.",
                      placeholder: "Enter the lower range",
                    },
                    {
                      name: "gridUpper",
                      label: "Grid Upper",
                      tooltipInfo:
                        "This represents the maximum take-profit price of the grid. After a buy order is filled, the bot sells the asset at the next higher grid level, capturing profit as price moves upward. When the price reaches the highest grid level, the bot executes a sell and completes that grid cycle. This value defines the upper profit boundary of the strategy.",
                      placeholder: "Enter the higher range",
                    },
                    {
                      name: "investment",
                      label: "Investment",
                      tooltipInfo:
                        "This value represents the intended capital allocation for the bot and helps you plan how much balance you want to dedicate to this strategy. At present, this amount is informational only and is not strictly enforced by the bot during order placement. Actual trades are executed based on the configured order size and the available balance on the exchange, so the bot may use more or less than this amount depending on market conditions and open orders.",
                      placeholder: "10",
                    },
                    {
                      name: "stopLossPrice",
                      label: "Stop Loss Price",
                      tooltipInfo:
                        "This is an optional emergency protection level. If the market price falls to or below this value, the bot immediately cancels all open orders, sells any remaining balance at market price, and stops execution. This helps protect capital during sharp or unexpected market drops.",
                      placeholder: "10",
                    },
                    {
                      name: "orderSize",
                      label: "Order Size",
                      tooltipInfo:
                        "This specifies the amount used for each individual buy order placed by the bot. Every grid buy uses this fixed quantity. Smaller order sizes result in more granular trades, while larger sizes increase exposure per trade. This value must be compatible with the exchange’s minimum order requirements.",
                      placeholder: "10",
                    },
                    {
                      name: "gridCount",
                      label: "Grids Count",
                      tooltipInfo:
                        "This determines how many grid levels are created between the lower and upper prices. Each grid level represents a buy-then-sell cycle. Increasing the grid count results in smaller price gaps and more frequent trades, while fewer grids result in larger price gaps and fewer trades. The grid levels are evenly distributed across the price range.",
                      placeholder: "10",
                    },
                  ].map((f) => (
                    <label key={f.name} className="block">
                      <div className="flex items-center gap-2 text-md text-gray-400 mb-1">
                        <span>{f.label}</span>

                        {f.tooltipInfo && (
                          <div className="relative group">
                            <Info
                              size={16}
                              className="text-gray-400 cursor-pointer hover:text-gray-200"
                            />
                            <div className="absolute left-1/2 -translate-x-1/2 top-5 hidden group-hover:block bg-gray-800 text-gray-200 text-xs p-2 rounded-md shadow-lg w-64 z-10">
                              {f.tooltipInfo}
                            </div>
                          </div>
                        )}
                      </div>
                      <input
                        name={f.name}
                        value={formik.values[f.name]}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full p-3 bg-[#1A1A24] rounded focus:outline-none"
                        placeholder={f.placeholder}
                      />
                      {formik.touched[f.name] && formik.errors[f.name] && (
                        <div className="text-red-500 text-xs mt-1">
                          {formik.errors[f.name]}
                        </div>
                      )}
                    </label>
                  ))}
                  {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xl:gap-32">
                    <div className="flex items-center justify-between bg-[#191921] border border-[#17171a] rounded-xl p-3">
                      <div className="text-sm text-green-400">Buy Orders:</div>
                      <div className="font-medium mt-1 text-green-400">
                        {buySellValue?.buy}
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-[#191921] border border-[#17171a] rounded-xl p-3">
                      <div className="text-sm text-red-400">Sell Orders:</div>
                      <div className="font-medium mt-1 text-red-400">
                        {buySellValue?.sell}
                      </div>
                    </div>
                  </div> */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Toggle
                      name="enableIndicators"
                      label="Enable Smart Indicators"
                      tooltip={
                        "When enabled, the bot will not start immediately. Instead, it waits until all predefined technical indicator conditions are satisfied. These include trend, momentum, and market strength checks. If conditions are not met, the bot remains in a waiting state and automatically rechecks the indicators at regular intervals before starting."
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full mt-2 py-3 rounded-xl text-white font-semibold disabled:opacity-50"
                    style={{ background: "var(--color-primary)" }}
                  >
                    {isPending ? "Creating..." : "Create Grid Bot"}
                  </button>
                </div>
              </form>
            </aside>
          </main>
        </div>
      </div>
    </div>
  );
}
