"use client";
import { useState } from "react";
import { Check, Lock } from "lucide-react";

export default function PricingCard() {
  const [planType, setPlanType] = useState("monthly");

  return (
    <section className="bg-[#0a0f1e] text-white py-24 px-6 flex justify-center items-center">
      <div className="max-w-sm w-full text-center gap-3">
        {/* Toggle Buttons */}
        <div className="flex justify-center mb-8 bg-[#11182f] p-1 rounded-xl border border-white/10 w-fit mx-auto">
          <button
            onClick={() => setPlanType("monthly")}
            className={`px-6 py-2 rounded-xl text-sm font-medium transition ${
              planType === "monthly"
                ? "bg-primary text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setPlanType("yearly")}
            className={`px-6 py-2 rounded-xl text-sm font-medium transition ${
              planType === "yearly"
                ? "bg-primary text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Yearly
          </button>
        </div>

        <div className="col-span-12 lg:col-span-5 flex justify-center lg:justify-end mt-5">
          <div className="relative w-full max-w-[400px]">
            {/* Ribbon */}
            <div className="absolute -left-4 -top-4 z-20 transform rotate-[-18deg]">
              <div className="bg-pink-600 text-white text-xs px-4 py-1 rounded-md shadow-md">
                FL. limited
              </div>
            </div>

            {/* Card */}
            <div
              className="relative rounded-2xl p-8 pt-12 pb-10"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 10px 40px rgba(167,39,124,0.08)",
                backdropFilter: "blur(8px)",
                overflow: "hidden",
              }}
            >
              {/* inner neon border */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 16,
                  padding: 1,
                  background:
                    "linear-gradient(180deg, rgba(196,63,192,0.06), rgba(86,55,185,0.06))",
                  WebkitMask:
                    "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                  WebkitMaskComposite: "xor",
                  pointerEvents: "none",
                }}
              />

              {/* badge label */}
              <div className="absolute top-6 right-6 bg-pink-700/20 text-pink-200 px-3 py-1 rounded-full text-xs">
                Special offer
              </div>

              {/* Price */}
              <div className="text-center mt-1">
                <div className="text-md text-gray-400 line-through">$2000</div>
                <div className="mt-2 text-5xl font-extrabold">$1200</div>
              </div>

              {/* Bullet list */}
              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <CheckMark />
                  <div>
                    <div className="text-sm font-semibold">Duration: 1 Month</div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <CheckMark />
                  <div>
                    <div className="text-sm font-semibold">Exchanges: Binance , Bybit</div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <CheckMark />
                  <div>
                    <div className="text-sm font-semibold">Profit Cap: Unlimited</div>
                  </div>
                </li>
              </ul>

              {/* small description */}
              <p className="mt-6 text-gray-400 text-sm leading-relaxed">
                Explore grid & DCA on Binance & Bybit. Higher price programmatically automated and monitored.
              </p>

              {/* CTA */}
              <div className="mt-8">
                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff3b7a] to-[#ff6a9a] text-white font-semibold shadow-lg">
                  Login To Buy
                </button>
              </div>
            </div>

            {/* neon outer glow */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: -12,
                borderRadius: 20,
                boxShadow: "0 30px 80px rgba(160,50,140,0.18), inset 0 0 60px rgba(120,30,120,0.08)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}


function CheckMark() {
  return (
    <div className="w-6 h-6 rounded-full bg-primary grid place-items-center flex-shrink-0">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
        <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
