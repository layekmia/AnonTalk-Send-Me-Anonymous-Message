import mongoose from "mongoose";
import { ReactJsxRuntime } from "next/dist/server/route-modules/app-page/vendored/rsc/entrypoints";

// Define a connection state tracker;

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");
    connection.isConnected = db.connections[0].readyState; // db.connections[0].readySate return a numeric state like 0 =disconnect , 1 = connected, 2= connecting , 3 = disconnecting;

    console.log("Db successfully connected");
    process.exit(1);
  } catch (error) {
    console.log(`Database connection failed`);
    process.exit(1);
  }
}

export default dbConnect;
