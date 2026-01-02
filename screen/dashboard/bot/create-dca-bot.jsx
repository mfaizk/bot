"use client";
import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Dropdown from "@/components/dropdown";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { createBot, createDCABots, useGetSymbolList } from "@/queries/bot"; // <-- import your API function
import { toast } from "sonner";
import { useGetKeysExchange } from "@/queries/exchange";
import { Info } from "lucide-react";
const TradingViewWidget = dynamic(
  () => import("@/components/trading-view-widget"),
  { ssr: false }
);

const validationSchema = Yup.object({
  portfolioUsd: Yup.number()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue === null) return undefined;
      return Number(originalValue);
    })
    .typeError("Portfolio USD must be a number")
    .required("Portfolio USD is required")
    .positive("Portfolio USD must be positive")
    .min(100, "Portfolio USD must be at least 100 USD"),

  perBuyPct: Yup.number()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue === null) return undefined;
      return Number(originalValue);
    })

    .typeError("Buy percent must be a number")
    .positive("Must be positive")
    .required("Buy percent is required")
    .min(1, "Min 1%")
    .max(100, "Max 100%"),
  maxEntries: Yup.number()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue === null) return undefined;
      return Number(originalValue);
    })
    .typeError("Max Entries must be a number")
    .positive("Must be positive")
    .required("Max Entries is required")
    .min(1, "Min 1 Entries required")
    .max(3, "Max 3 Entries required"),
  minOrderUsd: Yup.number()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue === null) return undefined;
      return Number(originalValue);
    })
    .typeError("Min order size must be a number")
    .positive("Must be positive")
    .required("Min order size is required")
    .min(10, "Min 10 USD order size is required"),
  maxAllocPct: Yup.number()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue === null) return undefined;
      return Number(originalValue);
    })
    .typeError("Max allocation must be a number")
    .positive("Must be positive")
    .required("Max allocation in % is required")
    .min(5, "Min 5% required")
    .max(100, "Max 100% required"),

  stopLossPct: Yup.number()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue === null) return undefined;
      return Number(originalValue);
    })
    .typeError("Stop loss percent must be a number")
    // .integer("Must be an integer")
    .required("Stop loss percent are required")
    .min(0.1, "Min 0.1% required")
    .max(50, "Max 50% required"),
  takeProfitPct: Yup.number()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue === null) return undefined;
      return Number(originalValue);
    })
    .typeError("Take profit percent must be a number")
    // .integer("Must be an integer")
    .required("Take profit percent are required")
    .min(0.1, "Min 0.1% required")
    .max(100, "Max 100% required"),
});

