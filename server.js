const app = require("./app");
const connectDb = require("./config/connectDb");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDb();

  app.listen(PORT, () =>
    console.log(`Server is listening on http://localhost:${PORT}`),
  );
};

startServer();

module.exports = app;
