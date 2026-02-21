const express = require("express");
const authRouter = express.Router();

const validateRequest = require("../middlewares/validateRequest");
const authController = require("../controllers/auth.controllers");
const {
  signupValidator,
  loginValidator,
} = require("../validators/auth.validators");

authRouter.post(
  "/signup",
  validateRequest,
  signupValidator,
  authController.signup,
);

authController.post(
  "/login",
  validateRequest,
  loginValidator,
  authController.login,
);

module.exports = authRouter;
