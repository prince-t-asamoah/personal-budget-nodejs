const BaseDto = require("./base.dto");

/**
 * Response Dto
 *
 * @typedef {import('../types/response.types').ErrorResponse} ErrorResponse
 * @typedef {import('../types/response.types').SuccessResponse} SuccessResponse
 * @typedef {import('../types/response.types').BaseResponse} BaseResponse
 */

class ResponseDto extends BaseDto {
  /**
   * @param {BaseResponse} params
   */
  constructor({ success, message }) {
    /**@type {boolean} */
    this.success = success;
    /**@type {string} */
    this.message = message;
    this.filterUndefined();
  }
}

class ErrorResponseDto extends ResponseDto {
  /**
   * @param {ErrorResponse} params
   */
  constructor({ success = false, message, error }) {
    super({ success, message });
    /**@type {object} */
    this.error = error;
    this.filterUndefined();
  }
}

class SuccessResponseDto extends ResponseDto {
  /**
   * @param {SuccessResponse} params
   */
  constructor({ success = true, message, data }) {
    super({ success, message });
    /**@type {object} */
    this.data = data;
    this.filterUndefined();
  }
}

module.exports = {
  ErrorResponseDto,
  SuccessResponseDto,
};
