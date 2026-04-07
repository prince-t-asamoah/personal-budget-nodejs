const { validationResult } = require("express-validator");
const ValidationError = require("../errors/ValidationError");

module.exports = (req, _res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const jsonErrorsArray = JSON.stringify(errors.array());
    
    return next(
      new ValidationError("Error validating request body.", 400, {
        cause: JSON.parse(jsonErrorsArray),
      }),
    );
  }
  next();
};
