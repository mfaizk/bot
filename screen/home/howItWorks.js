

import { Key, Bot, Settings, BarChart3 } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Add Exchange",
      description:
        "Securely connect your Mexc or Bybit account using API keys. Your funds always stay on your exchange.",
      icon: <Key className="w-10 h-10 text-primary" />,
    },
    {
      number: "02",
      title: "Create Your Bot",
      description:
        "Choose between Grid or DCA — pick what fits your trading style and goals.",
      icon: <Bot className="w-10 h-10 text-primary" />,
    },
    {
      number: "03",
      title: "Set Strategy",
      description:
        "Customize trading parameters or run instantly with default optimized settings.",
      icon: <Settings className="w-10 h-10 text-primary" />,
    },
    {
      number: "04",
      title: "Monitor & Manage",
      description:
        "Track live performance, open/close orders, and P&L — all from a single dashboard.",
      icon: <BarChart3 className="w-10 h-10 text-primary" />,
    },
  ];

  return (
    <section className="bg-[#030b1f] text-white pt-15 md:pt-26 pb-0 md:pb-10 px-6 md:px-20 relative overflow-hidden">
      <div className=" mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          How Qbots Works —{" "}
          <span className="text-primary">Simple, Secure, Automated</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          From connecting your exchange to running AI-driven strategies — Qbots
          makes automation effortless.
        </p>
      </div>

      {/* Timeline Line */}
      <div className="absolute top-[60%] left-0 w-full h-[2px] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 hidden md:block"></div>

      {/* Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative  mx-auto z-10">
        {steps.map((step, index) => (
          <div
            key={index}
            className="relative flex flex-col items-center text-center bg-[#0b1229] border border-white/10 rounded-2xl p-8 shadow-md hover:shadow-blue-500/10 transition"
          >
            {/* Number Circle */}
            <div className="absolute -top-5 bg-[#030b1f] px-4 text-sm font-semibold text-blue-300">
              {step.number}
            </div>

            {/* Icon */}
            <div className="mb-4 p-3 rounded-full bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/10">
              {step.icon}
            </div>

            {/* Title & Description */}
            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* Subtle Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(80,56,240,0.1),transparent_70%)] pointer-events-none" />
    </section>
  );
}
