const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.use(express.static(path.join(__dirname, "public")));

/**
 * Represents a budget envelope object.
 *
 * @typedef {object} BudgetEnvelope
 * @property {string} id - A numbered id
 * @property {string} name - Name of envelope e.g. "Rent", "Groceries"
 * @property {number} allocatedAmount - Total budgeted amount
 * @property {number} spentAmount - Amount already spent
 * @property {number} balance - Allocated amount - Spent amount
 * @property {string} currency - ISO code e.g. "GHS", "USD"
 * @property {string} createdAt - ISO timestamp
 * @property {string} updatedAt - ISO timestamp
 *
 */

/**
 * All envelopes data
 *
 * @type {Array<BudgetEnvelope>}
 */
let envelopes = [];

app.get("/", (_req, res) => {
  res.render("index.html");
});

app.get("/health", (req, res) => {
  res.status(200).send();
});

app.get("/envelopes", (_req, res) => {
  res.status(200).send(envelopes);
});

app.get("/envelopes/:envelopeId", (req, res) => {
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

app.post("/envelopes", (req, res) => {
  /**@type {BudgetEnvelope} */
  const { name, currency, allocatedAmount, spentAmount } = req.body;

  if (
    !name ||
    !currency ||
    allocatedAmount === undefined ||
    spentAmount === undefined
  ) {
    res
      .status(400)
      .send(
        "name, currency, allocatedAmount and spentAmount must be provided.",
      );
    return;
  }

  const date = new Date().toISOString();

  /** @type {BudgetEnvelope} */
  const newEnvelope = {
    id: String(envelopes.length + 1),
    name,
    currency,
    allocatedAmount,
    spentAmount: spentAmount || 0,
    balance: allocatedAmount - spentAmount || 0,
    createdAt: date,
    updatedAt: date,
  };
  envelopes.push(newEnvelope);

  res.status(201).send(newEnvelope);
});

app.patch("/envelopes/:envelopeId", (req, res) => {
  /**@type {BudgetEnvelope} */
  const envelopeData = req.body;

  if (Object.keys(envelopeData).length === 0) {
    res.status(400).send("Envelope data must be provided to update.");
    return;
  }
  const envelopeId = req.params.envelopeId;

  if (!envelopeId) {
    res.status(400).send("Envelope id must be provided.");
    return;
  }

  const envelopeToBeUpdatedIndex = envelopes.findIndex(
    (envelope) => envelope.id === envelopeId,
  );
  if (envelopeToBeUpdatedIndex === -1) {
    res.status(404).send(`Budget envelope with id: ${envelopeId} not found.`);
    return;
  }

  const budgetEnvelopeToBeUpdate = envelopes[envelopeToBeUpdatedIndex];

  /**@type {BudgetEnvelope} */
  const updatedEnvelope = {
    id: budgetEnvelopeToBeUpdate.id,
    name: envelopeData.name || budgetEnvelopeToBeUpdate.name,
    currency: envelopeData.currency || budgetEnvelopeToBeUpdate.currency,
    spentAmount:
      envelopeData.spentAmount || budgetEnvelopeToBeUpdate.spentAmount,
    allocatedAmount:
      envelopeData.allocatedAmount || budgetEnvelopeToBeUpdate.allocatedAmount,
    balance:
      (envelopeData.allocatedAmount ||
        budgetEnvelopeToBeUpdate.allocatedAmount) -
      (envelopeData.spentAmount || budgetEnvelopeToBeUpdate.spentAmount),
    updatedAt: new Date().toISOString(),
    createdAt: budgetEnvelopeToBeUpdate.createdAt,
  };

  envelopes[envelopeToBeUpdatedIndex] = updatedEnvelope;
  res.status(200).send(updatedEnvelope);
});

app.delete("/envelopes/:envelopeId", (req, res) => {
  const envelopeId = req.params.envelopeId;

  if (!envelopeId) {
    res.status(400).send("Envelope id must be provided.");
    return;
  }
  /**@type {Array<BudgetEnvelope>} */
  const newEnvelopes = envelopes.filter(
    (envelope) => envelope.id !== envelopeId,
  );

  envelopes = [...newEnvelopes];
  res.status(204).send();
});

app.post("/envelopes/transfer/:fromId/:toId", (req, res) => {
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

app.post("/envelopes/distribute", (req, res) => {
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
    /**@type {BudgetEnvelope} */
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

module.exports = app;
