const bcrypt = require("bcrypt");

const SALT_ROUNDS = 12;

/**
 * A password utility function to hash plain password
 * 
 * @param {string} plainPassword 
 * @returns {Promise<string>}
 */
const hashPassword = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
};

module.exports = { hashPassword };
