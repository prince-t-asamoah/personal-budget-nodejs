const db = require("./db.config");

const connectDb = async () => {
  const client = await db.connect();
  // Health query
  await client.query("SELECT NOW()");

  client.release();
};

module.exports = connectDb;
