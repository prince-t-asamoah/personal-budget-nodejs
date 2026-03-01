const db = require("../config/db.config");
const { SuccessResponseDto } = require("../dtos/response.dtos");
const EnvelopeError = require("../errors/EnvelopeError");
const { EnvelopeDto } = require("../dtos/envelope.dtos");

/**
 * @typedef {import('../types/controller.types').Controller}  Controller
 * @typedef {import('../types/envelope.types').Envelope} Envelope
 * @typedef {import('pg').QueryResult<Envelope>} EnvelopeQuery
 */

/**
 * Get all envelopes
 *
 * @type {Controller}
 */
const getAllEnvelopes = async (req, res, next) => {
  const userId = req.session.user.id;

  try {
    /** @type {EnvelopeQuery} */
    const queryResult = await db.query(
      "SELECT * FROM envelopes WHERE user_id = $1",
      [userId],
    );

    const data = queryResult.rows;
    if (!data) {
      throw new EnvelopeError("Fetching all envelopes failed", 500);
    }

    const envelopes = data.map((env) => new EnvelopeDto(env));

    return res.status(200).json(
      new SuccessResponseDto({
        data: envelopes,
        message: "Fetching user envelopes successful",
      }),
    );
  } catch (error) {
    next(error);
  }
};


/**
 * Create an envelope
 *
 * @type {Controller}
 */
const createEnvelope = async (req, res, next) => {
  /**@type {Envelope} */
  const { name, currency, allocatedAmount, spentAmount } = req.body;

  const userId = req.session.user.id;
  const balance = allocatedAmount - spentAmount || 0;

  try {
    /** @type {EnvelopeQuery} */
    const query = await db.query(
      `INSERT INTO envelopes(name, currency, allocated_amount, spent_amount, balance, user_id)
         VALUES($1, $2, $3, $4, $5, $6) RETURNING id, name, currency, allocated_amount, spent_amount, balance, created_at, updated_at`,
      [name, currency, allocatedAmount, spentAmount, balance, userId],
    );

    const data = query.rows[0];

    return res.status(201).json(
      new SuccessResponseDto({
        data: new EnvelopeDto(data),
      }),
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEnvelopes,
  createEnvelope
};
