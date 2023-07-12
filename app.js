const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
require("./databases/models/index");
const { init } = require("./src/modules/index.routes");
const dbConnection = require("./databases/dbConnection");
const { createOnlineOrder } = require("./src/modules/order/order.controller");
require("dotenv").config();
const app = express();
const port = 8082;

app.use(cors());
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  createOnlineOrder
);
app.use(express.json());
app.use(express.static("uploads"));
if (process.env.MODE == "development") {
  app.use(morgan("dev"));
}

// routes
init(app);
// connection

dbConnection();
app.listen(port, () => console.log(`listening on port ${port}`));
// to handle any errors outside express js (db/connection)

process.on("unhandledRejection", (err) => {
  console.log("unhandledRejection", err);
});
