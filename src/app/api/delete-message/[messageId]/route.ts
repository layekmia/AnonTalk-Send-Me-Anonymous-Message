import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  const { messageId } = await params;
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
    const updatedData = await UserModel.updateOne(
      { _id: session.user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updatedData.modifiedCount === 0) {
      return Response.json({
        success: false,
        message: "message not found or already deleted",
      });
    }

    return Response.json({
      success: true,
      message: "message successfully deleted",
    });
  } catch (error) {
    console.error(error);
    return Response.json({
      success: false,
      message: "Internal server error",
    });
  }
}
