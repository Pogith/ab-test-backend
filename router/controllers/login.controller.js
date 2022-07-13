const User = require("../../models/User");

exports.login = async (req, res, next) => {
  try {
    const { email, uid } = req.body.user;

    if (!email) {
      return next({ status: 400, message: "Missing email" });
    }

    if (!uid) {
      return next({ status: 400, message: "Missing uid" });
    }

    const userData = await User.findOne({ uid }).lean();

    if (userData) {
      return res.json({ status: 200, message: "Success Login" });
    }

    await new User({
      email,
      uid,
    }).save();

    return res.json({ status: 200, message: "Success Save" });
  } catch (err) {
    next(err);
  }
};
