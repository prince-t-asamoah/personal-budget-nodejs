const express = require('express');
const envelopesRouter = require('./envelopes.routes');

const indexRouter = express.Router();

indexRouter.use('/envelopes', envelopesRouter);


module.exports  = indexRouter;