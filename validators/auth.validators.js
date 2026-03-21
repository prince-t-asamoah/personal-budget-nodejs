const { body, query } = require("express-validator");

const signupValidator = [
  body("fullname")
    .exists({ values: "undefined" })
    .withMessage("Fullname is required")
    .notEmpty()
    .withMessage("Fullname cannot be empty")
    .isString()
    .withMessage("Fullname must be a string"),
  body("email")
    .exists({ values: "undefined"})
    .withMessage("Enail is required")
    .notEmpty()
    .withMessage("Email cannot be exmpty")
    .isEmail()
    .withMessage("Valid email is required"),
  body("password")
    .exists({ values: "undefined" })
    .withMessage("Password is required")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 12 })
    .withMessage("Password must be at least 12 characters long."),
];

const loginValidator = [
  body("email")
    .exists({ values: "undefined" })
    .withMessage("Email is required")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Valid email is required"),
  body("password")
    .exists({ values: "undefined" })
    .withMessage("Password is required")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 12 })
    .withMessage("Password must be at least 12 characters long."),
  body("rememberMe")
    .optional()
    .isBoolean()
    .withMessage("Remember me must be a boolean value")
    .toBoolean(),
];

const verifyEmailValidator = [
  query('token')
    .exists({ values: "undefined" })
    .withMessage("Token is required")
    .notEmpty()
    .withMessage("Token cannot be empty")
    .isHexadecimal()
    .withMessage("Token must be a valid hexadecimal string")
    .isLength({ min: 64, max: 64 })
    .withMessage("Token must be 64 characters long"),
];

const forgotPasswordValidator = [
  body("email")
    .exists({ values: "undefined" })
    .withMessage("Email is required")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Valid email is required"),
];

const resetPasswordValidator = [
  body("token")
    .exists({ values: "undefined" })
    .withMessage("Token is required")
    .notEmpty()
    .withMessage("Token cannot be empty")
    .isString()
    .withMessage("Token must be a string")
    .isHexadecimal()
    .withMessage("Token must be a valid hexadecimal string")
    .isLength({ min: 64, max: 64 })
    .withMessage("Token must be 64 characters long"),
  body("newPassword")
    .exists({ values: "undefined" })
    .withMessage("New password is required")
    .notEmpty()
    .withMessage("New password cannot be empty")
    .isLength({ min: 12 })
    .withMessage("New password must be at least 12 characters long."),
  body("confirmNewPassword")
    .exists({ values: "undefined" })
    .withMessage("Confirm new password is required")
    .notEmpty()
    .withMessage("Confirm new password cannot be empty")
    .isLength({ min: 12 })
    .withMessage("Confirm new password must be at least 12 characters long.")
    .custom((confirmNewPassword, { req }) =>
      confirmNewPassword === req.body.newPassword,
    )
    .withMessage("Reset passwords must be the same."),
];

module.exports = {
  signupValidator,
  loginValidator,
  verifyEmailValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
};
