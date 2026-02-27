import { useGetFutureLogList } from "@/queries/futureGrid";
import React from "react";
import moment from "moment";
import clsx from "clsx";

const FutureBotLogs = ({ botId }) => {
  const {
    data: logList,
    isPending,
    refetch,
  } = useGetFutureLogList({ id: botId });
const logs = (logList || []).sort(
  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
);

const formatMessage = (message) => {
  if (!message) return "--";

  return message
    .replace("Placed ", "")
    .replace(" order", "")
    .replace(" ", " • ");
};
  return (
    <div>
      <div className="px-6 py-4 h-96 overflow-auto">
        {!isPending && (!logList || logList.length === 0) && (
          <div className="mt-8 py-12 flex flex-col items-center justify-center border-t border-white/5">
            <h3 className="text-gray-200 text-xl font-medium">Logs</h3>
            <p className="mt-3 text-sm text-gray-400">
              No logs to display right now.
            </p>
            <button
              className="mt-6 px-5 py-2 text-sm rounded-full border border-white/10 text-gray-300 hover:bg-white/5"
              onClick={refetch}
            >
              Refresh
            </button>
          </div>
        )}

        {!isPending && logList?.length > 0 && (
          <table className="table w-full text-sm">
          <thead className="sticky top-0 bg-[#0F0F0F] z-10">
              <tr className="text-left">
                <th className="px-2 py-2 text-white">Level</th>
                <th className="px-2 py-2 text-white">Category</th>
                <th className="px-2 py-2 text-white">Message</th>
                <th className="px-2 py-2 text-white">Meta</th>
                <th className="px-2 py-2 text-white">Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((item) => (
                <tr
                  key={item.id}
                  className="text-gray-300 border-t border-gray-700 hover:bg-white/5 transition"
                >
                  {/* LEVEL */}
             <td className="px-2 py-2">
  <span
    className={clsx(
      "px-2 py-1 rounded-full text-xs font-semibold",
      item.level === "ERROR" && "bg-red-500/20 text-red-400",
      item.level === "WARN" && "bg-yellow-500/20 text-yellow-400",
      item.level === "INFO" && "bg-green-500/20 text-green-400"
    )}
  >
    {item.level}
  </span>
</td>

                  {/* CATEGORY */}
                  <td className="px-2 py-2 text-blue-400">
                    {item.category}
                  </td>

                  {/* MESSAGE */}
                  <td className="px-2 py-2">
  <span
   className={clsx(
  formatMessage(item.message)?.includes("LONG") && "text-green-400",
  formatMessage(item.message)?.includes("SHORT") && "text-orange-400"
)}
  >
    {formatMessage(item.message)}
  </span>
</td>

                  {/* META */}
                 <td className="px-2 py-2 text-xs text-gray-400">
  {item.meta ? (
    <div className="space-y-1">
      {Object.entries(item.meta).map(([key, value]) => (
        <div key={key}>
          <span className="text-gray-500">{key}:</span>{" "}
          <span className="text-gray-300 break-all">{value}</span>
        </div>
      ))}
    </div>
  ) : (
    "--"
  )}
</td>

                  {/* TIME */}
                  <td className="px-2 py-2">
                    {item.createdAt
  ? moment(item.createdAt).format("YYYY.MM.DD HH:mm:ss")
  : "--"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FutureBotLogs;