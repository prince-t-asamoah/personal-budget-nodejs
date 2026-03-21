const express = require("express");
const authRouter = express.Router();

const validateRequest = require("../middlewares/validateRequest.middleware");
const authController = require("../controllers/auth.controllers");
const {
  signupValidator,
  loginValidator,
  verifyEmailValidator,
  forgotPasswordValidator,
  validateResetTokenValidator,
  resetPasswordValidator,
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

authRouter.post(
  "/forgot-password",
  forgotPasswordValidator,
  validateRequest,
  authController.forgotPassword,
);

authRouter.post(
  "/validate-reset-token",
  validateResetTokenValidator,
  validateRequest,
  authController.validateResetToken,
);

authRouter.post(
  "/reset-password",
  resetPasswordValidator,
  validateRequest,
  authController.resetPassword,
);

authRouter.get("/me", authController.currentUser);

authRouter.get("/google", authController.googleOAuth);

authRouter.get("/google/callback", authController.googleoAuthCallback);

module.exports = authRouter;
