"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import SubmitButton from "@/components/SubmitButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/type";
import { toast } from "sonner";

const messages = [
  "What's a hobby you’ve recently started?",
  "If you could have dinner with any historical figure, who would it be?",
  "What’s a simple thing that makes you happy?",
];

export default function Page() {
  const { username } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSelect = (msg: string) => {
    form.setValue("content", msg);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        content: data.content,
        username,
      });
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message);
    } finally {
      setIsSubmitting(false)
    }
  };

  const isDisabled =
    !form.watch("content") || form.watch("content").trim().length === 0;

  return (
    <div className="p-14 flex items-center justify-center min-h-screen flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl text-center p-10">
        <h1 className="text-4xl font-bold mb-6 text-purple-700">Public Profile Link</h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-700 mb-2">
                    Send Anonymous Message to <span className="text-purple-600 font-semibold">@{username}</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous message here..."
                      {...field}
                      className="w-full h-[120px] placeholder:text-[16px] resize-none border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 p-4 shadow-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 mt-1" />
                </FormItem>
              )}
            />

            <SubmitButton
              label="sending..."
              isSubmitting={isSubmitting}
              isDisable={isDisabled}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transform transition-all"
            >
              Send It
            </SubmitButton>
          </form>
        </Form>
      </div>

      <div className="w-full max-w-4xl mt-8 bg-white rounded-2xl shadow-xl p-6">
        <p className="text-base text-left mb-4 font-medium text-gray-700">
          Click on any message below to select it.
        </p>
        <Card className="w-full gap-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-md border-none">
          <CardHeader>
            <CardTitle className="text-xl text-left font-semibold text-purple-700">
              Messages
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            {messages.length > 0 ? (
              messages.map((msg, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="text-center font-medium cursor-pointer border-purple-300 text-purple-600 hover:bg-purple-100 hover:text-purple-800 rounded-lg shadow-sm transition-all"
                  onClick={() => handleSelect(msg)}
                >
                  {msg}
                </Button>
              ))
            ) : (
              <p className="text-gray-500 text-center py-6">No messages yet!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>

  );
}
