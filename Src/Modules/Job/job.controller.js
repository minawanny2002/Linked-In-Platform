import { Router } from "express";
import * as jobServices from "./job.service.js";
import * as jobSchemas from "./job.validation.js";
import { asyncHandler } from "../../Utils/Error Handling/asyncHandler.js";
import { uploadCloud } from "../../Utils/File Uploading/multerCloud.js";
import endPoints from "./job.endpoints.js";
import { fileValidation } from "../../Utils/eNums/enums.js";
import isAuthorized from "../../middlewares/authorization.middleWare.js";
import isAuthenticated from "../../middlewares/authentication.middleWare.js";
import validation from "../../middlewares/validation.middleWare.js";


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
