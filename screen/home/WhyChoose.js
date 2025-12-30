import React from "react";
import { Zap, Brain, Lock, Coins, Users } from "lucide-react";

export default function WhyChoose() {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-blue-400" />,
      title: "1-Week Free Trial",
      desc: "Experience full bot power before you subscribe.",
      // desktop position (used only on md+)
      position: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/6",
    },
    {
      icon: <Brain className="w-6 h-6 text-purple-400" />,
      title: "Smart Automation",
      desc: "Time-tested, cloud-based bots running 24/7 with real-time optimization.",
      position: "top-1/2 right-0 -translate-y-1/2 translate-x-4/9",
    },
    {
      icon: <Lock className="w-6 h-6 text-cyan-400" />,
      title: "100% Fund Security",
      desc: "Your money stays in your exchange, we only trade via APIs.",
      position: "bottom-0 left-1/2 -translate-x-1/2 translate-y-4/5",
    },
    {
      icon: <Users className="w-6 h-6 text-indigo-400" />,
      title: "Community Driven",
      desc: "Join a fast-growing global trader community.",
      position: "top-1/2 left-0 -translate-y-1/2 -translate-x-4/9",
    },
    {
      icon: <Coins className="w-6 h-6 text-yellow-400" />,
      title: "Minimal Plans",
      desc: "Start with just $10, available in monthly or yearly plans.",
      position: "bottom-[15%] left-[20%] hidden",
      // optional: we'll surface this in mobile list but keep it hidden on desktop by default
      showOnDesktop: false,
    },
  ];

  return (
    <section className="bg-[#030b1f] text-white py-24 md:py-35 px-6 md:px-20 relative overflow-hidden pb-5 ">
      {/* Title */}
      <div className="max-w-5xl mx-auto text-center mb-10 md:mb-16">
        <h2 className="text-2xl md:text-4xl font-bold">
          WHY CHOOSE <span className="text-primary">Qbots</span>
        </h2>
      </div>

      {/* --- Desktop Circular Layout (md+) --- */}
      <div className="hidden md:flex relative mx-auto max-w-[550px] aspect-square items-center justify-center">
        {/* Glowing Circle Layers */}
        <div className="absolute inset-0 rounded-full border border-primary blur-[1px]" />
        <div className="absolute inset-0 rounded-full border border-primary blur-[2px]" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 blur-xl" />

        {/* Center Q */}
        <div className="relative z-10 flex items-center justify-center w-[14rem] h-[14rem] rounded-full bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 border border-white/20 shadow-[0_0_40px_rgba(99,102,241,0.3)]">
          <img src="/assets/logo1.png" alt="Qbots Logo" className="w-14 md:w-30 h-14 md:h-30 "/>

        </div>

        {/* Feature Elements positioned absolutely around circle (desktop) */}
        {features.map((item, index) => {
          // respect showOnDesktop flag (default true)
          if (item.showOnDesktop === false) return null;
          return (
            <div
              key={index}
              className={`absolute ${item.position} w-48 text-center space-y-2 transform`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="bg-[#0b1229] border border-white/10 p-3 rounded-full">
                  {item.icon}
                </div>
                <h3 className="text-sm md:text-base font-semibold">{item.title}</h3>
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- Mobile / Small screens layout --- */}
      <div className="md:hidden max-w-md mx-auto flex flex-col items-center gap-6">
        {/* Center Q smaller on mobile */}
        <div className="flex items-center justify-center w-36 h-36 rounded-full bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border border-white/10 shadow-md">
        <img src="/assets/logo1.png" alt="Qbots Logo" className="w-18 h-18 "/>
        </div>

        {/* Features stacked in a 2-column grid on small screens */}
        <div className="grid grid-cols-2 gap-3 w-full px-2">
          {features.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-1 p-2">
              <div className="bg-[#0b1229] border border-white/10 p-2 rounded-full">
                {item.icon}
              </div>
              <h4 className="text-xs font-semibold">{item.title}</h4>
              <p className="text-gray-400 text-[11px] leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05),transparent_70%)] pointer-events-none" />
    </section>
  );
}
