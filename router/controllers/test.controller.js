const fs = require("fs");

const Test = require("../../models/Test");
const Visit = require("../../models/Visit");

exports.getSourcefile = (req, res, next) => {
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
};

exports.saveTestPageData = async (req, res, next) => {
  const event = JSON.parse(req.query.event);
  const uniqId = req.params.uniqid;
  const useragent = {
    mobile: req.useragent.isMobile,
    desktop: req.useragent.isDesktop,
    browser: req.useragent.browser,
  };

  const userVisitedUniqIdAndVisitedDataId = req.cookies[uniqId];

  let userVisitedUniqId;
  let visitedDataId;

  if (userVisitedUniqIdAndVisitedDataId) {
    userVisitedUniqId = userVisitedUniqIdAndVisitedDataId.split("&")[0];
    visitedDataId = userVisitedUniqIdAndVisitedDataId.split("&")[1];
  }

  try {
    const test = await Test.findOne({ uniqId }).lean();

    if (!test) {
      return next({ status: 400, message: "There is no test" });
    }

    if (event.name === "connect") {
      if (userVisitedUniqId && userVisitedUniqId === uniqId) {
        const filteredIds = test.visitedIds.filter((id) => id === visitedDataId);

        if (filteredIds) {
          let revisitCount = test.revisitCount + 1;

          await Test.findOneAndUpdate(
            { uniqId },
            {
              $set: { revisitCount: revisitCount },
            },
          );

          return res.json({ message: "RevisitData is successfully saved" });
        }
      }

      const visitData = await new Visit({
        uniqId,
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

      res.setHeader("Set-Cookie", `${uniqId}=${String(newUniqIdAndVisitedId)}; SameSite=None; Secure; Max-Age=${60 * 60 * 24 * 7}`);

      return res.json({ message: "connectEvent is successfully saved" });
    }

    if (event.name === "click") {
      await Test.findOneAndUpdate(
        { uniqId },
        {
          $push: { clickEvent: event },
        },
      );

      return res.json({ message: "clickEvent is successfully saved" });
    }

    if (event.name === "unload") {
      if (visitedDataId) {
        await Visit.findByIdAndUpdate(
          visitedDataId,
          {
            $set: { left_at: new Date() },
          },
        );

        return res.json({ message: "unload is successfully saved" });
      }
    }
  } catch (err) {
    next(err);
  }
};
