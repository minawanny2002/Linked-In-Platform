import { Router } from "express";
import * as chatServices from "./chat.service.js";
import * as chatSchemas from "./chat.validation.js";
import endPoints from "./chat.endpoint.js";
import { asyncHandler } from "../../Utils/Error Handling/asyncHandler.js";
import validation from "../../MiddleWares/validation.middleware.js";
import isAuthenticated from "../../MiddleWares/authentication.middleware.js";
import isAuthorized from "./../../MiddleWares/Authorization.MiddleWare.js";

const chatRouter = Router();

//----------------------------------------------- Register User --------------------------------------------------
chatRouter.get(
  "/history/:senderId/:receiverId",
  isAuthenticated,
  isAuthorized(endPoints.chatHistory),
  validation(chatSchemas.chatHistory),
  asyncHandler(chatServices.chatHistory)
);


export default chatRouter;
