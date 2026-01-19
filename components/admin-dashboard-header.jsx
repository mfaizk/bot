"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Copy,
  Menu,
  X,
  LogOut,
  User,
  Home,
  Calendar,
  Settings2,
} from "lucide-react";
import { IconCurrency, IconExchange, IconHistory } from "@tabler/icons-react";
import { deleteCookie } from "cookies-next";
import { useLogout } from "../queries/auth";
import { useAdminProfile } from "@/queries/admin";

export default function AdminDashboardHeader() {
  const { data: getAdminData, isPending: getAdminDataPending } =
    useAdminProfile();

  const email = getAdminData?.email;
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const logout = useLogout();
  const router = useRouter();
  const navItems = [
    { label: "Dashboard", path: "/admin/home", Icon: Home, type: "link" },
    { label: "Users", path: "/admin/user-list", Icon: User, type: "link" },

    { label: "Logout", Icon: LogOut, type: "button" },
  ];

  const handleLogout = () => {
    console.log("Logged out");
    setMenuOpen(false);
    deleteCookie("token");
    logout();
    router.replace("/");
  };

  const isActive = (path) =>
    pathname.startsWith(path)
      ? "bg-primary text-white"
      : "text-gray-300 hover:bg-white/10";

  return (
    <header className="fixed top-0 left-0 w-full z-10 bg-[#0B0B12]/80 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-1">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <img
              src="/assets/logo1.png"
              alt="Qbots Logo"
              className="w-18 h-16"
            />

            <span className="text-white font-semibold text-xl md:text-3xl tracking-tight">
              Admin
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {/* <a
              href="https://t.me/yourcommunity"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-block bg-primary text-white font-semibold rounded-[10px] px-4 py-1.5 text-sm transition-colors"
            >
              Join Telegram
            </a> */}

            <div className="hidden md:block">
              <button className="w-10 h-10 bg-primary text-white font-semibold rounded-[10px] flex items-center justify-center hover:ring-2 hover:ring-violet-400 transition">
                {email ? (
                  email.charAt(0).toUpperCase()
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </button>
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-white"
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-white/10 mt-2 py-3 space-y-2 bg-[#0B0B12]/95 backdrop-blur-md rounded-lg shadow-lg animate-fade-in">
            {navItems?.map(({ label, path, Icon, type }, idx) =>
              type === "link" ? (
                <Link
                  href={path}
                  key={idx}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center w-full px-4 py-2 rounded-md transition ${isActive(
                    path,
                  )}`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </Link>
              ) : (
                <button
                  key={idx}
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-primary hover:bg-white/10 rounded-md"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </button>
              ),
            )}
          </div>
        )}
      </div>
    </header>
  );
}
