import User from "../../../DB/Models/user.model.js";
import { decrypt } from "../../../Utils/Encryption/Encryption.js";

export const getAllUsers = async (_,args , context) => {
  const users = await User.find({ isDeleted: false }).select(
    "firstName lastName username email mobileNumber profilePicture _id"
  );
  for (const user of users) {
    if (user.mobileNumber)
      user.mobileNumber = decrypt({ cipherText: user.mobileNumber });
  }
  return {
    success: true,
    statusCode:200,
    results:users
  }
};


export const ban_unBan_User = async(_,args, context)=>{

  const{id} = args;
  let message;
  const user = await User.findOne({_id:id, isDeleted:false});
  if(!user)
    throw new Error("User Not Found !!" , {cause:404});

  
  if(!user.isBanned){
    user.isBanned = true ;
    user.bannedAt = new Date()
    message = "User Banned !"
  }
  else if(user.isBanned){
    user.isBanned = false ;
    message = "User Un-Banned !"
  }
  user.updateMobileNumber=true;
  await user.save()
  return {
    statusCode:200,
    success:true,
    results:message
  }
  
}
