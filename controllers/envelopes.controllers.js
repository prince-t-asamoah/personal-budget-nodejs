const db = require("../config/db.config");
const { SuccessResponseDto } = require("../dtos/response.dtos");
const EnvelopeError = require("../errors/EnvelopeError");
const { EnvelopeDto } = require("../dtos/envelope.dtos");
const { TRANSACTION_TYPES } = require("../types/transactions.types");

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
  const { name, currency, allocatedAmount, spentAmount, category, notes } =
    req.body;

  /** @type {string} */
  const userId = req.session.user.id;
  const balance = allocatedAmount - spentAmount || 0;

  const dbClient = await db.connect();

  try {
    await dbClient.query("BEGIN");

    // Create a new envelope
    /** @type {EnvelopeQuery} */
    const newEnvelopeQuery = await dbClient.query(
      `INSERT INTO envelopes(name, currency, allocated_amount, spent_amount, balance, user_id, category, notes)
         VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        name,
        currency,
        allocatedAmount,
        spentAmount,
        balance,
        userId,
        category,
        notes,
      ],
    );

    /** @type {Envelope} */
    const envelope = new EnvelopeDto(newEnvelopeQuery.rows[0]);

    if (!envelope) throw new EnvelopeError("Creating new envelope failed");

    // Create a transaction record for new envelope
    await dbClient.query(
      `INSERT INTO
      transactions (envelope_id, type, amount, currency, balance_after, description, notes)
      VALUES($1, $2, $3, $4, $5, $6, $7)`,
      [
        envelope.id,
        TRANSACTION_TYPES.FUNDING,
        allocatedAmount,
        envelope.currency,
        envelope.balance,
        "Initial Allocation",
        notes,
      ],
    );

    await dbClient.query("COMMIT");

    return res.status(201).json(
      new SuccessResponseDto({
        data: envelope,
      }),
    );
  } catch (error) {
    dbClient.query("ROLLBACK");
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

    await distributionQuery.query("BEGIN");

    /** @type {EnvelopeQuery} */
    const selectEnvelopesQuery = await distributionQuery.query(
      `SELECT * FROM envelopes WHERE user_id = $1 AND id IN (${dbPlaceholders}) FOR UPDATE`,
      [userId, ...envelopesId],
    );

    /** @type {Array<Envelope>} */
    const selectQueryEnvelopes = selectEnvelopesQuery.rows;

    if (selectQueryEnvelopes?.length === 0) {
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
      const distributedEnvelope = envelopes[envelopeIndex];

      // Create transaction record for each distribution
      await distributionQuery.query(
        `INSERT INTO transactions (envelope_id, type, amount, currency, balance_after, description, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          distributedEnvelope.id,
          TRANSACTION_TYPES.FUNDING,
          amountPerEnvelope,
          distributedEnvelope.currency,
          distributedEnvelope.balance,
          "Distributed funds",
          distributedEnvelope.notes,
        ],
      );
    }

    // Commit changes permanently
    await distributionQuery.query("COMMIT");

    return res.status(201).json(
      new SuccessResponseDto({
        message: `An amount of ${amount} has been successfully distributed to envelopes.`,
        data: envelopes,
      }),
    );
  } catch (error) {
    await distributionQuery.query("ROLLBACK");
    next(error);
  } finally {
    distributionQuery.release();
  }
};

/**
 *  Transfer funds from one ennvelope to another
 * @type {Controller}
 *
 */
