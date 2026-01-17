"use client";

import { useQuery } from "@tanstack/react-query";
import { api, gridBotBaseUrl } from "@/service/api-service";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";
import { Users, Bot, Play, BarChart2 } from "lucide-react";
import { useEffect, useState } from "react";

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
function StatCard({ title, value, subtitle, icon: Icon, duration = 900 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number(value ?? 0);
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
    <div className="bg-[#12121a] border border-gray-800/50 rounded-2xl p-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-400 text-sm">{title}</p>
        <div className="bg-gray-800/30 p-2 rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>

      <div className="text-white text-4xl font-semibold">
        {count.toLocaleString()}
      </div>

      {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
    </div>
  );
}

/* ============================
   API FETCHERS (Axios)
=============================== */

const fetchStats = async () => {
  const res = await api.get(`${gridBotBaseUrl}/admin/stats`);
  return res.data ?? null;
};

const fetchHealth = async () => {
  const res = await api.get(`${gridBotBaseUrl}/admin/health`);
  return res.data ?? null;
};

const fetchExchangeStats = async () => {
  const res = await api.get(`${gridBotBaseUrl}/admin/exchange-stats`);
  const data = res.data;

  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") return Object.values(data);
  return [];
};

/* ============================
   PAGE COMPONENT
=============================== */

export default function GridStats() {
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["grid-stats"],
    queryFn: fetchStats,
  });

  const { data: health, isLoading: loadingHealth } = useQuery({
    queryKey: ["grid-health"],
    queryFn: fetchHealth,
  });

  const { data: exchangeStats, isLoading: loadingEx } = useQuery({
    queryKey: ["grid-exchange-stats"],
    queryFn: fetchExchangeStats,
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-white">
        Grid Bot Admin Dashboard
      </h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loadingStats ? (
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
              value={stats?.total_users}
              icon={Users}
            />
            <StatCard title="Total Bots" value={stats?.total_bots} icon={Bot} />
            <StatCard
              title="Running Bots"
              value={stats?.running_bots}
              icon={Play}
            />
            <StatCard
              title="Total Trades"
              value={stats?.total_trades}
              icon={BarChart2}
            />
          </>
        )}
      </div>

      {/* HEALTH STATUS */}
      <div className="bg-[#12121a] border border-gray-800/50 rounded-2xl p-6 space-y-3">
        <h2 className="text-lg font-semibold text-white">System Health</h2>

        {loadingHealth ? (
          <div className="h-10 rounded-lg animate-pulse bg-gray-800/40" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
            <div>
              <span className="text-gray-500">Uptime:</span>{" "}
              {health?.uptime_seconds?.toFixed?.(1)} sec
            </div>
            <div>
              <span className="text-gray-500">Memory:</span> {health?.memory_mb}{" "}
              MB
            </div>
            <div>
              <span className="text-gray-500">Timestamp:</span>{" "}
              {moment(health?.timestamp).format("lll")}
            </div>
          </div>
        )}
      </div>

      {/* PIE CHART */}
      <div className="grid grid-cols-6  md:grid-cols-12 gap-6">
        <div className="bg-[#12121a] col-span-6 border border-gray-800/50 rounded-2xl p-6">
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

        <div className="bg-[#12121a] col-span-6 border border-gray-800/50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Running Bots by Exchange
          </h2>
          <div className="h-[300px]">
            {loadingEx ? (
              <div className="h-full animate-pulse bg-gray-800/40 rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={exchangeStats ?? []}
                    dataKey={(d) => Number(d.running_bots ?? 0)}
                    nameKey="exchange"
                    outerRadius={120}
                    label
                  >
                    {(exchangeStats ?? []).map((entry, idx) => (
                      <Cell
                        key={`cell-running-${idx}`}
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
    </div>
  );
}
