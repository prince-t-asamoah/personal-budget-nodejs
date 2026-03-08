/**
 * Represents a complete transaction record with all details including amount, type, and envelope association.
 * @typedef {Object} Transaction
 * @property {string} id - The unique identifier of the transaction
 * @property {string} type - The type of transaction (funding, expense, transfer_in, transfer_out, adjustment)
 * @property {number} amount - The transaction amount
 * @property {string} currency - The currency code (e.g., USD)
 * @property {number} balanceAfter - The envelope balance after the transaction
 * @property {string} description - A description of the transaction
 * @property {string} [notes] - Optional additional notes about the transaction
 * @property {string} [referenceId] - Optional reference identifier
 * @property {string} envelopeName - The name of the associated envelope
 * @property {string} createdAt - The timestamp when the transaction was created
 */

/**
 * Input payload for creating a new transaction. Requires transaction type, amount, and description.
 * @typedef {Object} CreateTransactionInput
 * @property {string} type - The type of transaction
 * @property {number} amount - The transaction amount
 * @property {string} [currency] - The currency code
 * @property {string} description - A description of the transaction
 * @property {string} [notes] - Optional additional notes
 * @property {string} [referenceId] - Optional reference identifier
 */

/**
 * Input payload for updating an existing transaction. All properties are optional.
 * @typedef {Object} UpdateTransactionInput
 * @property {string} [type] - The type of transaction
 * @property {number} [amount] - The transaction amount
 * @property {string} [currency] - The currency code
 * @property {string} [description] - A description of the transaction
 * @property {string} [notes] - Optional additional notes
 * @property {string} [referenceId] - Optional reference identifier
 */

/**
 * Valid transaction types values.
 *
 * @readonly
 * @enum {string}
 */
const TRANSACTION_TYPES = Object.freeze({
    FUNDING: "funding",
    EXPENSE: "expense",
    TRANSFER_IN: "transfer_in",
    TRANSFER_OUT: "transfer_out",
    ADJUSTMENT: "adjustment",
});

module.exports = {
    TRANSACTION_TYPES
}
