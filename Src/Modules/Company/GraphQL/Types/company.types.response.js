import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLID,
} from "graphql";

export const getAllCompanies = new GraphQLObjectType({
  name: "allCompanies",
  fields: {
    success: { type: GraphQLBoolean },
    statusCode: { type: GraphQLInt },
    results: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: "getallCompanies",
          fields: {
            companyName: { type: GraphQLString },
            description: { type: GraphQLString },
            industry: { type: GraphQLString },
            address: { type: GraphQLString },
            numberOfEmployees: { type: GraphQLInt },
            companyEmail: { type: GraphQLString },
            createdBy: {
              type: new GraphQLObjectType({
                name: "createdBy",
                fields: {
                  firstName: { type: GraphQLString },
                  lastName: { type: GraphQLString },
                  username: { type: GraphQLString },
                  mobileNumber: { type: GraphQLString },
                  email: { type: GraphQLString },
                  profilePicture: {
                    type: new GraphQLObjectType({
                      name: "profilePicture",
                      fields: {
                        secure_url: { type: GraphQLString },
                        public_id: { type: GraphQLString },
                      },
                    }),
                  },
                  _id: { type: GraphQLID },
                },
              }),
            },
            logo: {
              type: new GraphQLObjectType({
                name: "logo",
                fields: {
                  secure_url: { type: GraphQLString },
                  public_id: { type: GraphQLString },
                },
              }),
            },
            coverPicture: {
              type: new GraphQLObjectType({
                name: "coverPicture",
                fields: {
                  secure_url: { type: GraphQLString },
                  public_id: { type: GraphQLString },
                },
              }),
            },
            HRs: {
              type: new GraphQLList(
                new GraphQLObjectType({
                  name: "HRs",
                  fields: {
                    firstName: { type: GraphQLString },
                    lastName: { type: GraphQLString },
                    username: { type: GraphQLString },
                    mobileNumber: { type: GraphQLString },
                    email: { type: GraphQLString },
                    profilePicture: {
                      type: new GraphQLObjectType({
                        name: "HrprofilePic",
                        fields: {
                          secure_url: { type: GraphQLString },
                          public_id: { type: GraphQLString },
                        },
                      }),
                    },
                    _id: { type: GraphQLID },
                  },
                })
              ),
            },
            isDeleted: { type: GraphQLBoolean },
            deletedAt: { type: GraphQLString },
            bannedAt: { type: GraphQLString },
            legalAttachment: {
              type: new GraphQLObjectType({
                name: "legalAttachment",
                fields: {
                  secure_url: { type: GraphQLString },
                  public_id: { type: GraphQLString },
                },
              }),
            },
            approvedByAdmin: { type: GraphQLBoolean },
          },
        })
      ),
    },
  },
});

export const ban_unBan_company= new GraphQLObjectType({
  name:"banUnbanCompany",
  fields:{
    success: { type: GraphQLBoolean },
    statusCode: { type: GraphQLInt },
    results : {type:GraphQLString}
  }
})

export const approveCompany= new GraphQLObjectType({
  name:"approveCompany",
  fields:{
    success: { type: GraphQLBoolean },
    statusCode: { type: GraphQLInt },
    results : {type:GraphQLString}
  }
})