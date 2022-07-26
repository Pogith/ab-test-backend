const { expect } = require("chai");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

describe("User Model", function () {
  this.timeout(10000);

  let User;

  beforeEach((done) => {
    mongoose.connect(process.env.MONGODB_URL);
    mongoose.connection.once("connected", () => {
      mongoose.connection.db.dropDatabase();

      require("../models/User");

      User = mongoose.model("User");
      done();
    });
  });

  afterEach((done) => {
    mongoose.disconnect();
    done();
  });

  describe("User models test", () => {
    it("should be email", (done) => {
      const user = new User();

      user.validate((err) => {
        expect(err.errors.email).to.exist;
        done();
      });
    });

    it("should be uid", (done) => {
      const user = new User();

      user.validate((err) => {
        expect(err.errors.uid).to.exist;
        done();
      });
    });
  });
});
