import { connectDB } from "./DB/Connection.js";
import authRouter from "./Modules/Auth/auth.controller.js";
import userRouter from "./Modules/User/user.controller.js";
import globalErrorHandler from "./Utils/Error Handling/globalErrorHAndler.js";
import notFoundErrorHandler from "./Utils/Error Handling/notFoundErrorHandler.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { createHandler } from 'graphql-http/lib/use/express';
import cors from "cors"
import companyRouter from "./Modules/Company/company.controller.js";
import {schema} from "./app.schema.js";
import jobRouter from "./Modules/Job/job.controller.js";
import chatRouter from "./Modules/Chat/chat.controller.js";


const limiter = rateLimit({
  limit:3,
  windowMs : 0.5*60*1000,
  message :"Rate Limit Reached",
  legacyHeaders:true,
  standardHeaders:'draft-8'
})


export const bootStrap = async (app, express) => {
  await connectDB();
  // app.use(limiter)
  app.use(cors())
  app.use(helmet())
  app.use(express.json());
  app.use("/uploads", express.static("uploads"))
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/company", companyRouter),
  app.use("/job", jobRouter),
  app.use("/chat", chatRouter),
  app.use("/graphql", createHandler({schema, context:(req)=>{
    const{authorization} = req.headers;
    return {authorization}
  },formatError:(err)=>{
    return{
      success:false,
      message:err.originalError?.message,
      stack:err.stack,
      statusCode:err.originalError?.cause || 500,
    }
  }}))


  //API Not Found 
  app.all("*", notFoundErrorHandler);
  // Global Error Handler ** Must Be Last One
  app.use(globalErrorHandler);
};
