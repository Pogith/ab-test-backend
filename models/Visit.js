const mongoose = require("mongoose");

const VisitSchema = new mongoose.Schema({
  uniqId: { type: String },
  ip: { type: String },
  visited_at: { type: Date },
  left_at: { type: Date },
  useragent: [Object],
});

const Visit = mongoose.model("Visit", VisitSchema);

module.exports = Visit;
