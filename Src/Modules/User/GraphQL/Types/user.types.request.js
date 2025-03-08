import { GraphQLID, GraphQLNonNull } from "graphql";

export const ban_unBan_User = {
    id: { type:new GraphQLNonNull(GraphQLID) },
}