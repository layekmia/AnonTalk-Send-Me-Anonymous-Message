"use client";

import SubmitButton from "@/components/SubmitButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function Page() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);

    try {
      const result = await signIn("domain-login", {
        redirect: false, // handle redirect manually
        identifier: data.identifier.trim(),
        password: data.password,
      });

      // Handle NextAuth errors (result.error is string if login fails)
      if (result?.error) {
        toast.error(result.error);
        return;
      }

      // Handle successful login
      toast.success("Successfully logged in!");
      router.replace("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen 
  bg-gradient-to-br from-[#1a0128] via-[#240046] to-[#0a0014] p-4">

      <div className="
      w-full max-w-md p-8 space-y-8 
      bg-white/10 backdrop-blur-xl 
      border border-white/20 
      rounded-2xl shadow-2xl 
      shadow-purple-900/40
    ">
        <div className="text-center">
          <h1
            className="
          text-3xl md:text-4xl font-extrabold
          bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 
          bg-clip-text text-transparent
          drop-shadow-[0_3px_10px_rgba(255,255,255,0.1)]
          mb-4
        "
          >
            Sign in to your account
          </h1>

          <p className="text-purple-200/80 text-sm md:text-base">
            Enter valid credentials to continue
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-200">Email / Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email or username"
                      {...field}
                      className="
                    bg-white/10 border-white/20 text-white 
                    placeholder-white/50
                    focus:ring-2 focus:ring-purple-400
                  "
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-200">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="your password"
                      {...field}
                      className="
                    bg-white/10 border-white/20 text-white 
                    placeholder-white/50
                    focus:ring-2 focus:ring-purple-400
                  "
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <SubmitButton
              label="Signing in..."
              isSubmitting={isSubmitting}
              className="
            w-full py-3 text-lg font-semibold rounded-xl
            bg-gradient-to-r from-purple-500 to-pink-500
            hover:from-purple-600 hover:to-pink-600
            shadow-lg shadow-purple-800/40
            transition-all
          "
            >
              Sign In
            </SubmitButton>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p className="text-purple-200/80 text-sm">
            Don&apos;t have an account?
            <Link
              href="/sign-up"
              className="text-pink-300 hover:text-pink-400 font-semibold ml-1"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>

  );
}
