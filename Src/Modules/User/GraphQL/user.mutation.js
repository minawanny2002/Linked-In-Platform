import * as userServices from "./user.graphql.service.js"
import * as responseTypes from "./Types/user.types.response.js"
import * as requestTypes from "./Types/user.types.request.js"
import * as userSchemas from "./user.validation.js"
import { roles } from "../../../Utils/eNums/enums.js"
import { allMiddleWare } from "../../../GraphQL/allMiddleWares.js"
import { isAuthenticatedIsAuthorized } from "../../../GraphQL/authentication.js"
import { val } from "../../../GraphQL/val.js"


export const banUserMutation = {

    ban_unBan_User:{
        type: responseTypes.ban_unBan_user,
        args:requestTypes.ban_unBan_User,
        resolve:allMiddleWare(userServices.ban_unBan_User, isAuthenticatedIsAuthorized([roles.admin, roles.superAdmin]), val(userSchemas.ban_unBan_User))

    }
}