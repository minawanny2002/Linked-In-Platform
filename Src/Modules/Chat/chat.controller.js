import { Router } from "express";
import * as chatServices from "./chat.service.js";
import * as chatSchemas from "./chat.validation.js";
import endPoints from "./chat.endpoint.js";
import { asyncHandler } from "../../Utils/Error Handling/asyncHandler.js";
import validation from "../../middlewares/validation.middleWare.js";
import isAuthenticated from "../../middlewares/authentication.middleWare.js";
import isAuthorized from "../../middlewares/authorization.middleWare.js";

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
