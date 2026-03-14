const path = require("node:path");
const fs = require("node:fs");
const handlebars = require("handlebars");
const emailClient = require("../config/email.config");

const APP_FRONTEND_BASE_URL = `${process.env.APP_API_BASE_URL}/api/v1`;

/**
 * Send email verification email to new signup users
 *
 * @param {string} email - User email address
 * @param {string} name - User fullname
 * @param {string} verificationToken - Verification token code
 */
const sendVerificationEmail = async (email, name, verificationToken) => {
  const templatePath = path.join(__dirname, "../views/verify-email.handlebars");
  const templateSource = fs.readFileSync(templatePath, "utf-8");

  // Compile the handlebar template
  const template = handlebars.compile(templateSource);
  const verificationLink = `${APP_FRONTEND_BASE_URL}/auth/verify-email?code=${verificationToken}`;

  // Render HTML with name, email and verification link
  const html = template({ name, email, verificationLink });

  await emailClient({
    to: email,
    subject: "Verify your email",
    html,
  });
};

module.exports = {
  sendVerificationEmail,
};
