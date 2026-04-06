const path = require("node:path");
const fs = require("node:fs");
const dotenv = require("dotenv");

function loadEnv() {
  const environment = process.env.NODE_ENV || "development";
  const envCandidates = {
    development: [".env", ".env.development"],
    test: [".env.test", ".env"],
    production: [".env.production", ".env"],
  };

  const fileNamesToLoad = envCandidates[environment] || [".env"];

  for (const fileName of fileNamesToLoad) {
    const envFilePath = path.resolve(process.cwd(), fileName);
    if (fs.existsSync(envFilePath)) {
      dotenv.config({ path: envFilePath });
    }
  }
}

module.exports = loadEnv;
