const express = require("express");
const app = express();

const AuthController = require("./controllers/AuthController");
const NotesController = require("./controllers/NotesController");
const ProductsController = require("./controllers/ProductsController");

app.use(function(req, res, next) {
  //CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  let time = new Date();
  console.log(
    `${time.toLocaleTimeString()} Req: ${req.header("host")}${
      req.originalUrl
    } From: ${req.headers["x-forwarded-for"] || req.connection.remoteAddress}`
  );

  next();
});

app.use("/api/auth", AuthController);
app.use("/api/notes", NotesController);
app.use("/api/products", ProductsController);

module.exports = app;
