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

class LogoutError extends BaseError {
  constructor(message, status, options) {
    super(message, status, options);
  }
}

class UnAuthorizedError extends BaseError {
  constructor(message = 'User not authorized, please login.', status = 401, options) {
    super(message, status, options);
  }
}

module.exports = {
  LoginError,
  SignupError,
  LogoutError,
  UnAuthorizedError,
};
