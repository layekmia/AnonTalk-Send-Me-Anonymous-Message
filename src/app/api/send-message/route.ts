import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  // parse data from body , head or url;
  const { username, content } = await request.json();

  try {
    // find user in database;
    const user = await UserModel.findOne({ username });

    // validate the user
    if (!user)
      return Response.json(
        { success: false, message: "user not found" },
        { status: 401 }
      );

    // check is user accepting the messages ;
    if (!user.isAcceptingMessages) {
      return Response.json(
        { success: false, message: "user not accepting the messages" },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
