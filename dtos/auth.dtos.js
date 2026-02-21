/**
 * Signup data object
 *
 * @typedef {Object} SignupDto
 * @property {string} fullname - User fullname
 * @property {string} email - User email
 * @property {password} password - User password
 */

class SignupDto {
  /**
   * @param {SignupDto} params
   */
  constructor({ fullname, email, password }) {
    /** @type {string} */
    this.fullname = fullname;
    /** @type {string} */
    this.email = email;
    /**@type {string} */
    this.password = password;
  }
}

module.exports = {
  SignupDto,
};
