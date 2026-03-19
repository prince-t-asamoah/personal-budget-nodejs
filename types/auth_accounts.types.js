/**
 * @typedef {Object} AuthAccount
 * @property {string} id
 * @property {string} user_id
 * @property {string} provider
 * @property {string} provider_user_id
 * @property {string} created_at
 * 
 */

/**
 * Valid authentication provider types values
 *
 * @readonly
 * @enum {string}
 */
const AUTH_ACCOUNTS_TYPE = Object.freeze({
  LOCAL: "local",
  GOOGLE: "google",
  FACEBOOK: "facebook",
  APPLE: "apple",
  MICROSOFT: "microsoft",
});

module.exports = {
  AUTH_ACCOUNTS_TYPE,
};
