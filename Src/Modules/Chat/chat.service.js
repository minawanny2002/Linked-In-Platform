import User from "../../DB/Models/user.model.js";
import Randomstring from "randomstring";
import { emailEmitter } from "./../../Utils/Email/emailEvent.js";
import { compareHash, hash } from "../../Utils/Hashing/Hash.js";
import { generateToken, verifyToken } from "../../Utils/Token/Token.js";
import { OTPTypes, providers } from "../../Utils/eNums/enums.js";
import verify from "../../Utils/Login With Gmail Form/gmailAuth.js/gmailAuth.js";
import Chat from "../../DB/Models/chat.model.js"


//----------------------------------------------- Chat History --------------------------------------------------
export const chatHistory = async(req, res, next)=>{
  const { senderId, receiverId } = req.params;

  if(req.user._id.toString()!=senderId.toString() && req.user._id.toString()!=receiverId.toString())
    return next(new Error("Not authorized" , {cause:403}))

  const chat = await Chat.findOne({ senderId, receiverId }).populate([
    {path:'senderId', select:'firstName lastName username profilePicture'},
    {path:'receiverId', select:'firstName lastName username profilePicture'}
  ])

  if(!chat)
    return next(new Error("No Chats", {cause:404}));

  return res.status(200).json({
    success: true,
    messages: chat.messages
  });
}