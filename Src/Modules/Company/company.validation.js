import joi from "joi"
import { fileObjectValidation, isValidObjectID } from "../../middlewares/validation.middleWare.js"


//------------------------------------------------------------- Add Company ------------------------------------------------------------------
export const addCompany = joi.object({
    companyName: joi.string().required(),
    description : joi.string().required(),
    industry: joi.string().required(),
    address : joi.string().required(),
    numberOfEmployees:joi.number().min(11).max(20).required(),
    companyEmail: joi.string().email().required(),
    file:joi.object(fileObjectValidation("legalAttachment")).required()

}).required()

//------------------------------------------------------------- Update Company ------------------------------------------------------------------
export const updateCompany = joi.object({
    id:joi.string().custom(isValidObjectID).required(),
    companyName: joi.string(),
    description : joi.string(),
    industry: joi.string(),
    address : joi.string(),
    numberOfEmployees:joi.number().min(11).max(20),
    companyEmail: joi.string().email(),
    HRs : joi.array().items(joi.string().custom(isValidObjectID))

}).required()

//------------------------------------------------------------- Soft Delete Company ------------------------------------------------------------------
export const softDeleteCompany = joi.object({
    id:joi.string().custom(isValidObjectID).required(),
}).required()

//------------------------------------------------------------- Get Company With Jobs ------------------------------------------------------------------
export const companyWithJobs = joi.object({
  id:joi.string().custom(isValidObjectID).required(),
}).required()  

//------------------------------------------------------------- Search Companies ------------------------------------------------------------------
export const searchCompanies = joi.object({
    companyName : joi.string().required()
}).required()

//------------------------------------------------------------- Upload Logo ------------------------------------------------------------------
export const uploadLogo = joi.object({
    id:joi.string().custom(isValidObjectID).required(),
    file:joi.object(fileObjectValidation("images")).required()
  }).required()
  
//------------------------------------------------------------- Upload Cover Picture ------------------------------------------------------------------
export const uploadCoverPicture = joi.object({
    id:joi.string().custom(isValidObjectID).required(),
    file:joi.object(fileObjectValidation("images")).required()
  }).required()


//------------------------------------------------------------- Delete Logo ------------------------------------------------------------------
export const deleteLogo = joi.object({
    id:joi.string().custom(isValidObjectID).required(),
  }).required()
  
//------------------------------------------------------------- Delete Cover Picture ------------------------------------------------------------------
export const deleteCoverPicture = joi.object({
    id:joi.string().custom(isValidObjectID).required(),
  }).required()  