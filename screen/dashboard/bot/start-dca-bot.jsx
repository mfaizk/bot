"use client";
import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Dropdown from "@/components/dropdown";
import StylesTabs from "@/components/style-tab";
import { useRouter, useSearchParams } from "next/navigation";
import {
  deleteDCABot,
  updateBotStatus,
  updateDCABotStatus,
  useDCAGetLogList,
  useGetBot,
  useGetBotList,
  useGetDCABot,
  useGetDCABotPNL,
  useGetDCAOrder,
  useGetLogList,
  useGetOrder,
} from "@/queries/bot";
import { useGetKeysExchange } from "@/queries/exchange";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IconTrashXFilled } from "@tabler/icons-react";
import {
  EditIcon,
  FileWarning,
  Info,
  RefreshCcw,
  TriangleAlert,
} from "lucide-react";
import Modal from "@/components/ui/modal";
import DCABotTrades from "./start-dca-bot-components/trades";
import DCABotLogs from "./start-dca-bot-components/logs";

import { deleteBot } from "@/queries/bot";
import clsx from "clsx";
import { formatCurrency } from "@/utils";
const TradingViewWidget = dynamic(
  () => import("@/components/trading-view-widget"),
  { ssr: false }
);
const tabs = ["Trades", "Logs"];

export default function StartDCABot() {
  const router = useRouter();
  const [active, setActive] = useState("Trades");
  const searchParams = useSearchParams();
  const botId = searchParams.get("botId");

  const [deleteModalState, setDeleteModalState] = useState(false);
  const [currentSelectedItem, setCurrentSelectedItem] = useState({});
  const {
    data: botData,
    isPending: botDataPending,
    refetch: botDataRefetch,
  } = useGetDCABot({ id: botId });
  const { data: botPNL, isLoading: botPNLLoading } = useGetDCABotPNL({
    id: botId,
  });

  const { refetch: filledRefetch, isLoading: filledRefetchloading } =
    useGetDCAOrder({
      id: botId,
    });
  const { refetch: logRefetch, isLoading: logRefetchLoading } =
    useDCAGetLogList({
      id: botId,
    });

  const { data: exchangeData, refetch: exchangeDataRefetch } =
    useGetKeysExchange();

  const {
    mutateAsync: updateBotStatusMutate,
    isPending: updatebotStatusPending,
  } = useMutation({
    mutationFn: () => {
      return updateDCABotStatus({ id: botId, status: botData?.status });
    },
    onSuccess: (data) => {
      botDataRefetch();
      exchangeDataRefetch();
      if (data?.message == 200) {
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
    },
    onError: (data) => {
      console.log(data, "err>>");
    },
  });

  const isBotRunning = useMemo(() => {
    return botData?.status == "running";
  }, [botData]);

  return (
    <div className="min-h-screen  text-gray-200">
      <div className="">
        <div className="flex flex-col gap-6 py-10">
          {/* MAIN CONTENT (no sidebar) */}
          <main className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Chart & controls (span 2 columns on large screens) */}
            <section className="col-span-1 lg:col-span-2 bg-[#0f0f11] rounded-2xl p-6 shadow-lg border border-[#1b1b1e]">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">
                  Bot Status:{" "}
                  {isBotRunning ? (
                    <span className="text-green-700">Running</span>
                  ) : (
                    <span className="text-red-600">Offline</span>
                  )}
                  <span> </span>
                </h1>
              </div>

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-1 gap-6">
                <div className="lg:col-span-2">
                  <div className=" h-[500px]">
                    <TradingViewWidget symbol={botData?.symbol} />
                  </div>

                  <div className=" flex items-start justify-center mt-12">
                    <div className="w-full max-w-4xl">
                      <div className=" rounded-2xl shadow-xl ring-1 ring-white/6 overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/5 relative">
                          <StylesTabs
                            tabs={tabs}
                            active={active}
                            setActive={setActive}
                          />
                          <div className="absolute top-4 right-8 z-50 hidden md:flex">
                            <RefreshCcw
                              onClick={() => {
                                filledRefetch();
                                logRefetch();
                              }}
                              className={clsx(
                                "cursor-pointer",
                                (filledRefetchloading || logRefetchLoading) &&
                                  "animate-spin"
                              )}
                            />
                          </div>
                        </div>
                        {/* {active == "Orders" && <GridBotOrders botId={botId} />} */}
                        {active == "Trades" && <DCABotTrades botId={botId} />}
                        {active == "Logs" && <DCABotLogs botId={botId} />}
                        {/* {active == "Cancelled" && (
                          <GridBotCancelledOrder botId={botId} />
                        )} */}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block">
                  <div className="bg-[#0b0b0d] border border-[#151518] rounded-xl p-4 text-sm leading-6">
                    <h3 className="font-semibold mb-2">About DCA Bot</h3>
                    <p className="text-gray-400">
                      This DCA bot automatically buys in multiple small entries
                      instead of one large order. It helps reduce the average
                      entry price during market dips and controls risk using
                      your defined buy size, max allocation, and safety
                      settings.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Right: Form */}
            <aside className="bg-[#0f0f11] rounded-2xl p-6 shadow-lg border border-[#1b1b1e] ">
              <div className="flex items-center justify-between mb-4">
                {/* <div className="text-lg font-semibold">
                  {botData?.botName || "--"}
                </div> */}
                <div className="text-sm text-gray-400">#{botData?.id}</div>
              </div>

              <div className="space-y-6">
                {/* Portfolio Size (USD) */}
                <div className="flex justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    Portfolio Size (USD)
                    <div className="relative group">
                      <Info
                        size={14}
                        className="text-gray-400 cursor-pointer hover:text-gray-200"
                      />
                      <div className="absolute left-1/2 -translate-x-1/2 top-5 hidden group-hover:block bg-gray-800 text-gray-200 text-xs p-2 rounded-md shadow-lg w-64 z-10">
                        The amount of USDT you are allocating to this bot (the
                        bot’s working balance). This is the base amount used to
                        compute all percentage fields below — and the bot will
                        treat it as the capital you give it to trade (a
                        reference + cap for calculations).
                      </div>
                    </div>
                  </div>
                  <div className="text-base text-white">
                    {botData?.config?.portfolioUsd || 0}
                  </div>
                </div>

                {/* Buy Amount per Entry (%) */}
                <div className="flex justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    Buy Amount per Entry (%)
                    <div className="relative group">
                      <Info
                        size={14}
                        className="text-gray-400 cursor-pointer hover:text-gray-200"
                      />
                      <div className="absolute left-1/2 -translate-x-1/2 top-5 hidden group-hover:block bg-gray-800 text-gray-200 text-xs p-2 rounded-md shadow-lg w-64 z-10">
                        Percentage of the Portfolio Size the bot should attempt
                        to spend on each DCA buy. Example: 5% means each planned
                        buy equals 5% of the Portfolio Size.
                      </div>
                    </div>
                  </div>
                  <div className="text-base text-white">
                    {botData?.config?.perBuyPct || 0}
                  </div>
                </div>

                {/* Maximum DCA Entries */}
                <div className="flex justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    Maximum DCA Entries
                    <div className="relative group">
                      <Info
                        size={14}
                        className="text-gray-400 cursor-pointer hover:text-gray-200"
                      />
                      <div className="absolute left-1/2 -translate-x-1/2 top-5 hidden group-hover:block bg-gray-800 text-gray-200 text-xs p-2 rounded-md shadow-lg w-64 z-10">
                        The *Maximum Number of DCA Buy Attempts* defines how
                        many additional buys the bot can make after the first
                        entry, stopping earlier if the Maximum total allocation
                        is used up. The *1st entry* happens when the bot starts
                        (if Smart Indicator is off) or when the Smart Indicator
                        condition becomes true (if it’s on). The *2nd entry*
                        occurs when the price drops *10% or more* from the last
                        entry price. The *3rd entry* occurs when the price drops
                        *15% or more* from the last entry price. These DCA
                        entries help lower the overall average buy price.
                      </div>
                    </div>
                  </div>
                  <div className="text-base text-white">
                    {botData?.config?.maxEntries || 0}
                  </div>
                </div>

                {/* Take Profit (%) */}
                <div className="flex justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    Take Profit (%)
                    <div className="relative group">
                      <Info
                        size={14}
                        className="text-gray-400 cursor-pointer hover:text-gray-200"
                      />
                      <div className="absolute left-1/2 -translate-x-1/2 top-5 hidden group-hover:block bg-gray-800 text-gray-200 text-xs p-2 rounded-md shadow-lg w-64 z-10">
                        Percent profit at which the bot will close the position
                        and take profit.
                      </div>
                    </div>
                  </div>
                  <div className="text-base text-white">
                    {botData?.config?.takeProfitPct || 0}
                  </div>
                </div>

                {/* Stop Loss (%) */}
                <div className="flex justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    Stop Loss (%)
                    <div className="relative group">
                      <Info
                        size={14}
                        className="text-gray-400 cursor-pointer hover:text-gray-200"
                      />
                      <div className="absolute left-1/2 -translate-x-1/2 top-5 hidden group-hover:block bg-gray-800 text-gray-200 text-xs p-2 rounded-md shadow-lg w-64 z-10">
                        Percent loss at which the bot will close the position to
                        limit losses.
                      </div>
                    </div>
                  </div>
                  <div className="text-base text-white">
                    {botData?.config?.stopLossPct || 0}
                  </div>
                </div>

                {/* Minimum Order Size (USD) */}
                <div className="flex justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    Minimum Order Size (USD)
                    <div className="relative group">
                      <Info
                        size={14}
                        className="text-gray-400 cursor-pointer hover:text-gray-200"
                      />
                      <div className="absolute left-1/2 -translate-x-1/2 top-5 hidden group-hover:block bg-gray-800 text-gray-200 text-xs p-2 rounded-md shadow-lg w-64 z-10">
                        The smallest valid order size (exchange rule or your
                        choice). If a calculated buy amount is below this value,
                        the bot will use the minimum order size logic described
                        below.
                      </div>
                    </div>
                  </div>
                  <div className="text-base text-white">
                    {botData?.config?.minOrderUsd || 0}
                  </div>
                </div>

                {/* Maximum Total Allocation (%) */}
                <div className="flex justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    Maximum Total Allocation (%)
                    <div className="relative group">
                      <Info
                        size={14}
                        className="text-gray-400 cursor-pointer hover:text-gray-200"
                      />
                      <div className="absolute left-1/2 -translate-x-1/2 top-5 hidden group-hover:block bg-gray-800 text-gray-200 text-xs p-2 rounded-md shadow-lg w-64 z-10">
                        The hard cap (percent of Portfolio Size) that the bot
                        may spend across all DCA entries. Even if maxEntries is
                        larger, the bot will never spend more than this total
                        percent of the Portfolio Size.
                      </div>
                    </div>
                  </div>
                  <div className="text-base text-white">
                    {botData?.config?.maxAllocPct || 0}
                  </div>
                </div>

                {/* Pair */}
                <div className="flex justify-between">
                  <div className="text-sm text-gray-400 mb-1">Pair</div>
                  <div className="text-base text-white capitalize">
                    {botData?.pair || "--"}
                  </div>
                </div>

                {/* Exchange Name */}
                <div className="flex justify-between">
                  <div className="text-sm text-gray-400 mb-1">
                    Exchange Name
                  </div>
                  <div className="text-base text-white capitalize">
                    {botData?.config?.exchangeName || "--"}
                  </div>
                </div>
                {/* Buttons + PnL unchanged */}
                <button
                  className={clsx(
                    "w-full mt-2 py-3 rounded-xl text-white font-semibold  transition-all capitalize",
                    Number(botPNL?.realized?.realizedPnl || 0) == 0
                      ? "bg-pink-600 hover:bg-pink-700"
                      : "bg-pink-600/50 hover:bg-pink-600/50"
                  )}
                  onClick={() => {
                    if (Number(botPNL?.realized?.realizedPnl || 0) == 0) {
                      updateBotStatusMutate();
                    }
                  }}
                  disabled={updatebotStatusPending}
                >
                  {updatebotStatusPending ? (
                    "Processing..."
                  ) : (
                    <>
                      {Number(botPNL?.realized?.realizedPnl || 0) == 0 ? (
                        <>{isBotRunning ? "Stop" : "Start"} Bot</>
                      ) : (
                        <>
                          Achived PNL:{" "}
                          {Number(botPNL?.realized?.realizedPnl)?.toFixed(6)}
                        </>
                      )}
                    </>
                  )}
                </button>

                <div className="space-y-3 text-sm">
                  {/* Avg Entry Price */}
                  <div className="flex justify-between text-gray-400">
                    <span>Avg Entry Price</span>
                    <span className="text-white">
                      ${" "}
                      {Number(botPNL?.unrealized?.avgEntryPrice || 0).toFixed(
                        4
                      )}
                    </span>
                  </div>

                  {/* Current Price */}
                  <div className="flex justify-between text-gray-400">
                    <span>Current Price</span>
                    <span className="text-white">
                      ${" "}
                      {Number(botPNL?.unrealized?.currentPrice || 0).toFixed(4)}
                    </span>
                  </div>

                  {/* Unrealized PnL */}
                  <div className="flex justify-between text-gray-400">
                    <span>Unrealized P&amp;L</span>
                    <span
                      className={
                        botPNL?.unrealized?.unrealizedPnl < 0
                          ? "text-red-500"
                          : "text-green-500"
                      }
                    >
                      ${" "}
                      {Number(botPNL?.unrealized?.unrealizedPnl || 0).toFixed(
                        4
                      )}
                      <span className="ml-1 text-xs text-gray-400">
                        (
                        {Number(
                          botPNL?.unrealized?.unrealizedPnlPct || 0
                        ).toFixed(2)}
                        %)
                      </span>
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/10 my-2" />

                  {/* Realized PnL + Delete */}
                  <div className="flex justify-between items-center">
                    <p className="text-gray-400">
                      Realized P&amp;L:{" "}
                      <span
                        className={
                          botPNL?.realized?.realizedPnl < 0
                            ? "text-red-500"
                            : "text-green-500"
                        }
                      >
                        ${" "}
                        {Number(botPNL?.realized?.realizedPnl || 0).toFixed(2)}
                      </span>
                    </p>

                    <IconTrashXFilled
                      onClick={() => {
                        setCurrentSelectedItem(null);
                        setDeleteModalState(true);
                      }}
                      color="red"
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </aside>
          </main>
        </div>
      </div>
      {deleteModalState && (
        <DeleteModal
          open={deleteModalState}
          setOpen={setDeleteModalState}
          botId={botId}
        />
      )}
    </div>
  );
}

