"use client";
import { useRouter } from "next/navigation";

export default function CommonTable({ columns, data }) {
  const router = useRouter();

  const getStatusColor = (value) => {
    console.log(value, "valuevaluevalue");

    if (!value) return "text-gray-400";
    const lower = value.toLowerCase();
    if (lower === "active") return "text-green-500 font-semibold";
    if (lower === "inactive") return "text-red-500 font-semibold";
    if (lower === "expired") return "text-red-500 font-semibold";
    if (lower === "deactive") return "text-red-500 font-semibold";

    return "text-gray-300";
  };

  return (
    <div
      className={
        "overflow-x-auto bg-[#12121d] rounded-xl border border-gray-800"
      }
    >
      <table className={"min-w-full text-left text-sm text-gray-300"}>
        <thead className="bg-[#1a1a25] text-gray-400 uppercase text-xs">
          <tr>
            {columns.map((col) => (
              <th key={col?.key} className="px-4 py-3 font-medium">
                {col?.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 ? (
            data?.map((row, idx) => (
              <tr
                key={idx}
                className="border-t border-gray-800 hover:bg-[#1a1a2a] transition"
              >
                {columns?.map((col) => {
                  if (col.key === "actions") {
                    return (
                      <td key={col.key} className="px-4 py-3">
                        <button
                          className="px-3 py-1 rounded-md bg-primary text-black font-medium"
                          onClick={() => {
                            const id = row?.id;

                            router.push(
                              `/admin/user-list/user-view?id=${encodeURIComponent(
                                id
                              )}`
                            );
                          }}
                        >
                          View
                        </button>
                      </td>
                    );
                  }

                  const cellValue = row[col.key];
                  const cellClass =
                    col.key === "status" ||
                    col.key === "planStatus" ||
                    col?.key === "planStatus"
                      ? getStatusColor(cellValue)
                      : "text-gray-300";

                  return (
                    <td key={col.key} className={`px-4 py-3 ${cellClass}`}>
                      {/* {cellValue} */}
                      {col?.key === "txHash" && row?.txUrl ? (
                        <a
                          href={row?.txUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline"
                        >
                          {row?.txHash}
                        </a>
                      ) : (
                        row[col?.key] || "--"
                      )}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-6 text-gray-500"
              >
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
