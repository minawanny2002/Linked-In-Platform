import { asyncHandler } from "../Utils/Error Handling/asyncHandler.js"

const isAuthorized = (roles) =>{

    return (req, res, next) =>{

        if(!roles.includes(req.user.role))
            return next(new Error ("Not Authorized !", {cause:401}))
        return next()
    }
}

export default isAuthorized