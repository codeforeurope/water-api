require('dotenv-safe').load({
  allowEmptyValues: true,
  sample: './.env.example'
})
const port = process.env.SPA_PORT
const audience = process.env.AUDIENCE
const clientsecret = process.env.CLIENT_SECRET
const clientid = process.env.CLIENT_ID
const algorithm = process.env.ALGORITHM
const tokenurl = process.env.TOKEN_URL
const api = process.env.AUTH0_API
const baseurl = process.env.BASE_URL
const base = process.env.AUTH0_TENANT
// TODO per domain AU ? US ? EU
module.exports = {port, clientid, audience, clientsecret, algorithm, tokenurl, api, baseurl, base}
