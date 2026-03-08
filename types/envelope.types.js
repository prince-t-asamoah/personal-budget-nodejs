/**
 * Valid envelope category values.
 *
 * @readonly
 * @enum {string}
 */
const ENVELOPE_CATEGORY_TYPES = Object.freeze({
    GROCERIES: "groceries",
    RENT_HOUSING: "rent_housing",
    UTILITIES: "utilities",
    TRANSPORTATION: "transportation",
    DINING_OUT: "dining_out",
    ENTERTAINMENT: "entertainment",
    HEALTHCARE: "healthcare",
    PERSONAL_CARE: "personal_care",
    SAVINGS: "savings",
    EMERGENCY_FUND: "emergency_fund",
});

/**
 * Envelope category type.
 *
 * @typedef {"groceries" | "rent_housing" | "utilities" | "transportation" | "dining_out" | "entertainment" | "healthcare" | "personal_care" | "savings" | "emergency_fund"} EnvelopeCategoryType
 */

/**
 * Represents a budget envelope object.
 *
 * @typedef {object} Envelope
 * @property {string} id - Envelope UUID
 * @property {string} name - Name of envelope e.g. "Rent", "Groceries"
 * @property {number} allocatedAmount - Total budgeted amount
 * @property {number} spentAmount - Amount already spent
 * @property {number} balance - Allocated amount - Spent amount
 * @property {EnvelopeCategoryType} category - Spending category type
 * @property {string} currency - ISO code e.g. "GHS", "USD"
 * @property {string} notes - Notes (Optional)
 * @property {string} createdAt - ISO timestamp
 * @property {string} updatedAt - ISO timestamp
 *
 */

module.exports = {
    ENVELOPE_CATEGORY_TYPES,
};