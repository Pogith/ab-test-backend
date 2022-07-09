const mongoose = require("mongoose");

const TestSchema = new mongoose.Schema({
  uniqId: { type: String },
  projectId: { type: mongoose.Schema.Types.ObjectId },
  visitedIds: [{ type: String }],
  visitCount: { type: Number, default: 0 },
  revisitCount: { type: Number, default: 0 },
  clickEvent: [Object],
  url: { type: String },
});

const Test = mongoose.model("Test", TestSchema);

module.exports = Test;
