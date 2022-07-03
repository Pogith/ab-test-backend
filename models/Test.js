const mongoose = require("mongoose");

const TestSchema = new mongoose.Schema({
  uniqId: { type: String },
  projectId: { type: mongoose.Schema.Types.ObjectId },
  visitedIp: [{ type: String }],
  visitCount: { type: Number },
  revisitCount: { type: Number },
  clickEvent: [Object],
  url: { type: String },
});

const Test = mongoose.model("Test", TestSchema);

module.exports = Test;
