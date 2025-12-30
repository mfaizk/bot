"use client";
import { useGetDCAOrder, useGetOrder } from "@/queries/bot";
import React, { useMemo } from "react";
import { formatCurrency } from "@/utils/index";
import { RefreshCcw } from "lucide-react";
import clsx from "clsx";
import moment from "moment";
const DCABotTrades = ({ botId }) => {
  const {
    data: orderList,
    isPending: orderListPending,
    refetch,
  } = useGetDCAOrder({
    id: botId,
  });

  return (
    <div>
      <div className="px-6 py-4 h-96 overflow-auto">
        {!orderListPending && orderList?.length == 0 && (
          <div className="mt-8 py-12 flex flex-col items-center justify-center border-t border-white/5">
            <h3 className="text-gray-200 text-xl md:text-2xl font-medium">
              Open and orders
            </h3>
            <p className="mt-3 text-sm text-gray-400">
              No trades to display right now.
            </p>

            <button
              className="mt-8 px-5 py-2 text-sm rounded-full bg-transparent border border-white/6 text-gray-300 hover:bg-white/2"
              onClick={refetch}
            >
              {orderListPending ? `Refreshing..` : `Refresh`}
            </button>
          </div>
        )}
        {!orderListPending && orderList?.length > 0 && (
          <table className="table w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="px-2 py-2 text-white">Side</th>
                <th className="px-2 py-2 text-white">Type</th>
                <th className="px-2 py-2 text-white">Price</th>
                <th className="px-2 py-2 text-white">Amount</th>
                <th className="px-2 py-2 text-white">Notional (USD)</th>
                <th className="px-2 py-2 text-white">Date/Time</th>
              </tr>
            </thead>
            <tbody>
              {orderList?.map((item, idx) => {
                return (
                  <tr
                    className="text-gray-300 border-t border-gray-700"
                    key={idx}
                  >
                    <td
                      className={clsx(
                        "px-2 py-2",
                        String(item?.side)?.toLowerCase() == "buy"
                          ? "text-green-500"
                          : "text-red-500"
                      )}
                    >
                      {item?.side || "--"}
                    </td>
                    <td className="px-2 py-2">{item?.exit_type || "--"}</td>
                    <td className="px-2 py-2">
                      {formatCurrency({
                        amount: item?.price,
                        currency: "USD",
                      })}
                    </td>
                    <td className="px-2 py-2">
                      {item?.amount}{" "}
                      {/* {String(item?.symbol)?.split("/")?.[0] || "--"} */}
                    </td>
                    {/* Notional (USD) */}
                    <td className="px-2 py-2">
                      {formatCurrency({
                        amount: Number(item?.price || 0) * Number(item?.amount || 0),
                        currency: "USD",
                      })}
                    </td>
                    <td className="px-2 py-2">
                      {moment(item?.updatedAt)?.format("YYYY.MM.DD HH:mm:ss") ||
                        "--"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DCABotTrades;
