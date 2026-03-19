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

/**
 * Auth account data object
 *
 * @typedef {Object} AuthAccountDto
 * @property {string} id - Auth account id
 * @property {string} userId - User id
 * @property {string} provider - Auth provider type
 * @property {string} providerUserId - Provider user id
 * @property {string} createdAt - Created at timestamp
 */
class AuthAccountDto extends BaseDto {
  constructor({ id, user_id, provider, provider_user_id, created_at }) {
    super();
    /** @type {string} */
    this.id = id;
    /** @type {string} */
    this.userId = user_id;
    /** @type {string} */
    this.provider = provider;
    /** @type {string} */
    this.providerUserId = provider_user_id;
    /** @type {string} */
    this.createdAt = created_at;
    this.filterUndefined();
  }
}

module.exports = {
  SignupDto,
  LoginDto,
  AuthAccountDto
};
