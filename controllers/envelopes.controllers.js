const db = require("../config/db.config");
const { SuccessResponseDto } = require("../dtos/response.dtos");
const EnvelopeError = require("../errors/EnvelopeError");

/**
 * @typedef {import('../types/controller.types').Controller}  Controller
 * @typedef {import('../types/envelope.types').Envelope} Envelope
 * @typedef {import('pg').QueryResult} DatabaseQuery
 */

/**
 * Get all envelopes
 *
 * @type {Controller}
 */
const getAllEnvelopes = async (req, res, next) => {
  const userId = req.session.user.id;

  try {
    /** @type {DatabaseQuery} */
    const queryResult = await db.query(
      "SELECT * FROM envelopes WHERE user_id = $1",
      [userId],
    );

    const data = queryResult.rows;
    if (!data) {
      throw new EnvelopeError("Fetching all envelopes failed", 500);
    }

    return res.status(200).json(
      new SuccessResponseDto({
        data,
        message: "Fetching user envelopes successful",
      }),
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEnvelopes,
};
