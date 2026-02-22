const BaseError = require("./BaseError");

class LoginError extends BaseError {
  constructor(message, status, options) {
    super(message, status, options);
  }
}

class SignupError extends BaseError {
  constructor(message, status, options) {
    super(message, status, options);
  }
}

module.exports = {
  LoginError,
  SignupError,
};
