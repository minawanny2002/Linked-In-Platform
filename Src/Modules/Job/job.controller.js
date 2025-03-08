import { Router } from "express";
import * as jobServices from "./job.service.js";
import * as jobSchemas from "./job.validation.js";
import { asyncHandler } from "../../Utils/Error Handling/asyncHandler.js";
import isAuthorized from "../../MiddleWares/Authorization.MiddleWare.js";
import { uploadCloud } from "../../Utils/File Uploading/multerCloud.js";
import endPoints from "./job.endpoints.js";
import { fileValidation } from "../../Utils/eNums/enums.js";
import User from "../../DB/Models/user.model.js";

const isAuthenticated = asyncHandler(async (req, res, next) => {

  // Who Are You ????
  const { authorization } = req.headers; //Bearer <token>
  // Check If Authorization Is Not Sent || It Isn't Starting With "Bearer"
  if (!authorization || !authorization.startsWith("Bearer"))
    return next(new Error("Token Is Required !!", {cause:403}))
  // Extract Token
  const token = authorization.split(" ")[1]; //[Bearer, token]
  // Verify Token
  const payload = verifyToken({token});
  // Check User
  const user = await User.findById(payload.id)
  if (!user)
    return next(new Error("User Not Found !!", {cause:404}))
  
  if(user.isDeleted == true){
    if(user.deletedAt.getTime() > payload.iat*1000)
      return next(new Error ("Destroyed Token !!" , {cause:400}))
    return next(new Error("Account Is Freezed Please Login First !!" ,{cause:400}))
  }
    
  if(user.isBanned)
    return next(new Error("Account Is Banned By Admins !!" ,{cause:400}))

  // Send The user itself through the request to the profile function
  
  req.user = user;
  return next();
})
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

const jobRouter = Router({mergeParams:true});
//------------------------------------------------------------- Add Job ------------------------------------------------------------------
jobRouter.post(
  "/",
  isAuthenticated,
  isAuthorized(endPoints.addJob),
  validation(jobSchemas.addJob),
  asyncHandler(jobServices.addJob)
);

//------------------------------------------------------------- Update Job ------------------------------------------------------------------
jobRouter.patch(
    "/:jobId",
    isAuthenticated,
    isAuthorized(endPoints.updateJob),
    validation(jobSchemas.updateJob),
    asyncHandler(jobServices.updateJob)
  );

//------------------------------------------------------------- Delete Job ------------------------------------------------------------------
jobRouter.delete(
    "/:jobId",
    isAuthenticated,
    isAuthorized(endPoints.deleteJob),
    validation(jobSchemas.deleteJob),
    asyncHandler(jobServices.deleteJob)
  );  
//----------------------------------------------------- Search Jobs For Specific Company ------------------------------------------------------------------
jobRouter.get(
    "/jobForCompany",
    isAuthenticated,
    isAuthorized(endPoints.searchJobsForACompany),
    validation(jobSchemas.searchJobsForACompany),
    asyncHandler(jobServices.searchJobsForACompany)
  ); 

//----------------------------------------------------- Jobs Filter ------------------------------------------------------------------
jobRouter.get(
  "/",
  isAuthenticated,
  isAuthorized(endPoints.jobsFilter),
  validation(jobSchemas.jobsFilter),
  asyncHandler(jobServices.jobsFilter)
);

//----------------------------------------------------- Get Applications Of a Job ------------------------------------------------------------------
jobRouter.get
(
  "/:id/applications",
  isAuthenticated,
  isAuthorized(endPoints.getApplications),
  validation(jobSchemas.getApplications),
  asyncHandler(jobServices.getApplications)
); 

//----------------------------------------------------- Apply To Job ------------------------------------------------------------------
jobRouter.post
(
  "/:id/apply",
  isAuthenticated,
  isAuthorized(endPoints.applyToJob),
  uploadCloud(fileValidation.pdfs).single("CV"),
  validation(jobSchemas.applyToJob),
  asyncHandler(jobServices.applyToJob)
); 

//----------------------------------------------------- Accept/Reject Application ------------------------------------------------------------------
jobRouter.patch
(
  "/acceptRejectApp/:id",
  isAuthenticated,
  isAuthorized(endPoints.acceptRejectApp),
  validation(jobSchemas.acceptRejectApp),
  asyncHandler(jobServices.acceptRejectApp)
); 






export default jobRouter;
