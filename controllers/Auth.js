(function () {
  'use strict'
  var axios = require('axios')

  var config = require('../config/auth0')

  class Api {
    constructor (callback) {
      this.auth = new Auth(config.clientid, config.domain, callback)
    }
    getRepos () {
      return this.isLoggedIn()
        ? this.getProfile()
        : Promise.reject(new Error('User is not authenticated'))
    }
    async getProfile () {
      const profile = await axios.post(config.domain + '/tokeninfo', {
        id_token: this
          .auth
          .getToken()
      })
      return Promise.all([
        profile.data //, // TODO API
      ])
    }
    isLoggedIn () {
      return this
        .auth
        .loggedIn()
    }
    login () {
      this
        .auth
        .login()
    }
    logout () {
      this
        .auth
        .logout()
    }
  }
  module.exports = Api
}())
