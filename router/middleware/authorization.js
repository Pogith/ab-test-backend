const admin = require("../../config/firebaseConfig");

const authorization = async (req, res, next) => {
  const token = req.headers?.authorization.split(" ")[1];

  if (String(token) !== "undefined") {
    try {
      const decodeValue = await admin.auth().verifyIdToken(token);

      req.user = decodeValue;

      return next();
    } catch (err) {
      if (err.codePrefix === "auth") {
        return next({ status: 400, message: "Invalid token" });
      } else {
        return next(err);
      }
    }
  } else {
    return next({ status: 401, message: "Unauthorized" });
  }
};

module.exports = authorization;
