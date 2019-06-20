const expect = require('chai').expect;
const sinon = require('sinon');

const asyncStarterService = require("../../lib/asyncStarterService");
let asyncStarterFunction = require("../../index");

describe('asyncStarterFunction', function asyncStarterFunctionTest() {
  let stripWhitespacesStub;

  context('input ok', function () {
    let queryStringParameters = { message: "hello world" };
    let result = "helloworld";

    before(function beforeTest() {
      stripWhitespacesStub = sinon.stub(asyncStarterService, "stripWhitespaces");
      stripWhitespacesStub.callsFake(function (msg) {
        expect(msg).to.eq(queryStringParameters.message);
        return Promise.resolve(result);
      });
    });

    it('success', async function () {
      let event = { queryStringParameters };
      let context = {};

      let response = await asyncStarterFunction.handler(event, context);
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.eq(`{"message":"${result}"}`);
    });

    after(function afterTest() {
      stripWhitespacesStub.restore();
    });
  });

  
  context('input missing', function () {
    let queryStringParameters = {};

    it('failure', async function () {
      let event = { queryStringParameters };
      let context = {};

      let response = await asyncStarterFunction.handler(event, context);

      expect(response.statusCode).to.eq(400);
      expect(response.body).to.eq('{"message":"Please specify message to strip whitespaces from"}');
    });

    after(function afterTest() {
      stripWhitespacesStub.restore();
    });
  });

});