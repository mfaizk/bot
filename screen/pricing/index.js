"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";



export default function PricingHero() {
  const [planType, setPlanType] = useState("monthly");
  const [token, setToken] = useState();
  const router = useRouter();

  useMemo(() => {
    const cookieToken = getCookie("token");
    setToken(cookieToken);
  }, []);

  const plans = [
    {
      id: "starter",
      title: "Starter",

      // Monthly values
      priceOldMonthly: "$40",
      priceMonthly: "$20",
      durationMonthly: "1 Month",
      bottomMonthly: "Pay with QIE: $10/month",

      // Yearly values — must be hard-coded
      priceOldYearly: "$400",
      priceYearly: "$200",
      durationYearly: "1 Year",
      bottomYearly: "Pay with QIE: $100/year",

      exchanges: ["BYBIT"],
      access: "Access to 1 bot",
      profitCap: "Unlimited",
      support1: "Share server resources",
      badge: "Limited",
      ribbon: "Save 50%",
      popular: false,
    },
    {
      id: "pro",
      title: "Pro",

      // Monthly
      priceOldMonthly: "$100",
      priceMonthly: "$50",
      durationMonthly: "1 Month",
      bottomMonthly: "Pay with QIE: $25/month",

      // Yearly (hard-coded)
      priceOldYearly: "$1000",
      priceYearly: "$500",
      durationYearly: "1 Year",
      bottomYearly: "Pay with QIE: $250/year",

      exchanges: ["Mexc", "BYBIT"],
      access: "Access to all bots",
      profitCap: "Unlimited",
      support1: "Priority server resources",
      support2: "24/7 premium support",
      badge: "FL. limited",
      ribbon: "Save 50%",
      popular: true,
    },
  ];

  return (
    <section className="text-white px-6 md:px-20 sm:px-10 pt-20 sm:pt-30 pb-10 md:pb-20 overflow-x-hidden">
      <div className="mx-auto ">
        {/* MAIN CONTENT */}
        <div className="flex flex-col items-start">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-center lg:text-left">
            Enjoy Automated Trading at
            <br />
            <span className="block">Competitive Pricing</span>
          </h1>

          <h2 className="mt-5 sm:mt-8 text-2xl md:text-3xl font-semibold text-center lg:text-center justify-center w-full">
            Plans & Pricing
          </h2>

          <div className="flex justify-center mt-8 bg-[#11182f] p-1 rounded-xl border border-white/10 w-fit mx-auto">
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

          <h2 className="mt-4 sm:mt-8 mb-12 text-3xl font-semibold text-center lg:text-center justify-center w-full">
            Pay with QIE coins and get{" "}
            <span className="text-primary">50% off any plan.</span>
          </h2>

          <div className="w-full ">
            <div className="flex flex-col lg:flex-row  justify-center gap-8 ">
              {plans.map((p) => (
                <div
                  key={p.id}
                  className="w-full max-w-md lg:max-w-[420px] mx-auto"
                >
                  <PlanCard plan={p} planType={planType} token={token}/>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-8 max-w-2xl text-gray-300 text-center lg:text-left">
            Automate trades on Mexc & Bybit — single API-only connections.
            Your funds remain on the exchange.
          </p>

          <div className="mt-4 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-6 justify-center lg:justify-start">
            {/* <ExchangeBadge name="BINANCE" accent="yellow" active /> */}
            <ExchangeBadge name="BYBIT" accent="gold" active />
            <ExchangeBadge name="MEXC" accent="gray" active />
             <ExchangeBadge name="KUCOIN" accent="gray" comingSoon />
          </div>

          <div className="pt-2 sm:pt-12 text-sm text-gray-400 flex items-center gap-2 justify-center lg:justify-start">
            <span className="text-pink-400 font-medium">
              Trusted by 18k traders
            </span>{" "}
            • 24/7 uptime
          </div>
        </div>
      </div>
    </section>
  );
}

function PlanCard({ plan, planType = "monthly" ,token}) {
  const router = useRouter();
  const {
    title,
    exchanges,
    profitCap,
    badge,
    ribbon,
    popular,
    access,
    support1,
    support2,

    // monthly
    priceOldMonthly,
    priceMonthly,
    durationMonthly,
    bottomMonthly,

    // yearly
    priceOldYearly,
    priceYearly,
    durationYearly,
    bottomYearly,
  } = plan;

  // choose fields based on planType
  const isYearly = planType === "yearly";

  const showPriceOld = isYearly ? priceOldYearly : priceOldMonthly;
  const showPrice = isYearly ? priceYearly : priceMonthly;
  const showDuration = isYearly ? durationYearly : durationMonthly;
  const showBottom = isYearly ? bottomYearly : bottomMonthly;

  return (
    <div
      className="relative w-full rounded-2xl p-6 sm:p-8 pt-10 pb-8 sm:pt-12 sm:pb-10"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 10px 40px rgba(167,39,124,0.04)",
        backdropFilter: "blur(8px)",
        overflow: "hidden",
      }}
    >
      {badge && (
        <div className="absolute left-0 -top-4 z-20 transform -rotate-12">
          <div className="bg-pink-600 text-white text-xs px-4 py-1 rounded-md shadow-md"></div>
        </div>
      )}

      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 16,
          padding: 1,
          background:
            "linear-gradient(180deg, rgba(196,63,192,0.04), rgba(86,55,185,0.03))",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          pointerEvents: "none",
        }}
      />

      {ribbon && (
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-pink-700/20 text-pink-200 px-3 py-1 rounded-full text-[10px] sm:text-xs">
          {ribbon}
        </div>
      )}

      <div className="text-center mt-2 sm:mt-1">
        <div className="mt-2 text-3xl text-gray-300 font-semibold">{title}</div>
        <div className="text-sm sm:text-md text-gray-400 line-through">
          {showPriceOld}
        </div>
        <div className="mt-2 text-4xl sm:text-5xl font-extrabold">
          {showPrice}
        </div>
        <div className="text-sm text-gray-400 mt-1">{showDuration}</div>
      </div>

      <ul className="mt-6 space-y-3 sm:space-y-4">
        <li className="flex items-start gap-3">
          <CheckMark />
          <span className="text-sm font-semibold">
            Exchanges: {exchanges.join(", ")}
          </span>
        </li>
        <li className="flex items-start gap-3">
          <CheckMark />
          <span className="text-sm font-semibold">Access: {access}</span>
        </li>
        <li className="flex items-start gap-3">
          <CheckMark />
          <span className="text-sm font-semibold">Profit Cap: {profitCap}</span>
        </li>
        {support1 && (
          <li className="flex items-start gap-3">
            <CheckMark />
            <span className="text-sm font-semibold">Server: {support1}</span>
          </li>
        )}
        {support2 && (
          <li className="flex items-start gap-3">
            <CheckMark />
            <span className="text-sm font-semibold">Support: {support2}</span>
          </li>
        )}
      </ul>

      {/* <p className="mt-6 text-gray-400 text-xs sm:text-sm leading-relaxed">
        Explore grid & DCA on supported exchanges. Higher price programmatically
        automated and monitored.
      </p> */}

      <div className="mt-8">
        <button
          onClick={() => {
            if (token) {
              router.push("/dashboard/pricing");
            } else {
              router.push("/login");
            }
          }}
          className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#ff3b7a] to-[#ff6a9a] text-white font-semibold shadow-lg hover:opacity-90 transition"
        >
          {token ? "Choose plan" : "Login To Buy"}
        </button>
      </div>
      <div className="mt-4 text-xl text-[#f116b7] font-semibold text-center">
        {showBottom}
      </div>

      {popular && (
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-primary text-sm px-3 py-1 rounded-full text-pink-200">
          Most Popular
        </div>
      )}
    </div>
  );
}

