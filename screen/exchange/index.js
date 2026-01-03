// "use client";

// import React from "react";
// import { motion } from "framer-motion";
// import { LineChart, Target, PlayCircle, Cloud } from "lucide-react";
// import { InfiniteMovingCards } from "../../components/ui/moving-card";

// const steps = [
//   {
//     id: 1,
//     title: "Initialization",
//     description:
//       "Begin by integrating your exchange accounts securely via API. Our platform ensures secure and encrypted connections, allowing seamless data flow between Qbots and your exchanges.",
//     icon: <Cloud size={48} />,
//   },
//   {
//     id: 2,
//     title: "Market Monitoring",
//     description:
//       "Once connected, Qbots continuously tracks market movements in real time, analyzing price fluctuations, liquidity, and emerging trends across multiple exchanges.",
//     icon: <LineChart size={48} />,
//   },
//   {
//     id: 3,
//     title: "Opportunity Detection",
//     description:
//       "Our intelligent system identifies potential trading opportunities, including arbitrage gaps, price variations, and strategic trade signals that can enhance profitability.",
//     icon: <Target size={48} />,
//   },
//   {
//     id: 4,
//     title: "Trade Execution",
//     description:
//       "When the system detects a profitable opportunity, it executes trades instantly based on your defined strategy, ensuring efficient and precise order placements while reducing risks and delays.",
//     icon: <PlayCircle size={48} />,
//   },
// ];

// const testimonials = [
//   {
//     name: "Binance",
//     icon: "/assets/exchange/bitmart.png",
//   },
//   {
//     name: "CoinSwitch",
//     icon: "/assets/exchange/binance_1.png",
//   },
//   {
//     name: "Mudrex",
//     icon: "/assets/exchange/kraken.png",
//   },
// ];

// const Exchange = () => {
//   return (
//     <div className="relative w-full flex flex-col  bg-[#05060f] py-30 px-5 md:px-20 gap-10">
//       <div className="w-full md:w-[90%] flex flex-col  gap-2">
//         <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold ">
//           Securely Integrate Your
//         </h1>
//         <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
//           Exchange APIs on Qbots
//         </h1>
//       </div>
//       <div className="w-full  items-center justify-center flex flex-col gap-2">
//         <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
//           Qbots Supports Multiple Exchanges
//         </h1>
//         <p className=" w-full   text-sm sm:text-base md:text-lg text-gray-200 items-center text-center">
//           Our platform allows users to connect and trade across leading
//           cryptocurrency exchanges, ensuring a unified, efficient, and secure
//           trading experience.
//         </p>

//         <InfiniteMovingCards items={testimonials} direction="right" speed="" />
//       </div>
//       <div className="max-w-7xl mx-auto flex flex-col gap-2">
//         <h2 className="text-2xl sm:text-3xl md:text-4xl  font-bold text-center ">
//           How Does It Work?
//         </h2>

//         <p className=" w-full   text-sm sm:text-base md:text-lg text-gray-200 items-center text-center">
//           Qbots is a powerful automated trading platform that helps you
//           monitor, identify, and execute trading opportunities across multiple
//           cryptocurrency exchanges. Our system ensures fast execution and
//           efficiency, making trading seamless and optimized for profitability.
//         </p>

//         <div className="relative flex flex-col md:flex-row justify-between items-center gap-16 mt-2">
//           {steps?.map((step, index) => (
//             <motion.div
//               key={step.id}
//               initial={{ opacity: 0, y: 40 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: index * 0.2 }}
//               className="relative z-10 flex flex-col items-center text-center max-w-xs"
//             >
//               <div className="bg-purple-600/20 border border-purple-500 rounded-2xl p-6 mb-6 flex items-center justify-center">
//                 {step.icon}
//               </div>

//               <span className="text-primary text-lg font-semibold mb-2">
//                 Step {step.id}
//               </span>

//               <h3 className="text-xl font-bold mb-3">{step.title}</h3>

//               <p className="text-gray-300 text-sm leading-relaxed">
//                 {step.description}
//               </p>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Exchange;

"use client";

import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { getCookie } from "cookies-next";
import Link from "next/link";

