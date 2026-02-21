const express = require('express');

const healthRouter = express.Router();

healthRouter.get('/', (_req, res) => {
  res.sendStatus(200);
});


module.exports =  healthRouter;