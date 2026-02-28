"use client";
import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Dropdown from "@/components/dropdown";
import StylesTabs from "@/components/style-tab";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import {
    useGetFutureBot,
    updateFutureBotStatus,
    useGetFutureOrders,
    useGetFutureLogList,
    useFutureGridPNL,
    deleteFutureBot,
    useGetFutureBotList,
    liquidateAndDeleteFutureBot,
} from "@/queries/futureGrid";
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
import FutureBotOrders from "./start-future-grid-bot-components/future-order";
import FutureBotTrades from "./start-future-grid-bot-components/future-trades";
import FutureBotLogs from "./start-future-grid-bot-components/future-logs";
import FutureBotCancelledOrder from "./start-future-grid-bot-components/future-cancelled-order";
// import { deleteBot } from "@/queries/bot";
import clsx from "clsx";
import { formatCurrency } from "@/utils";
const TradingViewWidget = dynamic(
    () => import("@/components/trading-view-widget"),
    { ssr: false },
);

export default function StartFutureGridBot() {
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
    } = useGetFutureBot({ id: botId });
    const { data: PNLData } = useFutureGridPNL({
        id: botId,
    });

    const { refetch: filledRefetch, isLoading: filledRefetchloading } =
        useGetFutureOrders({
            id: botId,
            filter: "filled",
        });
    const { refetch: logRefetch, isLoading: logRefetchLoading } = useGetFutureLogList({
        id: botId,
    });
    const { refetch: cancelledRefetch, isLoading: cancelledRefetchLoading } =
        useGetFutureOrders({
            id: botId,
            filter: "canceled",
        });
    const { refetch: pendingRefetch, isLoading: pendingRefetchLoading } =
        useGetFutureOrders({
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
            const newStatus =
                botData?.status === "RUNNING" ? "STOPPED" : "RUNNING";

            return updateFutureBotStatus({
                id: botId,
                status: botData?.status,
            });
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

    const formattedSymbol = botData?.symbol
        ? botData.symbol.split(":")[0].replace("/", "")
        : null;
    const botStatus = botData?.status;

    const isBotActive =
        botStatus === "RUNNING" || botStatus === "WAITING";

    const isWaiting = botStatus === "WAITING";
    const isRunning = botStatus === "RUNNING";
    const isStopped = botStatus === "STOPPED";
    console.log("Future Start Symbol:", botData?.symbol);
    return (
        <div className="min-h-screen  text-gray-200">
            <div className="">
                <div className="flex flex-col gap-6 py-10">
                    {/* MAIN CONTENT (no sidebar) */}
                    <main className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left: Chart & controls (span 2 columns on large screens) */}
                        <section className="col-span-1 lg:col-span-2 bg-[#0f0f11] rounded-2xl p-6 shadow-lg border border-[#1b1b1e]">
                            <div className="flex items-center md:flex-row gap-2 flex-col justify-between">
                                <div className="flex items-center gap-4">
                                    <h1 className="text-3xl font-bold">Bot Status</h1>

                                    <span
                                        className={clsx(
                                            "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold",
                                            botStatus === "RUNNING" &&
                                            "bg-green-500/20 text-green-400",
                                            botStatus === "WAITING" &&
                                            "bg-yellow-500/20 text-yellow-400",
                                            botStatus === "STOPPED" &&
                                            "bg-red-500/20 text-red-400",
                                            botStatus === "ERROR" &&
                                            "bg-orange-500/20 text-orange-400"
                                        )}
                                    >
                                        {botStatus === "RUNNING" && (
                                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                        )}

                                        {botStatus === "WAITING" && (
                                            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                                        )}

                                        {botStatus === "ERROR" && (
                                            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
                                        )}

                                        {botStatus === "RUNNING" && "Active"}
                                        {botStatus === "WAITING" && "Waiting"}
                                        {botStatus === "STOPPED" && "Stopped"}
                                        {botStatus === "ERROR" && "Error"}
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold">
                                    Pair: <span> {botData?.symbol || "--"} </span>
                                </h1>
                            </div>

                            <div className="mt-6 grid grid-cols-1 lg:grid-cols-1 gap-6">
                                <div className="lg:col-span-2">
                                    <div className="h-[500px]">
                                        {botData?.symbol && (
                                            <TradingViewWidget
                                                key={botData.symbol}
                                                symbol={botData.symbol.split(":")[0]}
                                                gridLower={botData?.gridLower}
                                                gridUpper={botData?.gridUpper}
                                                lowerStopLossPrice={botData?.lowerStopLossPrice}
                                                upperStopLossPrice={botData?.upperStopLossPrice}
                                            />
                                        )}
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
                                                {active == "Orders" && <FutureBotOrders botId={botId} />}
                                                {active == "Trades" && <FutureBotTrades botId={botId} />}
                                                {active == "Logs" && <FutureBotLogs botId={botId} />}
                                                {active == "Cancelled" && (
                                                    <FutureBotCancelledOrder botId={botId} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden lg:block">
                                    <div className="bg-[#0b0b0d] border border-[#151518] rounded-xl p-4 text-sm leading-6">
                                        <h3 className="font-semibold mb-2">About Future Grid Bot</h3>
                                        <p className="text-gray-400">
                                            This is a futures grid trading bot. It operates using leverage and
                                            automatically places buy and sell orders within the defined price
                                            range. Profits are generated from price oscillations between grid
                                            levels. Leverage increases both potential returns and risk.
                                            Risk management through stop loss settings is strongly recommended.
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
                                    <div className="text-sm text-gray-400 mb-1">Leverage</div>
                                    <div className="text-base text-white">
                                        {botData?.leverage || 1}x
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
                                    <div className="text-sm text-gray-400 mb-1">Lower Stop Loss</div>
                                    <div className="text-base text-white">
                                        {botData?.lowerStopLossPrice || 0}
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <div className="text-sm text-gray-400 mb-1">Upper Stop Loss</div>
                                    <div className="text-base text-white">
                                        {botData?.upperStopLossPrice || 0}
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
                                    <div className="text-base text-white capitalize">Future Grid</div>
                                </div>

                                <div className="flex items-center justify-center gap-4">
                                    <button
                                        className="w-full mt-2 py-3 rounded-xl text-white font-semibold bg-pink-600 hover:bg-pink-700 transition-all"
                                        onClick={() => {
                                            if (isBotActive) {
                                                setCurrentSelectedItem(null);
                                                setDeleteModalState(true);
                                            } else {
                                                updateBotStatusMutate();
                                            }
                                        }}
                                        disabled={updatebotStatusPending || isWaiting}
                                    >
                                        {updatebotStatusPending
                                            ? "Processing..."
                                            : isWaiting
                                                ? "Waiting for Indicator..."
                                                : isRunning
                                                    ? "Liquidate/Delete Bot"
                                                    : "Start Bot"}
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
                                <div className="bg-[#151518] rounded-xl p-5 space-y-4">
                                    <div className="grid grid-cols-3 gap-4 text-center">

                                        <div>
                                            <p className="text-gray-400 text-sm">Realized P&L</p>
                                            <p
                                                className={clsx(
                                                    "text-xl font-bold",
                                                    PNLData?.realizedPnL < 0
                                                        ? "text-red-500"
                                                        : "text-green-500"
                                                )}
                                            >
                                                ${Number(PNLData?.realizedPnL || 0).toFixed(3)}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-400 text-sm">Unrealized P&L</p>
                                            <p
                                                className={clsx(
                                                    "text-xl font-bold",
                                                    Number(botData?.unrealizedPnL || 0) < 0
                                                        ? "text-red-500"
                                                        : "text-green-500"
                                                )}
                                            >
                                                ${Number(botData?.unrealizedPnL || 0).toFixed(3)}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-400 text-sm">Grid Cycles</p>
                                            <p className="text-xl font-bold text-white">
                                                {Number(PNLData?.trades || 0)}
                                            </p>
                                        </div>

                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="text-sm text-gray-400">Open Positions</div>
                                    <div className="text-base text-white">
                                        {botData?.openPositions ?? 0}
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <div className="text-sm text-gray-400">Cooldown Count</div>
                                    <div className="text-base text-white">
                                        {botData?.cooldownCount ?? 0}
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="text-sm text-gray-400">Indicators Enabled</div>
                                    <div
                                        className={`text-base font-semibold ${botData?.enableIndicators ? "text-green-500" : "text-gray-500"
                                            }`}
                                    >
                                        {botData?.enableIndicators ? "Enabled" : "Disabled"}
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <div className="text-sm text-gray-400">Sideways Protection</div>
                                    <div
                                        className={`text-base font-semibold ${botData?.isSidewaysProtectionActive
                                            ? "text-green-500"
                                            : "text-gray-500"
                                            }`}
                                    >
                                        {botData?.isSidewaysProtectionActive ? "Active" : "Inactive"}
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <div className="text-sm text-gray-400">Indicator Status</div>
                                    <div
                                        className={`text-base font-semibold ${botData?.indicatorPassed
                                            ? "text-green-500"
                                            : "text-red-500"
                                            }`}
                                    >
                                        {botData?.indicatorPassed ? "Passed" : "Blocked"}
                                    </div>
                                </div>

                                {botData?.cooldownUntil && (
                                    <div className="flex justify-between">
                                        <div className="text-sm text-gray-400">Cooldown Until</div>
                                        <div className="text-base text-yellow-400">
                                            {moment(botData.cooldownUntil).format(
                                                "YYYY.MM.DD HH:mm:ss"
                                            )}
                                        </div>
                                    </div>
                                )}

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
    const { refetch } = useGetFutureBotList();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: () => {
            return liquidateAndDeleteFutureBot({ id: botId });
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Bot liquidated & deleted");
            router.replace("/dashboard/bot");
            setOpen(false);
            refetch?.();
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Something went wrong");
            setOpen(false);
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
