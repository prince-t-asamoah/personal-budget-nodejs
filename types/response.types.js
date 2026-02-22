/**
 * Base Response Object
 *
 * @typedef {Object} BaseResponse
 * @property {boolean} success - Base response success
 * @property {string} message - Base response message
 */

/**
 * Success Response Object
 *
 * @typedef {Object} SuccessResponse
 * @augments {BaseResponse}
 * @property {object} data - Response data
 *
 */

/**
 * Error Response Object
 *
 * @typedef {Object} ErrorResponse
 * @augments {BaseResponse}
 * @property {object} error - Response error
 *
 */

module.exports = {
  SuccessResponse,
  ErrorResponse,
};
