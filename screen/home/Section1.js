import React, { useState } from "react";
import CommonCard from "../../components/CommonCard";

const Section1 = () => {
  const [activeImage, setActiveImage] = useState("/assets/homepage/img1.png");
  const items = [
    {
      title: "Effortless Profits with Triangular Arbitrage",
      description:
        "Automate trades to capitalize on price differences among three cryptocurrencies within the same exchange.",
      image: "/assets/homepage/dashboardimage.png",
      link: "/analytics",
    },
    {
      title: "Seamless Gains with Intra-Exchange Arbitrage",
      description:
        "Leverage small price variations across trading pairs within one exchange for quick profits.",
      image: "/assets/homepage/dashboardimage.png",
      link: "/users",
    },
    {
      title: "Steady Growth with Dollar-Cost Averaging (DCA)",
      description:
        "Automate regular crypto purchases to reduce volatility and grow wealth steadily.",
      image: "/assets/homepage/dashboardimage.png",
      link: "/notifications",
    },
  ];
  return (
    <div className="  bg-[#05060f] gap-5 p-[2%]">
      {/* <div className=" items-center w-full justify-center  ">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
        Strategies Offered by Qbots:
        Simple, Smart, and Secure
        </h1>

        <p className="mt-6 text-sm sm:text-base md:text-lg text-gray-200  text-center">
        Qbots provides proven automated trading strategies designed for consistent performance and risk management.
Our Grid and DCA (Dollar-Cost Averaging) strategies are built for both beginners and experienced traders, helping you trade efficiently without constant monitoring.
All trades run securely through API connections on Bybit and Mexc — ensuring your funds stay safe while Qbots does the work.
        </p>
      </div> */}

      {/* <CommonCard items={items} className="gap-4" /> */}
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left sm:justify-between w-full">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold  w-full sm:w-[40%]">
          Discover How Qbots Simplifies Trading
        </h1>
        <p className="mt-4 sm:mt-0 w-full sm:w-[50%]  sm:text-md">
          Experience advanced automated crypto trading with a seamless and
          secure process designed for both beginners and experts.
        </p>
      </div>
      <div className="w-full  text-white py-16 px-4 sm:px-8 md:px-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 max-w-7xl mx-auto">
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <div
              onMouseEnter={() => setActiveImage("/assets/homepage/img1.png")}
              className="bg-[#141424] p-6 rounded-2xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer"
            >
              <h3 className="text-xl font-semibold flex items-center gap-2">
                👤 Sign Up The Account
              </h3>
              <p className="mt-2 text-gray-400 text-sm sm:text-base">
                Join Qbots by quickly creating your account with a few basic
                details.
              </p>
            </div>

            <div
              onMouseEnter={() => setActiveImage("/assets/homepage/dashboard2.png")}
              className="bg-[#141424] p-6 rounded-2xl   shadow-lg hover:shadow-purple-500/30 transition-all duration-300 cursor-pointer"
            >
              <h3 className="text-xl font-semibold flex items-center gap-2 ">
                🔗 Connect Your Exchange APIs
              </h3>
              <p className="mt-2 text-gray-400 text-sm sm:text-base">
                Link your preferred exchanges — Mexc or Bybit —
                securely and select your desired trading strategy.
              </p>
            </div>

            <div
              onMouseEnter={() => setActiveImage("/assets/homepage/dashboard2.png")}
              className="bg-[#141424] p-6 rounded-2xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer"
            >
              <h3 className="text-xl font-semibold flex items-center gap-2">
                📊 Start Trading
              </h3>
              <p className="mt-2 text-gray-400 text-sm sm:text-base">
                Leverage automation to execute profitable trades while Qbots
                handles market fluctuations.
              </p>
            </div>

          
          </div>

          <div className="w-full lg:w-1/2 flex justify-center transition-all duration-500">
            <img
              src={activeImage}
              alt="Step Preview"
              className="w-full max-w-[500px] h-auto rounded-3xl shadow-2xl border border-gray-800 object-cover transition-all duration-500"
            />
          </div>
        </div>
      </div>
      {/* <div className=" flex-col items-center text-center   w-full">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold  w-full sm:w-[40%]">
          Why Choose Qbots! Your Gateway to Smarter Trading.
        </h1>
        <div className="w-full sm:w-[50%] gap-5 items-center">
          <p className="mt-4 sm:mt-0   sm:text-md">
            Take the complexity out of crypto trading with our automated
            arbitrage system. Whether you're a beginner or an experienced
            trader.
          </p>
          <button className=" mt-2 px-6 py-3 bg-primary text-[white] font-semibold rounded-[10px] shadow hover:opacity-90 transition">
            Get Started
          </button>
        </div>
      </div> */}
       <div className=" items-center w-full justify-center  ">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
        Why Choose Qbots! Your Gateway to Smarter Trading.
        </h1>

        <p className="mt-3 text-sm sm:text-base md:text-lg text-gray-200  text-center">
        Take the complexity out of crypto trading with our automated
            arbitrage system. Whether you're a beginner or an experienced
            trader.
        </p>
        <div className=" items-center w-full justify-center flex ">
         <button className=" mt-2 px-6 py-3 bg-primary text-[white] font-semibold rounded-[10px] shadow hover:opacity-90 transition">
            Get Started
          </button>
      </div>
      </div>
      <div className="w-full p-5 items-center justify-center flex">
        {" "}
        <img
          src="/assets/homepage/dashboardimage.png"
          alt="Qbots Logo"
          className="w-[90%] sm:w-[60%] h-auto items-center justify-center"
        />
      </div>

      <div className=" items-center w-full justify-center  ">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
        Supports Multiple Exchanges </h1>
<p className="mt-6 text-sm sm:text-base md:text-lg text-gray-200  text-center">
        Gain broader market access and enhanced trading opportunities across multiple exchanges.
        </p>
      </div>

      <div className="w-full p-5 items-center justify-center flex">
        {" "}
        <img
          src="/assets/homepage/suportExchange.png"
          alt="Qbots Logo"
          className="w-[90%] sm:w-[60%] h-auto items-center justify-center"
        />
      </div>
      
    </div>
  );
};

export default Section1;
