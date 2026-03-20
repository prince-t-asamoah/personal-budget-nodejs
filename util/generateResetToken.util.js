const crypto = require("node:crypto");

/** Generate an sha256 token for password reset oken */
const generatResetToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  const hasedToken = crypto.createHash("sha256").update(token).digest("hex");

  return { token, hasedToken };
};

module.exports = { generatResetToken };
