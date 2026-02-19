const db = require("./db.config");

const connectDb = async () => {
  try {
    const client = db.connect();
    console.log("Connected to PostgreSQL successfully");

    // Health query
    await client.query("SELECT NOW()");

    await client.release();
  } catch (error) {
    console.error("Database connection failed: ", error.message);

    // Stop server in production
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};

module.exports = connectDb;
