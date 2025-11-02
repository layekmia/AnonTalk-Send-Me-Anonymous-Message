import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ messageId: string }> }
) {
  const { params } = context;
  const { messageId } = await params; // unwrap the promise

  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return new Response(
      JSON.stringify({ success: false, message: "User not authenticated" }),
      { status: 401 }
    );
  }

  try {
    const updatedData = await UserModel.updateOne(
      { _id: session.user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updatedData.modifiedCount === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Message not found or already deleted",
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Message successfully deleted",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500 }
    );
  }
}
