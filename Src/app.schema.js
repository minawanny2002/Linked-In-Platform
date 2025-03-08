import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import User from "./DB/Models/user.model.js";
import { decrypt } from "./Utils/Encryption/Encryption.js";
import { getUsersQuery } from "./Modules/User/GraphQL/user.query.js";
import { getCompaniesQuery } from "./Modules/Company/GraphQL/company.query.js";
import { banUserMutation } from "./Modules/User/GraphQL/user.mutation.js";
import { approveCompanyMutation, banCompanyMutation } from "./Modules/Company/GraphQL/company.mutation.js";

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name:"MainQuery",
    description:"LinkedIN-APP",
    fields:{
        ...getUsersQuery,
        ...getCompaniesQuery
    }
  }),

  mutation: new GraphQLObjectType({
    name:"MainMutation",
    fields:{
      ...banUserMutation,
      ...banCompanyMutation,
      ...approveCompanyMutation
    }
  })
});
