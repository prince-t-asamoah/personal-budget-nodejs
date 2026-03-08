const express = require("express");
const {
  getAllTransactions,
  getEnvelopeTransactions,
} = require("../controllers/transactions.controllers");

const transactionsRouter = express.Router();

transactionsRouter.get("/", getAllTransactions);
transactionsRouter.get("/:envelopeId", getEnvelopeTransactions);

module.exports = transactionsRouter;
