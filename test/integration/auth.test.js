const { expect } = require("chai");
const chai = require("chai");
const request = require("supertest");
const sinon = require("sinon");
const util = require("node:util");
const app = require("../../app");
const emailService = require("../../services/email.service");

chai.use(require("chai-uuid"));
chai.use(require("chai-date-string"));

describe("Authentication", () => {
  describe("Signup", () => {
    let sendVerificationEmailStub;
    const signupData = {
      fullname: "John Mensah",
      email: "johnmensah@gmail.com",
      password: "J0hnMens@hisAwesome",
    };
    const apiEndpoint = "/api/v1/auth/signup";

    beforeEach(() => {
      sendVerificationEmailStub = sinon
        .stub(emailService, "sendVerificationEmail")
        .resolves({ id: "b9c0bc87-258c-4474-99e0-2aabcb19d184" });
    });

    afterEach(() => {
      sendVerificationEmailStub.restore();
    });

    it("POST /api/v1/auth/signup with valid user data", async () => {
      const response = await request(app).post(apiEndpoint).send(signupData);
      const responseBody = response.body;

      expect(
        response.status,
        "Successful signup should return status code 201",
      ).to.equal(201);
      expect(
        responseBody,
        "Response body should have success property set to boolean true",
      ).to.have.property("success", true);
      expect(
        responseBody,
        "Response body should have message property set to string 'Check your email to verify your account email.'",
      ).to.have.property(
        "message",
        "Check your email to verify your account email.",
      );
      expect(
        responseBody,
        "Response body should have data object property",
      ).to.have.property("data");
      expect(
        responseBody,
        "Response body should have data.id property with UUID value",
      )
        .to.have.nested.property("data.id")
        .to.be.uuid();
      expect(
        responseBody,
        "Response body should have data.fullName property",
      ).to.have.nested.property("data.fullName", signupData.fullname);
      expect(
        responseBody,
        "Response body should have data.email property",
      ).to.have.nested.property("data.email", signupData.email);
      expect(
        responseBody,
        "Response body should have data.createdAt property with a date string value",
      )
        .to.have.nested.property("data.createdAt")
        .to.be.dateString();
      expect(
        responseBody,
        "Response body should have data.updatedAt property with date string value",
      )
        .to.have.nested.property("data.updatedAt")
        .to.be.dateString();
      expect(
        sendVerificationEmailStub.calledOnce,
        "sendVerificationEmail service should be called once",
      ).to.be.true;
    });

    it("POST /api/v1/auth/signup with invalid data", async () => {
      const missingEmailResponse = await request(app)
        .post(apiEndpoint)
        .send({});

      expect(
        missingEmailResponse.status,
        "Response status should be 400",
      ).to.be.equal(400);
      expect(
        missingEmailResponse.body,
        "Response body should have success property with value set to boolean true",
      ).to.have.property("success", false);
      expect(
        missingEmailResponse.body,
        'Response body should have message property with value set to "Error validating request body."',
      ).to.have.property("message", "Error validating request body.");
      expect(
        missingEmailResponse.body,
        "Response body should have error property with value set to an object",
      ).to.have.property("error");
      expect(
        missingEmailResponse.body,
        "Response body should have error.type property with value 'ValidationError'",
      ).to.have.nested.property("error.type", "ValidationError");
      expect(
        missingEmailResponse.body,
        "Response body should have error.status property with number value 400",
      ).to.have.nested.property("error.status", 400);
       expect(
        missingEmailResponse.body,
        "Response body should have error.cause property with an array of validation errors",
      ).to.have.nested.property("error.cause");
        expect(
        missingEmailResponse.body.error.cause,
        "Response body error.cause property should have an array of validation errors",
      ).to.be.an('array').to.have.lengthOf.above(0);
    });

  });
});
