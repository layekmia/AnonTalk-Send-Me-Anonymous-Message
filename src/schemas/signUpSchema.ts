import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, { message: "Username must be at least 3 characters" })
  .max(20, { message: "Username must be no more that 20 characters" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "username must not contain special characters",
  });

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
