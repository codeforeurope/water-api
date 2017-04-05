require('dotenv-safe').load({
  allowEmptyValues: true,
  sample: './.env.example'
})
const port = process.env.SPA_PORT
const domain = process.env.AUDIENCE
const audience = domain
const clientsecret = process.env.CLIENT_SECRET
const clientid = process.env.CLIENT_ID
const algorithm = process.env.ALGORITHM
const tokenurl = process.env.TOKEN_URL
// TODO per domain AU ? US ? EU
module.exports = {port, domain, clientid, audience, clientsecret, algorithm, tokenurl}
