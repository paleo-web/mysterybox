import { create } from "domain";
import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
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
  verifiedCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "please enter your username"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "please enter your email"],
    unique: true,
    match: [
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
      "please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "please enter your password"],
  },
  verifyCode: {
    type: String,
    required: [true, "please enter your verify code"],
  },
  verifiedCodeExpiry: {
    type: Date,
    required: [true, "please enter your verify code expiry"],
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  messages: [MessageSchema],
});


const UserModel = (mongoose.models.User as mongoose.Model<User>) || 
  mongoose.model<User>("User", UserSchema);

  export default UserModel;