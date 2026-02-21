const express = require('express');
const envelopesRouter = require('./envelopes.routes');
const authRouter = require('./auth.routes');
const healthRouter = require('./health.routes');

const indexRouter = express.Router();

indexRouter.use('/auth', authRouter);
indexRouter.use('/envelopes', envelopesRouter);
indexRouter.use('/health', healthRouter);


module.exports  = indexRouter;