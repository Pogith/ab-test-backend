const mongoose = require("mongoose");
require("mongoose-type-email");

const UserSchema = new mongoose.Schema({
  email: { type: mongoose.SchemaTypes.Email },
  uid: { type: String },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
