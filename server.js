const express = require("express");
const app = express();
const dotenv = require("dotenv");
const http = require("http");
const server = http.createServer(app);
const cookieParser = require("cookie-parser");
const cors = require("cors");
const useragent = require("express-useragent");

dotenv.config();

const db = require("./db/db");

db();

const authorization = require("./router/middleware/authorization");
const login = require("./router/login");
const project = require("./router/project");
const test = require("./router/test");
const index = require("./router/index");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(useragent.express());

app.use(cors());

app.use("/", index);
app.use("/auth", login);
app.use("/api", test);
app.use("/users", authorization, project);

// for unit test
// app.use("/users", project);

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

// for unit test
module.exports = app;
