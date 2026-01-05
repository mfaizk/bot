"use client";
import React from "react";

/**
 * Put two logos in /public:
 *  - /public/binance.png
 *  - /public/bybit.png
 *
 * Example usage:
 * import SupportsExchanges from "@/components/SupportsExchanges";
 * <SupportsExchanges />
 */

export default function SupportsExchanges() {
  return (
    <section className="bg-[#030b1f] text-white pt-24 px-6">
      <div className=" mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          SUPPORTS <span className="text-primary">TOP EXCHANGES</span>
        </h2>
        <p className="text-slate-300 max-w-3xl mx-auto mb-12 text-lg">
          Gain broader market access and enhanced trading opportunities with minimal commissions through major exchanges.
        </p>

        {/* Visualization container */}
        <div className="relative mx-auto w-full max-w-3xl h-[250px] sm:h-[400px]">
          {/* SVG background (rings + semicircle arc) */}
          <svg viewBox="0 0 900 520" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
            <defs>
              <linearGradient id="semiGrad" x1="0" x2="1">
                <stop offset="0%" stopColor="#4fd6ff"/>
                <stop offset="55%" stopColor="#885bff"/>
                <stop offset="100%" stopColor="#ff66b2"/>
              </linearGradient>
              <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* concentric rings centered horizontally at (450,260) */}
            <g transform="translate(450,260)">
              <circle r="0" fill="#0b1020" />
              <circle r="60" fill="none" stroke="rgba(120,130,200,0.06)" strokeWidth="2"/>
              <circle r="120" fill="none" stroke="rgba(120,130,200,0.05)" strokeWidth="2"/>
              <circle r="180" fill="none" stroke="rgba(120,130,200,0.04)" strokeWidth="2"/>
            </g>

            {/* semicircular arc (top half) from left to right */}
            <g transform="translate(0,0)">
              {/* large semicircle path centered at (450,260) radius 240 */}
              <path
                d="M210,260 A240,240 0 0,1 690,260"
                fill="none"
                stroke="url(#semiGrad)"
                strokeWidth="10"
                strokeLinecap="round"
                style={{ filter: 'url(#softGlow)' }}
              />

              {/* small decorative glow dots on arc */}
              <circle cx="365" cy="110" r="6" fill="#71e6ff" style={{ filter: 'url(#softGlow)' }}/>
              <circle cx="450" cy="30" r="7" fill="#2de0d6" style={{ filter: 'url(#softGlow)' }}/>
              <circle cx="540" cy="112" r="6" fill="#c98bff" style={{ filter: 'url(#softGlow)' }}/>
            </g>
          </svg>

          {/* Left exchange node (Mexc) - absolute positioned relative to container */}
          <div
            className="absolute left-[5%] sm:left-[15%] top-[58%] transform -translate-y-1/2 w-40 flex flex-col items-center"
            style={{ pointerEvents: "auto" }}
          >
            <div className="w-20 h-20 rounded-full bg-[#0b1229] flex items-center justify-center border border-white/8 shadow-[0_10px_30px_rgba(20,120,255,0.06)]">
              <img src="././../assets/homepage/mexc.png" alt="Mexc" className="w-12 h-12 object-contain"/>
            </div>
            <div className="mt-3 text-white font-semibold text-lg">Mexc</div>
          </div>

          {/* Right exchange node (Bybit) */}
          <div
            className="absolute right-[5%] sm:right-[15%] top-[58%] transform -translate-y-1/2 w-40 flex flex-col items-center"
            style={{ pointerEvents: "auto" }}
          >
            <div className="w-20 h-20 rounded-full bg-[#0b1229] flex items-center justify-center border border-white/8 shadow-[0_10px_30px_rgba(200,100,255,0.06)]">
              <img src="././../assets/homepage/bybit.webp" alt="Bybit" className="w-12 h-12 object-contain"/>
            </div>
            <div className="mt-3 text-white font-semibold text-lg">Bybit</div>
          </div>

          {/* Decorative glowing orbit dots placed along bottom center */}
          {/* <div className="absolute left-1/2 -translate-x-1/2 bottom-[6%]">
            <div className="w-3 h-3 rounded-full bg-cyan-400/90 blur-sm" />
          </div> */}
        </div>
      </div>
    </section>
  );
}
