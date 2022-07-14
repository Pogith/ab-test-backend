const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const uniqid = require("uniqid");

const Project = require("../../models/Project");
const Test = require("../../models/Test");
const Visit = require("../../models/Visit");

exports.getAllProjectLists = async (req, res, next) => {
  const uid = req.params.id;

  try {
    const projects = await Project.find({ uid }).lean();

    if (!projects) {
      return next({ status: 400, message: "There is no projects" });
    }

    return res.json(projects);
  } catch (err) {
    next(err);
  }
};

exports.saveProject = async (req, res, next) => {
  const uid = req.params.id;
  const projectName = req.body.projectName;

  try {
    await new Project({
      uid,
      projectName,
      testIds: [],
    }).save();

    return res.json({ message: "Success" });
  } catch (err) {
    next(err);
  }
};

exports.deleteProject = async (req, res, next) => {
  const projectId = req.params.project;

  try {
    const project = await Project.findById(projectId).lean();

    if (!project) {
      return next({ status: 400, message: "There is no project" });
    }

    const testLists = await Test.find({ _id: project.testIds }).lean();

    if (!testLists) {
      return next({ status: 400, message: "There is no testLists" });
    }

    for (const test of testLists) {
      const visitLists = await Visit.find({ _id: test.visitedIds}).lean();

      if (!visitLists) {
        return next({ status: 400, message: "There is no visitLists" });
      }

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
};

exports.getAllTestLists = async (req, res, next) => {
  const projectId = req.params.project;

  try {
    const testLists = await Test.find({ projectId }).lean();

    if (!testLists) {
      return next({ status: 400, message: "There is no testLists" });
    }

    return res.json(testLists);
  } catch (err) {
    next(err);
  }
};

exports.saveTest = async (req, res, next) => {
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

    return res.json({ message: "Success" });
  } catch (err) {
    next(err);
  }
};

exports.deleteTest = async (req, res, next) => {
  const projectId = req.params.project;
  const testId = req.params.test;

  try {
    const test = await Test.findById(testId).lean();

    if (!test) {
      return next({ status: 400, message: "There is no test" });
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
};

exports.getAllResults = async (req, res, next) => {
  const projectId = req.params.project;

  try {
    const testRecords = await Test.find({ projectId }).lean();
    const uniqIds = [];

    if (!testRecords) {
      return next({ status: 400, message: "There is no testRecords" });
    }

    for (const value of testRecords) {
      uniqIds.push(value.uniqId);
    }

    const visitRecords = await Visit.find({
      uniqId: uniqIds,
    }).lean();

    if (!visitRecords) {
      return next({ status: 400, message: "There is no visitRecords" });
    }

    const result = {
      testResults: testRecords,
      visitResults: visitRecords,
    };

    return res.json(result);
  } catch (err) {
    next(err);
  }
};


exports.getScreenshot = async (req, res, next) => {
  const { uniqid } = req.params;
  const script = fs.readFileSync("./clickPoint.js", "utf-8");

  try {
    const test = await Test.findOne({ uniqId: uniqid }).lean();

    if (!test) {
      return next({ status: 400, message: "There is no test"});
    }

    const coordinateXandY = test.clickEvent.map((e) => [e.x, e.y]);
    const clickData = "const dataset = " + JSON.stringify(coordinateXandY);
    const { data } = await axios.get(test.url);
    const $ = cheerio.load(data);

    $("script").each((index, item) => {
      if ("src" in item.attribs) $(item).remove();
    });

    $("body").append(script + clickData + '</script>');

    res.send($.html());
  } catch (err) {
    next(err);
  }
};
