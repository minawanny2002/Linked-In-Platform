import joi from "joi"
// import { fileObjectValidation, isValidObjectID } from "../../MiddleWares/Validation.MiddleWare.js"
import { jobLocations, seniorityLevel, status, workingTime } from "../../Utils/eNums/enums.js"
import { fileObjectValidation, isValidObjectID } from "../../middlewares/validation.middleWare.js"

//------------------------------------------------------------- Add Job ------------------------------------------------------------------
export const addJob = joi.object({
  companyId: joi.string().custom(isValidObjectID).required(),
  jobTitle : joi.string().required(),
  jobLocation :joi.string().valid(...Object.values(jobLocations)).required(),
  workingTime :joi.string().valid(...Object.values(workingTime)).required(),
  seniorityLevel :joi.string().valid(...Object.values(seniorityLevel)).required(),
  jobDescription :joi.string().required(),
  technicalSkills: joi.array().items(joi.string()).required(),
  softSkills: joi.array().items(joi.string()).required(),
}).required()

//------------------------------------------------------------- Update Job ------------------------------------------------------------------
export const updateJob = joi.object({
  jobId: joi.string().custom(isValidObjectID).required(),
  jobTitle : joi.string(),
  jobLocation :joi.string().valid(...Object.values(jobLocations)),
  workingTime :joi.string().valid(...Object.values(workingTime)),
  seniorityLevel :joi.string().valid(...Object.values(seniorityLevel)),
  jobDescription :joi.string(),
  technicalSkills: joi.array().items(joi.string()),
  softSkills: joi.array().items(joi.string()),

}).required()

//------------------------------------------------------------- Delete Job ------------------------------------------------------------------
export const deleteJob = joi.object({
    jobId:joi.string().custom(isValidObjectID).required(),
}).required()

//--------------------------------------------------- Search Jobs For Specific Company ------------------------------------------------------------------
export const searchJobsForACompany = joi.object({
    companyName : joi.string().required(),
    jobId:joi.string().custom(isValidObjectID),
    page:joi.number().required(),
}).required()

//--------------------------------------------------------- Jobs FIlter ------------------------------------------------------------------
export const jobsFilter = joi.object({
  page:joi.number().required(),
  workingTime :joi.string().valid(...Object.values(workingTime)), 
  jobLocation :joi.string().valid(...Object.values(jobLocations)),
  seniorityLevel :joi.string().valid(...Object.values(seniorityLevel)),
  jobTitle: joi.string(),
  technicalSkills:joi.array().items(joi.string()),
}).required()

//--------------------------------------------------------- Apply To Job ------------------------------------------------------------------
export const applyToJob = joi.object({
  id:joi.string().custom(isValidObjectID).required(),
  file:joi.object(fileObjectValidation("CV")).required()
}).required()

//--------------------------------------------------------- Get Applications ------------------------------------------------------------------
export const getApplications = joi.object({
  id:joi.string().custom(isValidObjectID).required(),
  page:joi.number().required(),
}).required()

//--------------------------------------------------------- Accept Reject App ------------------------------------------------------------------
export const acceptRejectApp = joi.object({
  id:joi.string().custom(isValidObjectID).required(),
  status:joi.string().valid(...Object.values(status)).required()
}).required()

