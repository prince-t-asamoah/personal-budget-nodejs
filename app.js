const express = require("express");
const app = express();

/**
 * Represents a budget envelope object.
 * 
 * @typedef {object} Envelope
 * @property {string} id - A numbered id
 * @property {string} name - Name of envelope e.g. "Rent", "Groceries"
 * @property {number} allocatedAmout - Total budgeted amount
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
const envelopes = [];

app.get("/", (_req, res) => {
  res.send('Personal Budget API 1.0.0');
});

app.get("/envelopes", (_req, res) => {
  res.status(200).send(envelopes);
});

module.exports = app;
