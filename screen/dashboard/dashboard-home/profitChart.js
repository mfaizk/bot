"use client";
import { useDcaSummary, useGridSummary } from "@/queries/dashboard";
import { useFutureGridSummary } from "@/queries/futureGrid";
import { formatCurrency } from "@/utils";
import { useState } from "react";

export default function ProfitChart() {
  return (
    <div className="w-full bg-[#0B0B12] text-white p-6 rounded-2xl shadow-lg">
      <BotStatsCards />
    </div>
  );
}

function BotStatsCards() {
  const [activeTab, setActiveTab] = useState("grid");
  const { data: dcaStats, isLoading: dcaSummaryLoading } = useDcaSummary();
  const { data: gridStats, isLoading: gridSummaryLoading } = useGridSummary();
  const { data: futureStats, isLoading: futureSummaryLoading } = useFutureGridSummary();
  // console.log(dcaSummary, gridSummary, "asdasd");

  // const gridStats = {
  //   filledOrders: 1248,
  //   realizedPnL: 248.73,
  //   gridCycles: 87,
  //   mostProfitableBot: {
  //     symbol: "XRP/USDT",
  //     exchange: "Bybit",
  //     profit: 184.42,
  //   },
  // };

  // const dcaStats = {
  //   totalBots: 3,
  //   runningBots: 2,
  //   totalTrades: 18,
  //   buyTrades: 10,
  //   sellTrades: 8,
  // };

  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition
        ${activeTab === id
          ? "bg-primary text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
    >
      {label}
    </button>
  );

  const StatCard = ({ label, value, highlight }) => (
    <div
      className={`rounded-xl p-4 shadow-sm text-white
        ${highlight ? "bg-primary " : "bg-secondary "}`}
    >
      <p className="text-xs ">{label}</p>
      <p className="text-lg font-semibold ">{value}</p>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto lg:h-82 ">
      <p className="py-4 text-4xl">Statistics</p>
      <div className="flex gap-2 mb-6">
        <TabButton id="grid" label="Grid Bot" />
        <TabButton id="dca" label="DCA Bot" />
        <TabButton id="future" label="Future Grid Bot" />

      </div>

      {/* Grid Bot */}
      {activeTab === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Filled Orders"
            value={gridStats?.filledOrders || 0}
          />

          <StatCard
            label="Realized PnL"
            value={`$${Number(gridStats?.realizedPnL || 0).toFixed(2)}`}
            highlight={Number(gridStats?.realizedPnL || 0) > 0}
          />

          <StatCard
            label="Grid Cycles"
            value={gridStats?.gridCycles || 0}
          />

          <StatCard
            label="Active Bots"
            value={gridStats?.activeBots || 0}
          />

          {gridStats?.mostProfitableBot && (
            <StatCard
              label="Top Bot Profit"
              value={`${gridStats?.mostProfitableBot?.symbol} • $${Number(
                gridStats?.mostProfitableBot?.profit || 0
              ).toFixed(2)}`}
              highlight={Number(gridStats?.mostProfitableBot?.profit || 0) > 0}
            />
          )}
        </div>
      )}
      {/* Future Grid Bot */}
      {activeTab === "future" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Filled Orders"
            value={futureStats?.filledOrders || 0}
          />

          <StatCard
            label="Realized PnL"
            value={`$${Number(futureStats?.realizedPnL || 0).toFixed(2)}`}
            highlight={Number(futureStats?.realizedPnL || 0) > 0}
          />

          <StatCard
            label="Grid Cycles"
            value={futureStats?.gridCycles || 0}
          />

          {futureStats?.mostProfitableBot && (
            <StatCard
              label="Top Bot Profit"
              value={`${futureStats?.mostProfitableBot?.symbol} • $${Number(
                futureStats?.mostProfitableBot?.profit || 0
              ).toFixed(2)}`}
              highlight={
                Number(futureStats?.mostProfitableBot?.profit || 0) > 0
              }
            />
          )}

          {/* Regime Section */}
          {/* Regime Section */}
          {(() => {
            const regime = futureStats?.regime || {};

            return (
              <>
                <StatCard
                  label="Sideways Bots"
                  value={regime?.sidewaysBots ?? 0}
                />
                <StatCard
                  label="Trending Bots"
                  value={regime?.trendingBots ?? 0}
                />
                <StatCard
                  label="Protection Active"
                  value={regime?.protectionActiveBots ?? 0}
                />
                <StatCard
                  label="Cooldown Bots"
                  value={regime?.cooldownBots ?? 0}
                />
                <StatCard
                  label="Cooldown Triggers"
                  value={regime?.totalCooldownTriggers ?? 0}
                />
              </>
            );
          })()}
        </div>
      )}
      {/* DCA Bot */}
      {activeTab === "dca" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard label="Total Bots" value={dcaStats?.total_bots || 0} />
          <StatCard
            label="Running Bots"
            value={dcaStats?.running_bots || 0}
            highlight
          />
          <StatCard label="Total Trades" value={dcaStats?.total_trades || 0} />
          <StatCard label="Buy Trades" value={dcaStats?.buy_trades || 0} />
          <StatCard label="Sell Trades" value={dcaStats?.sell_trades || 0} />
          {/* <StatCard label="Realized PnL" value={dcaStats?.realized_pnl?.toFixed(2) || 0} /> */}
          <StatCard
            label="Realized PnL"
            value={`$${dcaStats?.realized_pnl?.toFixed(2) || 0}`}
            highlight
          />
        </div>
      )}
    </div>
  );
}
