const { validationResult } = require("express-validator");
const ValidationError = require("../errors/ValidationError");
const { error } = require("console");

module.exports = (req, _res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new ValidationError("Error validating request body.", 400, {
        cause: JSON.stringify(errors.array()),
      }),
    );
  }
  next();
};
