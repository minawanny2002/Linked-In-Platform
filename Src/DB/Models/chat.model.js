import mongoose, { Schema, Types } from "mongoose";
import { status } from "../../Utils/eNums/enums.js";
import User from "./user.model.js";

//schema
const chatSchema = new Schema(
  {
    senderId: { type: Types.ObjectId , ref: "Users", required: true,
      validate: {
        validator: async function (value) {
          const user = await User.findById(value);
          return user && (user.HR || user.companyOwner);
        },
        message: "Sender must be an HR or company owner",
      },
    },
    receiverId: {type: Types.ObjectId, ref: "Users", required: true,},
    messages: [
      {
        message: { type: String, required: true },
        senderId: {type: Types.ObjectId,ref: "Users", required: true,},
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtual: true } }
);

//model
const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
