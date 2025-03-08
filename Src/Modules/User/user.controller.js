import { Router } from "express";
import * as userServices from "./user.service.js";
import * as userSchemas from "./user.validation.js";
import { asyncHandler } from "./../../Utils/Error Handling/asyncHandler.js";
import isAuthorized from "./../../MiddleWares/Authorization.MiddleWare.js";
import { uploadCloud } from "../../Utils/File Uploading/multerCloud.js";
import endPoints from "./user.endpoint.js";
import { fileValidation } from "../../Utils/eNums/enums.js";
import jwt from "jsonwebtoken";
import User from "../../DB/Models/user.model.js";
import { verifyToken } from "../../Utils/Token/Token.js";
import { Types } from "mongoose";
import joi from "joi";

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

const userRouter = Router();


//----------------------------------------------------------- Update Profile -----------------------------------------------------------------
userRouter.patch(
  "/update-profile",
  isAuthenticated,
  isAuthorized(endPoints.updateProfile),
  validation(userSchemas.updateProfile),
  asyncHandler(userServices.updateProfile)
);

//----------------------------------------------------------- Get My Profile -----------------------------------------------------------------
userRouter.get(
  "/profile",
  isAuthenticated,
  isAuthorized(endPoints.profile),
  asyncHandler(userServices.profile)
);

//----------------------------------------------------------- Get Another Profile -----------------------------------------------------------------
userRouter.get(
  "/getAnotherProfile/:id",
  isAuthenticated,
  isAuthorized(endPoints.getAnotherProfile),
  validation(userSchemas.getAnotherProfile),
  asyncHandler(userServices.getAnotherProfile)
);

//----------------------------------------------------------- Update Password -----------------------------------------------------------------
userRouter.patch(
  "/updatePassword",
  isAuthenticated,
  isAuthorized(endPoints.updatePassword),
  validation(userSchemas.updatePassword),
  asyncHandler(userServices.updatePassword)
);

//----------------------------------------------------------- Upload Profile Picture -----------------------------------------------------------------
userRouter.post(
  "/uploadProfilePicture",
  isAuthenticated,
  isAuthorized(endPoints.uploadProfilePicture),
  uploadCloud(fileValidation.images).single("images"),
  validation(userSchemas.uploadProfilePicture),
  asyncHandler(userServices.uploadProfilePicture)
);

//----------------------------------------------------------- Upload Cover Picture -----------------------------------------------------------------
userRouter.post(
  "/uploadCoverPicture",
  isAuthenticated,
  isAuthorized(endPoints.uploadCoverPicture),
  uploadCloud(fileValidation.images).single("images"),
  validation(userSchemas.uploadCoverPicture),
  asyncHandler(userServices.uploadCoverPicture)
);

//----------------------------------------------------------- Delete Profile Picture -----------------------------------------------------------------
userRouter.delete(
  "/deleteProfilePicture",
  isAuthenticated, 
  isAuthorized(endPoints.deleteProfilePicture),
  asyncHandler(userServices.deleteProfilePicture)
);

//----------------------------------------------------------- Delete Cover Picture -----------------------------------------------------------------
userRouter.delete(
  "/deleteCoverPicture",
  isAuthenticated, 
  isAuthorized(endPoints.deleteCoverPicture),
  asyncHandler(userServices.deleteCoverPicture)
);

// ------------------------------------------------------------ Soft Delete --------------------------------------------------------------
userRouter.delete(
  "/softDelete",
  isAuthenticated,
  isAuthorized(endPoints.softDeleteAccount),
  validation(userSchemas.softDeleteAccount),
  asyncHandler(userServices.softDeleteAccount)
);




export default userRouter;
