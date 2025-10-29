import mongoose, { Schema, Document } from "mongoose";

// I defined a custom TypeScript interface for my Schema;
// Message interface defines the shape of the MongoDB document before creating the schema.
export interface Message extends Document {
  content: string;
  createAt: Date;
}

// Create a typed Mongoose schema for the Message collection (blueprint for documents)

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "Email is required"],
    lowercase: true,
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      "Please enter a valid email address",
    ],
  },
  password: { type: String, required: [true, "Password is required"] },
  verifyCode: { type: String, required: [true, "verify code is required"] },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "verify code Expiry is required"],
  },
  isVerified: { type: Boolean, default: false },
  isAcceptingMessage: { type: Boolean, default: true },
  messages: [MessageSchema],
});

export default (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);
