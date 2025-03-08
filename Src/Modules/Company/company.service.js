import { nanoid } from "nanoid";
import Company from "../../DB/Models/company.model.js";
import cloudinary from "../../Utils/File Uploading/Cloudinary.config.js";
import { defaultProfilePicture, roles } from "../../Utils/eNums/enums.js";
import User from "../../DB/Models/user.model.js";

//------------------------------------------------------------- Add Company ------------------------------------------------------------------
export const addCompany = async (req, res, next) => {
  const { companyName, companyEmail } = req.body;
  const legalAttachment = req.file;
  const cloudFolder = nanoid();
  const companyExist = await Company.findOne({ companyName, companyEmail });

  if (companyExist)
    return next(new Error("Company Already Exists !!", { cause: 400 }));

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    legalAttachment.path,
    {
      folder: `${process.env.CLOUD_FOLDER_NAME}/Companies/${cloudFolder}/legalAttachment`,
    }
  );

  req.body.cloudFolder = cloudFolder;
  req.body.legalAttachment = { secure_url, public_id };
  req.body.createdBy = req.user._id;
  const company = await Company.create({ ...req.body});
  req.user.companyOwner =true;
  req.user.updateMobileNumber=true;
  await req.user.save();

  return res.status(200).json({
    success: true,
    message: "Company Created And Pending Approval",
    result: company,
  });
};

//------------------------------------------------------------- Update Company ------------------------------------------------------------------
export const updateCompany = async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;

  // check company existence;
  const company = await Company.findOne({_id:id, isDeleted:false});
  if (!company) return next(new Error("Company Not Exist !!", { cause: 404 }));

  //check owner of the company
  if (company.createdBy.toString() != user._id.toString())
    return next(
      new Error("You Are Not Allowed To Update This Company !!", { cause: 400 })
    );

    // check array of HRs And update the users
  if(req.body.HRs)
    {
      for (const id of req.body.HRs) {
        const user = await User.findById(id);
        if(!user)
          return next (new Error ("One Of HRs Not found !!" , {cause:404}))
        user.updateMobileNumber =true;
        user.HR = true;
        await user.save()
      }
    }  

  Object.assign(company, req.body);
  await company.save();
  return res.status(200).json({
    success: true,
    message: "Company Updated Successfully",
    result: company,
  });
};

//------------------------------------------------------------- Delete Company ------------------------------------------------------------------
export const softDeleteCompany = async (req, res, next) => {
  const userId = req.user._id;
  const { id } = req.params;

  // check company existence;
  const company = await Company.findOne({_id:id, isDeleted:false});
  if (!company) return next(new Error("Company Not Exist !!", { cause: 404 }));

  const companyOwner = company.createdBy.toString() == userId.toString();
  const admin = req.user.role == roles.admin;

  if (!companyOwner && !admin)
    return next(new Error("You Are Not Allowed To Delete This Company", { cause: 400 }));

  company.isDeleted = true;
  company.deletedAt = new Date();
  await company.save();

  return res.status(201).json({
    success: true,
    message: "Company Freezed Successfully",
  });
};

//---------------------------------------------------------- Get Company With Jobs ------------------------------------------------------------------
export const companyWithJobs = async (req, res, next) => {

  const{id} = req.params;
  const company = await Company.findOne({_id:id, isDeleted:false}).populate({path:"Jobs", select:"jobTitle jobLocation workingTime seniorityLevel jobDescription technicalSkills softSkills -_id"});
  if(!company)
    return next(new Error("Company Not Found !!"), {cause:404})

  return res.status(200).json({success:true, results:company})
};

//------------------------------------------------------------- Search Companies ------------------------------------------------------------------
export const searchCompanies = async (req, res, next) => {
    const {companyName} = req.query;

    // Partial Search with part from the name and case insensitive to get all companies that match
    const regExpression = new RegExp(companyName, 'i')

    const companies = await Company.find({companyName: regExpression})

    if(companies.length==0)
        return next(new Error("No Companies Found" , {cause:404}));

    return res.status(200).json({success:true, results:companies})
  };

//------------------------------------------------------------ Upload Logo --------------------------------------------------------------
export const uploadLogo = async(req,res,next)=>{

    const {id} =req.params
    const company = await Company.findById(id)
    if(!company)
        return next(new Error("Company Not Exist !" , {cause:404}))

    //check Owner
    if(company.createdBy.toString() != req.user._id.toString())
        return next(new Error("Not Authorized !!" ,{cause:400}))

    // upload file to cloud
    const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, {folder:`${process.env.CLOUD_FOLDER_NAME}/Companies/${company.cloudFolder}/Logos`})
    // save to DB
    company.logo = {secure_url, public_id};
    await company.save();
    return res.status(200).json({success:true , message:"Logo Uploaded Successfully" , result:company})
}

//------------------------------------------------------------ Upload Cover Picture --------------------------------------------------------------
export const uploadCoverPicture = async(req,res,next)=>{

    const {id} =req.params
    const company = await Company.findById(id)
    if(!company)
        return next(new Error("Company Not Exist !" , {cause:404}))

    //check Owner
    if(company.createdBy.toString() != req.user._id.toString())
        return next(new Error("Not Authorized !!" ,{cause:400}))
    // upload file to cloud
    const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, {folder:`${process.env.CLOUD_FOLDER_NAME}/Companies/${company.cloudFolder}/coverPictures`})
    // save to DB

    company.coverPicture = {secure_url, public_id};
    await company.save();
    return res.status(200).json({success:true , message:"Cover Picture Uploaded Successfully" , result:company})
}

//------------------------------------------------------------ Delete Logo--------------------------------------------------------------
export const deleteLogo = async(req,res,next)=>{

    const {id} =req.params
    const company = await Company.findById(id)
    if(!company)
        return next(new Error("Company Not Exist !" , {cause:404}))

    //check Owner
    if(company.createdBy.toString() != req.user._id.toString())
        return next(new Error("Not Authorized !!" ,{cause:400}))

    if(company.logo.public_id == defaultProfilePicture.public_id && company.logo.secure_url == defaultProfilePicture.secure_url)
        return res.status(400).json({success:false , message:"No Logo"})
    
    const deleted = await cloudinary.uploader.destroy(company.logo.public_id);
    if(deleted.result== "ok")
    {
        company.logo = defaultProfilePicture;
        await company.save();
        return res.status(200).json({success:true , message:"Logo Deleted Successfully"})
    }
    
}

//------------------------------------------------------------ Delete Cover Picture --------------------------------------------------------------
export const deleteCoverPicture = async(req,res,next)=>{

    const {id} =req.params
    const company = await Company.findById(id)
    if(!company)
        return next(new Error("Company Not Exist !" , {cause:404}))

    //check Owner
    if(company.createdBy.toString() != req.user._id.toString())
        return next(new Error("Not Authorized !!" ,{cause:400}))

    if(company.coverPicture.public_id == defaultProfilePicture.public_id && company.coverPicture.secure_url == defaultProfilePicture.secure_url)
        return res.status(400).json({success:false , message:"No Cover Picture"})
    
    const deleted = await cloudinary.uploader.destroy(company.coverPicture.public_id);
    if(deleted.result== "ok")
    {
        company.coverPicture = defaultProfilePicture;
        await company.save();
        return res.status(200).json({success:true , message:"Cover Picture Deleted Successfully"})
    }
    
}  