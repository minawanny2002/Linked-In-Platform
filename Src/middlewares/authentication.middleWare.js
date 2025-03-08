import jwt from "jsonwebtoken";
import User from "../DB/Models/user.model.js";
import { verifyToken } from "../Utils/Token/Token.js";
import { asyncHandler } from "../Utils/Error Handling/asyncHandler.js";

const isAuthenticated = asyncHandler(async (req, res, next) => {
  
  // Who Are You ????
  const { authorization } = req.headers; //Bearer <token>
  // Check If Authorization Is Not Sent || It Isn't Starting With "Bearer"
  if (!authorization || !authorization.startsWith("Bearer"))
    return next(new Error("Token Is Required !!", {cause:403}))
  // Extract Token
  const token = authorization.split(" ")[1]; //[Bearer, token]
  // Verify Token
  const payload = verifyToken({token});
  // Check User
  const user = await User.findById(payload.id)
  if (!user)
    return next(new Error("User Not Found !!", {cause:404}))
  
  if(user.isDeleted == true){
    if(user.deletedAt.getTime() > payload.iat*1000)
      return next(new Error ("Destroyed Token !!" , {cause:400}))
    return next(new Error("Account Is Freezed Please Login First !!" ,{cause:400}))
  }
    
  if(user.isBanned)
    return next(new Error("Account Is Banned By Admins !!" ,{cause:400}))

  // Send The user itself through the request to the profile function
  
  req.user = user;
  return next();
})
export default isAuthenticated;
