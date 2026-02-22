const express = require("express");
const authRouter = express.Router();

const validateRequest = require("../middlewares/validateRequest.middleware");
const authController = require("../controllers/auth.controllers");
const {
  signupValidator,
  loginValidator,
} = require("../validators/auth.validators");

authRouter.post(
  "/signup",
  signupValidator,
  validateRequest,
  authController.signup,
);

authRouter.post(
  "/login",
  loginValidator,
  validateRequest,
  authController.login,
);

module.exports = authRouter;
