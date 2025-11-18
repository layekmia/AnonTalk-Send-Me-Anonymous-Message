"use client";

import { Loader2 } from "lucide-react";

export default function GlobalLoader() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-500 text-white">
            <Loader2 className="animate-spin h-16 w-16 mb-6" />
            <h1 className="text-3xl font-bold tracking-wide">Loading...</h1>
            <p className="mt-2 text-lg opacity-80">Please wait while we prepare everything for you</p>
        </div>
    );
}
