import { Router } from "express";
import * as companyServices from "./company.service.js";
import * as companySchemas from "./company.validation.js";
import { asyncHandler } from "./../../Utils/Error Handling/asyncHandler.js";
import isAuthorized from "../../middlewares/authorization.middleWare.js";
import { uploadCloud } from "../../Utils/File Uploading/multerCloud.js";
import endPoints from "./company.endpoints.js";
import { fileValidation } from "../../Utils/eNums/enums.js";
import jobRouter from "../Job/job.controller.js";
import validation from "../../middlewares/validation.middleWare.js";
import isAuthenticated from "../../middlewares/authentication.middleWare.js";


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
