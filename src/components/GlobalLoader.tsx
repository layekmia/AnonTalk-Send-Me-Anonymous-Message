"use client";

import { Loader2 } from "lucide-react";

export default function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500">
      <Loader2 className="animate-spin h-16 w-16 text-white mb-6" />

      <h1 className="text-3xl font-extrabold text-white">Loading...</h1>
      <p className="mt-2 text-lg text-white opacity-80">
        Please wait while we fetch your data...
      </p>
    </div>
  );
}
