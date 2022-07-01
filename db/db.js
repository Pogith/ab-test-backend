const mongoose = require("mongoose");

module.exports = () => {
  const connect = () => {
    mongoose.connect(
      process.env.MONGODB_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "abtests",
      },
      (err) => {
        if (err) {
          console.error("mongoDB connection error", err);
        }

        console.log("mongoDb is connected!! :)");
      }
    );
  };

  connect();

  mongoose.connection.on("disconnected", connect);
};
