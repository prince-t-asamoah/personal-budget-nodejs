const express = require('express');
const { getAllTransactions } = require('../controllers/transactions.controllers');

const transactionsRouter = express.Router();

transactionsRouter.get('/', getAllTransactions);

module.exports  = transactionsRouter;