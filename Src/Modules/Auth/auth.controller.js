import { Router } from "express";
import * as authServices from "./auth.service.js";
import * as authSchemas from "./auth.validation.js";
import { asyncHandler } from "../../Utils/Error Handling/asyncHandler.js";
import validation from "../../middlewares/validation.middleWare.js"
import { auth } from "google-auth-library";

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
