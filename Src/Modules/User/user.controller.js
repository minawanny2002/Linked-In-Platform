import { Router } from "express";
import * as userServices from "./user.service.js";
import * as userSchemas from "./user.validation.js";

import { asyncHandler } from "./../../Utils/Error Handling/asyncHandler.js";
import validation from "./../../MiddleWares/Validation.MiddleWare.js";
import isAuthenticated from "./../../MiddleWares/Authentication.MiddleWare.js";
import isAuthorized from "./../../MiddleWares/Authorization.MiddleWare.js";

import { uploadCloud } from "../../Utils/File Uploading/multerCloud.js";
import endPoints from "./user.endpoint.js";
import { fileValidation } from "../../Utils/eNums/enums.js";

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
