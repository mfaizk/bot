"use client";
import { IconCrown, IconExchange } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React from "react";
import ActivityIndicator from "@/components/activity-indicator";

const NotActiveBots = () => {
  const router = useRouter();

  return (
    <div className="min-h-[100%] w-full flex items-center justify-center">
      <div className="flex flex-col items-center text-center max-w-md">
       
          <div className=" flex flex-col justify-center items-center gap-4">
            {/* <ActivityIndicator isLoading className={"h-12 w-12"} /> */}
            <p className="text-2xl font-semibold text-primary">No any Bot</p>
          </div>
      
      
      </div>
    </div>
  );
};

export default NotActiveBots;
