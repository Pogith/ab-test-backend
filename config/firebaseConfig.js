const admin = require("firebase-admin");

const serviceSecret = JSON.parse(process.env.SERVICE_SECRET_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceSecret),
});

module.exports = admin;
