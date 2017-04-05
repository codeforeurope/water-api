# Build status

[![Travis](https://api.travis-ci.org/codeforeurope/water-api.svg?branch=master)](https://travis-ci.org/codeforeurope/water-api)
[![David](https://david-dm.org/codeforeurope/water-api.svg)](https://david-dm.org/codeforeurope/water-api)

# water-api
This is a the API for the Code For Europe Transparent Water Initiative.

# Run

```bash
npm install
npm start
```
# Test

```bash
npm test
```


# Auth

https://auth0.com/docs/api-auth
-[] swagger definition

## Generate token via https://jwt.io/#libraries
-[x] Done via https://github.com/auth0/node-jsonwebtoken

## Cors http://apprize.info/javascript/cors/8.html
-[] refreshtoken, accesstoken

## send to endpoint per domain - AU, EU, US

https://water.au.auth0.com/api/v2/
https://water.eu.auth0.com/api/v2/
https://watertransparency.auth0.com/api/v2/

Basic flow is User sends user and pwd or other credentials to auth0, auth0 sends webtoken, we use webtoken to auth against api

Saves Auth JWT token to localstorage (emulated on node) auth/id_token

# Travis 
To encrypt variables for travis use (assuming you have travis installed)
```shell 
travis encrypt-file .env --add
```

# Issues

Please report any issues at the [Transparent-Water](https://github.com/codeforeurope/Transparent-Water/issues) repository.
You can reference issues in commits using: 
```
npm commit -m "I fixed codeforeurope/transparent-water#1"
```
