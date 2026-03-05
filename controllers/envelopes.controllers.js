const db = require("../config/db.config");
const { SuccessResponseDto } = require("../dtos/response.dtos");
const EnvelopeError = require("../errors/EnvelopeError");
const { EnvelopeDto } = require("../dtos/envelope.dtos");

/**
 * @typedef {import('../types/controller.types').Controller}  Controller
 * @typedef {import('../types/envelope.types').Envelope} Envelope
 * @typedef {import('pg').QueryResult<Envelope>} EnvelopeQuery
 * 
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
      "SELECT * FROM envelopes WHERE user_id = $1 AND deleted_at IS NULL",
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
         VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
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

/**
 *  Delete envelope by id
 *  @type {Controller}
 *
 */
const deleteEnvelope = async (req, res, next) => {
  const userId = req.session.user.id;
  const envelopeId = req.params.envelopeId;

  try {
    /** @type {EnvelopeQuery} */
    const query = await db.query(
      "UPDATE envelopes SET deleted_at = NOW() WHERE user_id = $1 AND id = $2 RETURNING *",
      [userId, envelopeId],
    );

    const data = query.rows[0];

    if (!data) {
      throw new EnvelopeError(
        `Deleting envelope with id: ${envelopeId} failed.`,
      );
    }

    return res.status(200).json(
      new SuccessResponseDto({
        message: "Envelope deleted successfully.",
        data,
      }),
    );
  } catch (error) {
    next(error);
  }
};

/**
 *  Update envelope by id
 * @type {Controller}
 */
const updateEnvelope = async (req, res, next) => {
  /**@type {Envelope} */
  const { name, allocatedAmount, spentAmount, currency, balance } = req.body;
  const envelopeId = req.params.envelopeId;
  const userId = req.session.user.id;

  try {
    /**@type {EnvelopeQuery} */
    const query = await db.query(
      `UPDATE envelopes SET name = $1, allocated_amount = $2, spent_amount = $3, currency = $4, balance = $5, updated_at = Now() WHERE user_id = $6 AND id = $7 RETURNING *`,
      [
        name,
        allocatedAmount,
        spentAmount,
        currency,
        balance,
        userId,
        envelopeId,
      ],
    );

    const data = query.rows[0];

    if (!data) {
      throw new EnvelopeError(
        `Updating envelope with id:${envelopeId} failed.`,
        500,
      );
    }

    return res.status(200).json(
      new SuccessResponseDto({
        message: "Envelope updated successfully",
        data: new EnvelopeDto(data),
      }),
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get envelope by id
 * @type {Controller}
 */
const getEnvelope = async (req, res, next) => {
  const envelopeId = req.params.envelopeId;
  const userId = req.session.user.id;
  try {
    /**@type {EnvelopeQuery} */
    const query = await db.query(
      "SELECT * FROM envelopes WHERE user_id = $1 AND id = $2",
      [userId, envelopeId],
    );

    const data = query.rows[0];
    if (!data) {
      return res
        .status(404)
        .json(
          new EnvelopeError(`Envelope with id: ${envelopeId} not found.`, 404),
        );
    }

    return res.status(200).json(
      new SuccessResponseDto({
        message: "Envelope fetched successfully",
        data: new EnvelopeDto(data),
      }),
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Distrubute funds among envelopes
 *
 * @type {Controller} */
const distributeFunds = async (req, res, next) => {
  /**
   * Distribute envelopes request data
   *
   * @typedef {Object} DistributeEnvelopeData
   * @property {number} amount - Amount to distribute
   * @property {Array<string>} envelopesId - Envelopes ids to distribute
   */

  /** @type {DistributeEnvelopeData} - Amount to distribute */
  const { amount, envelopesId } = req.body;

  /** @type {string} */
  const userId = req.session.user.id;
  const distributionQuery = await db.connect();

  try {
    // Get all the envelopes to be updated
    const dbPlaceholders = envelopesId
      .map((_, index) => `$${index + 2}`)
      .join(",");

    /** @type {EnvelopeQuery} */
    const selectEnvelopesQuery = await distributionQuery.query(
      `SELECT * FROM envelopes WHERE user_id = $1 AND id IN (${dbPlaceholders})`,
      [userId, ...envelopesId],
    );

    /** @type {Array<Envelope>} */
    const selectQueryEnvelopes = selectEnvelopesQuery.rows;

    if (selectQueryEnvelopes && selectQueryEnvelopes.length === 0) {
      throw new EnvelopeError("No envelopes to distribute funds");
    }

    const envelopes = selectQueryEnvelopes.map((env) => new EnvelopeDto(env));

    // Updated each selected envelopes
    for (const envelopeId of envelopesId) {
      const envelopeIndex = envelopes.findIndex((env) => env.id === envelopeId);
      if (envelopeIndex === -1) continue;

      const amountPerEnvelope = envelopesId.length
        ? Number(amount) / envelopesId.length
        : Number(amount);

      // Update each envelopes allocated and balance amount
      const current = envelopes[envelopeIndex];
      const allocatedAmount = current.allocatedAmount + amountPerEnvelope;
      const balance = allocatedAmount - current.spentAmount;

      /**@type {Envelope} */
      const updatedEnvelope = {
        ...current,
        allocatedAmount: allocatedAmount,
        balance: balance,
        updatedAt: new Date().toISOString(),
      };

      /** @type {EnvelopeQuery} */
      const updateQuery = await distributionQuery.query(
        "UPDATE envelopes SET allocated_amount = $1, balance = $2, updated_at = NOW() WHERE id = $3 RETURNING *",
        [updatedEnvelope.allocatedAmount, updatedEnvelope.balance, envelopeId],
      );

      envelopes[envelopeIndex] = new EnvelopeDto(updateQuery.rows[0]);
    }

    return res.status(201).json(
      new SuccessResponseDto({
        message: `An amount of ${amount} has been successfully distributed to envelopes.`,
        data: envelopes,
      }),
    );
  } catch (error) {
    next(error);
  } finally {
    distributionQuery.release();
  }
};

module.exports = {
  getAllEnvelopes,
  createEnvelope,
  deleteEnvelope,
  updateEnvelope,
  getEnvelope,
  distributeFunds,
};