export default function Exchange() {
  const [token, setToken] = useState();
  const router = useRouter();

  useMemo(() => {
    const cookieToken = getCookie("token");
    setToken(cookieToken);
  }, []);
  return (
    <section className="  text-white px-6 md:px-20 sm:px-10 pt-20 sm:pt-30 pb-10 md:pb-20  overflow-x-hidden">
      <div className=" mx-auto grid grid-cols-12 gap-8 items-start">
        {/* LEFT: Content */}
        <div className="col-span-12 lg:col-span-7 order-1 ">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            Securely Integrate Your
            <br />
            Exchange APIs on Qbots
          </h1>

          <p className="mt-6 text-lg text-gray-300 max-w-3xl">
            Automate trades on Mexc & Bybit — simple API-only connections.
            Your funds remain on the exchange.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              className="px-6 py-3 rounded-lg text-lg font-medium shadow-[0_20px_40px_rgba(255,70,120,0.12)]
                         bg-gradient-to-r from-[#ff2a8f] to-[#ff5a8f] hover:brightness-105 transition"
              onClick={() => {
                if (token) {
                  router.push("/dashboard/home");
                } else {
                  router.push("/login");
                }
              }}
            >
              Make Money
            </button>

            <Link className="px-5 py-3 rounded-lg border border-white/10 bg-white/3 text-gray-200 backdrop-blur-sm" href="Https://www.docs.qbots.trade" target="_blank">
              Learn More
            </Link>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-sm text-gray-300">
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full border-2 border-[#2ecc71]" />
              <span>Trusted by 15k+ traders</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full border-2 border-[#3b82f6]" />
              <span>API-only — no withdrawal access</span>
            </div>
          </div>

          {/* HOW IT WORKS */}
          <div className="mt-16">
            <h2 className="text-3xl font-semibold">How Does It Work?</h2>
            <p className="mt-4 text-gray-300 max-w-3xl">
              Connect Mexc or Bybit using API keys (no withdrawal permissions
              required).
            </p>
          </div>
        </div>

        {/* RIGHT: Neon ring + badges */}
        <div className="col-span-12 lg:col-span-5 flex justify-center  lg:justify-center items-start lg:items-center gap-20 order-2 h-[100%]">
          {/* Mexc block */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="p-1.5 rounded-md bg-[#0d1726] border border-white/6 w-[80px] h-[80px] flex items-center justify-center">
              <img
                src="././../assets/homepage/mexc.png"
                alt="Mexc"
                className="max-w-[60px] w-full h-auto object-contain"
              />
            </div>
            <p className="text-md text-gray-300 font-bold text-center">
              Mexc
            </p>
          </div>

          {/* Bybit block */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="p-1.5 rounded-md bg-[#0d1726] border border-white/6 w-[80px] h-[80px] flex items-center justify-center">
              <img
                src="././../assets/homepage/bybit.webp"
                alt="Bybit"
                className="max-w-[60px] w-full h-auto object-contain"
              />
            </div>
            <p className="text-md text-gray-300 font-bold text-center">Bybit</p>
          </div>
        </div>
      </div>

      <div className="mt-15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard
          icon={<PlusIcon />}
          title="Add Exchange"
          description="Connect Mexc or Bybit using API keys (no withdrawal permissions)."
        />
        <FeatureCard
          icon={<BotIcon />}
          title="Create Your Bot"
          description="Select grid or DCA, pick pair & price, choose an optimized preset."
        />
        <FeatureCard
          icon={<StrategyIcon />}
          title="Set Strategy"
          description="Fine tune parameters or turn limits ability with safe defaults."
        />
        <FeatureCard
          icon={<MonitorIcon />}
          title="Monitor & Manage"
          description="Watch performance, pause or stop. Do it all from your dashboard."
        />
      </div>

      <style js>{`
        .animate-slow-spin {
          animation: slowSpin 20s linear infinite;
        }
        @keyframes slowSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 1024px) {
          h1 { font-size: 52px !important; }
        }
        @media (max-width: 640px) {
          h1 { font-size: 36px !important; line-height: 1.02 !important; }
        }
      `}</style>
    </section>
  );
}

/* ----------------------
   Subcomponents & SVGs
   ---------------------- */

function FeatureCard({ icon, title, description }) {
  return (
    <div
      className="rounded-2xl p-5 bg-gradient-to-b from-white/3 to-white/2 border border-white/6 backdrop-blur-sm"
      style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
    >
      <div className="flex items-start gap-4">
        {/* Icon container */}
        <div className="w-20 h-20 rounded-lg bg-black/20 grid place-items-center text-white flex-shrink-0">
          <div className="w-12 h-12">{icon}</div>
        </div>

        {/* Text content */}
        <div>
          <div className="font-semibold text-lg">{title}</div>
          <div className="mt-2 text-sm text-gray-400">{description}</div>
        </div>
      </div>
    </div>
  );
}

/* Icons */
function PlusIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 5v14M5 12h14"
        stroke="#ff6b9b"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BotIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="3"
        width="18"
        height="12"
        rx="3"
        stroke="#7dd3fc"
        strokeWidth="2"
      />
      <circle cx="9.5" cy="9" r="1.5" fill="#7dd3fc" />
      <circle cx="14.5" cy="9" r="1.5" fill="#7dd3fc" />
    </svg>
  );
}

function StrategyIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 16l6-6 4 4 6-6"
        stroke="#c084fc"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="4"
        width="18"
        height="12"
        rx="2"
        stroke="#34d399"
        strokeWidth="2"
      />
      <path
        d="M8 20h8"
        stroke="#34d399"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* Exchange logos */
function BinanceLogo() {
  return (
    <svg width="68" height="68" viewBox="0 0 24 24" fill="none">
      <g transform="translate(2 2) scale(0.85)">
        <path d="M8 1L11 4L8 7L5 4L8 1Z" fill="#F3BA2F" />
        <path d="M1 8L4 11L1 14L-2 11L1 8Z" fill="#F3BA2F" />
        <path d="M8 15L11 18L8 21L5 18L8 15Z" fill="#F3BA2F" />
        <path d="M15 8L18 11L15 14L12 11L15 8Z" fill="#F3BA2F" />
        <path d="M8 8L11 11L8 14L5 11L8 8Z" fill="#F3BA2F" />
      </g>
    </svg>
  );
}
function BybitLogo() {
  return (
    <svg width="68" height="68" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" fill="transparent" />
      <text
        x="50%"
        y="52%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill="#ff6b88"
      >
        B
      </text>
    </svg>
  );
}
