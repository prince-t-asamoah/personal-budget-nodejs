const path = require("path");
const dotenv = require("dotenv");

function loadEnv() {
  const environment = process.env.NODE_ENV || "development";
  const envFilePath =
    environment === "development"
      ? path.resolve(process.cwd(), ".env")
      : path.resolve(process.cwd(), ".env.production");

  dotenv.config({ path: envFilePath });
}

module.exports = loadEnv;
