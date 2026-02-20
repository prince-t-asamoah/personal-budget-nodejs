const express = require('express');
const envelopesRouter = require('./envelopes.routes');
const authRouter = require('./auth.routes');

const indexRouter = express.Router();

indexRouter.use('/envelopes', envelopesRouter);
indexRouter.use('/auth', authRouter)


module.exports  = indexRouter;