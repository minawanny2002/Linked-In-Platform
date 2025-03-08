import { Router } from "express";
import * as companyServices from "./company.service.js";
import * as companySchemas from "./company.validation.js";
import { asyncHandler } from "./../../Utils/Error Handling/asyncHandler.js";
import isAuthorized from "./../../MiddleWares/Authorization.MiddleWare.js";
import { uploadCloud } from "../../Utils/File Uploading/multerCloud.js";
import endPoints from "./company.endpoints.js";
import { fileValidation } from "../../Utils/eNums/enums.js";
import jobRouter from "../Job/job.controller.js";
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

const companyRouter = Router();
companyRouter.use("/:companyId/job", jobRouter);
companyRouter.use("/name/:companyName/job", jobRouter);


//------------------------------------------------------------- Add Company ------------------------------------------------------------------
companyRouter.post(
  "/",
  isAuthenticated,
  isAuthorized(endPoints.addCompany),
  uploadCloud([...fileValidation.images, ...fileValidation.pdfs]).single("legalAttachment"),
  validation(companySchemas.addCompany),
  asyncHandler(companyServices.addCompany)
);

//------------------------------------------------------------- Update Company / Add Hrs------------------------------------------------------------------
companyRouter.patch(
    "/updateCompany/:id",
    isAuthenticated,
    isAuthorized(endPoints.updateCompany),
    validation(companySchemas.updateCompany),
    asyncHandler(companyServices.updateCompany)
  );

//------------------------------------------------------------- Soft Delete Company ------------------------------------------------------------------
companyRouter.patch(
    "/softDeleteCompany/:id",
    isAuthenticated,
    isAuthorized(endPoints.softDeleteCompany),
    validation(companySchemas.softDeleteCompany),
    asyncHandler(companyServices.softDeleteCompany)
  );  
//------------------------------------------------------------ Get Company With Jobs------------------------------------------------------------------
companyRouter.get(
  "/companyWithJobs/:id",
  isAuthenticated,
  isAuthorized(endPoints.companyWithJobs),
  validation(companySchemas.companyWithJobs),
  asyncHandler(companyServices.companyWithJobs)
);  
//------------------------------------------------------------- Search Companies ------------------------------------------------------------------
companyRouter.get(
    "/searchCompanies",
    isAuthenticated,
    isAuthorized(endPoints.searchCompanies),
    validation(companySchemas.searchCompanies),
    asyncHandler(companyServices.searchCompanies)
  ); 

//--------------------------------------------------------------- Upload Logo -----------------------------------------------------------------
companyRouter.post(
    "/companyLogo/:id",
    isAuthenticated,
    isAuthorized(endPoints.uploadLogo),
    uploadCloud(fileValidation.images).single("images"),
    validation(companySchemas.uploadLogo),
    asyncHandler(companyServices.uploadLogo)
  );
  
  //----------------------------------------------------------- Upload Cover Picture -----------------------------------------------------------------
  companyRouter.post(
    "/uploadCoverPicture/:id",
    isAuthenticated,
    isAuthorized(endPoints.uploadCoverPicture),
    uploadCloud(fileValidation.images).single("images"),
    validation(companySchemas.uploadCoverPicture),
    asyncHandler(companyServices.uploadCoverPicture)
  );
  
  //----------------------------------------------------------- Delete Profile Picture -----------------------------------------------------------------
  companyRouter.delete(
    "/deleteLogo/:id",
    isAuthenticated, 
    isAuthorized(endPoints.deleteLogo),
    validation(companySchemas.deleteLogo),
    asyncHandler(companyServices.deleteLogo)
  );
  
  //----------------------------------------------------------- Delete Cover Picture -----------------------------------------------------------------
  companyRouter.delete(
    "/deleteCoverPicture/:id",
    isAuthenticated, 
    isAuthorized(endPoints.deleteCoverPicture),
    validation(companySchemas.deleteCoverPicture),
    asyncHandler(companyServices.deleteCoverPicture)
  );  

export default companyRouter;
