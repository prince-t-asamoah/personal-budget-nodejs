class BaseError extends Error {
  constructor(message, status, options = {}) {
    super(message, options);
    this.status = status;
    this.name = this.constructor.name;
    this.options = options;
    this.cause = options.cause;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = BaseError;