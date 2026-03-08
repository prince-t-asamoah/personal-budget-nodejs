/**
 * @typedef {import('../types/controller.types').Controller}  Controller
 *
 */

const db = require("../config/db.config");
const { SuccessResponseDto } = require("../dtos/response.dtos");
const { TransactionDto } = require("../dtos/transactions.dtos");

/**
 * Get all transactions
 * @type {Controller}

 */
const getAllTransactions = async (req, res, next) => {
  const userId = req.session.user.id;

  try {
    const query = await db.query(
      `
    SELECT t.*, e.name AS envelope_name
    FROM transactions t
    JOIN envelopes e ON t.envelope_id = e.id
    WHERE e.user_id = $1
    AND e.deleted_at IS NULL
    ORDER BY t.created_at DESC LIMIT 10`,
      [userId],
    );

    const transactions = query.rows.map(
      (transaction) => new TransactionDto(transaction),
    );

    return res.status(200).json(
      new SuccessResponseDto({
        message: "Fetching all transactions successful",
        data: transactions,
      }),
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get envelope transactions
 * @type {Controller}
 */
const getEnvelopeTransactions = async (req, res, next) => {
  const envelopeId = req.params.envelopeId;

  try {
    const query = await db.query(
      `SELECT *
    FROM transactions
    WHERE envelope_id = $1
    ORDER BY created_at DESC;`,
      [envelopeId],
    );
    const transactions = query.rows.map(
      (transaction) => new TransactionDto(transaction),
    );

    return res.status(200).json(
      new SuccessResponseDto({
        message: "Fetching envelope transactions successful",
        data: transactions,
      }),
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTransactions,
  getEnvelopeTransactions,
};
