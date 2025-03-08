import joi from "joi";
import {isValidObjectID } from "./../../../MiddleWares/Validation.MiddleWare.js";



export const ban_unBan_Company = joi.object({
    companyId:joi.string().custom(isValidObjectID).required()
}).required()

export const approveCompany = joi.object({
    companyId:joi.string().custom(isValidObjectID).required()
}).required()