const BaseDto = require("./base.dto");

class EnvelopeDto extends BaseDto {
  constructor({
    id,
    name,
    allocatedAmount,
    spentAmount,
    balance,
    currency,
    createdAt,
    updatedAt,
  }) {
    /**@type {string} */
    this.id = id;
    /**@type {string} */
    this.name = name;
    /**@type {number} */
    this.allocatedAmount = allocatedAmount;
    /**@type {number} */
    this.spentAmount = spentAmount;
    /**@type {number} */
    this.balance = balance;
    /**@type {number} */
    this.currency = currency;
    /**@type {string} */
    this.createdAt = createdAt;
    /**@type {string} */
    this.updatedAt = updatedAt;
    filterUndefined();
  }
}

module.exports = {
  EnvelopeDto,
};
