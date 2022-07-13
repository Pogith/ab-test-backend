const express = require("express");
const router = express.Router();

const testController = require("./controllers/test.controller");

router.get("/test-page/ab-test", testController.getSourcefile);
router.post("/test-page/:uniqid", testController.saveTestPageData);

module.exports = router;
