const { expect } = require("chai");
const chai = require("chai");
const request = require("supertest");
const sinon = require("sinon");
const app = require("../../app");
const emailService = require("../../services/email.service");

chai.use(require("chai-uuid"));
chai.use(require('chai-date-string'));

describe("Authentication", () => {
  describe("Signup", () => {
    let sendVerificationEmailStub;

    beforeEach(() => {
      sendVerificationEmailStub = sinon
        .stub(emailService, "sendVerificationEmail")
        .resolves({ id: "b9c0bc87-258c-4474-99e0-2aabcb19d184" });
    });

    afterEach(() => {
      sendVerificationEmailStub.restore();
    });

    it("POST /api/v1/auth/signup with valid user data", async () => {
      const signupData = {
        fullname: "John Mensah",
        email: "johnmensah@gmail.com",
        password: "J0hnMens@hisAwesome",
      };

      const response = await request(app)
        .post("/api/v1/auth/signup")
        .send(signupData);
      const responseBody = response.body;

      expect(
        response.status,
        "Successfull signup should return status code 201",
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
      ).to.have.nested.property("data.id").to.be.uuid();
      expect(
        responseBody,
        "Response body should have data.fullName property",
      ).to.have.nested.property("data.fullName", signupData.fullname);
      expect(
        responseBody,
        "Response body should have data.email property",
      ).to.have.nested.property("data.email", signupData.email);
      expect(responseBody, "Response body should have data.createdAt property with a date string value")
        .to.have.nested.property("data.createdAt").to.be.dateString();
      expect(
        responseBody,
        "Response body should have data.updatedAt property with date string value",
      ).to.have.nested.property("data.updatedAt").to.be.dateString();
      expect(
        sendVerificationEmailStub.calledOnce,
        "sendVerificationEmail service should be called once",
      ).to.be.true;
    });
  });
});
