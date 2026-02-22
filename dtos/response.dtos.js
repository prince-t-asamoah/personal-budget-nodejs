/**
 * Response Dto
 *
 * @typedef {import('../types/response.types').ErrorResponse} ErrorResponse
 * @typedef {import('../types/response.types').SuccessResponse} SuccessResponse
 * @typedef {import('../types/response.types').BaseResponse} BaseResponse
 */

class ResponseDto {
  /**
   * @param {BaseResponse} params
   */
  constructor({ success, message }) {
    /**@type {boolean} */
    this.success = success;
    /**@type {string} */
    this.message = message;
  }
}

class ErrorResponseDto extends ResponseDto {
  /**
   * @param {ErrorResponse} params
   */
  constructor({ success, message, error }) {
    super({ success, message, error });
    /**@type {object} */
    this.error = error;
  }
}

class SuccessResponseDto extends ResponseDto {
  /**
   * @param {SuccessResponse} params
   */
  constructor({ success, message, data }) {
    super({ success, message, data });
    /**@type {object} */
    this.data = data;
  }
}

module.exports = {
  ErrorResponseDto,
  SuccessResponseDto,
};
