"use client";

import GlobalLoader from "@/components/GlobalLoader";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptSchema";
import { ApiResponse } from "@/types/type";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Check, Copy, Loader2, RefreshCcw, RefreshCw, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  // optimistic ui;

  const handleMessageDelete = (messageId: string) => {
    setMessages((messages) =>
      messages.filter((message) => message._id !== messageId)
    );
  };

  const { data: session, status } = useSession();

  const username = session?.user.username;

  const profileUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/u/${username}`;

  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptingMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);

    try {
      const response = await axios.get("/api/accept-message");
      setValue("acceptingMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "failed to update");
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean) => {
      setIsLoading(true);
      setIsSwitchLoading(true);

      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");

        setMessages(response.data.messages || []);
        if (refresh) {
          toast.success("Showing latest messages");
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(axiosError.response?.data.message || "failed to update");
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages(true);
    fetchAcceptMessages();
  }, [session, setValue, fetchAcceptMessages, fetchMessages]);

  const handleSwitchToggle = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-message", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptingMessages", !acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    }
  };

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(profileUrl);
      toast.success("Profile link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy link.");
    }
  };

  if (!session || !session.user) {
    return <GlobalLoader/>
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-200 via-pink-200 to-yellow-200 p-6">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-pink-600 drop-shadow-lg">
          Welcome Back, {session?.user?.username ?? "Anon"}!
        </h1>
        <p className="text-lg md:text-xl text-purple-800 mt-3">
          Your personal anonymous message hub 🌟
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Unique Link Card */}
        <div className="bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-all">
          <h2 className="text-xl font-bold text-white mb-3">Your Unique Link</h2>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="flex-1 rounded-xl px-4 py-3 border-2 border-white/50 bg-white/20 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-white/70 backdrop-blur-sm"
            />
            <Button
              onClick={copyToClipboard}
              className="bg-white text-pink-600 font-bold px-4 py-2 rounded-xl hover:bg-white/80 transition-all shadow-lg"
            >
              <Copy className="h-5 w-5" />
              Copy
            </Button>
          </div>
        </div>

        {/* Accept Messages Card */}
        <div className="bg-gradient-to-tr from-green-300 via-lime-300 to-yellow-300 rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-all flex flex-col justify-center items-center gap-3">
          <span className="text-xl font-semibold text-white">Accept Messages</span>
          <Switch
            {...register("acceptingMessages")}
            checked={acceptMessages as boolean}
            onCheckedChange={handleSwitchToggle}
            disabled={isSwitchLoading}
            className="bg-white cursor-pointer rounded-full shadow-lg"
          />
          <span className="text-gray-700">
            {acceptMessages ? <Check className="h-5 w-5 text-green-400" /> : <X className="h-5 w-5 text-red-400" />}
            {acceptMessages ? "On" : "Off"}
          </span>
        </div>

        <div className="bg-gradient-to-br from-orange-300 via-red-300 to-pink-400 rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-all flex flex-col justify-center items-center gap-3">
          <Button
            // variant="outline"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border-white/70 text-white font-bold bg-white/30 hover:bg-white/30 transition-all shadow-lg shadow-black/30"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : (
              <RefreshCw className="h-5 w-5 text-white" />
            )}
            Refresh
          </Button>


        </div>
      </div>

      {/* Messages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 max-w-7xl mx-auto">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message._id as string}
              className="bg-white/30 backdrop-blur-lg rounded-3xl p-5 shadow-2xl transform hover:scale-105 hover:shadow-3xl transition-all border border-white/40"
            >
              <MessageCard
                message={message}
                onMessageDelete={handleMessageDelete}
              />
            </div>
          ))
        ) : (
          <p className="text-white col-span-full text-center py-10 font-semibold">
            No messages yet! 📨
          </p>
        )}
      </div>
    </div>


  );
}
