const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  uid: { type: String },
  projectName: { type: String },
  testId: [{ type: mongoose.Schema.Types.ObjectId }],
});

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
