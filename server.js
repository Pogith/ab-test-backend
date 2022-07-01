const express = require("express");
const app = express();
const dotenv = require("dotenv");
const http = require("http");
const server = http.createServer(app);

dotenv.config();

const db = require("./db/db");
const cors = require("cors");

db();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
  const err = new Error("Not Found");

  err.status = 404;

  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  if (res.statusCode !== 500) {
    res.json({ message: err.message });
  } else {
    res.json({});
  }
});

const port = process.env.PORT || 8080;

server.listen(port, () => console.log("server is up and running"));
