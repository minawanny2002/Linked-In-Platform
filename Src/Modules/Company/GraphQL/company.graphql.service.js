import Company from "../../../DB/Models/company.model.js";

export const getAllCompanies = async (_,args) => {

  const companies = await Company.find({ isDeleted: false }).populate([{path:"createdBy", select:"firstName lastName username email mobileNumber profilePicture _id"}, {path:"HRs", select:"firstName lastName username email mobileNumber profilePicture _id"}])

  return {
    success: true,
    statusCode:200,
    results:companies
  }
};


export const ban_unBan_Company = async(_,args, context)=>{

  const{companyId} = args;
  let message;
  const company = await Company.findOne({_id:companyId, isDeleted:false});
  if(!company)
    throw new Error("Company Not Found !!" , {cause:404});

  
  if(!company.isBanned){
    company.isBanned = true ;
    company.bannedAt = new Date()
    message = "company Banned !"
  }
  else if(company.isBanned){
    company.isBanned = false ;
    message = "company Un-Banned !"
  }

  await company.save()
  return {
    statusCode:200,
    success:true,
    results:message
  }
  
}

export const approveCompany = async(_,args, context)=>{

  const{companyId} = args;
  let message
  const company = await Company.findOne({_id:companyId, isDeleted:false});
  if(!company)
    throw new Error("Company Not Found !!" , {cause:404});

  
  if(!company.approvedByAdmin){
    company.approvedByAdmin = true ;
    message = "Company Approved Successfully !"
  }
  else if(company.approvedByAdmin){
    message = "Company Already Approved !"
  }

  await company.save()
  return {
    statusCode:200,
    success:true,
    results:message
  }
  
}