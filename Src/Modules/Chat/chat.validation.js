import { Types } from "mongoose";
import joi from "joi";
import {genders} from "./../../Utils/eNums/enums.js";
const isValidObjectID = (value, helper)=>{
    if(Types.ObjectId.isValid(value))
        return true
    return helper.message("Invalid ObjectId !!")
}

// chat History
export const chatHistory= joi
  .object({
    senderId: joi.string().custom(isValidObjectID).required(),
    receiverId: joi.string().custom(isValidObjectID).required()

  })
  .required();

