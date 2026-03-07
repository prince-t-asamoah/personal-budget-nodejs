/**
 * Represents a budget envelope object.
 *
 * @typedef {object} Envelope
 * @property {string} id - A numbered id
 * @property {string} name - Name of envelope e.g. "Rent", "Groceries"
 * @property {number} allocatedAmount - Total budgeted amount
 * @property {number} spentAmount - Amount already spent
 * @property {number} balance - Allocated amount - Spent amount
 * @property {string} currency - ISO code e.g. "GHS", "USD"
 * @property {string} notes - Notes (Optional)
 * @property {string} createdAt - ISO timestamp
 * @property {string} updatedAt - ISO timestamp
 *
 */

module.exports = {
    Envelope
}