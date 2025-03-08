import { Types } from "mongoose";
import { asyncHandler } from "../Utils/Error Handling/asyncHandler.js";
import joi from "joi";

export const fileObjectValidation = function(fieldName){
    return{
    fieldname:joi.string().valid(fieldName).required(),
    originalname:joi.string().required(),
    encoding:joi.string().required(),
    mimetype:joi.string().required(),
    size:joi.number().required(),
    destination : joi.string().required(),
    filename:joi.string().required(),
    path : joi.string().required()
}}

export const isValidObjectID = (value, helper)=>{
    if(Types.ObjectId.isValid(value))
        return true
    return helper.message("Invalid ObjectId !!")
}


const validation =(schema) =>{
    return (req,res,next)=>{
        const data = {...req.body, ...req.query, ...req.params};

        if(req.file || req.files?.length)
            data.file = req.file || req.files
        const result = schema.validate(data, {abortEarly:false});

        if(result.error){
            const messageList = result.error.details.map((obj)=>obj.message);
            return next(new Error (messageList, {cause:400}))
        }

        return next();
    }
}

export default validation;