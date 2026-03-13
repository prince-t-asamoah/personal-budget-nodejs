const { Resend } = require("resend");

/**
 * @typedef EmailConfig
 * @property {string} to - Send email address
 * @property {string} subject - Email subject
 * @property {string} html - Email html code
 */

const emailConfig = new Resend(process.env.EMAIL_API_KEY);

/**
 * Sends email using resend
 *
 * @param {EmailConfig} config - Config for email
 */
const sendEmail = async (config) => {
  const { data, error } = await emailConfig.emails.send({
    from: process.env.SEND_EMAIL_ADDRESS,
    ...config,
  });

  if (error) {
    throw new Error(`Send email failed: ${error.message}`);
  }

  return data;
};

module.exports = sendEmail;
