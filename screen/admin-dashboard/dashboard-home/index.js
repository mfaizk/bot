"use client";

import React, { useState } from "react";
import { ArrowLeftRight, Receipt, TrendingUp, User } from "lucide-react";
import { useGetAdminDashboard } from "@/queries/admin";
import ActivityIndicator from "@/components/activity-indicator";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { api } from "@/service/api-service";
import StatCard from "./statCard";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const baseUrl = "https://productionb.qbots.trade/api/v1";

/* ---------------- FETCH HOOKS ---------------- */
const useUserAnalytics = (fromDate, toDate) =>
  useQuery({
    queryKey: ["userAnalytics", fromDate, toDate],
    queryFn: async () => {
      const res = await api.post(
        `${baseUrl}/admin/userAnalytics`,
        new URLSearchParams({ fromDate, toDate }),
      );
      return res.data.result;
    },
  });

const useTransactionChart = (transactionType, fromDate, toDate) =>
  useQuery({
    queryKey: ["transactionChart", transactionType, fromDate, toDate],
    queryFn: async () => {
      const res = await api.post(
        `${baseUrl}/admin/transactionChart`,
        new URLSearchParams({
          transactionType,
          fromDate,
          toDate,
        }),
      );
      return res.data.result;
    },
  });

export default function Dashboard() {
  const { data: dashboardCount, isLoading: dashboardPending } =
    useGetAdminDashboard();

  const [transactionType, setTransactionType] = useState("QIE");

  const [userFrom, setUserFrom] = useState(new Date("2026-01-01"));
  const [userTo, setUserTo] = useState(new Date("2026-01-07"));

  const [txFrom, setTxFrom] = useState(new Date("2025-01-12"));
  const [txTo, setTxTo] = useState(new Date("2025-01-17"));

  const { data: userAnalytics } = useUserAnalytics(
    moment(userFrom).format("YYYY-MM-DD"),
    moment(userTo).format("YYYY-MM-DD"),
  );

  const { data: txChart } = useTransactionChart(
    transactionType,
    moment(txFrom).format("YYYY-MM-DD"),
    moment(txTo).format("YYYY-MM-DD"),
  );

  if (dashboardPending) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4 text-white">
        <ActivityIndicator isLoading className="h-10 w-10" />
        <p className="text-xl font-semibold">Fetching Dashboard...</p>
      </div>
    );
  }

  const datePickerClasses =
    "bg-gray-800 border border-gray-700 p-2 rounded-lg text-white text-sm w-[140px]";

  return (
    <div className="min-h-screen text-white px-4 md:px-6 py-6">
      <div className="max-w-screen-2xl mx-auto">
        {/* ===== STAT CARDS ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <StatCard
            title="Exchange"
            value={dashboardCount?.exchangeConnectedCount}
            subtitle="Connected Exchange"
            icon={ArrowLeftRight}
          />
          {/* <StatCard
            title="Transactions"
            value={dashboardCount?.transactionCount}
            subtitle="Transactions"
            icon={Receipt}
          /> */}
          {/* <StatCard
            title="Total Bots"
            value={dashboardCount?.noOfBot}
            subtitle="Total Bots"
            icon={TrendingUp}
          /> */}
          <StatCard
            title="Users"
            value={dashboardCount?.userCounts}
            subtitle="Total Users"
            icon={User}
          />
        </div>

        {/* ===== USER GROWTH TREND ===== */}
        <div className="bg-[#111] rounded-2xl p-6 border border-white/10 shadow-xl mb-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-5 gap-4">
            <h2 className="text-xl font-semibold">User Growth Trend</h2>

            <div className="flex gap-2">
              <ReactDatePicker
                selected={userFrom}
                onChange={(date) => date && setUserFrom(date)}
                selectsStart
                startDate={userFrom}
                endDate={userTo}
                maxDate={userTo}
                className={datePickerClasses}
                dateFormat="yyyy-MM-dd"
                placeholderText="From"
              />
              <span className="self-center">→</span>
              <ReactDatePicker
                selected={userTo}
                onChange={(date) => date && setUserTo(date)}
                selectsEnd
                startDate={userFrom}
                endDate={userTo}
                minDate={userFrom}
                className={datePickerClasses}
                dateFormat="yyyy-MM-dd"
                placeholderText="To"
              />
            </div>
          </div>

          <ResponsiveContainer width="100%" height={330}>
            <LineChart data={userAnalytics?.chartData ?? []}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

              <XAxis
                dataKey="date"
                tickFormatter={(value) => moment(value).format("DD MMM YYYY")} // format
                angle={-35}
                textAnchor="end"
                height={60}
                style={{ fontSize: 12, fill: "#6B7280", fontWeight: 500 }} // styling
              />

              <YAxis
                tickFormatter={(v) => v.toLocaleString()} // optional formatting (1,000, 12,300 etc)
                angle={-45}
                textAnchor="end"
                width={70}
                style={{ fontSize: 12, fill: "#6B7280", fontWeight: 500 }} // styling
              />

              <Tooltip
                labelFormatter={(value) => moment(value).format("DD MMM YYYY")}
                formatter={(v) => v.toLocaleString()}
              />

              {/* <Legend /> */}

              <Line
                type="monotone"
                dataKey="userCount"
                stroke="#34D399"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ===== TRANSACTION VOLUME ===== */}
        <div className="bg-[#111] rounded-2xl p-6 border border-white/10 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-center mb-5 gap-4">
            <div>
              <h2 className="text-xl font-semibold">Transaction Volume</h2>
            </div>
            {/* NORMAL SELECT */}
            <div className="flex gap-4 flex-wrap">
              <div className="flex gap-2">
                <ReactDatePicker
                  selected={txFrom}
                  onChange={(date) => date && setTxFrom(date)}
                  selectsStart
                  startDate={txFrom}
                  endDate={txTo}
                  maxDate={txTo}
                  className={datePickerClasses}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="From"
                />
                <span className="self-center">→</span>
                <ReactDatePicker
                  selected={txTo}
                  onChange={(date) => date && setTxTo(date)}
                  selectsEnd
                  startDate={txFrom}
                  endDate={txTo}
                  minDate={txFrom}
                  className={datePickerClasses}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="To"
                />
              </div>
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                className="bg-gray-900 border border-gray-700 p-2 rounded-lg text-white text-sm"
              >
                <option value="QIE">QIE</option>
                <option value="PAYPAL">PAYPAL</option>
              </select>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={330}>
            <BarChart data={txChart?.transactions ?? []}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis
                dataKey="createdAt"
                tickFormatter={(v) => v.split("T")[0]}
              />
              <YAxis />
              <Tooltip />
              {/* <Legend /> */}
              <Bar dataKey="qieAmount" fill="#a78bfa" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div>
            <div className="flex gap-4">
              <p>Total Qie Amount:</p>
              <p>{txChart?.totalQieAmount || 0}</p>
            </div>
            <div className="flex gap-4">
              <p>Total Amount:</p>
              <p>{txChart?.totalAmount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
