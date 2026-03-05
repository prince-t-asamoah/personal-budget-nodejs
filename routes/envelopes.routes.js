const express = require("express");
const envelopesRouter = express.Router();
const envelopesController = require("../controllers/envelopes.controllers");
const EnvelopeDto = require("../dtos/envelope.dtos");
const {
  createEnvelopeValidator,
  envelopeIdValidator,
  updateEnvelopeValidator,
  distributeFundsValidator,
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

envelopesRouter.post("/transfer/:fromId/:toId", (req, res) => {
  const { fromId, toId } = req.params;
  if (!fromId && !toId) {
    res
      .status(400)
      .send("Budget envelope transfer from and to id must be provided.");
    return;
  }

  const amount = req.body.amount;
  if (amount === undefined) {
    res.status(400).send("Budget transfer amount not provided.");
    return;
  }

  if (amount === 0) {
    res.status(201).send("No transfer for zero amount.");
    return;
  }

  // Check if budget envelopes transfer from and to exist
  const budgetTransferFromIndex = envelopes.findIndex(
    (envelope) => envelope.id === fromId,
  );
  if (budgetTransferFromIndex === -1) {
    res.status(404).send(`Budget envelope with id: ${fromId} does not exist.`);
    return;
  }
  const budgetTransferToIndex = envelopes.findIndex(
    (envelope) => envelope.id === toId,
  );
  if (budgetTransferToIndex === -1) {
    res.status(404).send(`Budget envelope with id: ${toId} does not exist.`);
    return;
  }

  const budgetTransferFrom = envelopes[budgetTransferFromIndex];
  const budgetTransferTo = envelopes[budgetTransferToIndex];
  const currentUpdatedAt = new Date().toISOString();
  const transferAmount = Number(req.body.amount);

  if (budgetTransferFrom.balance > transferAmount) {
    // Budget transfer from envelope update
    budgetTransferFrom.allocatedAmount -= transferAmount;
    budgetTransferFrom.balance =
      budgetTransferFrom.allocatedAmount - budgetTransferFrom.spentAmount;
    budgetTransferFrom.updatedAt = currentUpdatedAt;
    envelopes[budgetTransferFromIndex] = budgetTransferFrom;

    // Budget transfer to envelope update
    budgetTransferTo.allocatedAmount += transferAmount;
    budgetTransferTo.balance =
      budgetTransferTo.allocatedAmount - budgetTransferTo.spentAmount;
    budgetTransferFrom.updatedAt = currentUpdatedAt;
    envelopes[budgetTransferToIndex] = budgetTransferTo;
    res.status(201).send("Budget transfer successful.");
  } else {
    res
      .status(400)
      .send(
        "Budget transfer amount exceeds envelope balance been transfered from.",
      );
  }
});

envelopesRouter.post(
  "/distribute",
  distributeFundsValidator,
  validateResult,
  envelopesController.distributeFunds,
);

module.exports = envelopesRouter;
