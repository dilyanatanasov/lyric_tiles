import express = require("express");
import * as userController  from "../contollers/user-controller";

export const userRouter = express.Router();
userRouter.post("/:id", userController.getUser);
userRouter.post("/login", userController.getUser);