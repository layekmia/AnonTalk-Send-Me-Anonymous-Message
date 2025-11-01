import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    // check if any user already exist and verified;
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json({
        success: false,
        message: "username is already taken",
      });
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      // if user exist but not verified, update code and expiry
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Email is already registered",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        existingUserByEmail.code = code;
        existingUserByEmail.verifyCodeExpiry = new Date(
          Date.now() + 60 * 60 * 1000
        ); // 1 hour from now
        existingUserByEmail.password = hashedPassword;
        await existingUserByEmail.save();

        const emailResponse = await sendVerificationEmail(
          existingUserByEmail.email,
          existingUserByEmail.username,
          existingUserByEmail.code
        );

        if (!emailResponse.success) {
          return Response.json(
            {
              success: false,
              message:
                emailResponse.message || "Failed to send verification email",
            },
            { status: 500 }
          );
        }
        return Response.json(
          {
            success: true,
            message:
              "User already registered but not verified. A new verification email has been sent.",
          },
          { status: 200 }
        );
      }
    } else {
      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // const does NOT make objects immutable
      // if the variable is an object, we can still change its properties or call methods that mutate it.
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); // set expiry to 1 hour from now

      // create user
      const newUser = await UserModel.create({
        username,
        email,
        password: hashedPassword,
        code,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });
      const emailResponse = await sendVerificationEmail(
        newUser.email,
        newUser.username,
        newUser.code
      );

      if (!emailResponse.success) {
        return Response.json(
          {
            success: false,
            message:
              emailResponse.message || "Failed to send verification email",
          },
          { status: 500 }
        );
      }

      return Response.json(
        {
          success: true,
          message: "User registered successfully. Please verify your email.",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return Response.json(
      {
        success: false,
        message: "Registration failed due to an unexpected error.",
      },
      { status: 500 }
    );
  }
}
