// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

// Require the dev-dependencies
var moment = require('moment-timezone')
var chai = require('chai')
var chaiHttp = require('chai-http')
var app = require('../server')
var models = require('../models')

chai.use(chaiHttp)
var should = chai.should()

describe('testing /api/company', function () {
  var token = 'myawesomedummytoken'

  var testcompany = {
    code: 'wueteria',
    name: 'Wüteria Mineralquellen GmbH & Co. KG',
    url: 'http://wueteria.de',
    country: 'Germany'
  }

  var testuser = {
    name: 'testUser',
    email: 'test@email.com',
    token: token
  }
  var user = new models.User.model(testuser)

  user.save(function (err, user, count) {
    user = user
  })

  afterEach(function () {
    // runs after each test in this block
  })

  /*
   * Test the /POST Company route
   */
  describe('POST Company without token', function () {
    it('it should return AuthenticationError, No token provided', function (done) {
      chai.request(app)
        .post('/api/company')
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
  /*
   * Test the /POST Company route
   */
/* // broken TODO 
  describe('POST Company with token', function () {
    it('it should return the newly created company', function (done) {
      chai.request(app)
        .post('/api/company')
        .set('x-access-token', token)
        .send(testcompany)
        .end(function (err, res) {
          var data = JSON.parse(res.text)
          res.should.be.json // jshint ignore:line
          should.equal(data.code, 'wueteria')
          res.should.have.status(200)
          done()
        })
    })
  })
*/  
})

