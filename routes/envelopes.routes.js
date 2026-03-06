const express = require("express");
const envelopesRouter = express.Router();
const envelopesController = require("../controllers/envelopes.controllers");
const EnvelopeDto = require("../dtos/envelope.dtos");
const {
  createEnvelopeValidator,
  envelopeIdValidator,
  updateEnvelopeValidator,
  distributeFundsValidator,
  transferFundsValidator,
} = require("../validators/envelopes.validators");
const validateResult = require("../middlewares/validateRequest.middleware");

/**
 * Budget Envelope
 *
 * @typedef {Array<import('../types/envelope.types').Envelope>} Envelope
 *
 */

/**
 * All envelopes data
 *
 * @type {Array<Envelope>}
 */
let envelopes = [];

envelopesRouter.get("/", envelopesController.getAllEnvelopes);

envelopesRouter.get(
  "/:envelopeId",
  envelopeIdValidator,
  envelopesController.getEnvelope,
);

envelopesRouter.post(
  "/",
  createEnvelopeValidator,
  validateResult,
  envelopesController.createEnvelope,
);

envelopesRouter.put(
  "/:envelopeId",
  envelopeIdValidator,
  updateEnvelopeValidator,
  validateResult,
  envelopesController.updateEnvelope,
);

envelopesRouter.delete(
  "/:envelopeId",
  envelopeIdValidator,
  validateResult,
  envelopesController.deleteEnvelope,
);

envelopesRouter.post(
  "/transfer/:fromId/:toId",
  transferFundsValidator,
  validateResult,
  envelopesController.transferFunds,
);

envelopesRouter.post(
  "/distribute",
  distributeFundsValidator,
  validateResult,
  envelopesController.distributeFunds,
);

module.exports = envelopesRouter;
