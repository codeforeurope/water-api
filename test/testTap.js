// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

// Require the dev-dependencies
var moment = require('moment-timezone')
var chai = require('chai')
var chaiHttp = require('chai-http')
var app = require('../server')
chai.use(chaiHttp)
var should = chai.should()

describe('testing /api/tap', function () {
  afterEach(function () {
    // runs after each test in this block
  })
  /*
   * Test /PUT water
   */
  describe('PUT Tap without token', function () {
    it('it should return AuthenticationError, No token provided', function (done) {
      chai.request(app)
        .put('/api/tap')
        .send({})
        .end(function (err, res) {
          var data = JSON.parse(res.text)
          should.equal(data.name, 'AuthenticationError')
          should.equal(data.message, 'No token provided')
          res.should.have.status(402)
          done()
        })
    })
  })
})
