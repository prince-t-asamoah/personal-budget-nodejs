const { body } = require("express-validator");

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
];

module.exports = {
  signupValidator,
  loginValidator,
};
