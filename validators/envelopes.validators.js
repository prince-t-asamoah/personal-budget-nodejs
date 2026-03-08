const { body, param } = require("express-validator");
const { ENVELOPE_CATEGORY_TYPES } = require("../types/envelope.types");

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
  category: body("category")
    .exists({ values: "undefined" })
    .withMessage("Category is required")
    .notEmpty()
    .withMessage("Category cannot be empty")
    .isString()
    .withMessage("Category must be a string")
    .isIn(Object.values(ENVELOPE_CATEGORY_TYPES))
    .withMessage("Category is invalid"),
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
    .matches(/^[0-9]+(?:\.[0-9]{1,2})?$/)
    .withMessage("Balance amount must be a valid number with up to two decimal places")
    .isFloat({ min: 0.01 })
    .withMessage("Balance amount must be greater than zero"),
  amount: body("amount")
    .exists({ values: "undefined" })
    .withMessage("Amount is required")
    .matches(/^[0-9]+(?:\.[0-9]{1,2})?$/)
    .withMessage("Amount must be a valid number with up to two decimal places")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be greater than zero"),
  description: body("description")
    .exists({ values: "undefined" })
    .withMessage("Description is required")
    .notEmpty()
    .withMessage("Description cannot be empty")
    .isString()
    .withMessage("Description must be a string"),
  notes: body("notes").isString().withMessage("Notes must be a string"),
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
  validationsBody.category,
  validationsBody.allocatedAmount,
  validationsBody.notes
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
    .matches(/^[0-9]+(?:\.[0-9]{1,2})?$/)
    .withMessage("Distributed amount must be a valid number with up to two decimal places")
    .isFloat({ min: 0.01 })
    .withMessage("Distributed amount must be greater than zero"),
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
    .matches(/^[0-9]+(?:\.[0-9]{1,2})?$/)
    .withMessage("Transfer amount must be a valid number with up to two decimal places")
    .isFloat({ min: 0.01 })
    .withMessage("Transfer amount must be greater than zero"),
];

const expenseFundsValidator = [
  validationsBody.amount,
  validationsBody.description,
  validationsBody.notes
];

module.exports = {
  createEnvelopeValidator,
  envelopeIdValidator,
  updateEnvelopeValidator,
  distributeFundsValidator,
  transferFundsValidator,
  expenseFundsValidator
};
