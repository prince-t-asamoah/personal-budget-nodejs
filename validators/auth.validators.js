const { body } = require("express-validator");

const signupValidator = [
  body("fullname")
    .notEmpty()
    .withMessage("Fullname is required")
    .isString()
    .withMessage("Fullname must be a string"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Valid email is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 12 })
    .withMessage("Password must be at least 12 characters long."),
];

module.exports = {
  signupValidator,
};
