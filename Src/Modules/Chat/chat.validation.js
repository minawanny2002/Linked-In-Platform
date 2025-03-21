import joi from 'joi';
import {genders} from "./../../Utils/eNums/enums.js";
import { isValidObjectID } from '../../middlewares/validation.middleWare.js';



// chat History
export const chatHistory= joi
  .object({
    senderId: joi.string().custom(isValidObjectID).required(),
    receiverId: joi.string().custom(isValidObjectID).required()

  })
  .required();

