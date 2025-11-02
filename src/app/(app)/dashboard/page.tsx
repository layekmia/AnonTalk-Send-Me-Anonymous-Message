"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
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
    return <div>Please login</div>;
  }

  return (
    // <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
    //   <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

    //   <div className="mb-4">
    //     <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
    //     <div className="flex items-center">
    //       <input
    //         type="text"
    //         value={profileUrl}
    //         disabled
    //         className="input input-bordered w-full p-2 mr-2"
    //       />
    //       <Button className="cursor-pointer" onClick={copyToClipboard}>
    //         Copy
    //       </Button>
    //     </div>
    //   </div>

    //   <div className="mb-4">
    //     <Switch
    //       {...register("acceptingMessages")}
    //       checked={acceptMessages as boolean}
    //       onCheckedChange={handleSwitchToggle}
    //       disabled={isSwitchLoading}
    //     />
    //     <span className="ml-2">
    //       Accept Messages: {acceptMessages ? "On" : "Off"}
    //     </span>
    //   </div>
    //   <Separator />
    //   <Button
    //     className="mt-4"
    //     variant="outline"
    //     onClick={(e) => {
    //       e.preventDefault();
    //       fetchMessages(true);
    //     }}
    //   >
    //     {isLoading ? (
    //       <Loader2 className="h-4 w-4 animate-spin" />
    //     ) : (
    //       <RefreshCcw
    //         className="
    //     h-4 w-4"
    //       />
    //     )}
    //   </Button>

    //   <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
    //     {messages.length > 0 ? (
    //       messages.map((message) => (
    //         <MessageCard
    //           message={message}
    //           onMessageDelete={handleMessageDelete}
    //           key={message._id as string}
    //         />
    //       ))
    //     ) : (
    //       <p>No Message to display</p>
    //     )}
    //   </div>
    // </div>
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-8 bg-gray-50 rounded-xl shadow-lg w-full max-w-6xl">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center md:text-left">
        User Dashboard
      </h1>

      {/* Unique Link */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Copy Your Unique Link
        </h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Button
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
            onClick={copyToClipboard}
          >
            Copy
          </Button>
        </div>
      </div>

      {/* Accept Messages */}
      <div className="mb-6 flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <Switch
          {...register("acceptingMessages")}
          checked={acceptMessages as boolean}
          onCheckedChange={handleSwitchToggle}
          disabled={isSwitchLoading}
        />
        <span className="text-gray-700 font-medium">
          Accept Messages:{" "}
          <span className="font-bold">{acceptMessages ? "On" : "Off"}</span>
        </span>
      </div>

      <Separator className="my-6" />

      {/* Refresh Button */}
      <div className="flex justify-end mb-6">
        <Button
          variant="outline"
          className="flex items-center gap-2 px-4 py-2 rounded-lg border-gray-300 hover:bg-gray-100 transition-all"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
          ) : (
            <RefreshCcw className="h-5 w-5 text-gray-600" />
          )}
          <span className="text-gray-700 font-medium">Refresh Messages</span>
        </Button>
      </div>

      {/* Messages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message._id as string}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition-shadow border border-gray-200"
            >
              <MessageCard
                message={message}
                onMessageDelete={handleMessageDelete}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center py-10">
            No messages to display
          </p>
        )}
      </div>
    </div>
  );
}
