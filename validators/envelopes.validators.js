const { body, param } = require("express-validator");
const validationsBody = {
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
  validationsBody.name,
  validationsBody.currency,
  validationsBody.allocatedAmount,
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
  validationsBody.name,
  validationsBody.allocatedAmount,
  validationsBody.currency,
  validationsBody.balance,
];

module.exports = {
  createEnvelopeValidator,
  envelopeIdValidator,
  updateEnvelopeValidator,
};
