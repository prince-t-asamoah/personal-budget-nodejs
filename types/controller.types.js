/**
 * @typedef {import("express").Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 * Standard Express controller function
 * @typedef {(req: Request, res: Response, next: NextFunction) => Promise<void> | void} Controller
 */

module.exports = Controller