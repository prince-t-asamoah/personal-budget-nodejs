const { body, param } = require("express-validator");
const validations = {
  name: body("name")
    .exists({ values: "undefined" })
    .withMessage("Name is required")
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isString()
    .withMessage("Name must be a string"),
  currency: body("currency")
    .exists({ values: "undefined" })
    .withMessage("Currency is required")
    .notEmpty()
    .withMessage("Currency cannot be empty")
    .isString()
    .withMessage("Currency must be a string"),
  allocatedAmount: body("allocatedAmount")
    .exists({ values: "undefined" })
    .withMessage("Allocated amount is required")
    .isInt({ min: 0 })
    .withMessage("Allocated amount cannot be less than or equal to zero")
    .isNumeric()
    .withMessage("Allocated amount must be a number"),
  balance: body("balance")
    .exists({ values: "undefined" })
    .withMessage("Balance amount is required")
    .isInt({ min: 0 })
    .withMessage("Balance amount cannot be less than or equal to zero")
    .isNumeric()
    .withMessage("Balance amount must be a number"),
};

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

const envelopeIdValidator = [
  param("envelopeId")
    .exists()
    .withMessage("Envelope id is required")
    .notEmpty()
    .withMessage("Envelope id cannot be empty")
    .isUUID()
    .withMessage("Envelope id must be a UUID string"),
];

const updateEnvelopeValidator = [
  validations.name,
  validations.allocatedAmount,
  validations.currency,
  validations.balance,
];

module.exports = {
  createEnvelopeValidator,
  envelopeIdValidator,
  updateEnvelopeValidator
};
