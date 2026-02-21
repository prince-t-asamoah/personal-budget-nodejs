const express = require("express");
const authRouter = express.Router();

const validateRequest = require("../middlewares/validateRequest");
const authController = require("../controllers/auth.controllers");
const { signupValidator } = require("../validators/auth.validators");

authRouter.post(
  "/signup",
  validateRequest,
  signupValidator,
  authController.signup,
);

module.exports = authRouter;
