const request = require("supertest");
const { assert, expect } = require("chai");

const app = require("../server");
const User = require("../models/User");

describe("Reading Details of User", function () {
  this.timeout(10000);

  beforeEach(async () => {
    await new User({
      email: "abtest@example.com",
      uid: "exampleUid",
    }).save();
  });

  afterEach(async () => {
    await User.findOneAndDelete({ uid: "exampleUid" });
  });

  it("Find user with the uid", (done) => {
    User.findOne({ uid: "exampleUid" }).then((user) => {
      assert(user.uid === "exampleUid");
      done();
    });
  });
});

describe("Login test", function () {
  this.timeout(10000);

  afterEach(async () => {
    await User.findOneAndDelete({ uid: "exampleUid" });
  });

  it("it should be error if there is no email", (done) => {
    const data = {
      user: {
        email: null,
        uid: null,
      },
    };

    request(app)
      .post("/auth/login")
      .send(data)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).to.eql(400);
        expect(res.text).to.include("Missing email");
        done();
      });
  });

  it("it should be success if email and uid are valid", (done) => {
    const data = {
      user: {
        email: "abtest@example.com",
        uid: "exampleUid",
      },
    };

    request(app)
      .post("/auth/login")
      .send(data)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).to.eql(200);
        expect(res.text).to.include("Success Save");
        done();
      });
  });

  it("it should be error if there is no uid", (done) => {
    const data = {
      user: {
        email: "abtest@example.com",
        uid: null,
      },
    };

    request(app)
      .post("/auth/login")
      .send(data)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).to.eql(400);
        expect(res.text).to.include("Missing uid");
        done();
      });
  });
});
