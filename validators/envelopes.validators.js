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
    .matches(/^\-?[0-9]+(?:\.[0-9]{2})?$/)
    .withMessage("Allocated amount cannot have more than two decimal places")
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

const envelopeIdValidator = [
  param("envelopeId")
    .exists()
    .withMessage("Envelope id is required")
    .notEmpty()
    .withMessage("Envelope id cannot be empty")
    .isUUID()
    .withMessage("Envelope id must be a UUID string"),
];

const createEnvelopeValidator = [
  validationsBody.name,
  validationsBody.currency,
  validationsBody.allocatedAmount,
];

const updateEnvelopeValidator = [
  validationsBody.name,
  validationsBody.allocatedAmount,
  validationsBody.currency,
  validationsBody.balance,
];

const distributeFundsValidator = [
  body("amount")
    .exists({ values: "undefined" })
    .withMessage("Distributed amount is required")
    .isInt({ min: 0 })
    .withMessage("Distributed amount cannot be less than or equal to zero")
    .isNumeric()
    .withMessage("Distributed amount must be a number"),
  body("envelopesId")
    .exists({ values: "undefined" })
    .withMessage("Envelopes id is required")
    .isArray({ min: 1 })
    .withMessage("Envelopes id must be a non-empty array"),
];

const transferFundsValidator = [
  param("fromId")
    .exists({ values: "undefined" })
    .withMessage("Transfer from id is required")
    .isUUID()
    .withMessage("Id must be a UUID"),
  param("toId")
    .exists({ values: "undefined" })
    .withMessage("Transfer to id is required")
    .isUUID()
    .withMessage("Id must be a UUID"),
  body("amount")
    .exists({ values: "undefined" })
    .withMessage("Transfer amount is required")
    .isNumeric()
    .withMessage("Amount must be a number"),
];
module.exports = {
  createEnvelopeValidator,
  envelopeIdValidator,
  updateEnvelopeValidator,
  distributeFundsValidator,
  transferFundsValidator
};
