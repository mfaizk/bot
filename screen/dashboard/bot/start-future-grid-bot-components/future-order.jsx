import { useGetFutureOrders } from "@/queries/futureGrid";
import React, { useState } from "react";
import { formatCurrency } from "@/utils/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import moment from "moment";
import clsx from "clsx";
const GridBotOrders = ({ botId }) => {
  const [currentDeletingItem, setCurrentDeletingItem] = useState("");
  const queryclient = useQueryClient();
  const {
    data: orderList,
    isPending: orderListPending,
    refetch,
  } = useGetFutureOrders({
    id: botId,
    filter: "open",
  });
  const getOrderType = (item) => {
    const { side, positionSide, reduceOnly } = item;

    // Long Open
    if (side === "BUY" && positionSide === "LONG" && reduceOnly === false)
      return "Long Open";

    // Long Close
    if (side === "SELL" && positionSide === "LONG" && reduceOnly === true)
      return "Long Close";

    // Short Open
    if (side === "SELL" && positionSide === "SHORT" && reduceOnly === false)
      return "Short Open";

    // Short Close
    if (side === "BUY" && positionSide === "SHORT" && reduceOnly === true)
      return "Short Close";

    return side; // fallback
  };
  return (
    <div>
      <div className="px-6 py-4 h-96 overflow-auto">
        {!orderListPending && orderList?.data?.length == 0 && (
          <div className="mt-8 py-12 flex flex-col items-center justify-center border-t border-white/5">
            <h3 className="text-gray-200 text-xl md:text-2xl font-medium">
              Open and orders
            </h3>
            <p className="mt-3 text-sm text-gray-400">
              No orders to display right now.
            </p>

            <button
              className="mt-8 px-5 py-2 text-sm rounded-full bg-transparent border border-white/6 text-gray-300 hover:bg-white/2"
              onClick={refetch}
            >
              {orderListPending ? `Refreshing..` : `Refresh`}
            </button>
          </div>
        )}
        {!orderListPending && orderList?.orders?.length > 0 && (
          <table className="table w-full text-sm ">
            <thead>
              <tr className="text-left">
                <th className="px-2 py-2 text-white">Side</th>
                {/* <th className="px-2 py-2 text-white">Status</th> */}
                <th className="px-2 py-2 text-white">Price</th>
                <th className="px-2 py-2 text-white">Amount</th>
                <th className="px-2 py-2 text-white">Notional (USD)</th>

                <th className="px-2 py-2 text-white">Date/Time</th>
                <th className="px-2 py-2 text-white">Status</th>
              </tr>
            </thead>
            <tbody>
              {orderList?.orders?.map((item, idx) => {
                return (
                  <tr
                    className="text-gray-300 border-t border-gray-700"
                    key={idx}
                  >
                    <td
                      className={clsx(
                        "px-2 py-2 font-semibold",
                        getOrderType(item).includes("Long") && "text-green-400",
                        getOrderType(item).includes("Short") && "text-red-400"
                      )}
                    >
                      {getOrderType(item)}
                    </td>
                    {/* <td className="px-2 py-2">{item?.status || "--"}</td> */}
                    <td className="px-2 py-2">
                      {formatCurrency({ amount: item?.price, currency: "USD" })}
                    </td>
                    <td className="px-2 py-2">{item?.amount} </td>
                    <td className="px-2 py-2">
                      {formatCurrency({
                        amount:
                          Number(item?.price || 0) * Number(item?.amount || 0),
                        currency: "USD",
                      })}
                    </td>
                    <td className="px-2 py-2">
                      {moment(item?.updatedAt)?.format("YYYY.MM.DD HH:mm:ss") ||
                        "--"}
                    </td>
                    <td className="px-2 py-2">{item?.status || "--"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* <div className="mt-4 space-y-3 md:space-y-0 md:block">
          <div className="md:hidden bg-white/3 rounded p-3">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium text-gray-100">
                Buy • Limit
              </div>
              <div className="text-sm text-gray-200">$32,000</div>
            </div>
            <div className="mt-2 text-sm text-gray-300">Amount: 0.005</div>
            <div className="mt-2 text-sm text-amber-400">Status: Open</div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default GridBotOrders;
