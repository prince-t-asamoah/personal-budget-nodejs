const { body } = require("express-validator");

const createEnvelopeValidator = [
  body("name")
    .exists({ values: "undefined" })
    .withMessage("Name is required")
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isString()
    .withMessage("Name must be a string"),
  body("currency")
    .exists({ values: "undefined" })
    .withMessage("Currency is required")
    .notEmpty()
    .withMessage("Currency cannot be empty")
    .isString()
    .withMessage("Currency must be a string"),
  body("allocatedAmount")
    .exists({ values: "undefined" })
    .withMessage("Allocated amount is required")
    .isInt({ min: 0 })
    .withMessage("Allocated amount cannot be less than or equal to zero")
    .isNumeric()
    .withMessage("Fullname must be a number"),
];

module.exports = {
  createEnvelopeValidator,
};
