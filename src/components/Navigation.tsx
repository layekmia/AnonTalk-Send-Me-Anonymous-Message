"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";

export default function Navigation() {
  const { data: session } = useSession();

  return (
    <nav
      className="
        p-4 md:p-6 
        sticky top-0 z-50 
        bg-gradient-to-r from-purple-600/80 via-pink-500/70 to-indigo-600/80
        backdrop-blur-xl
        shadow-xl shadow-purple-900/30
        border-b border-white/10
      "
    >
      <div
        className="
          container mx-auto 
          flex flex-col md:flex-row 
          justify-between items-center
          text-white
        "
      >
        {/* Logo */}
        <Link
          href="/"
          className="
            text-3xl font-extrabold tracking-wide
            bg-clip-text text-transparent 
            bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-300
            drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]
            hover:scale-105 transition-transform
            mb-4 md:mb-0
          "
        >
          AnonTalk
        </Link>

        {/* Right Side */}
        {session ? (
          <div className="flex items-center gap-4">
            <span
              className="
                text-sm md:text-base 
                bg-white/10 px-3 py-1 rounded-xl 
                backdrop-blur-md border border-white/10
                shadow-inner
              "
            >
              Welcome, {session.user.username}
            </span>

            <Button
              onClick={() => signOut()}
              className="
                cursor-pointer px-6 py-2 rounded-xl
                bg-gradient-to-r from-red-500 to-red-600
                hover:from-red-600 hover:to-red-700
                text-white font-semibold shadow-lg
                hover:shadow-red-500/40 
                transition-all duration-200
              "
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button
              className="
                cursor-pointer px-6 py-2 rounded-xl
                bg-gradient-to-r from-green-500 to-emerald-600
                hover:from-green-600 hover:to-emerald-700
                text-white font-semibold shadow-lg
                hover:shadow-emerald-500/40
                transition-all duration-200
                w-full md:w-auto
              "
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
