import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";

export async function POST(request: Request) {
  await dbConnect();

  // get session from nextAuth;
  const session = await getServerSession(authOptions);

  // check if user logged in or not ;
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "user is not authenticated" },
      { status: 401 }
    );
  }

  // check user in database;
  const userId = session?.user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessages: acceptMessages,
      },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        { success: false, message: "user is not found" },
        { status: 401 }
      );
    }

    return Response.json({
      success: true,
      message: "Message acceptance status",
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "failed to updated user status to accept messages",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  // get session from nextAuth;
  const session = await getServerSession(authOptions);

  // check if user logged in or not ;
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "user is not authenticated" },
      { status: 401 }
    );
  }

  // check user in database;
  const userId = session?.user._id;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return Response.json(
        { success: false, message: "user is not found" },
        { status: 401 }
      );
    }

    return Response.json({
      success: true,
      message: "successfully retrieve the user data",
      isAcceptingMessages: user.isAcceptingMessages,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
