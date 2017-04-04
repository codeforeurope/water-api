// TODO 
// 
import axios from 'axios'
import Auth from './Auth'

(function () {
  'use strict'
  var models = require('../models')
  var Company = models.Company
  var User = models.User

const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');

require('dotenv-safe').config( {  

})

const port = process.env.SPA_PORT;
const domain = process.env.AUDIENCE;
const clientid = process.env.CLIENT_ID


export default class Api {  
    constructor (callback) {    
        this.auth = new Auth(clientid,
            domain, callback)  
    }
    getRepos () {    
        return this.isLoggedIn()    
        ? this.getProfile()    
        : Promise.reject(new Error(‘User is not authenticated’))  
    }
    async getProfile () {    
        const profile = await axios.post(domain + '/tokeninfo', {id_token: this.auth.getToken()})    
            return Promise.all([      
                profile.data //, // TODO API     
            ])  
    }  
    isLoggedIn () {    
        return this.auth.loggedIn()  
    }  
    login () {    
        this.auth.login()  
    }  logout () {    
        this.auth.logout()  
    }
}





/*
//http://apprize.info/javascript/cors/8.html
// TODO CORS
// res.header("Access-Control-Allow-Origin", '*')
// res.header('Access-Control-Allow-Headers', 'refreshToken,accessToken')
    res.header('Allow', 'OPTIONS,GET,PUT');

    res.header('Access-Control-Allow-Origin', '*');

    res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT');

    res.header('Access-Control-Allow-Headers', 'Content-Type');
*/
app.use(cors());


// Validate the access token and enable the use of the jwtCheck middleware
app.use(jwt({
  // Dynamically provide a signing key based on the kid in the header
  // and the singing keys provided by the JWKS endpoint
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    // Replace with your Auth0 Domain
    jwksUri: domain + '/.well-known/jwks.json'
  }),


  // Validate the audience and the issuer
  audience: 'organize',
  // Replace with your Auth0 Domain
  issuer: domain,
  algorithms: [ 'RS256' ]
}));

//middleware to check scopes
const checkPermissions = function(req, res, next){
  switch(req.path){
    case '/api/company':{
      var permissions = ['admin:org'];
      for(var i = 0; i < permissions.length; i++){
        if(req.user.scope.includes(permissions[i])){
          next();
        } else {
          res.status(403).send({message:'Forbidden'});
        }
      }
      break;
    }
  }
}

app.use(checkPermissions);