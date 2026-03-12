const { RedisStore } = require("connect-redis");
const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL,
  //   password: process.env.REDIS_PASSWORD,
});

redisClient.on("connect", () => {
  console.log("Redis connected successfully");
});

redisClient.on("error", (error) => {
  console.error("Redis error: ", error);
});

redisClient.connect();

module.exports = { redisClient, RedisStore };
