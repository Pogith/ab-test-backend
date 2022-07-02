const express = require("express");
const router = express.Router();

const User = require("../models/User");

router.post("/login", async (req, res, next) => {
  try {
    const { email, uid } = req.body.user;

    const userData = await User.findOne({ uid }).lean();

    if (userData) {
      return res.json({ status: 200, message: "Success Login" });
    }

    await new User({
      email,
      uid,
    }).save();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
