class BaseError extends Error {
  constructor(message, status, options = {}) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    this.options = options;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = BaseError;