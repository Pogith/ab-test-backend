const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.json("Server status is ok");
});

module.exports = router;
