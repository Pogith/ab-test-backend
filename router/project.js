const express = require("express");
const router = express.Router();

const projectController = require("./controllers/project.controller");

router.get("/:id/projects", projectController.getAllProjectLists);
router.post("/:id/projects", projectController.saveProject);
router.delete("/:id/projects/:project", projectController.deleteProject);

router.get("/:id/projects/:project/testlists", projectController.getAllTestLists);
router.post("/:id/projects/:project/testlists", projectController.saveTest);
router.delete("/:id/projects/:project/test/:test", projectController.deleteTest);

router.get("/:id/projects/:project/results", projectController.getAllResults);

router.get("/:id/projects/:uniqid/screen-shot", projectController.getScreenshot);

module.exports = router;
