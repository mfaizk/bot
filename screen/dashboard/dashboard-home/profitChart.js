"use client";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ProfitChart() {
  const [filter, setFilter] = useState("month");

  const data = [
    { date: "Sep 5, 2025", totalProfit: 20, totalCapital: 0 },
    { date: "Sep 6, 2025", totalProfit: 0, totalCapital: 20 },
    { date: "Sep 24, 2025", totalProfit: 0, totalCapital: 0 },
    { date: "Oct 5, 2025", totalProfit: 0, totalCapital: 0 },
  ];

  return (
    <div className="w-full bg-[#0B0B12] text-white p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Profit & Loss Chart <span className="text-sm text-gray-400">(USD)</span>
        </h2>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-800 text-white text-sm rounded-lg px-4 py-2 border border-gray-700 focus:outline-none"
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div>

      <div className="w-full h-90 md:h-117 ">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis
              yAxisId="left"
              label={{
                value: "Profit & Loss (USD)",
                angle: -90,
                position: "insideLeft",
                fill: "#9CA3AF",
                fontSize: 12,
              }}
              tick={{ fill: "#9CA3AF" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: "Capital (USD)",
                angle: 90,
                position: "insideRight",
                fill: "#9CA3AF",
                fontSize: 12,
              }}
              tick={{ fill: "#9CA3AF" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#F3F4F6" }}
            />
            <Legend verticalAlign="top" height={36} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="totalProfit"
              stroke="#fff"
              strokeWidth={3}
              dot={{ r: 6 }}
              activeDot={{ r: 8 }}
              name="Total Profit"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="totalCapital"
              stroke="#F87171"
              strokeWidth={3}
              dot={{ r: 6 }}
              activeDot={{ r: 8 }}
              name="Total Capital"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
