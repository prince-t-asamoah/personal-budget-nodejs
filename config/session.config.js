const { Session } = require("express-session");

let store;
if (process.env.NODE_ENV !== "test") {
  const { RedisStore, redisClient } = require("./redis.config");
  store = new RedisStore({ client: redisClient, prefix: "budget-app:sessions:" });
}

/** @type {Session} - Express session configuration */
const sessionConfig = {
  store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: null,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
};

module.exports = sessionConfig;
