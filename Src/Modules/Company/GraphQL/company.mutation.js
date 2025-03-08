import * as companyServices from "./company.graphql.service.js"
import * as responseTypes from "./Types/company.types.response.js"
import * as requestTypes from "./Types/company.types.request.js"
import * as companySchemas from "./company.validation.js"
import { roles } from "../../../Utils/eNums/enums.js"
import { allMiddleWare } from "../../../GraphQL/allMiddleWares.js"
import { isAuthenticatedIsAuthorized } from "../../../GraphQL/authentication.js"
import { validation } from "../../../GraphQL/validation.js"


export const banCompanyMutation = {

    ban_unBan_Company:{
        type: responseTypes.ban_unBan_company,
        args:requestTypes.ban_unBan_Company,
        resolve:allMiddleWare(companyServices.ban_unBan_Company, isAuthenticatedIsAuthorized([roles.admin, roles.superAdmin]), validation(companySchemas.ban_unBan_Company))

    }
}

export const approveCompanyMutation = {

    approveCompany:{
        type: responseTypes.approveCompany,
        args:requestTypes.approveCompany,
        resolve:allMiddleWare(companyServices.approveCompany, isAuthenticatedIsAuthorized([roles.admin, roles.superAdmin]), validation(companySchemas.approveCompany))

    }
}