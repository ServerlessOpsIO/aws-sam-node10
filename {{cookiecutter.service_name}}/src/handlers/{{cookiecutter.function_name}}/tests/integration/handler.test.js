const request = require('supertest');
const expect = require('chai').expect;

describe('getStripWhitespaces', function getStripWhitespacesTest() {

  it('ok', function it(done) {
    request(`http://localhost:3000`)
      .get(`/stripWhitespaces?message=hello\ world`)
      .expect(200)
      .end(function (error, result) {
        if (error) {
          return done(error);
        }

        expect(result.body.message).to.deep.eq("helloworld");
        done();
      });
  });

});