function ExchangeBadge({
  name,
  accent = "gray",
  active = false,
  comingSoon = false,
}) {
  const logos = {
      MEXC: "/assets/homepage/mexc.png",
    BYBIT: "/assets/homepage/bybit.webp",
    KUCOIN: "/assets/homepage/kucoin.png",

  };
  const isKucoin = name === "KUCOIN";
  const logoSize = isKucoin ? 100 : 40;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-10 h-10 rounded-md grid place-items-center ${
          active ? "bg-opacity-100" : "bg-opacity-30"
        }`}
        style={{
          background: active ? "" : "transparent",
          border: active
            ? "1px solid rgba(255,255,255,0.04)"
            : "1px dashed rgba(255,255,255,0.03)",
        }}
      >
        {logos[name] ? (
          <Image
            src={logos[name]}
            alt={name}
            width={logoSize}
            height={logoSize}
            className={"object-contain"}
          />
        ) : (
          <></>
        )}
      </div>

      <div
        className={`text-sm font-semibold ${
          active ? "text-white" : "text-gray-400"
        }`}
      >
        {name}
      </div>
      {comingSoon && (
        <span className="text-[10px] text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 px-1.5 py-0.5 rounded">
          Coming Soon
        </span>
      )}
    </div>
  );
}

function CheckMark() {
  return (
    <div className="w-6 h-6 rounded-full bg-primary grid place-items-center flex-shrink-0">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
        <path
          d="M20 6L9 17l-5-5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
