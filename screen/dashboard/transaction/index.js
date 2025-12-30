"use client";
import React, { useState } from "react";
import ToggleTabs from "../../../components/toggle-Tabs";
import ActiveTrade from "./component/active-trade";
import History from "./component/history";
import { useHaveActiveSubscriptions } from "@/queries/payment";
import NotActiveSubs from "@/components/no-active-subs";

const Transaction = () => {
  const [transactionType, setTransactionType] = useState("Active Trade");

  const { data: haveActiveSubs, isPending: haveActiveSubsPending } =
    useHaveActiveSubscriptions();

  // if (!haveActiveSubs) {
  //   return <NotActiveSubs />;
  // }
  return (
    <div>
      <div className="flex items-center justify-center">
        <ToggleTabs
          options={[
            { label: "Active Trade", value: "Active Trade" },
            { label: "History", value: "History" },
          ]}
          active={transactionType}
          onChange={setTransactionType}
        />
      </div>
      {transactionType === "Active Trade" && <ActiveTrade />}
      {transactionType === "History" && <History />}
    </div>
  );
};

export default Transaction;
