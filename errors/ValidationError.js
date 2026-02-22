const BaseError = require("./BaseError");

class ValidationError extends BaseError {
  constructor(message, status , options) {
    super(message, status, options);
  }
}

module.exports = ValidationError;
