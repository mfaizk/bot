"use client";
import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { getCookie } from "cookies-next";
import { useEffect, useMemo, useState } from "react";
import Marquee from "react-fast-marquee";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HeroSection() {
  const [token, setToken] = useState();
  const router = useRouter();

  useMemo(() => {
    const cookieToken = getCookie("token");
    setToken(cookieToken);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#030b1f] text-white pt-30  items-center justify-center px-6 md:px-20">
      <div className="inline-block px-4 py-1.5 pb-4 text-sm tracking-wide font-medium text-gray-200"></div>
      <div className="absolute top-25 md:top-30 left-0 w-full bg-primary ">
        <div className="px-6 md:px-20"> {/* this adds parent padding */}
          <Marquee
            gradient={false}
            className="text-lg md:text-xl font-bold py-3"
          >
            This app is in active development. Data, features, and content may
            be incomplete or inaccurate.
          </Marquee>
        </div>
      </div>
      <div className=" mx-auto flex flex-col lg:flex-row items-center justify-between w-full gap-12 pt-10 md:pt-15">
        <div className="flex-1 space-y-6 ">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Trade Smarter with
            <br />
            <span className="bg-primary to-cyan-400 bg-clip-text text-transparent">
              AI-Powered Bots
            </span>
          </h1>

          <p className="text-gray-400 text-lg max-w-lg mx-auto lg:mx-0">
            Automate trades on Mexc & Bybit — minimal setup, continuous
            optimization.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-center gap-4 pt-2">
            <button
              onClick={() => {
                if (token) {
                  router.push("/dashboard/home");
                } else {
                  router.push("/login");
                }
              }}
              className="px-6 py-3 rounded-lg font-medium text-white bg-primary hover:opacity-90 transition flex items-center space-x-2 shadow-lg shadow-blue-500/30"
            >
              <span>🚀</span>
              <span>Make Money</span>
            </button>

            <Link className="px-6 py-3 rounded-lg font-medium border border-white/20 text-gray-200 hover:bg-white/10 transition" href="Https://www.docs.qbots.trade" target="_blank">
              Learn
            </Link>
          </div>

          {/* Feature List */}
          <div className="flex items-center justify-start">
            <div className="pt-6 space-y-3 text-gray-300 flex-col justify-center">
              <Feature text="Trusted by 15k traders" />
              <Feature text="24/7 uptime" />
              <Feature text="Funds stay on Mexc & Bybit" />
            </div>
          </div>

          {/* Left-aligned stats line */}
          <div className="flex-1 space-y-6 pt-4 text-sm text-gray-400 flex items-center justify-start px-4 lg:px-0 text-center">
            <span className="text-primary font-medium">
              Trusted by 18k traders
            </span>{" "}
            • 24/7 uptime
          </div>
        </div>

        {/* Right Image Section */}
        <div className="flex-1 flex justify-center lg:justify-end relative">
          <div className="relative w-[100%] max-w-[750px] ">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-200 rounded-3xl blur-3xl opacity-40 animate-pulse"></div>
            <Image
              src="/assets/homepage/heroimageLaptop.png"
              alt="Dashboard preview"
              width={1000}
              height={1000}
              className="relative rounded-2xl"
            />
          </div>
        </div>
      </div>

      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,rgba(0,60,255,0.1),transparent_70%)] pointer-events-none" />
    </section>
  );
}

function Feature({ text }) {
  return (
    <div className="flex items-center space-x-2">
      <Check className="text-cyan-400 w-5 h-5" />
      <span>{text}</span>
    </div>
  );
}
