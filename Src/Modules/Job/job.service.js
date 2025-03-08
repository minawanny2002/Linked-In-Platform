import Company from "../../DB/Models/company.model.js";
import Job from "../../DB/Models/job.model.js";
import Application from "../../DB/Models/application.model.js";
import cloudinary from "../../Utils/File Uploading/Cloudinary.config.js";
import {io, onlineHRs} from "./../../../index.js"
import { status } from "../../Utils/eNums/enums.js";
import { emailEmitter } from "../../Utils/Email/emailEvent.js";



//------------------------------------------------------------- Add Job ------------------------------------------------------------------
export const addJob = async (req, res, next) => {
  const { companyId } = req.params;
  const company = await Company.findOne({ _id: companyId, isDeleted: false });

  if(!company)
    return next(new Error("No Company Found !!" , {cause:404}))
  const companyOwner = company.createdBy.toString() == req.user._id.toString();
  const companyHR = company.HRs.includes(req.user._id);

  if (!companyOwner && !companyHR)
    return next(
      new Error("You Are Not Allowed To Add Jobs To This Company", {
        cause: 403,
      })
    );

  const job = await Job.create({
    ...req.body,
    addedBy: req.user._id,
    companyId: company._id,
  });

  return res
    .status(201)
    .json({ success: true, message: "Job Created Successfully", results: job });
};

//------------------------------------------------------------- Update Job ------------------------------------------------------------------
export const updateJob = async (req, res, next) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId);
  if (!job) return next(new Error("Job Not found !!", { cause: 404 }));

  const jobOwner = job.addedBy.toString() == req.user._id.toString();
  if (!jobOwner)
    return next(
      new Error("You Are Not Allowed To Update This Job", { cause: 403 })
    );

  await Job.findOneAndUpdate(
    { _id: job._id },
    { ...req.body, updatedBy: req.user._id }
  );

  return res.status(200).json({
    success: true,
    message: "Job Updated Successfully",
    result: job,
  });
};

//------------------------------------------------------------- Delete Job ------------------------------------------------------------------
export const deleteJob = async (req, res, next) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId);
  if (!job) return next(new Error("Job Not found !!", { cause: 404 }));

  const company = await Company.findById(job.companyId);
  if (!company) return next(new Error("Company Not found !!", { cause: 404 }));
  const companyHR = company.HRs.includes(req.user._id);

  if (!companyHR)
    return next(
      new Error("You Are Not Allowed To Delete This Job", { cause: 403 })
    );

  await job.deleteOne();

  return res.status(201).json({
    success: true,
    message: "Job Deleted Successfully",
  });
};

//--------------------------------------------------- Search Jobs For Specific Company ------------------------------------------------------------------
export const searchJobsForACompany = async (req, res, next) => {
  const { companyName } = req.params;
  const page  = parseInt(req.query.page);
  const jobId = req.query.jobId ? req.query.jobId : undefined;
  let jobs;
  // const regExpression = new RegExp(companyName, 'i')
  const company = await Company.findOne({
    companyName: { $regex: `^${companyName}$`, $options: "i" },
    isDeleted: false,
    isBanned: false,
  });

  if (!company) return next(new Error("No Company Found !!", { cause: 404 }));

  if (jobId)
    jobs = await Job.findOne({
      companyId: company._id,
      _id: jobId,
      closed: false,
    });
  else
    jobs = await Job.find({ companyId: company._id, closed: false }).paginate(
      page
    );

  return res.status(200).json({ success: true, results: jobs });
};

//------------------------------------------------------------- Jobs Filter ------------------------------------------------------------------
export const jobsFilter = async (req, res, next) => {
  const {page} = req.query;
  const {
    workingTime,
    jobLocation,
    seniorityLevel,
    jobTitle,
    technicalSkills,
  } = req.body;
  const filters = {};
  if (workingTime) {
    filters.workingTime = workingTime;
  }

  if (jobLocation) {
    filters.jobLocation = jobLocation;
  }

  if (seniorityLevel) {
    filters.seniorityLevel = seniorityLevel;
  }

  //partial search
  if (jobTitle) {
    filters.jobTitle = { $regex: `${jobTitle}`, $options: "i" };
  }

  if (technicalSkills && technicalSkills.length > 0) {
    filters.technicalSkills = { 
      $all: technicalSkills.map(skill => new RegExp(`${skill}`, 'i'))
    };

  }

  const jobs = await Job.find(filters).paginate(page)

  return res.status(200).json({ success: true, results: jobs });
};

//------------------------------------------------------------- Get Applications ------------------------------------------------------------------
export const getApplications = async (req, res, next) => {

  const {id} = req.params;
  const {user} = req;
  const page = parseInt(req.query.page)
  const limit = 2;
  const skip = limit * (page - 1);


  const job = await Job.findById(id).populate([
    {path:"companyId", select:"createdBy HRs"},
    {path:"Applications", options: { limit, skip}}
  ]);
  if(!job)
    return next(new Error("Job Not Found !!", {cause:404}));


  const companyOwner = job.companyId.createdBy.toString() == user._id.toString();
  const companyHR = job.companyId.HRs.includes(user._id); 
  if(!companyOwner && !companyHR)
    return next(new Error("Not Authorized !!" , {cause:403}));


  // const applications = await job.get("Applications");
  return res.status(200).json({ success: true,results: job});
}

//------------------------------------------------------------- ApplyToJob ------------------------------------------------------------------
export const applyToJob = async (req, res, next) => {

  const {id} = req.params;
  const {user} = req;

  const job = await Job.findById(id);
  if(!job)
    return next(new Error("Job Not Found !!", {cause:404}));

  const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, {folder:`${process.env.CLOUD_FOLDER_NAME}/Jobs/${job._id}/Applications`})

  const application = await Application.create({jobID:job._id, userID:user._id, userCV:{secure_url,public_id}})

  // Emit a socket event to notify HR
  Object.keys(onlineHRs).forEach((socketId) => {
      io.to(socketId).emit('new-application', { jobId:job._id, userId:user._id });
    });

  return res.status(200).json({ success: true, message:"Application Sent Successfully" ,results: application });
};

//------------------------------------------------------------- Accept reject App ------------------------------------------------------------------
export const acceptRejectApp = async (req, res, next) => {

  const {id} = req.params;
  const statusReq = req.body.status;  
  let message;
  const application = await Application.findById(id).populate([
    {path:"jobID", select:"companyId", populate:{path:"companyId", select:"HRs"}},
    {path:"userID", select:"email"}
  ]);
  if(!application)
    return next(new Error("Application Not Found !!", {cause:404}));

  
  const companyHR = application.jobID.companyId.HRs.includes(req.user._id); 


  if(!companyHR)
    return next(new Error("Not Authorized !!" , {cause:403}));

  application.status = statusReq;
  await application.save()

  
  if(statusReq== status.accepted)
  {emailEmitter.emit("acceptRejectApp", application.userID.email, "Accepted Application", "Accepted");
    message = "Application Accepted"
  }

  if(statusReq== status.rejected)
    {emailEmitter.emit("acceptRejectApp", application.userID.email, "Rejected Application", "Rejected");
      message = "Application Rejected"
    }

  return res.status(200).json({ success: true, message});
}

