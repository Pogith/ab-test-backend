const request = require("supertest");
const { expect } = require("chai");

const app = require("../server");

describe("Connect test", function () {
  it("Server connect is success", (done) => {
    request(app)
      .get("/")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).to.eq(200);
        expect(res.text).to.include("Server status is ok");
        done();
      });
  });
});
