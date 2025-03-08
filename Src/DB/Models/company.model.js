import joi from "joi";
import cloudinary from "../../Utils/File Uploading/Cloudinary.config.js";
import mongoose, { Schema, Types } from "mongoose";
import cron from "node-cron";
import {
  providers,
  genders,
  roles,
  defaultProfilePicture,
  OTPTypes,
} from "../../Utils/eNums/enums.js";
import Job from "./job.model.js";

//schema
const companySchema = new Schema(
    {
      companyName: {
        type: String,
        required: true,
        unique:true
      },
      description : {type:String, required:true},
      industry: {type:String, required:true},
      address : {type:String, required:true},
      numberOfEmployees:{type:Number, required:true, minLength:11, maxLEngth:20},
      companyEmail: {
        type: String,
        required: true,
        unique: [true, "Email ALready Exists"],
        lowercase: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      },
      createdBy : {type:Types.ObjectId, ref:"Users", required:true},
      logo: {
        secure_url: { type: String, default: defaultProfilePicture.secure_url },
        public_id: { type: String, default: defaultProfilePicture.public_id },
      },
      coverPicture: {
        secure_url: { type: String, default: defaultProfilePicture.secure_url },
        public_id: { type: String, default: defaultProfilePicture.public_id },
      },
      HRs : [{type:Types.ObjectId, ref:"Users"}],
      isDeleted: { type: Boolean, default: false },
      deletedAt: { type: Date },
      isBanned: { type: Boolean, default: false },
      bannedAt: { type: Date },
      legalAttachment: {secure_url: { type: String, required:true},public_id: { type: String, required:true}},
      cloudFolder : {type:String},
      approvedByAdmin: { type: Boolean, default: false },
    
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtual: true } }
  );



companySchema.virtual("Jobs", {
  ref : "Jobs",
  foreignField:"companyId",
  localField:"_id"
})


companySchema.post("deleteOne" , {query:false, document:true} , async(doc,next)=>{

  if (doc.legalAttachment.public_id != undefined) {
    await cloudinary.uploader.destroy(doc.legalAttachment.public_id);
  }
  const jobs = Job.find({companyId:doc._id});

  if(jobs.length)
  {
    for (const job of jobs) {
      await job.deleteOne();
    }
  }

  return next();
})

  //model
  const Company = mongoose.model("Companies", companySchema);
  export default Company;