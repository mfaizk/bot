"use client";

import Image from "next/image";
import Herosection from "../../screen/home/herosection";
import StrategiesSection from "../../screen/home/StrategiesSection";
import HowItWorks from "../../screen/home/howItWorks";
import WhyChoose from "../../screen/home/WhyChoose";
import PricingCard from "../../screen/home/PricingCard";
import SupportsExchanges from "../../screen/home/SupportsExchanges";
import NeonHero from "../../screen/home/NeonHero";
import Section1 from "../../screen/home/Section1";
import ReferralSection from "../../screen/home/referalSection";
import HomeTab from "../../screen/home/homeTab";

export default function Home() {
  return (
    <div className=" px-[-1%] ">
      <Herosection />
      <StrategiesSection />
      <WhyChoose />
      <HowItWorks />
      <SupportsExchanges />
      {/* <PricingCard /> */}
      {/* <NeonHero /> */}
      {/* <Section1/> */}
      {/* <ReferralSection/> */}
      {/* <div className="bg-[#05060f] w-full">
     <HomeTab/>
     </div> */}
    </div>
  );
}
