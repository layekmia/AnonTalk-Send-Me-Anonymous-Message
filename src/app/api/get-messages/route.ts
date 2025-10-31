import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import mongoose from "mongoose";

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

  const userId = new mongoose.Types.ObjectId(session?.user._id);

  try {
    // here we used mongodb aggregation pipeline;
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        { success: false, message: "user not found" },
        { status: 401 }
      );
    }
    return Response.json(
      { success: true, messages: user[0].messages },
      { status: 200 }
    );
  } catch (error) {
    console.log(error)
    return Response.json(
        { success: false, message: "something wetn wrong" },
        { status: 500 }
      );
  }
}