const transferFunds = async (req, res, next) => {
  const { fromId, toId } = req.params;
  const transferAmount = Number(req.body.amount);
  const userId = req.session.user.id;

  const transferQuery = await db.connect();

  try {
    await transferQuery.query("BEGIN");
    // Check if budget envelopes transfer from and to exist
    /** @type {EnvelopeQuery} */
    const searchQuery = await transferQuery.query(
      "SELECT * FROM envelopes WHERE user_id = $1 AND id IN ($2, $3) FOR UPDATE",
      [userId, fromId, toId],
    );

    const envelopesById = searchQuery.rows.reduce((acc, row) => {
      acc[row.id] = new EnvelopeDto(row);
      return acc;
    }, {});

    const envelopeTransferFrom = envelopesById[fromId];
    if (!envelopeTransferFrom) {
      throw new EnvelopeError(
        `Transfer from envelope with id: ${fromId} not found`,
        404,
      );
    }

    const envelopeTransferTo = envelopesById[toId];
    if (!envelopeTransferTo) {
      throw new EnvelopeError(
        `Transfer to envelope with id: ${toId} not found`,
        404,
      );
    }

    if (envelopeTransferFrom.balance < transferAmount) {
      throw new EnvelopeError(
        "Envelope transfer from amount must be greater than transfer amount",
      );
    }

    /** @type {EnvelopeQuery} */
    const updateQuery = await transferQuery.query(
      `UPDATE envelopes AS m 
      SET
      allocated_amount = m.allocated_amount + c.delta,
      balance = (m.allocated_amount + c.delta) - m.spent_amount,
      updated_at = NOW()
      FROM (VALUES($1::uuid, $2::numeric), ($3::uuid, $4::numeric))
      AS c(id, delta)
      WHERE m.user_id = $5 AND c.id = m.id RETURNING m.*`,
      [fromId, -transferAmount, toId, transferAmount, userId],
    );

    if (updateQuery.rows.length !== 2)
      throw new EnvelopeError("Envelopes update query failed");

    const updatedFromEnvelope = updateQuery.rows[0];
    const updatedToEnvelope = updateQuery.rows[1];

    await transferQuery.query(
      `INSERT INTO transactions (envelope_id, type, amount, currency, balance_after, description, notes, reference_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8), ($9, $10, $11, $12, $13, $14, $15, $16)`,
      [
        // Transfer from Envelope
        updatedFromEnvelope.id,
        TRANSACTION_TYPES.TRANSFER_OUT,
        transferAmount,
        updatedFromEnvelope.currency,
        updatedFromEnvelope.balance,
        `Funds transfer to ${updatedToEnvelope.id}`,
        updatedFromEnvelope.notes,
        updatedToEnvelope.id,
        // Transfer to Envelope
        updatedToEnvelope.id,
        TRANSACTION_TYPES.TRANSFER_IN,
        transferAmount,
        updatedToEnvelope.currency,
        updatedToEnvelope.balance,
        `Funds transfer from ${updatedFromEnvelope.id}`,
        updatedToEnvelope.notes,
        updatedFromEnvelope.id,
      ],
    );

    await transferQuery.query("COMMIT");

    return res.status(201).json(
      new SuccessResponseDto({
        message: "Funds transfered successful",
        data: [
          new EnvelopeDto(updateQuery.rows[0]),
          new EnvelopeDto(updateQuery.rows[1]),
        ],
      }),
    );
  } catch (error) {
    await transferQuery.query("ROLLBACK");
    next(error);
  } finally {
    transferQuery.release();
  }
};

/**
 * Create an expense from an envelope
 *
 *  @type {Controller} */
const expenseFunds = async (req, res, next) => {
  /**
   * @typedef {object} ExpenseRequestData
   * @property {number} amount - Expense amount
   * @property {string} description - Expense description
   * @property {string} notes - Expense notes (optional)
   */

  /** @type {ExpenseRequestData} */
  const { amount, description, notes } = req.body;
  const userId = req.session.user.id;
  const envelopeId = req.params.envelopeId;

  const dbClient = await db.connect();

  try {
    await dbClient.query("BEGIN");

    // Get envelopes to be updated
    /** @type {EnvelopeQuery} */
    const selectQuery = await dbClient.query(
      `SELECT * FROM envelopes WHERE user_id = $1 AND id = $2 FOR UPDATE`,
      [userId, envelopeId],
    );

    if (!selectQuery.rows[0]) {
      throw new EnvelopeError(
        `Envelope with id: ${envelopeId} does not exist.`,
      );
    }

    /** @type {Envelope} */
    const envelope = new EnvelopeDto(selectQuery.rows[0]);

    const expenseAmount = Number(amount);
    const currentAllocatedAmount = envelope.allocatedAmount;
    const updatedSpentAmount = envelope.spentAmount + expenseAmount;
    const updatedBalanceAmount = currentAllocatedAmount - updatedSpentAmount;

    // Create a transaction record for expense
    await dbClient.query(
      `INSERT INTO
      transactions (envelope_id, type, amount, currency, balance_after, description, notes)
      VALUES($1, $2, $3, $4, $5, $6, $7)`,
      [
        envelope.id,
        TRANSACTION_TYPES.EXPENSE,
        expenseAmount,
        envelope.currency,
        updatedBalanceAmount,
        description,
        notes,
      ],
    );

    // Update envelope with  spent amount and updated at
    /** @type {EnvelopeQuery} */
    const updateQuery = await dbClient.query(
      "UPDATE envelopes SET allocated_amount = $1, spent_amount = $2, balance = $3, updated_at = NOW() WHERE id = $4 RETURNING *",
      [
        currentAllocatedAmount,
        updatedSpentAmount,
        updatedBalanceAmount,
        envelopeId,
      ],
    );

    if (!updateQuery.rows[0]) {
      throw new EnvelopeError(`Envelope with id: ${envelopeId} update failed`);
    }

    await dbClient.query("COMMIT");

    /** @type {Envelope} */
    const updatedEnvelope = updateQuery.rows[0];

    return res.status(201).json(
      new SuccessResponseDto({
        message: "Expense transaction successful",
        data: new EnvelopeDto(updatedEnvelope),
      }),
    );
  } catch (error) {
    dbClient.query("ROLLBACK");
    next(error);
  } finally {
    dbClient.release();
  }
};

module.exports = {
  getAllEnvelopes,
  createEnvelope,
  deleteEnvelope,
  updateEnvelope,
  getEnvelope,
  distributeFunds,
  transferFunds,
  expenseFunds,
};
