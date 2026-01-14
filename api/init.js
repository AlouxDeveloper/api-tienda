const express = require("express");
const mongoose = require("mongoose");
const router = require("./router");

const methodOverride = require("method-override");

mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
});

const app = express();

// CORS
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.json());
app.use(methodOverride());
app.use(router);

app.listen(3000, () => {
    console.log("=== API-TIENDA Corriendo En El Puerto 3000 ===")
})

module.exports = app;