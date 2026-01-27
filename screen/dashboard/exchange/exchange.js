"use client";
import { IconExchange } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import OTPInput from "../../../components/otp-modal";
import { useGetKeysExchange } from "@/queries/exchange";
import { BarChart3, DollarSign } from "lucide-react";
import ActivityIndicator from "@/components/activity-indicator";
import { useHaveActiveSubscriptions } from "@/queries/payment";
import NotActiveSubs from "@/components/no-active-subs";
import { useUserProfile } from "@/queries/profile";
export default function Exchange() {
  const router = useRouter();
  const { data: getUserData, isPending: getUserDataPending } = useUserProfile();
  const {
    data: exchangeKeyList,
    isLoading: exchangeKeyListLoading,
    refetch: exchangeKeyListRefetch,
  } = useGetKeysExchange();

  const { data: haveActiveSubs, isPending: haveActiveSubsPending } =
    useHaveActiveSubscriptions();

  if (!getUserData?.isPlanActive) {
    return <NotActiveSubs />;
  }
  return (
    <div className="flex  min-h-[100%]  text-white px-4 ">
      {exchangeKeyListLoading && (
        <div className="min-h-[100%] w-full flex items-center justify-center flex-col gap-4">
          <ActivityIndicator isLoading className={"h-12 w-12"} />
          <p className="text-2xl font-semibold">Getting Data...</p>
        </div>
      )}
      {!exchangeKeyListLoading && exchangeKeyList?.length == 0 && (
        <div className="min-h-[100%] w-full flex items-center justify-center">
          <div className="flex flex-col items-center text-center max-w-md">
            <div className="w-20 h-20 bg-[#1a1a25] rounded-full flex items-center justify-center mb-6">
              <IconExchange size={42} className="text-primary" />
            </div>

            <h1 className="text-3xl font-semibold mb-3">Exchange</h1>

            <p className="text-lg text-gray-400 mb-2">
              Add your first exchange account!
            </p>

            <p className="text-gray-500 mb-8 leading-relaxed">
              You haven&apos;t created or added any exchange accounts yet. Use
              the button below to add an account for trading.
            </p>

            <button
              className="px-8 py-3 bg-primary  font-semibold  text-white  rounded-[10px]  shadow-lg "
              onClick={() => {
                router.push("/dashboard/exchange/add-exchange");
              }}
            >
              Add New Exchange
            </button>
          </div>
        </div>
      )}
      {!exchangeKeyListLoading && exchangeKeyList?.length > 0 && (
        <div className="w-full">
          <div className="w-full flex justify-between items-center">
            <h1 className="py-10 text-3xl font-semibold px-1">
              Exchange Key List
            </h1>
            <button
              className="w-52 h-10 rounded bg-primary flex items-center justify-center"
              onClick={() => {
                router.push("/dashboard/exchange/add-exchange");
              }}
            >
              Create/Manage Keys
            </button>
          </div>
          <div className="grid grid-cols-12 gap-6  w-full">
            {exchangeKeyList?.map((strategy, index) => (
              <div
                key={index}
                className="col-span-12 md:col-span-6 lg:col-span-4 bg-[#0b1229] border border-white/10 rounded-2xl p-6 hover:bg-[#121a36] transition group shadow-md hover:shadow-blue-500/10 h-52 "
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-[#141c3b] group-hover:bg-[#1d2650] transition">
                      <img
                        src={strategy?.icon}
                        className="h-10 text-primary object-contain"
                      />
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-md  bg-emerald-700/70 text-white`}
                    >
                      Active
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 capitalize">
                    Exchange Name: {strategy?.exchange}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {strategy.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const strategies = [
  {
    title: "Grid Trading",
    description: "Buy low, sell high – automatically.",
    icon: <BarChart3 className="w-8 h-8 text-primary" />,
    status: "Active",
    statusColor: "bg-emerald-700/70 text-white",
  },
  {
    title: "DCA (Dollar-Cost Averaging)",
    description: "Invest gradually to reduce volatility risk.",
    icon: <DollarSign className="w-8 h-8 text-primary" />,
    status: "Active",
    statusColor: "bg-emerald-700/70 text-white",
  },
];
