"use client";
import {
  BarChart3,
  DollarSign,
  Rocket,
  TrendingUp,
  Bot,
  Shuffle,
  Activity,
  Network,
  Cpu,
} from "lucide-react";

export default function StrategiesSection() {
  const strategies = [
    {
      title: "Grid Trading",
      description:
        "Great for sideways markets — grid bots earn from frequent price moves within a stable range.",
      icon: <BarChart3 className="w-8 h-8 text-primary" />,
      status: "Active",
      statusColor: "bg-emerald-700/70 text-white",
    },
    {
      title: "DCA (Dollar-Cost Averaging)",
      description: "Invest gradually to reduce volatility risk.",
      icon: <DollarSign className="w-8 h-8 text-primary" />,
      status: "Active",
      statusColor: "bg-emerald-700/70 text-white",
    },
    {
      title: "Futures Grid",
      description: "Amplify profits with leveraged grid trading.",
      icon: <Rocket className="w-8 h-8 text-primary" />,
      status: "Active",
      statusColor: "bg-emerald-700/70 text-white",
    },
    {
      title: "Momentum Strategy",
      description: "Ride market trends with momentum signals.",
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      status: "Coming Soon",
      statusColor: "bg-primary text-purple-200",
    },
    {
      title: "AI Smart Strategy",
      description: "Adaptive bots powered by real-time AI.",
      icon: <Bot className="w-8 h-8 text-primary" />,
      status: "Coming Soon",
      statusColor: "bg-primary text-purple-200",
    },
    {
      title: "Triangular Arbitrage",
      description:
        "Exploit price differences between three trading pairs simultaneously and efficiently.",
      icon: <Shuffle className="w-8 h-8 text-primary" />,
      status: "Coming Soon",
      statusColor: "bg-primary text-purple-200",
    },
    {
      title: "Mean Reversion Strategy",
      description:
        "Capitalize on short-term price deviations — buy undervalued, sell overvalued.",
      icon: <Activity className="w-8 h-8 text-primary" />,
      status: "Coming Soon",
      statusColor: "bg-primary text-purple-200",
    },
    {
      title: "Momentum Delta Neutral",
      description:
        "Combine momentum insights with hedged neutrality to capture pure alpha.",
      icon: <Network className="w-8 h-8 text-primary" />,
      status: "Coming Soon",
      statusColor: "bg-primary text-purple-200",
    },
    {
      title: "AI Advanced Strategy",
      description:
        "Next-gen intelligent trading self-learning bots that evolve with market dynamics.",
      icon: <Cpu className="w-8 h-8 text-primary" />,
      status: "Coming Soon",
      statusColor: "bg-primary text-purple-200",
    },
  ];

  return (
    <section className="bg-[#030b1f] text-white pt-24 md:pt-35 px-6 md:px-20 relative overflow-hidden">
      <div className=" mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Strategies Offered by <span className="text-primary">Qbots</span>: and
          Secure
        </h2>
        <p className="text-gray-400 text-lg">
          Automate your trading with powerful strategies – designed for every
          market condition
        </p>
      </div>

      {/* Strategy Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6  mx-auto">
        {strategies?.map((strategy, index) => (
          <div
            key={index}
            className="bg-[#0b1229] border border-white/10 rounded-2xl p-6 hover:bg-[#121a36] transition group shadow-md hover:shadow-blue-500/10"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-[#141c3b] group-hover:bg-[#1d2650] transition">
                  {strategy.icon}
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-md bg-primary ${strategy.statusColor}`}
                >
                  {strategy.status}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{strategy.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {strategy.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05),transparent_70%)] pointer-events-none" />
    </section>
  );
}
