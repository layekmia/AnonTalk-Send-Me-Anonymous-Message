import { verifyEmailProps } from "@/types/type";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from "@react-email/components";

export default function VerifyEmail({ username, code }: verifyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>AnonTalk - Verify your account</Preview>
      <Body className="bg-gray-100 font-sans">
        <Container className="bg-white mx-auto my-10 p-8 rounded-2xl shadow-md max-w-md border border-gray-200">
          <Heading className="text-2xl font-bold text-center text-blue-600 mb-4">
            Welcome to AnonTalk 👋
          </Heading>

          <Text className="text-gray-700 text-base mb-3">
            Hi <span className="font-semibold">{username}</span>,
          </Text>

          <Text className="text-gray-700 mb-4 leading-relaxed">
            Thank you for joining <strong>AnonTalk</strong> — the anonymous
            feedback platform that helps you get honest opinions from your
            friends. To complete your sign-up, please use the verification code
            below:
          </Text>

          <div className="bg-gray-100 rounded-lg text-center font-bold text-2xl tracking-widest py-4 mb-5 text-gray-800">
            {code}
          </div>

          <Text className="text-gray-600 text-sm text-center">
            If you didn’t request this email, please ignore it.
          </Text>

          <Hr className="my-6 border-gray-300" />

          <Text className="text-center text-xs text-gray-500">
            © 2025 AnonTalk. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
