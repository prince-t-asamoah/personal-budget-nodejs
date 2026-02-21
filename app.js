const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const indexRouter = require("./routes/index.routes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);


app.get("/", (_req, res) => {
  res.render("index.html");
});

app.get("/health", (_req, res) => {
  res.sendStatus(200);
});


module.exports = app;
