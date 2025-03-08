import { GraphQLID, GraphQLNonNull } from "graphql";

export const ban_unBan_Company = {
    companyId: { type:new GraphQLNonNull(GraphQLID) },
}

export const approveCompany = {
    companyId: { type:new GraphQLNonNull(GraphQLID) },
}