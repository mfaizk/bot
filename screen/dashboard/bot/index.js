"use client";

import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Info, Copy } from "lucide-react";
import { IconExchange } from "@tabler/icons-react";
import Dropdown from "../../../components/dropdown";
import { useRouter } from "next/navigation";
import NotActiveSubs from "@/components/no-active-subs";
import { useGetFutureBotList } from "@/queries/futureGrid";
import CommingSoon from "@/components/comming-soon";
import { useHaveActiveSubscriptions } from "@/queries/payment";
import { useGetBotList, useGetDCABotList } from "@/queries/bot";
import NotActiveBots from "@/components/no-active-bot";
import clsx from "clsx";
import ActivityIndicator from "@/components/activity-indicator";
import { useUserProfile } from "@/queries/profile";
const exchangeOptions = [
  { label: "New Grid Bot", value: "/create-grid-bot" },
  { label: "New DCA Bot", value: "/create-dca-bot" },
  { label: "New Future Grid Bot", value: "/create-future-grid-bot" },
];

const statusOptions = [
  { label: "Mexc", value: "mexc", icon: "/assets/homepage/mexc.png" },
  { label: "Bybit", value: "bybit", icon: "/assets/homepage/bybit.webp" },
];
const statusOptionsBOT = [
  { label: "GRID BOT", value: "grid" },
  { label: "DCA BOT", value: "dca" },
  { label: "FUTURE GRID BOT", value: "future" },

];

