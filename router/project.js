const express = require("express");
const router = express.Router();
const uniqid = require("uniqid");
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const Project = require("../models/Project");
const Test = require("../models/Test");
const Visit = require("../models/Visit");

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
      return next({ status: 400, message: "Bad Request" });
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

    await Project.findByIdAndUpdate(projectId, {
      $push: { testIds: newTest._id },
    });

    res.json({ message: "Success" });
  } catch (err) {
    next(err);
  }
});

router.get("/:id/projects/:project/results", async (req, res, next) => {
  const projectId = req.params.project;

  try {
    const testRecords = await Test.find({ projectId }).lean();
    const uniqIds = [];

    for (const value of testRecords) {
      uniqIds.push(value.uniqId);
    }

    const visitRecords = await Visit.find({
      uniqId: uniqIds,
    }).lean();

    const result = {
      testResults: testRecords,
      visitResults: visitRecords,
    };
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id/projects/:project", async (req, res, next) => {
  const projectId = req.params.project;

  try {
    const project = await Project.findById(projectId).lean();

    if (!project) {
      return next({ status: 400, message: "Bad Request" });
    }

    const testLists = await Test.find({ _id: project.testIds }).lean();

    for (const test of testLists) {
      const visitLists = await Visit.find({ _id: test.visitedIds}).lean();

      for (const visit of visitLists) {
        await Visit.findByIdAndDelete(visit._id);
      }
    }

    for (const id of project.testIds) {
      await Test.findByIdAndDelete(id);
    }

    await Project.findByIdAndDelete(projectId);

    return res.json({ message: "Delete Success" });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id/projects/:project/test/:test", async (req, res, next) => {
  const projectId = req.params.project;
  const testId = req.params.test;

  try {
    const test = await Test.findById(testId).lean();

    if (!test) {
      return next({ status: 400, message: "Bad Request" });
    }

    if (test.visitedIds.length !== 0) {
      for (const id of test.visitedIds) {
        await Visit.findByIdAndDelete(id);
      }
    }

    await Test.findByIdAndDelete(testId);
    await Project.findByIdAndUpdate(projectId, {
      $pull: { testIds: testId },
    });

    return res.json({ message: "Delete Success" });
  } catch (err) {
    next(err);
  }
});

router.get("/:id/projects/:uniqid/screen-shot", async (req, res, next) => {
  const { uniqid } = req.params;
  const script = fs.readFileSync("./clickPoint.js", "utf-8");

  try {
    const test = await Test.findOne({ uniqId: uniqid }).lean();

    if (!test) {
      return next({ status: 400, message: "Bad Request"});
    }

    const coordinateXandY = test.clickEvent.map((e) => [e.x - 6, e.y + 20]);
    const clickData = "const dataset = " + JSON.stringify(coordinateXandY);
    const { data } = await axios.get(test.url);
    const $ = cheerio.load(data);

    $("body").append(script + clickData + '</script>');

    res.send($.html());
  } catch (err) {
    next(err);
  }
});

module.exports = router;
