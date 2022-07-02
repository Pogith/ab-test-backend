const express = require("express");
const router = express.Router();

const Project = require("../models/Project");

router.post("/:id/projects", async (req, res, next) => {
  try {
    const uid = req.params.id;
    const projectName = req.body.projectName;

    await new Project({
      uid,
      projectName,
      testId: [],
    }).save();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
