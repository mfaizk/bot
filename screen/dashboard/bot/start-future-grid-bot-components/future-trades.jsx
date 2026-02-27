import { useGetFutureOrders } from "@/queries/futureGrid";
import React from "react";
import moment from "moment";
import clsx from "clsx";

const FutureBotTrades = ({ botId }) => {
  const {
    data,
    isPending,
    refetch,
  } = useGetFutureOrders({
    id: botId,
    filter: "filled",
  });

  const orders = (data?.orders || []).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const getTradeLabel = (item) => {
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

    return `${positionSide} ${reduceOnly ? "Close" : "Open"}`;
  };
  return (
    <div>
      <div className="px-6 py-4 h-96 overflow-auto">
        {!isPending && orders.length === 0 && (
          <div className="mt-8 py-12 flex flex-col items-center justify-center border-t border-white/5">
            <h3 className="text-gray-200 text-xl font-medium">
              Filled Orders
            </h3>
            <p className="mt-3 text-sm text-gray-400">
              No filled orders yet.
            </p>
            <button
              className="mt-6 px-5 py-2 text-sm rounded-full border border-white/10 text-gray-300 hover:bg-white/5"
              onClick={refetch}
            >
              Refresh
            </button>
          </div>
        )}

        {!isPending && orders.length > 0 && (
          <table className="table w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="px-2 py-2 text-white">Trade Type</th>
                <th className="px-2 py-2 text-white">Price</th>
                <th className="px-2 py-2 text-white">Amount</th>
                <th className="px-2 py-2 text-white">Notional</th>
                <th className="px-2 py-2 text-white">Fee</th>
                <th className="px-2 py-2 text-white">Time</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((item) => {
                const price = Number(item.price || 0);
                const amount = Number(item.amount || 0);
                const notional = price * amount;

                return (
                  <tr
                    key={item.id}
                    className="text-gray-300 border-t border-gray-700"
                  >
                    <td
                      className={clsx(
                        "px-2 py-2 font-semibold",
                        getTradeLabel(item).includes("Long") && "text-green-400",
                        getTradeLabel(item).includes("Short") && "text-red-400"
                      )}
                    >
                      {getTradeLabel(item)}
                    </td>
                    {/* PRICE */}
                    <td className="px-2 py-2">
                      ${price.toFixed(4)}
                    </td>

                    {/* AMOUNT */}
                    <td className="px-2 py-2">
                      {amount}
                    </td>

                    {/* NOTIONAL */}
                    <td className="px-2 py-2">
                      ${notional.toFixed(4)}
                    </td>

                    {/* FEE */}
                    <td className="px-2 py-2 text-yellow-400">
                      ${Math.abs(Number(item.fee || 0)).toFixed(6)}
                    </td>

                    {/* TIME */}
                    <td className="px-2 py-2">
                      {item.createdAt
                        ? moment(item.createdAt).format("YYYY.MM.DD HH:mm:ss")
                        : "--"}
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

export default FutureBotTrades;