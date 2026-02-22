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
  console.error(err.stack);
  /**@type {number} */
  const statusCode = err.status || 500;
  res.status(statusCode).json(
    new ErrorResponseDto({
      success: false,
      message: "Internal Server",
      error: err,
    }),
  );
};

module.exports = errorHandler;
