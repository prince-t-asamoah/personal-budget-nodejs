const BaseDto = require("./base.dto");

class TransactionDto extends BaseDto {
  constructor({
    id,
    type,
    amount,
    currency,
    balance_after,
    description,
    notes,
    reference_id,
    created_at,
  }) {
    super();
    /**@type {string} */
    this.id = id;
    /**@type {string} */
    this.type = type;
    /**@type {number} */
    this.amount = amount;
    /**@type {number} */
    this.balanceAfter = balance_after;
    /**@type {string} */
    this.description = description;
    /**@type {string} */
    this.notes = notes;
    /**@type {string} */
    this.referenceId = reference_id;
    /**@type {string} */
    this.currency = currency;
    /**@type {string} */
    this.createdAt = created_at;
    this.filterUndefined();
  }
}

module.exports = {
  TransactionDto,
};
