
const https = require("node:https");

/**
 * Makes an HTTPS request and returns the parsed JSON response.
 *
 * @param {import("node:https").RequestOptions} options
 * @param {string} [body]
 * @returns {Promise<any>}
 */
const httpsRequestJson = (options, body) => {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }
      });
    });
    req.on("error", reject);
    if (body) {
      req.write(body);
    }
    req.end();
  });
};

module.exports = httpsRequestJson;