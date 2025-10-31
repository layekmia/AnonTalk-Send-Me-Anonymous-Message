import { resend } from "@/app/lib/resend";
import VerifyEmail from "@/emails/VerifyEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  code: string
): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "AnonTalk | Verification code",
      react: VerifyEmail({ username, code }),
    });

    if (error) {
      console.error("Resend returned error:", error);
      return { success: false, message: "Failed to send verification email" };
    }

    return { success: true, message: "Verification email send successfully" };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
