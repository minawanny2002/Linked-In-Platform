
import { allMiddleWare } from "../../../GraphQL/allMiddleWares.js";
import { isAuthenticatedIsAuthorized } from "../../../GraphQL/authentication.js";
import { roles } from "../../../Utils/eNums/enums.js";
import * as companyServices from "./company.graphql.service.js"
import * as responseTypes from "./Types/company.types.response.js"

export const getCompaniesQuery = {
  allCompanies: {
    type: responseTypes.getAllCompanies,
    resolve: allMiddleWare(companyServices.getAllCompanies, isAuthenticatedIsAuthorized([roles.admin, roles.superAdmin]))
  },
};
