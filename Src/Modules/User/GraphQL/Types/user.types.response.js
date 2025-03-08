import { GraphQLBoolean, GraphQLInt, GraphQLObjectType,GraphQLList, GraphQLString,GraphQLID } from "graphql";

export const getAllUsers = new GraphQLObjectType({
  name: "allUsers",
  fields: {
    success: { type: GraphQLBoolean },
    statusCode: { type: GraphQLInt },
    results: {type: new GraphQLList(
        new GraphQLObjectType({
          name: "getAllUsers",
          fields: {
            firstName: { type: GraphQLString },
            lastName: { type: GraphQLString },
            username: { type: GraphQLString },
            mobileNumber: { type: GraphQLString },
            email: { type: GraphQLString },
            profilePicture: {
              type: new GraphQLObjectType({
                name: "profilePic",
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
    }
  }
});

export const ban_unBan_user= new GraphQLObjectType({
  name:"banUnbanUser",
  fields:{
    success: { type: GraphQLBoolean },
    statusCode: { type: GraphQLInt },
    results : {type:GraphQLString}
  }
})
