"use client";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Home,
  Calendar,
  Settings2,
  Bot,
  ChevronLeft,
  ChevronRight,
  School,
} from "lucide-react";
import Link from "next/link";
import { IconCurrency, IconExchange, IconHistory } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import { toast } from "sonner";
import { useState } from "react";
import { useLogout } from "@/queries/auth";

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout();
  const logoutHandler = () => {
    deleteCookie("token");
    toast.success("Logout successfully");
    logout();
    router.replace("/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard/home", Icon: Home, type: "link" },
    {
      label: "Exchange",
      path: "/dashboard/exchange",
      Icon: IconExchange,
      type: "link",
    },
    { label: "Bots", path: "/dashboard/bot", Icon: Bot, type: "link" },

    {
      label: "Pricing",
      path: "/dashboard/pricing",
      Icon: IconCurrency,
      type: "link",
    },
    {
      label: "Plan Management",
      path: "/dashboard/plan-management",
      Icon: Calendar,
      type: "link",
    },
    // {
    //   label: "Transaction",
    //   path: "/dashboard/transaction",
    //   Icon: IconHistory,
    //   type: "link",
    // },
    {
      label: "Settings",
      path: "/dashboard/settings",
      Icon: Settings2,
      type: "link",
    },
    {
      label: "Tutorial",
      path: "https://www.docs.qbots.trade/",
      Icon: School,
      type: "link",
    },
    { label: "Logout", Icon: LogOut, type: "button", onClick: logoutHandler },
  ];

  const mobileNavItems = [
    { label: "Dashboard", path: "/dashboard/home", Icon: Home, type: "link" },
    {
      label: "Settings",
      path: "/dashboard/settings",
      Icon: Settings,
      type: "link",
    },
    { label: "Logout", Icon: LogOut, type: "button", onClick: logoutHandler },
  ];

  const isActive = (path) => pathname === path;

  return (
    <>
      {/* Desktop Sidebar - hidden on small devices */}
      <div
        className={`hidden pt-10 md:flex flex-col bg-gray-800 border-r border-gray-700 min-h-screen p-5 transition-all duration-200 ease-in-out ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="relative flex items-center justify-between mb-6">
          <h2
            className={`text-2xl font-semibold text-primary transition-opacity duration-150 ${
              isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            Qbots
          </h2>

          <button
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand" : "Collapse"}
            onClick={() => setIsCollapsed((v) => !v)}
            className="absolute right-[-35px] top-15 p-1 rounded-full bg-gray-600 hover:bg-gray-700"
          >
            {isCollapsed ? (
              <ChevronRight size={25} />
            ) : (
              <ChevronLeft size={25} />
            )}
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map(({ label, path, Icon, type, onClick }) => {
            if (type === "link") {
              return (
                <Link
                  key={label}
                  href={path}
                  className={`group flex items-center gap-3 p-2 rounded-md transition-colors duration-150 ${
                    isActive(path)
                      ? "bg-primary text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                  title={label}
                >
                  <div
                    className={`flex items-center justify-center ${
                      isCollapsed ? "w-full" : "w-6"
                    }`}
                  >
                    <Icon />
                  </div>
                  <span
                    className={`transition-opacity duration-150 whitespace-nowrap ${
                      isCollapsed
                        ? "opacity-0 w-0 overflow-hidden"
                        : "opacity-100"
                    }`}
                  >
                    {label}
                  </span>
                </Link>
              );
            } else if (type === "button") {
              return (
                <button
                  key={label}
                  onClick={() => onClick && onClick()}
                  className={`flex items-center gap-3 hover:bg-gray-700 p-2 rounded-md mt-auto transition-colors duration-150 ${
                    isCollapsed ? "justify-center" : ""
                  }`}
                  title={label}
                >
                  <Icon />
                  <span
                    className={`transition-opacity duration-150 whitespace-nowrap ${
                      isCollapsed
                        ? "opacity-0 w-0 overflow-hidden"
                        : "opacity-100"
                    }`}
                  >
                    {label}
                  </span>
                </button>
              );
            }
            return null;
          })}
        </nav>
      </div>

      {/* Mobile Drawer Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 bg-purple-600 p-2 rounded-lg z-50"
      >
        <LayoutDashboard size={24} />
      </button>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex md:hidden">
          <div className="bg-gray-800 w-64 p-5 flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-semibold text-primary">My App</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              {mobileNavItems.map(({ label, path, Icon, type, onClick }) => {
                if (type === "link") {
                  return (
                    <Link
                      key={label}
                      href={path}
                      className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon /> {label}
                    </Link>
                  );
                } else if (type === "button") {
                  return (
                    <button
                      key={label}
                      className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded-md mt-auto"
                      onClick={() => {
                        if (onClick) onClick();
                        setIsOpen(false);
                      }}
                    >
                      <Icon /> {label}
                    </button>
                  );
                }
                return null;
              })}
            </nav>
          </div>
          <div className="flex-1" onClick={() => setIsOpen(false)}></div>
        </div>
      )}
    </>
  );
}
