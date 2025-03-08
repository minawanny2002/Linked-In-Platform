import User from "../../DB/Models/user.model.js"
import { compareHash } from "../../Utils/Hashing/Hash.js";
import cloudinary from "../../Utils/File Uploading/Cloudinary.config.js";
import { defaultProfilePicture } from "../../Utils/eNums/enums.js";




//------------------------------------------------------------ Update Profile --------------------------------------------------------------
export const updateProfile = async (req,res, next)=>{
    const {user} = req;

    let theUser = await User.findById(user._id)

    theUser.updateMobileNumber=true;
    Object.assign(theUser, req.body);
    await theUser.save()
    return res.status(200).json({success:true , result: theUser})

}

//------------------------------------------------------------ Get My Profile --------------------------------------------------------------
export const profile = async (req,res, next)=>{
    const {user} = req;
    return res.status(200).json({success:true , result: user})
}

//------------------------------------------------------------ Get Another Profile --------------------------------------------------------------
export const getAnotherProfile = async (req,res, next)=>{
  
    const {id} = req.params;
    // Here I dont use direct .select() because username is a virtual field will return undefined
    const user = await User.findById(id)

    
    if(!user)
        return next(new Error("User Not Found !!" , {cause:404}))
    return res.status(200).json({success:true , result: {
        username:user.username,
        mobileNumber:user.mobileNumber,
        profilePicture:user.profilePicture.public_id,
        coverPicture:user.coverPicture.public_id
    }})
}

//------------------------------------------------------------ Update Password --------------------------------------------------------------
export const updatePassword = async(req,res,next)=>{
    const {user} = req
    const {oldPassword, newPassword} = req.body;
    const matchedPassword = compareHash({plainText:oldPassword, hash:user.password});
    if(!matchedPassword)
        return next(new Error("Wrong Password" , {cause:403}))

    user.updatePassword = true
    user.updateMobileNumber = true
    user.password = newPassword;
    
    await user.save()

    return res.status(201).json({success:true, message:"Password Updated Successfully"})
}

//------------------------------------------------------------ Upload Profile Picture --------------------------------------------------------------
export const uploadProfilePicture = async(req,res,next)=>{

    const user = await User.findById(req.user._id)
    // upload file to cloud
    const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, {folder:`${process.env.CLOUD_FOLDER_NAME}/Users/${user._id}/profilePictures`})
    // save to DB
    user.updateMobileNumber=true
    user.profilePicture = {secure_url, public_id};
    await user.save();
    return res.status(200).json({success:true , message:"Profile Picture Uploaded Successfully" , result:user})
}

//------------------------------------------------------------ Upload Cover Picture --------------------------------------------------------------
export const uploadCoverPicture = async(req,res,next)=>{

    const user = await User.findById(req.user._id)
    // upload file to cloud
    const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, {folder:`${process.env.CLOUD_FOLDER_NAME}/Users/${user._id}/coverPictures`})
    // save to DB
    user.updateMobileNumber=true
    user.coverPicture = {secure_url, public_id};
    await user.save();
    return res.status(200).json({success:true , message:"Cover Picture Uploaded Successfully" , result:user})
}

//------------------------------------------------------------ Delete Profile Picture --------------------------------------------------------------
export const deleteProfilePicture = async(req,res,next)=>{

    const user = await User.findById(req.user._id);

    if(user.profilePicture.public_id == defaultProfilePicture.public_id && user.profilePicture.secure_url == defaultProfilePicture.secure_url)
        return res.status(400).json({success:false , message:"No Profile Picture"})
    
    const deleted = await cloudinary.uploader.destroy(user.profilePicture.public_id);
    if(deleted.result== "ok")
    {
        user.profilePicture = defaultProfilePicture;
        user.updateMobileNumber=true
        await user.save();
        return res.status(200).json({success:true , message:"Profile Picture Deleted Successfully"})
    }
    
}

//------------------------------------------------------------ Delete Cover Picture --------------------------------------------------------------
export const deleteCoverPicture = async(req,res,next)=>{

    const user = await User.findById(req.user._id);

    if(user.coverPicture.public_id == defaultProfilePicture.public_id && user.coverPicture.secure_url == defaultProfilePicture.secure_url)
        return res.status(400).json({success:false , message:"No Cover Picture"})
    
    const deleted = await cloudinary.uploader.destroy(user.coverPicture.public_id);
    if(deleted.result== "ok")
    {
        user.coverPicture = defaultProfilePicture;
        user.updateMobileNumber=true
        await user.save();
        return res.status(200).json({success:true , message:"Cover Picture Deleted Successfully"})
    }
    
}

//------------------------------------------------------------ Soft Delete -----------------------------------------------------------------------
export const softDeleteAccount = async (req,res, next)=>{

    const {password} = req.body;
    const user = await User.findById(req.user._id)
    if(! compareHash({plainText:password, hash:user.password}))
        return next(new Error("Invalid Password !!" , {cause:403}))
    
    user.isDeleted = true;
    user.deletedAt = new Date();
    user.updateMobileNumber=true;
    await user.save()
    return res.status(200).json({success:true , message:"Account Freezed Successfully"})

}


