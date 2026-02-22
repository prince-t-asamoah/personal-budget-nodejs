const BaseDto = require("./base.dto");

/**
 * Signup data object
 *
 * @typedef {Object} SignupDto
 * @property {string} fullname - User fullname
 * @property {string} email - User email
 * @property {password} password - User password
 */
class SignupDto extends BaseDto {
  /**
   * @param {SignupDto} params
   */
  constructor({ fullname, email, password }) {
    super();
    /** @type {string} */
    this.fullname = fullname;
    /** @type {string} */
    this.email = email;
    /**@type {string} */
    this.password = password;
    this.filterUndefined();
  }
}

/**
 * Login data object
 *
 * @typedef {Object} LoginDto
 * @property {string} email - User email
 * @property {string} password - User password
 */
class LoginDto extends BaseDto {
  constructor({ email, password }) {
    super();
    /** @type {string} */
    this.email = email;
    /** @type {string} */
    this.password = password;
    this.filterUndefined();
  }
}

module.exports = {
  SignupDto,
  LoginDto
};
