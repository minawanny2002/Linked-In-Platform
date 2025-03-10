import joi from "joi";
import { genders } from "../../Utils/eNums/enums.js";
import { fileObjectValidation, isValidObjectID } from "../../middlewares/validation.middleWare.js";
const today = new Date();
const eighteenYearsAgo = new Date(today.setFullYear(today.getFullYear() - 18)).toISOString().split("T")[0];

// update profile
export const updateProfile = joi.object({
    firstName: joi.string().min(3),
    lastName: joi.string().min(3),
    DOB: joi.date().less(eighteenYearsAgo).messages({
      "date.less": "User must be older than 18 years",
    }),
    mobileNumber: joi.string(),
    gender: joi.string().valid(...Object.values(genders)),
  })
  .required();

// get another profile
export const getAnotherProfile = joi.object({
    id: joi.string().custom(isValidObjectID)
  })
  .required();  

// update password
export const updatePassword = joi.object({
    oldPassword : joi.string().required(),
    newPassword: joi.string().required(),
    confirmNewPassword: joi.string().valid(joi.ref("newPassword")).required(),
  })
  .required();   

// upload profile picture
export const uploadProfilePicture = joi.object({
  file:joi.object(fileObjectValidation("images")) 
}).required()

// upload cover picture
export const uploadCoverPicture = joi.object({
  file:joi.object(fileObjectValidation("images")) 
}).required()

// soft delete account
export const softDeleteAccount = joi
  .object({
    password: joi.string().required(),
  })
  .required();

