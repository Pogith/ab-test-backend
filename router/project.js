const express = require("express");
const router = express.Router();
const uniqid = require("uniqid");

const Project = require("../models/Project");
const Test = require("../models/Test");

router.get("/:id/projects", async (req, res, next) => {
  const uid = req.params.id;

  try {
    const projects = await Project.find({ uid }).lean();

    if (!projects) {
      return next({ status: 400, message: "Bad Request" });
    }

    res.json(projects);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/projects", async (req, res, next) => {
  const uid = req.params.id;
  const projectName = req.body.projectName;

  try {
    await new Project({
      uid,
      projectName,
      testIds: [],
    }).save();

    res.json({ message: "Success" });
  } catch (err) {
    next(err);
  }
});

router.get("/:id/projects/:project/testlists", async (req, res, next) => {
  const projectId = req.params.project;

  try {
    const testLists = await Test.find({ projectId }).lean();

    if (!testLists) {
      return next({ status: 400, message: "Bad Request"});
    }

    res.json(testLists);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/projects/:project/testlists", async (req, res, next) => {
  const projectId = req.params.project;
  const url = req.body.testUrl;
  const uniqId = uniqid();
  let newTest;

  try {
    newTest = await new Test({
      uniqId,
      projectId,
      visitedIds: [],
      visitCount: 0,
      revisitCount: 0,
      clickEvent: [],
      url,
    }).save();

    await Project.findByIdAndUpdate(
      projectId,
      {
        $push: { testIds: newTest._id },
      },
    );

    res.json({ message: "Success" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
