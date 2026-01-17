"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, DCAbaseUrl } from "@/service/api-service";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Users, Bot, Play, BarChart2 } from "lucide-react";
import moment from "moment";
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AA66CC",
  "#FF6699",
  "#33B5E5",
  "#99CC00",
];

/* ============================
   STAT CARD COMPONENT
=============================== */
function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  currency,
  currencyIcon,
  duration = 900,
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = typeof value === "number" ? value : parseFloat(value);
    if (isNaN(end)) return;

    const increment = end / (duration / 16);

    const handle = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(handle);
        setCount(end);
      } else {
        setCount(Math.floor(start));
      }
    }, 5);

    return () => clearInterval(handle);
  }, [value, duration]);

  return (
    <div className="bg-[#12121a] border border-gray-800/50 rounded-2xl p-6 overflow-hidden w-full">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-gray-400 text-sm font-normal">{title}</h3>
        <div className="bg-gray-800/30 p-2 rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span
            className={`text-4xl font-semibold ${
              title === "Total Profit & Loss"
                ? value >= 0
                  ? "text-green-500"
                  : "text-red-500"
                : "text-white"
            }`}
          >
            {currencyIcon && currencyIcon}
            {count.toLocaleString()}
          </span>

          {currency && (
            <span className="text-gray-400 text-lg">{currency}</span>
          )}
        </div>

        {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
      </div>
    </div>
  );
}

/* ============================
   FETCHERS
=============================== */

const fetchSummary = async () => {
  try {
    const res = await api.get(`${DCAbaseUrl}/admin/summary`);
    return res.data ?? null;
  } catch {
    return null;
  }
};

const fetchSystem = async () => {
  try {
    const res = await api.get(`${DCAbaseUrl}/admin/system`);
    return res.data ?? null;
  } catch {
    return null;
  }
};

const fetchExchangeStats = async () => {
  try {
    const res = await api.get(`${DCAbaseUrl}/admin/exchange-stats`);
    const data = res.data;
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object") return Object.values(data);
    return [];
  } catch {
    return [];
  }
};

/* ============================
   PAGE COMPONENT
=============================== */

export default function DCAStats() {
  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ["summary"],
    queryFn: fetchSummary,
  });

  const { data: system, isLoading: loadingSystem } = useQuery({
    queryKey: ["system"],
    queryFn: fetchSystem,
  });

  const { data: exchangeStats, isLoading: loadingEx } = useQuery({
    queryKey: ["exchange-stats"],
    queryFn: fetchExchangeStats,
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-white">DCA Admin Dashboard</h1>

      {/* SUMMARY SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loadingSummary ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[120px] rounded-xl animate-pulse bg-gray-800/30"
            />
          ))
        ) : (
          <>
            <StatCard
              title="Total Users"
              value={Number(summary?.total_users ?? 0)}
              icon={Users}
            />
            <StatCard
              title="Total Bots"
              value={Number(summary?.total_bots ?? 0)}
              icon={Bot}
            />
            <StatCard
              title="Running Bots"
              value={Number(summary?.running_bots ?? 0)}
              icon={Play}
            />
            <StatCard
              title="Total Trades"
              value={Number(summary?.total_trades ?? 0)}
              icon={BarChart2}
            />
          </>
        )}
      </div>

      {/* SYSTEM STATUS */}
      <div className="bg-[#12121a] border border-gray-800/50 rounded-2xl p-6 space-y-3">
        <h2 className="text-lg font-semibold text-white">System Status</h2>

        {loadingSystem ? (
          <div className="h-10 bg-gray-800/40 rounded animate-pulse" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
            <div>
              <span className="text-gray-500">Uptime:</span>{" "}
              {(system?.uptime_seconds?.toFixed?.(1) ?? "—") + " sec"}
            </div>
            <div>
              <span className="text-gray-500">Memory:</span>{" "}
              {system?.memory_mb ?? "—"} MB
            </div>
            <div>
              <span className="text-gray-500">Timestamp:</span>{" "}
              {moment(system?.timestamp)?.format("lll") ?? "—"}
            </div>
          </div>
        )}
      </div>

      {/* PIE CHART */}
      <div className="bg-[#12121a] border border-gray-800/50 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Bots by Exchange
        </h2>
        <div className="h-[300px]">
          {loadingEx ? (
            <div className="h-full animate-pulse bg-gray-800/40 rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={exchangeStats ?? []}
                  dataKey={(d) => Number(d.total_bots ?? 0)}
                  nameKey="exchange"
                  outerRadius={120}
                  label
                >
                  {(exchangeStats ?? []).map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={COLORS[idx % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
