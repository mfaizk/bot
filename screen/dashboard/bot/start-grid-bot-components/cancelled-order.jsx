import { cancelOrder, useGetOrder } from "@/queries/bot";
import React, { useMemo } from "react";
import { formatCurrency } from "@/utils/index";
import { RefreshCcw } from "lucide-react";
import clsx from "clsx";
import moment from "moment";

const GridBotCancelledOrder = ({ botId }) => {
  const {
    data: orderList,
    isPending: orderListPending,
    refetch,
  } = useGetOrder({
    id: botId,
    filter: "canceled",
  });
  console.log(orderList, "orderList>>");

  return (
    <div>
      <div className="px-6 py-4 h-96 overflow-auto">
        {!orderListPending && orderList?.orders?.length == 0 && (
          <div className="mt-8 py-12 flex flex-col items-center justify-center border-t border-white/5">
            <p className="mt-3 text-sm text-gray-400">
              No cancelled orders to display right now.
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
                <th className="px-2 py-2 text-white">Price</th>
                <th className="px-2 py-2 text-white">Amount</th>
                <th className="px-2 py-2 text-white">Notional (USD)</th>

                <th className="px-2 py-2 text-white">Date/Time</th>

                <th className="px-2 py-2">Status</th>
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
                        "px-2 py-2",
                        item?.side == "SELL" ? "text-red-500" : "text-green-500"
                      )}
                    >
                      {item?.side || "--"}
                    </td>
                    <td className="px-2 py-2">
                      {formatCurrency({
                        amount: item?.price,
                        currency: "USD",
                      })}
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
                    <td className="px-2 py-2 text-red-500">
                      {item?.status || "--"}
                    </td>
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

export default GridBotCancelledOrder;
