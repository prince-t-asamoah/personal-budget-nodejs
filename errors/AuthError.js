const BaseError = require("./BaseError");

class LoginError extends BaseError {}

class SignupError extends BaseError {}

class LogoutError extends BaseError {}

class UnAuthorizedError extends BaseError {
  constructor(message, status, options = {}) {
    super(message ?? "User not authorized, please login.", status ?? 401, options);
  }
}

class VerifyEmailError extends BaseError {
  constructor(message, status, options = {}) {
    super(message, status ?? 401, options);
  }
}

class ForgotPasswordError extends BaseError {
  constructor(message, status, options = {}) {
    super(message, status ?? 400, options);
  }
}

class ResetPasswordError extends BaseError {
  constructor(message, status, options = {}) {
    super(message, status ?? 400, options);
  }
}

module.exports = {
  LoginError,
  SignupError,
  LogoutError,
  UnAuthorizedError,
  VerifyEmailError,
  ForgotPasswordError,
  ResetPasswordError,
};
