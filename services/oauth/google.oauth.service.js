const httpsRequestJson = require("../../util/httpRequestJson.util");

/**
 * Google OAuth User Data
 * 
 * @typedef GoogleUser
 * @property {string} id - User id
 * @property {string} email - User email
 * @property {string} name - User name
 * @property {string} picture - User profile picture url
 * @property {boolean} verified_email - User email verification status
 * @property {string} given_name - User first name
 * @property {string} family_name - User last name
 *
 */

/**
 * Google OAuth Service
 *
 * @param {string} code - Authentication code
 * @returns {Promise<GoogleUser | null>}
 */
const getGoogleUser = async (code) => {
  const tokenRequestBody = new URLSearchParams({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    grant_type: "authorization_code",
  }).toString();

  // Exchange authorization code for tokens
  const tokenData = await httpsRequestJson(
    {
      hostname: "oauth2.googleapis.com",
      path: "/token",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(tokenRequestBody),
      },
    },
    tokenRequestBody,
  );

  if (tokenData.error || !tokenData.access_token) {
    throw new Error(
      `Google token exchange failed: ${tokenData.error_description || tokenData.error || "unknown_error"}`,
    );
  }

  const { access_token } = tokenData;

  // Fetch user info with access token
  const userData = await httpsRequestJson({
    hostname: "www.googleapis.com",
    path: "/oauth2/v2/userinfo",
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (userData.error) {
    throw new Error(
      `Google user info fetch failed: ${userData.error.message || "unknown_error"}`,
    );
  }

  return userData;
};

module.exports = { getGoogleUser };
