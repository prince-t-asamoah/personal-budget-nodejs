const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const indexRouter = require("./routes/index.routes");
const sessionConfig = require("./config/session.config");
const errorHandler = require("./middlewares/errorHandler.middleware");

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.APP_BASE_URL,
  }),
);
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionConfig));

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use("/api/v1", indexRouter);

app.get("/", (_req, res) => {
  res.render("index.html");
});

app.use(errorHandler);

module.exports = app;
