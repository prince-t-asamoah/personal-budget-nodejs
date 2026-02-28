const BaseError = require("./BaseError");

class EnvelopeError extends BaseError {
    constructor(message, status, options) {
        super(message, status, options)
    }
}

module.exports = EnvelopeError;