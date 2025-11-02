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
import { ApiResponse } from "@/types/ApiResponse";
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
    }finally{
      setIsSubmitting(false)
    }
  };

  const isDisabled =
    !form.watch("content") || form.watch("content").trim().length === 0;

  return (
    <div className="p-14 flex items-center justify-center min-h-screen flex-col">
      <div className="w-full max-w-4xl bg-white  text-center">
        <h1 className="text-4xl font-bold mb-4">Public Profile Link</h1>
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
                  <FormLabel className="font-medium font-base mt-5">
                    Send Anonymous Message to @{username}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="write your anonymous message here"
                      {...field}
                      className="w-full h-[100px] placeholder:text-[17px] resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SubmitButton
              label="sending..."
              isSubmitting={isSubmitting}
              isDisable={isDisabled}
            >
              Send It
            </SubmitButton>
          </form>
        </Form>
      </div>

      <div className="w-full max-w-4xl bg-white mt-5 text-center">
        <p className="text-base text-left mb-4 font-medium">
          Click on any message below to select it.
        </p>
        <Card className="w-full gap-2">
          <CardHeader>
            <CardTitle className="text-xl text-left font-semibold">
              Messages
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-5">
            {messages.map((msg, i) => (
              <Button
                key={i}
                variant="outline"
                className="text-center font-medium cursor-pointer"
                onClick={() => handleSelect(msg)}
              >
                {msg}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
