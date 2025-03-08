import joi from "joi";
import {isValidObjectID } from "../../../middlewares/validation.middleWare.js";



export const ban_unBan_User = joi.object({
    id:joi.string().custom(isValidObjectID).required()
}).required()