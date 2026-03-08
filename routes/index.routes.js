const express = require("express");
const authenticateUser = require("../middlewares/authenticateUser.middleware");
const envelopesRouter = require("./envelopes.routes");
const authRouter = require("./auth.routes");
const healthRouter = require("./health.routes");
const transactionsRouter = require("./transactions.routes");

const indexRouter = express.Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/envelopes", authenticateUser, envelopesRouter);
indexRouter.use("/transactions", authenticateUser, transactionsRouter);
indexRouter.use("/health", healthRouter);

module.exports = indexRouter;
