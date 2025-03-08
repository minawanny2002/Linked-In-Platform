import mongoose, { Schema, Types } from "mongoose";
import {status} from "../../Utils/eNums/enums.js";

//schema
const applicationSchema = new Schema(
  {
    jobID: { type: Types.ObjectId, ref: "Jobs", required: true },
    userID: { type: Types.ObjectId, ref: "Users", required: true },
    userCV : {public_id:{type:String, required:true}, secure_url:{type:String, required:true}},
    status : {type:String, enum:Object.values(status), default:status.pending}
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtual: true } }
);

applicationSchema.query.paginate = async function (page){
  page = page?page:1
  const limit =2;
  const skip = limit *(page-1)

  const data = await this.skip(skip).limit(limit).sort({ createdAt: -1});
  return {
    data,
    currentPage : Number(page),
    jobsInCurrentPage:data.length,
  }
}

//model
const Application = mongoose.model("Applications", applicationSchema);
export default Application;
