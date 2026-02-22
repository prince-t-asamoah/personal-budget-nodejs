const { ErrorResponseDto } = require("../dtos/response.dtos");
const { NextFunction, Request, Response } = require("express");

/** Error handling middleware
 * @param {Error} err
 * @param {Request} _req - Express Request Object
 * @param {Response} res - Express Response Object
 * @param {NextFunction} _next - Express Next Function
 * @returns {void}
 */
const errorHandler = (err, _req, res, _next) => {
  /**@type {number} */
  const statusCode = err.status || 500;

  // Server Error
  if (statusCode === 500) {
    console.error(err.cause || err);
    return res.status(statusCode).json(
      new ErrorResponseDto({
        message: "Server has experienced an error",
        error: {
          type: "ServerError",
          status: 500,
        },
      }),
    );
  }

  // Client Error
  console.error(err);
  res.status(statusCode).json(
    new ErrorResponseDto({
      message: err.message,
      error: {
        type: err.name,
        status: statusCode,
      },
    }),
  );
};

module.exports = errorHandler;
