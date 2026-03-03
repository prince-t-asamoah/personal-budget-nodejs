const express = require("express");
const envelopesRouter = express.Router();
const envelopesController = require("../controllers/envelopes.controllers");
const EnvelopeDto = require("../dtos/envelope.dtos");
const {
  createEnvelopeValidator,
  envelopeIdValidator,
  updateEnvelopeValidator,
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

envelopesRouter.get("/:envelopeId", (req, res) => {
  const envelopeId = req.params.envelopeId;

  if (!envelopeId) {
    res.status(400).send("Envelope id must be provided.");
    return;
  }
  /**@type {BudgetEnvelope} */
  const envelopeById = envelopes.find((envelope) => envelope.id === envelopeId);

  if (!envelopeById) {
    res.status(404).send(`Envelope with id: ${envelopeId} not found.`);
  } else {
    res.status(200).send(envelopeById);
  }
});

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

envelopesRouter.post("/distribute", (req, res) => {
  /**
   * Distribute envelopes request data
   *
   * @typedef {Object} DistributeEnvelopeData
   * @property {number} amount - Amount to distribute
   * @property {Array<string>} envelopesId - Envelopes ids to distribute
   */
  /** @type {DistributeEnvelopeData} - Amount to distribute */
  const data = req.body;
  const { amount, envelopesId } = data;

  if (
    amount === undefined ||
    amount === 0 ||
    envelopes === undefined ||
    envelopes.length === 0
  ) {
    return res.status(400).send("Amount and envelopes must be provided.");
  }

  envelopesId.forEach((envelopeId) => {
    const envelopeToBeUpatedIndex = envelopes.findIndex(
      (envelope) => envelope.id === envelopeId,
    );
    if (envelopeToBeUpatedIndex === -1) return;
    const amountToDistributeEach =
      envelopesId.length > 0 ? amount / envelopesId.length : amount;
    /**@type {Envelope} */
    const updatedEnvelope = {
      ...envelopes[envelopeToBeUpatedIndex],
      allocatedAmount:
        envelopes[envelopeToBeUpatedIndex].allocatedAmount +
        amountToDistributeEach,
      balance:
        envelopes[envelopeToBeUpatedIndex].allocatedAmount +
        amountToDistributeEach -
        envelopes[envelopeToBeUpatedIndex].spentAmount,
      updatedAt: new Date().toISOString(),
    };
    envelopes[envelopeToBeUpatedIndex] = updatedEnvelope;
    res
      .status(201)
      .send(
        `An amount of ${amount} has been successfully distributed to envelopes.`,
      );
  });
});

module.exports = envelopesRouter;
