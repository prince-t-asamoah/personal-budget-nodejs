const BaseDto = require("./base.dto");

class EnvelopeDto extends BaseDto {
  constructor({
    id,
    name,
    allocated_amount,
    spent_amount,
    balance,
    currency,
    created_at,
    updated_at,
  }) {
    super();
    /**@type {string} */
    this.id = id;
    /**@type {string} */
    this.name = name;
    /**@type {number} */
    this.allocatedAmount = allocated_amount;
    /**@type {number} */
    this.spentAmount = spent_amount;
    /**@type {number} */
    this.balance = balance;
    /**@type {number} */
    this.currency = currency;
    /**@type {string} */
    this.createdAt = created_at;
    /**@type {string} */
    this.updatedAt = updated_at;
    this.filterUndefined();
  }
}

module.exports = {
  EnvelopeDto,
};
