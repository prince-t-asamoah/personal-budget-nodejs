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


/**
 * A password utility function to verify hashed password
 * 
 * @param {string} plainPassword
 * @param {string} hashedPassword
 * 
 * @returns {Promise<boolean>}
 */
const verifyPassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = { hashPassword, verifyPassword };
