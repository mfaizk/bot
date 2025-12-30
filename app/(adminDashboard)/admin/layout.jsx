
"use client";
import { useState } from "react";


import AdminDashboardHeader from "../../../components/admin-dashboard-header";
import AdminSidebar from "@/components/admin-sidebar";

export default function DashboardLayout({ children }) {
 
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="h-screen w-full bg-gray-900 text-white flex overflow-hidden">
      {/* Sidebar container: hidden on small screens, visible (block) on md+ */}
      <div
        className={`fixed top-0 left-0 h-screen md:block hidden transition-all duration-200 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
   
        <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>

   
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-200 ${
          isCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
       
      >
        <AdminDashboardHeader />

        <main className="flex-1 overflow-y-auto pt-20 px-5">{children}</main>
      </div>
    </div>
  );
}
