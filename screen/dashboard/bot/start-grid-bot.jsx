"use client";
import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Dropdown from "@/components/dropdown";
import StylesTabs from "@/components/style-tab";
import { useRouter, useSearchParams } from "next/navigation";
import {
  updateBotStatus,
  useGetBot,
  useGetBotList,
  useGetLogList,
  useGetOrder,
  useGridPNL,
} from "@/queries/bot";
import { useGetKeysExchange } from "@/queries/exchange";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { IconTrashXFilled } from "@tabler/icons-react";
import {
  Delete,
  EditIcon,
  FileWarning,
  Info,
  RefreshCcw,
  Trash,
  TriangleAlert,
} from "lucide-react";
import Modal from "@/components/ui/modal";
import GridBotOrders from "./start-grid-bot-components/order";
import GridBotTrades from "./start-grid-bot-components/trades";
import GridBotLogs from "./start-grid-bot-components/logs";

import GridBotCancelledOrder from "./start-grid-bot-components/cancelled-order";
import { deleteBot } from "@/queries/bot";
import clsx from "clsx";
import { formatCurrency } from "@/utils";
const TradingViewWidget = dynamic(
  () => import("@/components/trading-view-widget"),
  { ssr: false },
);

export default function StartGridBot() {
  const router = useRouter();
  const [active, setActive] = useState("Orders");
  const tabs = ["Orders", "Trades", "Logs", "Cancelled"];
  const searchParams = useSearchParams();
  const botId = searchParams.get("botId");

  const [deleteModalState, setDeleteModalState] = useState(false);
  const [currentSelectedItem, setCurrentSelectedItem] = useState({});
  const {
    data: botData,
    isPending: botDataPending,
    refetch: botDataRefetch,
  } = useGetBot({ id: botId });
  const { data: PNLData } = useGridPNL({
    id: botId,
  });

  const { refetch: filledRefetch, isLoading: filledRefetchloading } =
    useGetOrder({
      id: botId,
      filter: "filled",
    });
  const { refetch: logRefetch, isLoading: logRefetchLoading } = useGetLogList({
    id: botId,
  });
  const { refetch: cancelledRefetch, isLoading: cancelledRefetchLoading } =
    useGetOrder({
      id: botId,
      filter: "canceled",
    });
  const { refetch: pendingRefetch, isLoading: pendingRefetchLoading } =
    useGetOrder({
      id: botId,
      filter: "open",
    });

  const { data: exchangeData, refetch: exchangeDataRefetch } =
    useGetKeysExchange();

  const {
    mutateAsync: updateBotStatusMutate,
    isPending: updatebotStatusPending,
  } = useMutation({
    mutationFn: () => {
      return updateBotStatus({ id: botId, status: botData?.status });
    },
    onSuccess: (data) => {
      botDataRefetch();
      exchangeDataRefetch();
      if (data?.responseCode == 200) {
        toast.success(data?.responseMessage || "Bot started sucessfully.");
      } else {
        toast.error(data?.responseMessage || "Bot started sucessfully.");
      }
    },
    onError: (data) => {
      console.log(data, "err>>");
      toast.error("Unable to delete bot");
    },
  });

  const isBotRunning = useMemo(() => {
    return botData?.status == "RUNNING";
  }, [botData]);

  return (
    <div className="min-h-screen  text-gray-200">
      <div className="">
        <div className="flex flex-col gap-6 py-10">
          {/* MAIN CONTENT (no sidebar) */}
          <main className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Chart & controls (span 2 columns on large screens) */}
            <section className="col-span-1 lg:col-span-2 bg-[#0f0f11] rounded-2xl p-6 shadow-lg border border-[#1b1b1e]">
              <div className="flex items-center md:flex-row gap-2 flex-col justify-between">
                <h1 className="text-3xl font-bold">
                  Bot Status:{" "}
                  {isBotRunning ? (
                    <span className="text-green-700">Running</span>
                  ) : (
                    <span className="text-red-600">Offline</span>
                  )}
                  <span> </span>
                </h1>
                <h1 className="text-3xl font-bold">
                  Pair: <span> {botData?.symbol || "--"} </span>
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
                                cancelledRefetch();
                                pendingRefetch();
                              }}
                              className={clsx(
                                "cursor-pointer",
                                (filledRefetchloading ||
                                  logRefetchLoading ||
                                  cancelledRefetchLoading ||
                                  pendingRefetchLoading) &&
                                  "animate-spin",
                              )}
                            />
                          </div>
                        </div>
                        {active == "Orders" && <GridBotOrders botId={botId} />}
                        {active == "Trades" && <GridBotTrades botId={botId} />}
                        {active == "Logs" && <GridBotLogs botId={botId} />}
                        {active == "Cancelled" && (
                          <GridBotCancelledOrder botId={botId} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block">
                  <div className="bg-[#0b0b0d] border border-[#151518] rounded-xl p-4 text-sm leading-6">
                    <h3 className="font-semibold mb-2">About Grid Bot</h3>
                    <p className="text-gray-400">
                      This is a long-only spot grid bot. It buys assets below
                      the current market price and sells them higher for profit.
                      There is no leverage, no short selling, and no selling
                      without holding the asset. Profits are generated from
                      repeated upward price movements within the defined grid
                      range.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Right: Form */}
            <aside className="bg-[#0f0f11] rounded-2xl p-6 shadow-lg border border-[#1b1b1e] ">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-400">#{botData?.id}</div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    Grid Count
                    <div className="relative group">
                      <Info
                        size={14}
                        className="text-gray-400 cursor-pointer hover:text-gray-200"
                      />
                      <div className="absolute left-1/2 -translate-x-1/2 top-5 hidden group-hover:block bg-gray-800 text-gray-200 text-xs p-2 rounded-md shadow-lg w-64 z-10">
                        This determines how many grid levels are created between
                        the lower and upper prices. Each grid level represents a
                        buy-then-sell cycle. Increasing the grid count results
                        in smaller price gaps and more frequent trades, while
                        fewer grids result in larger price gaps and fewer
                        trades. The grid levels are evenly distributed across
                        the price range.
                      </div>
                    </div>
                  </div>
                  <div className="text-base text-white">
                    {botData?.gridCount || 0}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    Grid Lower
                    <div className="relative group">
                      <Info
                        size={14}
                        className="text-gray-400 cursor-pointer hover:text-gray-200"
                      />
                      <div className="absolute left-1/2 -translate-x-1/2 top-5 hidden group-hover:block bg-gray-800 text-gray-200 text-xs p-2 rounded-md shadow-lg w-64 z-10">
                        This is the lowest price level where the bot is allowed
                        to place buy orders. The bot is long-only and will never
                        buy above the current market price. All buy orders are
                        placed between the current market price and this lower
                        limit. This value defines how far downward the bot is
                        willing to accumulate the asset during price dips.
                      </div>
                    </div>
                  </div>
                  <div className="text-base text-white">
                    {botData?.gridLower || 0}
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    Grid Upper
                    <div className="relative group">
                      <Info
                        size={14}
                        className="text-gray-400 cursor-pointer hover:text-gray-200"
                      />
                      <div className="absolute left-1/2 -translate-x-1/2 top-5 hidden group-hover:block bg-gray-800 text-gray-200 text-xs p-2 rounded-md shadow-lg w-64 z-10">
                        This represents the maximum take-profit price of the
                        grid. After a buy order is filled, the bot sells the
                        asset at the next higher grid level, capturing profit as
                        price moves upward. When the price reaches the highest
                        grid level, the bot executes a sell and completes that
                        grid cycle. This value defines the upper profit boundary
                        of the strategy.
                      </div>
                    </div>
                  </div>
                  <div className="text-base text-white">
                    {botData?.gridUpper || 0}
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    Investment
                    <div className="relative group">
                      <Info
                        size={14}
                        className="text-gray-400 cursor-pointer hover:text-gray-200"
                      />
                      <div className="absolute left-1/2 -translate-x-1/2 top-5 hidden group-hover:block bg-gray-800 text-gray-200 text-xs p-2 rounded-md shadow-lg w-64 z-10">
                        This value represents the intended capital allocation
                        for the bot and helps you plan how much balance you want
                        to dedicate to this strategy. At present, this amount is
                        informational only and is not strictly enforced by the
                        bot during order placement. Actual trades are executed
                        based on the configured order size and the available
                        balance on the exchange, so the bot may use more or less
                        than this amount depending on market conditions and open
                        orders.
                      </div>
                    </div>
                  </div>

                  <div className="text-base text-white">
                    {botData?.investment || 0}
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    SL Price
                    <div className="relative group">
                      <Info
                        size={14}
                        className="text-gray-400 cursor-pointer hover:text-gray-200"
                      />
                      <div className="absolute left-1/2 -translate-x-1/2 top-5 hidden group-hover:block bg-gray-800 text-gray-200 text-xs p-2 rounded-md shadow-lg w-64 z-10">
                        This is an optional emergency protection level. If the
                        market price falls to or below this value, the bot
                        immediately cancels all open orders, sells any remaining
                        balance at market price, and stops execution. This helps
                        protect capital during sharp or unexpected market drops.
                      </div>
                    </div>
                  </div>

                  <div className="text-base text-white">
                    {botData?.stopLossPrice || 0}
                  </div>
                </div>

                {/* {currentAmount > 0 && (
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                      Investment Amount
                      <div className="relative group">
                        <Info
                          size={14}
                          className="text-gray-400 cursor-pointer hover:text-gray-200"
                        />
                        <div className="absolute left-1/2 -translate-x-1/2 top-5 hidden group-hover:block bg-gray-800 text-gray-200 text-xs p-2 rounded-md shadow-lg w-64 z-10">
                          The amount of funds the bot will use to execute grid
                          trades.
                        </div>
                      </div>
                    </div>
                    <div className="text-base text-white">
                      {formatCurrency({
                        amount: Number(currentAmount)?.toFixed(4),
                        currency: "USD",
                      })}
                    </div>
                  </div>
                )} */}

                <div className="flex justify-between">
                  <div className="text-sm text-gray-400 mb-1">
                    Exchange Name
                  </div>
                  <div className="text-base text-white capitalize">
                    {botData?.exchange || "--"}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm text-gray-400 mb-1">Pair</div>
                  <div className="text-base text-white capitalize">
                    {botData?.symbol || "--"}
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="text-sm text-gray-400 mb-1">Bot Type</div>
                  <div className="text-base text-white capitalize">Grid</div>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button
                    className="w-full mt-2 py-3 rounded-xl text-white font-semibold bg-pink-600 hover:bg-pink-700 transition-all"
                    onClick={() => {
                      if (botData?.status == "RUNNING") {
                        setCurrentSelectedItem(null);
                        setDeleteModalState(true);
                      } else {
                        updateBotStatusMutate();
                      }
                    }}
                    disabled={updatebotStatusPending}
                  >
                    {updatebotStatusPending ? (
                      "Processing..."
                    ) : (
                      <>
                        {botData?.status == "RUNNING"
                          ? "Liquidate/Delete "
                          : "Start"}{" "}
                        Bot
                      </>
                    )}
                  </button>
                  {botData?.enableIndicators && (
                    <Trash
                      className="text-red-500"
                      onClick={() => {
                        setCurrentSelectedItem(null);
                        setDeleteModalState(true);
                      }}
                    />
                  )}
                </div>
                <div className="flex flex-col md:flex-row  justify-between gap-4">
                  <p className="text-md text-gray-400">
                    Realized P&L:{" "}
                    <span
                      className={
                        PNLData?.realizedPnL < 0
                          ? "text-red-500"
                          : "text-green-500"
                      }
                    >
                      ${Number(PNLData?.realizedPnL || 0).toFixed(3)}
                    </span>
                  </p>
                  <p className="text-md text-gray-400">
                    Grid Cycle Completed:{" "}
                    <span
                      className={
                        PNLData?.trades < 0 ? "text-red-500" : "text-green-500"
                      }
                    >
                      {Number(PNLData?.trades || 0).toFixed(0)}
                    </span>
                  </p>
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
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => {
      return deleteBot({ id: botId });
    },
    onSuccess: (data) => {
      console.log(data, "data>>>");
      toast.success(data?.message);
      router.replace("/dashboard/bot");
      setOpen(false);
      if (refetch) {
        refetch();
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message);
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
