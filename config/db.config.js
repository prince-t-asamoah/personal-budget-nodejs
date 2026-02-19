const { Pool } = require("pg");

const db = new Pool({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
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
