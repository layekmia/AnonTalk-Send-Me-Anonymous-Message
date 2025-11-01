"use client";

import { signOut } from "next-auth/react";

export default function Navigation() {
  return (
    <header className="w-full bg-black">
      <nav className="flex items-center max-w-7xl mx-auto justify-between h-20 border-b-2 border-gray-400 px-4">
        <button
          onClick={() => signOut()}
          className="text-white bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Sign out
        </button>
      </nav>
    </header>
  );
}
