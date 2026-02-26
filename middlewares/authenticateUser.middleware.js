const { UnAuthorizedError } = require("../errors/AuthError");

/** Authenticate user middleware
 * 
 * @param {Error} err
 * @param {Request} _req - Express Request Object
 * @param {Response} res - Express Response Object
 * @param {NextFunction} _next - Express Next Function
 * @returns {void}
 */
const authenticateUser = (req, _res, next) => {
    if (!req.session.user) {
        return next(new UnAuthorizedError());
    }
    next();
}

module.exports = authenticateUser;