/**
 * User data object
 *
 * @typedef {Object} UserDto
 * @property {string} id - User account id
 * @property {string} full_name - User account name
 * @property {string} email - User accocunt email
 * @property {string} created_at - User account created at date
 * @property {string} updated_at - User account update date
 */

/**
 * @class UserDto
 */
class UserDto {
  /**
   * @param {UserDto} params
   */
  constructor({ id, full_name, email, created_at, updated_at }) {
    /** @type {string} */
    this.id = id;
    /** @type {string} */
    this.fullName = full_name;
    /** @type {email} */
    this.email = email;
    /** @type {string} */
    this.createdAt = created_at;
    /** @type {string} */
    this.updatedAt = updated_at;
  }
}

module.exports = { UserDto };
