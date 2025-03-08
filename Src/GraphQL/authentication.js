import User from "../DB/Models/user.model.js";
import { asyncHandler } from "../Utils/Error Handling/asyncHandler.js";
import { verifyToken } from "../Utils/Token/Token.js";

export const isAuthenticatedIsAuthorized = (Roles) => {
  return (resolver) => {
    //----------------------------------------------------------- Authentication---------------------------------------------------
    return async (parent, args, context) => {
      // Who Are You ????
      const { authorization } = context; //Bearer <token>

      // Check If Authorization Is Not Sent || It Isn't Starting With "Bearer"
      if (!authorization || !authorization.startsWith("Bearer"))
        throw new Error("Token Is Required !!", { cause: 403 });
      // Extract Token
      const token = authorization.split(" ")[1]; //[Bearer, token]
      // Verify Token
      const payload = verifyToken({ token });
      // Check User
      const user = await User.findById(payload.id);
      if (!user) throw new Error("User Not Found !!", { cause: 404 });

      if (user.isDeleted == true) {
        if (user.deletedAt.getTime() > payload.iat * 1000)
          throw new Error("Destroyed Token !!", { cause: 400 });
        throw new Error("Account Is Freezed Please Login First !!", {
          cause: 400,
        });
      }

      if(user.isBanned)
        throw new Error("Account Is Banned By Admins !!" ,{cause:400})
      //----------------------------------------------------------- Authorization ---------------------------------------------------
      if(Roles?.length && !Roles.includes(user.role))
        throw new Error ("Not Authorized !", {cause:403})
      //-----------------------------------------------------------------------------------------------------------------------------
      context.user = user;
      return resolver(parent, args, context);
    };
  };
};
