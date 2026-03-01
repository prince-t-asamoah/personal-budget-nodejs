
const { Pool, types } = require("pg");

// OIDs for common numeric types
const INT8_OID = 20;    // BIGINT
const FLOAT8_OID = 701; // DOUBLE PRECISION
const NUMERIC_OID = 1700; // NUMERIC/DECIMAL

// Parse these as numbers
types.setTypeParser(INT8_OID, val => Number(val));
types.setTypeParser(FLOAT8_OID, val => Number(val));
types.setTypeParser(NUMERIC_OID, val => Number(val));

const isProduction = process.env.NODE_ENV === "production";

const db = new Pool({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  ...(isProduction && { ssl: { rejectUnauthorized: false } })
});

db.on("connect", () => {
  console.log("Database connected successfully");
});

db.on("error", (error) => {
  console.error("Unexpected error on idle client", error);

  // Stops the server immediately on production
  if (process.env.NODE_ENV === "production") {
    process.exit(-1);
  }
});

module.exports = db;
