const request = require("supertest");
const { expect } = require("chai");

const app = require("../server");

describe("Project data test", function () {
  this.timeout(10000);

  describe("POST /users/:id/projects", () => {
    const id = "av3fjfad3fdlobm2";
    const newProject = {
      uid: "aks1nsvaosad2flasd",
      projectName: "button color",
    };

    it("it should post project name", (done) => {
      request(app)
        .post(`/users/${id}/projects`)
        .send(newProject)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.status).to.eql(200);
          expect(res.text).to.include("Success");
          done();
        });
    });
  });

  describe("GET /users/:id/projects", () => {
    const id = "av3fjfad3fdlobm2";

    it("it should get all project lists from the database and return in response", (done) => {
      request(app)
        .get(`/users/${id}/projects`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.status).to.eql(200);
          done();
        });
    });
  });

  describe("DELETE /users/:id/projects/:project", () => {
    const id = "av3fjfad3fdlobm2";
    const projectId = "62de73298ebb82df81a0e963";

    it("it should delete project and test lists and visit data", (done) => {
      request(app)
        .delete(`/users/${id}/projects/${projectId}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.status).to.eql(200);
          expect(res.text).to.include("Delete Success");
          done();
        });
    });
  });
});

describe("Test data test", function () {
  this.timeout(10000);

  describe("POST /users/:id/projects/:project/testlists", () => {
    const id = "av3fjfad3fdlobm2";
    const projectId = "62de73298ebb82df81a0e963";
    const testList = {
      testUrl: "https://example.com",
    };

    it("it should post test list", (done) => {
      request(app)
        .post(`/users/${id}/projects/${projectId}/testlists`)
        .send(testList)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.status).to.eql(200);
          expect(res.text).to.include("Success");
          done();
        });
    });
  });

  describe("GET /users/:id/projects/:project/testlists", () => {
    const id = "av3fjfad3fdlobm2";
    const projectId = "62de75673f5a87ecdd3b969f";

    it("it should get all test lists", (done) => {
      request(app)
        .get(`/users/${id}/projects/${projectId}/testlists`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.status).to.eql(200);
          done();
        });
    });
  });

  describe("DELETE /users/:id/projects/:project/test/:test", () => {
    const id = "av3fjfad3fdlobm2";
    const projectId = "62de73298ebb82df81a0e963";
    const testId = "62de8d7589aab48bdac81d48";

    it("it should delete test list and visit data", (done) => {
      request(app)
        .delete(`/users/${id}/projects/${projectId}/test/${testId}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.status).to.eql(200);
          expect(res.text).to.include("Delete Success");
          done();
        });
    });
  });
});

describe("ScreenShot data test", function () {
  this.timeout(10000);

  describe("GET /users/:id/projects/:uniqid/screen-shot", () => {
    const id = "av3fjfad3fdlobm2";
    const uniqId = "1o2w0eck0l60qh5am";

    it("it should get screenshot from test url", (done) => {
      request(app)
        .get(`/users/${id}/projects/${uniqId}/screen-shot`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.status).to.eql(200);
          done();
        });
    });
  });
});