export default function CreateDCABot() {
  const router = useRouter();
  const [selectedExchange, setSelectedExchange] = useState("");
  const [pair, setPair] = useState("");
  const { data: exchangeList, isPending: exchangeListPending } =
    useGetKeysExchange();

  const exchangeName = useMemo(() => {
    return exchangeList?.find((item) => item?.id == selectedExchange)?.exchange;
  }, [exchangeList, selectedExchange]);

  const { data: pairData, isPending: pairDataPending } = useGetSymbolList({
    exchange: exchangeName,
  });

  const { mutateAsync: handleCreateBot, isPending } = useMutation({
    mutationFn: createDCABots,
    onSuccess: (data) => {
      if (data?.id) {
        toast.success(data?.responseMessage || "DCA Bot Created Successfully!");
        router.push(
          `/dashboard/bot/start-dca-bot/?botId=${encodeURIComponent(data?.id)}`
        );
      } else {
        toast.error(data?.responseMessage || "Failed to create bot!");
      }
    },
    onError: (error) => {
      console.log(error, "errorerror");

      toast.error(error?.response?.data?.error || "Failed to create bot!");
      console.error("Error creating bot:", error);
    },
  });

  const formik = useFormik({
    initialValues: {
      portfolioUsd: "500",
      perBuyPct: "5",
      maxEntries: 3,
      minOrderUsd: "10",
      maxAllocPct: "20",
      stopLossPct: "25",
      takeProfitPct: "30",
      enableIndicators: false,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      if (!selectedExchange || !pair) {
        toast.error("Please select an exchange and pair");
        return;
      }

      const payload = {
        pair: pair,

        portfolioUsd: Number(values.portfolioUsd),
        perBuyPct: Number(values.perBuyPct),
        maxEntries: Number(values.maxEntries),
        takeProfitPct: Number(values.takeProfitPct),
        stopLossPct: Number(values.stopLossPct),
        minOrderUsd: Number(values.minOrderUsd),
        maxAllocPct: Number(values.maxAllocPct),
        enableIndicators: values.enableIndicators ? 1 : 0,
        exchangeName: exchangeName,
      };

      await handleCreateBot(payload);
    },
  });

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
                <h1 className="text-3xl font-bold">Create DCA Bot</h1>
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
                </div>

                <div className="space-y-4">
                  {[
                    {
                      name: "portfolioUsd",
                      label: "Portfolio Size (USD)",
                      tooltipInfo:
                        "The amount of USDT you are allocating to this bot (the bot’s working balance).This is the base amount used to compute all percentage fields below — and the bot will treat it as the capital you give it to trade (a reference + cap for calculations).",
                      placeholder: "e.g. 500",
                    },
                    {
                      name: "perBuyPct",
                      label: "Buy Amount per Entry (% of Portfolio)",
                      tooltipInfo:
                        "Percentage of the Portfolio Size the bot should attempt to spend on each DCA buy.Example: 5% means each planned buy equals 5% of the Portfolio Size.",
                      placeholder: "e.g. 5",
                    },
                    {
                      name: "maxEntries",
                      label: "Maximum DCA Entries",
                      tooltipInfo:
                        "The *Maximum Number of DCA Buy Attempts* defines how many additional buys the bot can make after the first entry, stopping earlier if the Maximum total allocation is used up. The *1st entry* happens when the bot starts (if Smart Indicator is off) or when the Smart Indicator condition becomes true (if it’s on). The *2nd entry* occurs when the price drops *10% or more* from the last entry price. The *3rd entry* occurs when the price drops *15% or more* from the last entry price. These DCA entries help lower the overall average buy price.",
                      placeholder: "e.g. 3",
                    },
                    {
                      name: "takeProfitPct",
                      label: "Take Profit (%)",
                      tooltipInfo:
                        "Percent profit at which the bot will close the position and take profit..",
                      placeholder: "e.g. 2",
                    },
                    {
                      name: "stopLossPct",
                      label: "Stop Loss (%)",
                      tooltipInfo:
                        "Percent loss at which the bot will close the position to limit losses.",
                      placeholder: "e.g. 1",
                    },
                    {
                      name: "minOrderUsd",
                      label: "Minimum Order Size (USD)",
                      tooltipInfo:
                        "The smallest valid order size (exchange rule or your choice). If a calculated buy amount is below this value, the bot will use the minimum order size logic described below.",
                      placeholder: "e.g. 10",
                    },
                    {
                      name: "maxAllocPct",
                      label: "Maximum Total Allocation (%)",
                      tooltipInfo:
                        "The hard cap (percent of Portfolio Size) that the bot may spend across all DCA entries.Even if maxEntries is larger, the bot will never spend more than this total percent of the Portfolio Size.",
                      placeholder: "e.g. 50",
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

                  <div>
                    <Toggle
                      name="enableIndicators"
                      label="Enable Smart Indicators"
                      tooltip={
                        "When enabled, the bot uses EMA-200 (4H), RSI (4H), and BTC (1H) trend checks before placing new entries only.This helps the bot avoid entering during downtrends, overbought zones, or weak BTC conditions.Indicators do not affect already-running positions."
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full mt-2 py-3 rounded-xl text-white font-semibold disabled:opacity-50"
                    style={{ background: "var(--color-primary)" }}
                  >
                    {isPending ? "Creating..." : "Create DCA Bot"}
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
