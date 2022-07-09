const express = require("express");
const router = express.Router();
const fs = require("fs");

const Test = require("../models/Test");
const Visit = require("../models/Visit");

router.get("/test-page/ab-test", (req, res, next) => {
  const scriptKey = req.query.key;

  fs.unlinkSync("./source/visitorSource.js");

  const readStream = fs.createReadStream("./source/source.js");
  const writeStream = fs.createWriteStream("./source/visitorSource.js");

  writeStream.on("open", () => {
    readStream.pipe(writeStream);

    readStream.on("error", (err) => {
      if (err) next(err);
    }).on("close", (err) => {
      if (err) next(err);

      console.log(`Close readStream with ${fs.statSync("./source/visitorSource.js").size} bytes`);
    });

    writeStream.on("error", () => next(err));

    writeStream.on("close", () => {
      fs.appendFileSync("./source/visitorSource.js", `\nconst key = "${scriptKey}";\n`);

      const sourceFile = fs.readFileSync("./source/visitorSource.js", "utf-8");

      res.send(sourceFile);
    });
  });
});

router.post("/test-page/:uniqid", async (req, res, next) => {
  const ip = req.query.ip;
  const event = JSON.parse(req.query.event);
  const uniqId = req.params.uniqid;
  const useragent = {
    mobile: req.useragent.isMobile,
    desktop: req.useragent.isDesktop,
    browser: req.useragent.browser,
  };
  const visitedPageIdAndVisitedId = req.cookies[uniqId];

  let visitedPageId;
  let visitedId;

  if (visitedPageIdAndVisitedId) {
    visitedPageId = visitedPageIdAndVisitedId.split("&")[0];
    visitedId = visitedPageIdAndVisitedId.split("&")[1];
  }

  try {
    const test = await Test.findOne({ uniqId }).lean();

    if (!test) {
      return next({ status: 400, message: "Bad Request"});
    }

    if (event.name === "connect") {
      if (visitedPageId && visitedPageId === uniqId) {
        const filteredIds = test.visitedIds.filter((id) => id === visitedId);

        if (filteredIds) {
          let revisitCount = test.revisitCount + 1;

          await Test.findOneAndUpdate(
            { uniqId },
            {
              $set: { revisitCount: revisitCount },
            },
          );

          await Visit.findOneAndUpdate(
            visitedId,
            {
              $set: { visited_at: new Date() },
            },
          );

          return res.json({ message: "RevisitData is successfully saved"});
        }
      }

      const visitData = await new Visit({
        uniqId,
        ip,
        visited_at: new Date(),
        left_at: "",
        useragent,
      }).save();

      let visitCount = test.visitCount + 1;

      await Test.findOneAndUpdate(
        { uniqId },
        {
          $set: { visitCount: visitCount },
          $push: { visitedIds: visitData._id },
        },
      );

      const newUniqIdAndVisitedId = `${uniqId}&${visitData._id}`;

      res.setHeader("Set-Cookie", `${uniqId}=${String(newUniqIdAndVisitedId)}; Max-Age=${60 * 60 * 24 * 7}`);

      return res.json({ message: "connectEvent is successfully saved"});
    }

    if (event.name === "click") {
      await Test.findOneAndUpdate(
        { uniqId },
        {
          $push: { clickEvent: event },
        },
      );

      return res.json({ message: "clickEvent is successfully saved"});
    }

    if (event.name === "unload") {
      if (visitedId) {
        await Visit.findByIdAndUpdate(
          visitedId,
          {
            $set: { left_at: new Date() },
          },
        );

        return res.json({ message: "unload is successfully saved"});
      }
    }

  } catch (err) {
    next(err);
  }
});

module.exports = router;
