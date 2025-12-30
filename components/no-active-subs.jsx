"use client";
import { IconCrown, IconExchange } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React from "react";
import ActivityIndicator from "@/components/activity-indicator";
import { useHaveActiveSubscriptions } from "@/queries/payment";
const NotActiveSubs = () => {
  const router = useRouter();
  const { isPending: haveActiveSubsPending } = useHaveActiveSubscriptions();
  return (
    <div className="min-h-[100%] w-full flex items-center justify-center">
      <div className="flex flex-col items-center text-center max-w-md">
        {haveActiveSubsPending && (
          <div className=" flex flex-col justify-center items-center gap-4">
            <ActivityIndicator isLoading className={"h-12 w-12"} />
            <p className="text-2xl font-semibold">Getting Data...</p>
          </div>
        )}
        {!haveActiveSubsPending && (
          <>
            <div className="w-20 h-20 bg-[#1a1a25] rounded-full flex items-center justify-center mb-6">
              <IconCrown size={42} className="text-primary" />{" "}
            </div>

            <h1 className="text-3xl font-semibold mb-3">
              No Active Subscription
            </h1>

            <p className="text-lg text-gray-400 mb-2">
              You don&apos;t have any active subscriptions.
            </p>

            <p className="text-gray-500 mb-8 leading-relaxed">
              Enjoy premium features, faster access, and enhanced tools. Choose
              a plan that fits your trading needs and start your subscription
              today.
            </p>

            <button
              className="px-8 py-3 bg-primary font-semibold text-white rounded-[10px] shadow-lg hover:bg-primary/90 transition"
              onClick={() => {
                router.push("/dashboard/pricing");
              }}
            >
              Purchase Now
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default NotActiveSubs;
