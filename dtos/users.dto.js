/**
 * User data object
 *
 * @typedef {Object} UserDto
 * @property {string} id - User account id
 * @property {string} full_name - User account name
 * @property {string} email - User accocunt email
 * @property {string} phone_number - User accocunt phone number
 * @property {string} address_details - User accocunt address details
 * @property {string} profile_image_url - User accocunt profile image url
 * @property {string} created_at - User account created at date
 * @property {string} updated_at - User account update date
 * @property {string} password_hash - User account password hash
 *
 */

/**
 * @class UserDto
 */
class UserDto {
  /**
   * @param {UserDto} params
   */
  constructor({
    id,
    full_name,
    email,
    phone_number,
    address_details,
    profile_image_url,
    password_hash,
    created_at,
    updated_at,
  }) {
    /** @type {string} */
    this.id = id;
    /** @type {string} */
    this.fullName = full_name;
    /** @type {string} */
    this.email = email;
    /** @type {string} */
     this.phoneNumber = phone_number;
    /** @type {string} */
    this.addressDetails = address_details;
    /** @type {string} */
    this.profileImageUrl = profile_image_url;
    /** @type {string} */
    this.passwordHash = password_hash;
    /** @type {string} */
    this.createdAt = created_at;
    /** @type {string} */
    this.updatedAt = updated_at;
  }
}

module.exports = { UserDto };