const DeleteModal = ({ open, setOpen, botId }) => {
  const router = useRouter();
  const { refetch } = useGetBotList();
  const queryclient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => {
      return deleteDCABot({ id: botId });
    },
    onSuccess: (data) => {
      if (data?.ok) {
        toast.success(data?.message);
        queryclient.invalidateQueries({ queryKey: ["getDCBotList"] });
        router.replace("/dashboard/bot");
      } else {
        toast.error(data?.message || "Something went wrong.");
      }
      setOpen(false);
      if (refetch) {
        refetch();
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.responseMessage);
      setOpen(false);
      if (refetch) {
        refetch();
      }
    },
  });

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="flex items-center justify-center flex-col">
        <div className="flex items-center gap-4">
          <TriangleAlert />

          <p className="font-semibold text-2xl">Confirmation</p>
        </div>
        <p className="mt-6 text-xl">
          Are you sure you want to delete this bot?
        </p>
        <p className="mt-2">
          Deleting this bot will permanently remove all orders and profile
          history. This action can't be undone.
        </p>
        <div className="w-full mt-4 flex flex-row gap-4 ">
          <button
            className="bg-gray-300 w-full flex justify-center items-center h-10 rounded text-black"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 w-full flex justify-center items-center h-10 rounded"
            onClick={mutateAsync}
            disabled={isPending}
          >
            {isPending ? `Processing...` : `Confirm`}
          </button>
        </div>
      </div>
    </Modal>
  );
};
