import * as userServices from "./user.graphql.service.js"
import * as responseTypes from "./Types/user.types.response.js"
import { isAuthenticatedIsAuthorized } from "../../../GraphQL/authentication.js"
import { roles } from "../../../Utils/eNums/enums.js"
import { allMiddleWare } from "../../../GraphQL/allMiddleWares.js"


export const getUsersQuery = {

    allUsers:{
        type: responseTypes.getAllUsers,
        resolve: allMiddleWare(userServices.getAllUsers, isAuthenticatedIsAuthorized([roles.admin, roles.superAdmin]))
    }
}