class AuthError extends Error {
  constructor(message, status, options = {}) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    this.options = options;
    Error.captureStackTrace(this, this.constructor);
  }
}

class LoginError extends AuthError {
  constructor(message, status, options) {
    super(message, status, options);
  }
}

class SignupError extends AuthError {
  constructor(message, status, options) {
    super(message, status, options);
  }
}

module.exports = {
  LoginError,
  SignupError,
};
