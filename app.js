const express = require("express");
const app = express();

app.use(express.json());

/**
 * Represents a budget envelope object.
 *
 * @typedef {object} Envelope
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
 * @type {Array<Envelope>}
 */
let envelopes = [];

app.get("/", (_req, res) => {
  res.send("Personal Budget API 1.0.0");
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
  /**@type {Envelope} */
  const envelopeById = envelopes.find(
    (envelope) => envelope.id === envelopeId,
  );

  if (!envelopeById) {
    res.status(404).send(`Envelope with id: ${envelopeId} not found.`);
  } else {
    res.status(200).send(envelopeById);
  }
});

app.post("/envelopes", (req, res) => {
  /**@type {Envelope} */
  const { name, currency, allocatedAmount, spentAmount } = req.body;

  if (!name || !currency || !allocatedAmount || !spentAmount) {
    res
      .status(400)
      .send(
        "name, currency, allocatedAmount and spentAmount must be provided.",
      );
    return;
  }

  const date = new Date().toISOString();

  /** @type {Envelope} */
  const newEnvelope = {
    id: String(envelopes.length + 1),
    name,
    currency,
    allocatedAmount,
    spentAmount,
    balance: allocatedAmount - spentAmount,
    createdAt: date,
    updatedAt: date,
  };
  envelopes.push(newEnvelope);

  res.status(201).send(newEnvelope);
});

app.delete('/envelopes/:envelopeId', (req, res) => {
     const envelopeId = req.params.envelopeId;

     if (!envelopeId) {
       res.status(400).send("Envelope id must be provided.");
       return;
     }
     /**@type {Array<Envelope>} */
     const newEnvelopes = envelopes.filter(
       (envelope) => envelope.id !== envelopeId,
     );

        envelopes = [...newEnvelopes];
       res.status(204).send();
});

module.exports = app;
