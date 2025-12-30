"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import { deleteCookie, getCookie } from "cookies-next";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState();
 
  const router = useRouter();

  useMemo(() => {
    setToken(getCookie("token"));
  }, [token, getCookie]);

 
  return (
    <nav className="fixed top-0 w-full bg-[#030b1f]/70 backdrop-blur-md border-b border-white/10 z-50">
      <div className="mx-auto flex items-center justify-between px-6 md:px-20 py-1 gap-2">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <img src="/assets/logo1.png" alt="Qbots Logo" className="w-14 md:w-18 h-14 md:h-18 "/>
          <span className="text-white font-semibold text-xl md:text-3xl tracking-tight">
            Qbots
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 text-gray-300">
          <Link href="/exchange" className="hover:text-white transition">
            Exchanges
          </Link>
          <Link href="/pricing" className="hover:text-white transition">
            Pricing
          </Link>
          <Link href="https://www.docs.qbots.trade/" target="_blank" className="hover:text-white transition">
            Docs
          </Link>
        </div>

        {/* Buttons */}
        {token ? (
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/dashboard/home"
              className="px-5 py-1.5 border border-white/30 text-gray-200 rounded-full hover:bg-primary transition"
            >
              Dashboard
            </Link>
          </div>
        ) : (
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/login"
              className="px-5 py-1.5 border border-white/30 text-gray-200 rounded-full hover:bg-primary transition"
            >
              LOGIN
            </Link>
            <Link
              href="/signup"
              className="px-5 py-1.5 bg-white/10 text-white rounded-full hover:bg-primary border border-white/30 transition"
            >
              SIGN UP
            </Link>
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#030b1f]/95 border-t border-white/10">
          <div className="flex flex-col px-6 py-4 space-y-3 text-gray-300">
            <Link
              href="/exchange"
              onClick={() => setIsOpen(false)}
              className="hover:text-white transition"
            >
              Exchanges
            </Link>
            <Link
              href="/pricing"
              onClick={() => setIsOpen(false)}
              className="hover:text-white transition"
            >
              Pricing
            </Link>
            <Link
              href="https://www.docs.qbots.trade/"
              target="_blank" 
              onClick={() => setIsOpen(false)}
              className="hover:text-white transition"
            >
              Docs
            </Link>

            <div className="flex space-x-2 pt-3">
              {token ? (
                <Link
                  href="/dashboard/home"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  className="flex-1 text-center border bg-primary rounded-full py-2 hover:bg-primary transition"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 text-center border bg-primary rounded-full py-2 hover:bg-primary transition"
                  >
                    LOGIN
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 text-center bg-white/10 border border-white/30 text-white rounded-full py-2 hover:bg-white/20 transition"
                  >
                    SIGN UP
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
