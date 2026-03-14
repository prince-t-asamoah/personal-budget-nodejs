const express = require("express");
const authRouter = express.Router();

const validateRequest = require("../middlewares/validateRequest.middleware");
const authController = require("../controllers/auth.controllers");
const {
  signupValidator,
  loginValidator,
  verifyEmailValidator,
} = require("../validators/auth.validators");

authRouter.post(
  "/signup",
  signupValidator,
  validateRequest,
  authController.signup,
);

authRouter.get(
  "/verify-email",
  verifyEmailValidator,
  validateRequest,
  authController.verifyEmail,
);

authRouter.post(
  "/login",
  loginValidator,
  validateRequest,
  authController.login,
);

authRouter.post("/logout", authController.logout);

module.exports = authRouter;
