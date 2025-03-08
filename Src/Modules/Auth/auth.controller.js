import { Router } from "express";
import * as authServices from "./auth.service.js";
import * as authSchemas from "./auth.validation.js";
import { asyncHandler } from "../../Utils/Error Handling/asyncHandler.js";
import { auth } from "google-auth-library";
import { Types } from "mongoose";
import joi from "joi";
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


const authRouter = Router();

//----------------------------------------------- Register User --------------------------------------------------
authRouter.post(
  "/register",
  validation(authSchemas.register),
  asyncHandler(authServices.register)
);

//----------------------------------------------- confirm OTP --------------------------------------------------
authRouter.post(
  "/confirmOTP",
  validation(authSchemas.confirmOTP),
  asyncHandler(authServices.confirmOTP)
);

//----------------------------------------------- Sign In (system) --------------------------------------------------
authRouter.post(
  "/login",
  validation(authSchemas.login),
  asyncHandler(authServices.login)
);
//----------------------------------------------- Sign In/UP (GMAIL) --------------------------------------------------
authRouter.post(
  "/loginWithGmail",
  validation(authSchemas.loginGmail),
  asyncHandler(authServices.loginGmail)
);

//----------------------------------------------- Send OTP for Forget password --------------------------------------------------
authRouter.post(
  "/OTP-forgetPassword",
  validation(authSchemas.OTPForgetPassword),
  asyncHandler(authServices.OTPForgetPassword)
);

//----------------------------------------------- Reset password --------------------------------------------------
authRouter.patch(
  "/resetPassword",
  validation(authSchemas.resetPassword),
  asyncHandler(authServices.resetPassword)
);

//----------------------------------------------- New Access Token --------------------------------------------------
authRouter.post(
  "/new_access_token",
  validation(authSchemas.newAccessToken),
  asyncHandler(authServices.newAccessToken)
);

export default authRouter;