export default function Bot() {
  const [select, setSelect] = useState("");
  const [selectExchange, setSelectExchange] = useState(null);
  const [selectedBotType, setselectedBotType] = useState("grid");
  const [isOpen, setIsOpen] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const router = useRouter();
  const { data: getUserData, isPending: getUserDataPending } = useUserProfile();

  const { data: botList, isPending: botListPending } = useGetBotList({
    selectExchange,
  });
  const { data: futureBotList, isPending: futureBotListPending } =
    useGetFutureBotList();
  const { data: DCAbotList, isPending: DCAbotListPending } = useGetDCABotList();

  const handleOTPSubmit = (code) => {
    console.log("OTP submitted:", code);
    setIsOpen(false);
  };

  const handleSelect = (val) => {
    setSelect(val);
    if (val === "New DCA Bot") {
      // setShowComingSoon(true);
      // return;
    }

    router.push(`/dashboard/bot/${val}`);
  };

  const getStatus = (item) => {
    return {
      status: item?.status == "RUNNING" ? "Active" : `InActive`,
    };
  };
  const getDCAStatus = (item) => {
    return {
      status: item?.status == "running" ? "Active" : `InActive`,
    };
  };

  if (!getUserData?.isPlanActive) {
    return <NotActiveSubs />;
  }

  if (botListPending || DCAbotListPending || futureBotListPending) {
    return (
      <div className=" min-h-screen flex flex-col justify-center items-center gap-4">
        <ActivityIndicator isLoading className={"h-12 w-12"} />
        <p className="text-2xl font-semibold">Getting Data...</p>
      </div>
    );
  }

  return (
    <div className="  py-10 text-white">
      <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-1 gap-8">
        <div className="flex">
          <Dropdown
            label="Create New Bot"
            bgColor="#EE3379"
            options={exchangeOptions}
            value={select || ""}
            onSelect={handleSelect}
            className="w-56"
          />
        </div>

        {showComingSoon ? (
          <div className="h-[100%] mt-14 flex items-center justify-center">
            <CommingSoon />
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-2 justify-end">
              {/* <div className="flex justify-end w-52">
                <Dropdown
                  label="Select Exchange"
                  options={statusOptions}
                  value={selectExchange}
                  onSelect={(val) => setSelectExchange(val)}
                  className="w-full md:w-56"
                />
              </div> */}
              <div className="flex justify-end w-52">
                <Dropdown
                  label="Select BOT"
                  bgColor="#EE3379"
                  options={statusOptionsBOT}
                  value={selectedBotType}
                  onSelect={(val) => setselectedBotType(val)}
                  className="w-full md:w-56"
                />
              </div>
            </div>
            <>
              {console.log(botList, "botList>>")}
              {selectedBotType == "grid" && (
                <>
                  {botList?.length === 0 ? (
                    <div className="mt-20 sm:mt-30 w-full py-12 flex flex-col items-center justify-center ">
                      <p className="mt-3 text-xl text-gray-400">
                        No bots here yet! Let’s make your first one
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {botList?.map((item, i) => {
                        // Move computed value outside useMemo since it's not needed inside map
                        const currentAmount =
                          item?.params?.gridLevel *
                          2 *
                          item?.params?.quantityPerGridUSD;

                        return (
                          <div
                            key={i}
                            className="rounded-2xl p-5 bg-[#0b1229] border-white/10 border shadow-md hover:shadow-blue-500/10 hover:bg-[#121a36] min-h-[120px] cursor-pointer"
                            onClick={() => {
                              router.push(
                                `/dashboard/bot/start-grid-bot/?botId=${encodeURIComponent(
                                  item?.id
                                )}`
                              );
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="w-10 h-10 rounded-md bg-[#141420] flex items-center justify-center text-pink-400">
                                <img
                                  src="/assets/logo1.png"
                                  alt="Qbots Logo"
                                  className="w-16 h-12"
                                />
                              </div>
                              <div
                                className={clsx(
                                  "text-xs text-white px-2 py-1 rounded",
                                  getStatus(item)?.status === "Active"
                                    ? "bg-emerald-700/70"
                                    : "bg-red-700/70"
                                )}
                              >
                                {getStatus(item)?.status}
                              </div>
                            </div>

                            {/* <h4 className="text-lg font-semibold mt-4">
                              {item?.botName || "--"}
                            </h4> */}

                            <div className="flex justify-between mt-4">
                              <div>
                                <h4 className="text-md font-semibold">
                                  Exchange
                                </h4>
                                <p className="text-sm text-gray-300 mt-1 capitalize">
                                  {item?.exchange || "--"}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-md font-semibold">Pair</h4>
                                <p className="text-sm text-gray-300 mt-1">
                                  {item?.symbol}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </>
            <>
              {selectedBotType == "dca" && (
                <>
                  {!DCAbotList || DCAbotList?.length === 0 ? (
                    <div className="mt-20 sm:mt-30 w-full py-12 flex flex-col items-center justify-center ">
                      <p className="mt-3 text-xl text-gray-400">
                        No bots here yet! Let’s make your first one
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                      {DCAbotList?.map((item, i) => {
                        return (
                          <div
                            key={i}
                            className="rounded-2xl p-5 bg-[#0b1229] border-white/10 border shadow-md hover:shadow-blue-500/10 hover:bg-[#121a36] min-h-[120px] cursor-pointer"
                            onClick={() => {
                              router.push(
                                `/dashboard/bot/start-dca-bot/?botId=${encodeURIComponent(
                                  item?.id
                                )}`
                              );
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="w-10 h-10 rounded-md bg-[#141420] flex items-center justify-center text-pink-400">
                                <img
                                  src="/assets/logo1.png"
                                  alt="Qbots Logo"
                                  className="w-16 h-12"
                                />
                              </div>
                              <div
                                className={clsx(
                                  "text-xs text-white px-2 py-1 rounded",
                                  getDCAStatus(item)?.status === "Active"
                                    ? "bg-emerald-700/70"
                                    : "bg-red-700/70"
                                )}
                              >
                                {getDCAStatus(item)?.status}
                              </div>
                            </div>

                            <div className="flex flex-row justify-between items-end">
                              <div className="flex flex-col mt-4  justify-between ">
                                <h4 className="text-md font-semibold">
                                  Exchange
                                </h4>
                                <p className="text-sm text-gray-300  capitalize mt-1">
                                  {item?.config?.exchangeName || "--"}
                                </p>
                              </div>
                              <div className="flex flex-col ">
                                <h4 className="text-md font-semibold">Pair</h4>

                                <p className="text-sm text-gray-300 mt-1">
                                  {item?.pair}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </>
            {selectedBotType == "future" && (
              <>
                {!futureBotList || futureBotList?.length === 0 ? (
                  <div className="mt-20 sm:mt-30 w-full py-12 flex flex-col items-center justify-center ">
                    <p className="mt-3 text-xl text-gray-400">
                      No futures bots yet! Let’s create your first one
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {futureBotList?.map((item, i) => {
                      return (
                        <div
                          key={i}
                          className="rounded-2xl p-5 bg-[#0b1229] border-white/10 border shadow-md hover:shadow-blue-500/10 hover:bg-[#121a36] min-h-[120px] cursor-pointer"
                          onClick={() => {
                            router.push(
                              `/dashboard/bot/start-future-grid-bot/?botId=${encodeURIComponent(
                                item?.id
                              )}`
                            );
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="w-10 h-10 rounded-md bg-[#141420] flex items-center justify-center text-pink-400">
                              <img
                                src="/assets/logo1.png"
                                alt="Qbots Logo"
                                className="w-16 h-12"
                              />
                            </div>
                            <div
                              className={clsx(
                                "flex items-center gap-2 text-xs px-3 py-1 rounded-full font-semibold",
                                item?.status === "RUNNING" &&
                                "bg-green-500/20 text-green-400",
                                item?.status === "WAITING" &&
                                "bg-yellow-500/20 text-yellow-400",
                                item?.status === "STOPPED" &&
                                "bg-red-500/20 text-red-400",
                                item?.status === "ERROR" &&
                                "bg-orange-500/20 text-orange-400"
                              )}
                            >
                              {item?.status === "RUNNING" && "Active"}
                              {item?.status === "WAITING" && "Waiting"}
                              {item?.status === "STOPPED" && "Stopped"}
                              {item?.status === "ERROR" && "Error"}
                            </div>
                          </div>

                          <div className="flex justify-between mt-4">
                            <div>
                              <h4 className="text-md font-semibold">Exchange</h4>
                              <p className="text-sm text-gray-300 mt-1 capitalize">
                                {item?.exchange || "--"}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-md font-semibold">Pair</h4>
                              <p className="text-sm text-gray-300 mt-1">
                                {item?.symbol}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 text-sm text-gray-400">
                            Leverage: {item?.leverage || 1}x
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      <OTPModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleOTPSubmit}
      />
    </div>
  );
}

/* ---------- Small inline components for demonstration --------- */

function OTPModal({ isOpen, onClose, onSubmit }) {
  const [code, setCode] = useState("");
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#0c0c11] p-6 rounded-xl w-full max-w-md">
        <h3 className="text-xl font-semibold mb-3">Enter OTP</h3>
        <p className="text-sm text-gray-400 mb-4">
          We sent a 4-digit code to your registered email.
        </p>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="0000"
          className="w-full p-3 bg-[#111217] rounded mb-4"
        />
        <div className="flex gap-3">
          <button
            onClick={() => {
              onSubmit(code);
              setCode("");
            }}
            className="flex-1 bg-gradient-to-r from-[#7b5cff] to-[#ff7ab6] py-2 rounded"
          >
            Verify
          </button>
          <button
            onClick={() => {
              onClose();
              setCode("");
            }}
            className="flex-1 border border-gray-700 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
