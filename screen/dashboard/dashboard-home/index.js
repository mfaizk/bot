"use client";

import React, { useMemo, useState } from "react";
import DashboardHeader from "./dashboardHeader";
import StatCard from "./statCard";
import ProfitChart from "./profitChart";
import CurrentPlan from "./currentPlan";
import { ArrowLeftRight, Receipt, TrendingUp, Wallet } from "lucide-react";
import {
  
  useHaveActiveSubscriptions,
} from "@/queries/payment";
import NotActiveSubs from "@/components/no-active-subs";
import {
  useAccountDetails,
  useExchangeCount,
  useExchangesAccountDetails,
  useTotalProfit,
  useTransactionCount,
} from "@/queries/dashboard";
import ActivityIndicator from "@/components/activity-indicator";
import { getKeysExchange, useGetKeysExchange } from "@/queries/exchange";
import { useUserProfile } from "@/queries/profile";

export default function Dashboard() {
  const [selectedExchangeId, setselectedExchangeId] = useState("");
  

  const { data: exchangeCount, isPending: exchangeCountPending } =
    useExchangeCount();
  const { data: trxCount, isPending: trxCountPending } = useTransactionCount();
  const { data: totalProfit, isPending: totalProfitPending } = useTotalProfit();
  const { data: exchangeKeys, isPending: exchangeKeysPending } =
    useGetKeysExchange();
  const { data: exchangeDetail, isPending: exchangeDetailPending } =
    useExchangesAccountDetails({ exchangeId: 35 });
  const { data: profile, isPending: profilePending } = useUserProfile();

  const activeSubs = useMemo(() => {
    return profile?.subscriptionDetail?.find(
      (item) => item?.planStatus == "ACTIVE"
    );
  }, [profile]);

  // const { data: accountDetail, isPending: accountDetailPending } =
  // useAccountDetails();

  // const balance = useMemo(() => {
  //   return accountDetail?.reduce(
  //     (a, b) => Number(a || 0) + Number(b?.balance?.["USDT"] || 0),
  //     0
  //   );
  // }, [accountDetail]);

  // if (
  //   haveActiveSubsPending ||
  //   accountDetailPending ||
  //   exchangeCountPending ||
  //   trxCountPending ||
  //   totalProfitPending
  // ) {
  //   return (
  //     <div className=" min-h-screen flex flex-col justify-center items-center gap-4">
  //       <ActivityIndicator isLoading className={"h-12 w-12"} />
  //       <p className="text-2xl font-semibold">Getting Data...</p>
  //     </div>
  //   );
  // }



  return (
    <div className="min-h-screen  text-white ">
      <div className="max-w-[1600px] mx-auto">
        <DashboardHeader />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* <StatCard
            title="Account Balance"
            value={Number(balance)?.toFixed(2) || 0}
            currency="(USDT)"
            subtitle="Lock Balance : 0
Available to Trade : 0"
            icon={Wallet}
          /> */}
          <StatCard
            title="Exchange"
            value={exchangeCount}
            subtitle="Connected Exchange"
            icon={ArrowLeftRight}
          />
          <StatCard
            title="Total Transactions"
            value={trxCount}
            subtitle="Transactions"
            icon={Receipt}
          />
          <StatCard
            title="Total Profit & Loss"
            value={totalProfit}
            currency="(USD)"
            currencyIcon="$"
            subtitle="Total Profit & Loss"
            icon={TrendingUp}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProfitChart />
          </div>
          <div>
            <CurrentPlan activeSubs={activeSubs} />
          </div>
        </div>
      </div>
    </div>
  );
}
