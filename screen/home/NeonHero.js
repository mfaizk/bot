"use client";

import React from "react";
import {
  TrendingUp,
  
  Cpu,
  GitBranch,
  RefreshCw,
} from "lucide-react";

/**
 * ComingSoon - neon-styled concentric rings with four feature nodes.
 *
 * Usage:
 *  import ComingSoon from "@/components/ComingSoon";
 *  <ComingSoon />
 *
 * Tailwind should be configured in your project as usual.
 */

export default function ComingSoon() {
  return (
    <section className="bg-[#030315] text-white py-20 px-6 md:px-20">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-wide mb-6">
          <span className="text-cyan-300/95">COMING SOON</span>
        </h1>

        {/* subtitle (optional) */}
        <p className="text-slate-300 max-w-2xl mx-auto mb-12">
          New strategies & exchanges will be available soon — stay tuned.
        </p>

        {/* visualization box */}
        <div className="relative mx-auto w-full max-w-[820px] h-[620px]">
          {/* SVG rings + arcs */}
          <svg
            viewBox="0 0 820 620"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="neonGrad" x1="0" x2="1">
                <stop offset="0%" stopColor="#3ee0ff" />
                <stop offset="60%" stopColor="#6f5bff" />
                <stop offset="100%" stopColor="#8a5cff" />
              </linearGradient>

              <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* concentric rings centered at (410,310) */}
            <g transform="translate(410,310)">
              <circle r="0" fill="#061021" />
              <circle r="140" fill="none" stroke="rgba(120,140,200,0.04)" strokeWidth="3" />
              <circle r="200" fill="none" stroke="rgba(120,140,200,0.03)" strokeWidth="2" />
              <circle r="260" fill="none" stroke="rgba(120,140,200,0.02)" strokeWidth="2" />
            </g>

            {/* semicircle neon arc on top (from left to right) */}
            <g>
              <path
                d="M150,310 A260,260 0 0,1 670,310"
                fill="none"
                stroke="url(#neonGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                style={{ filter: "url(#neonGlow)" }}
                opacity="1"
              />
              {/* small glow dots on arc */}
              <circle cx="240" cy="170" r="6" fill="#49d7ff" style={{ filter: "url(#neonGlow)" }} />
              <circle cx="410" cy="80" r="7" fill="#36c9ff" style={{ filter: "url(#neonGlow)" }} />
              <circle cx="560" cy="210" r="6" fill="#a57aff" style={{ filter: "url(#neonGlow)" }} />
            </g>

            {/* small inner semicircle */}
            <g>
              <path
                d="M210,310 A180,180 0 0,1 610,310"
                fill="none"
                stroke="rgba(60,170,255,0.12)"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </g>

            {/* center circular icon (rotating arrows) */}
            <g transform="translate(410,310)">
              <circle r="40" fill="rgba(60,142,255,0.06)" />
              <g transform="translate(-11,-10)">
                <RefreshCw size={48} className="text-cyan-400" />
              </g>
            </g>
          </svg>

          {/* Four feature nodes - positioned absolutely around rings */}
          {/* Top-left: Momentum Strategy */}
          <div className="absolute left-[6%] top-[36%] w-[220px] text-left">
            <div className="flex items-start gap-4">
              <div className="bg-[#071025] rounded-md p-3 w-12 h-12 flex items-center justify-center border border-white/6 shadow-[0_8px_40px_rgba(50,160,255,0.06)]">
                <TrendingUp className="w-6 h-6 text-cyan-300" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Momentum Strategy</h3>
                <p className="text-cyan-200/90 mt-1">Capture trends automatically</p>
              </div>
            </div>
          </div>

          {/* Top-right: Delta-Neutral Strategy */}
          <div className="absolute right-[6%] top-[36%] w-[220px] text-right">
            <div className="flex items-start gap-4 justify-end">
              <div>
                <h3 className="text-xl font-semibold text-white">Delta-Neutral Strategy</h3>
                <p className="text-cyan-200/90 mt-1">Hedge volatility smartly</p>
              </div>
              <div className="bg-[#071025] rounded-md p-3 w-12 h-12 flex items-center justify-center border border-white/6 shadow-[0_8px_40px_rgba(140,120,255,0.06)]">
                <Cpu className="w-6 h-6 text-cyan-300" />
              </div>
            </div>
          </div>

          {/* Bottom-left: AI Smart Bots */}
          <div className="absolute left-[15%] bottom-[16%] w-[220px] text-left">
            <div className="flex items-start gap-4">
              <div className="bg-[#071025] rounded-md p-3 w-12 h-12 flex items-center justify-center border border-white/6 shadow-[0_8px_40px_rgba(50,160,255,0.06)]">
                <Cpu className="w-6 h-6 text-cyan-300" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">AI Smart Bots</h3>
                <p className="text-cyan-200/90 mt-1">Learning from market data</p>
              </div>
            </div>
          </div>

          {/* Bottom-right: More Exchanges */}
          <div className="absolute right-[15%] bottom-[16%] w-[220px] text-right">
            <div className="flex items-start gap-4 justify-end">
              <div>
                <h3 className="text-xl font-semibold text-white">More Exchanges</h3>
                <p className="text-cyan-200/90 mt-1">OKX, Bitget, KuCoin next</p>
              </div>
              <div className="bg-[#071025] rounded-md p-3 w-12 h-12 flex items-center justify-center border border-white/6 shadow-[0_8px_40px_rgba(50,160,255,0.06)]">
                <GitBranch className="w-6 h-6 text-cyan-300" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
