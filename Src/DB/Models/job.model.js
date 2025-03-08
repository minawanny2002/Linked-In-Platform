import mongoose, { Schema, Types } from "mongoose";
import cloudinary from "../../Utils/File Uploading/Cloudinary.config.js";
import {
  jobLocations,
  workingTime,
  seniorityLevel,
} from "../../Utils/eNums/enums.js";
import Application from "./application.model.js";

//schema
const jobSchema = new Schema(
  {
    jobTitle: { type: String, required: true },
    jobLocation: {
      type: String,
      required: true,
      enum: Object.values(jobLocations),
    },
    workingTime: {
      type: String,
      required: true,
      enum: Object.values(workingTime),
    },
    seniorityLevel: {
      type: String,
      required: true,
      enum: Object.values(seniorityLevel),
    },
    jobDescription: { type: String, required: true },
    technicalSkills: [{ type: String, required: true }],
    softSkills: [{ type: String, required: true }],
    addedBy: { type: Types.ObjectId, ref: "Users", required: true },
    updatedBy: { type: Types.ObjectId, ref: "Users" },
    closed: { type: Boolean, default: false },
    companyId: { type: Types.ObjectId, ref: "Companies", required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtual: true } }
);


jobSchema.virtual("Applications", {
  ref:"Applications",
  foreignField:"jobID",
  localField:"_id"
})



jobSchema.query.paginate = async function (page) {
  page = page ? page : 1;
  const limit = 2;
  const skip = limit * (page - 1);

  const data = await this.skip(skip).limit(limit).sort({ createdAt: -1 });
  const items = await this.model.countDocuments();
  return {
    data,
    currentPage: Number(page),
    jobsInCurrentPage: data.length,
  };
};


jobSchema.post("deleteOne" , {query:false, document:true} , async(doc,next)=>{

  const applications = await Application.find({jobID:doc._id});
  
  if(applications.length)
  {
    for (const application of applications) {
      if (application.userCV.public_id != undefined) {
        await cloudinary.uploader.destroy(application.userCV.public_id);
      }
      await application.deleteOne();
    }
  }

  return next();
})


//model
const Job = mongoose.model("Jobs", jobSchema);
export default Job;
