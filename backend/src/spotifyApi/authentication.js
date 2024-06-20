require('dotenv').config()
const queryString = require('querystring')
const request = require('request')

const express = require('express'),
  app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const cors = require('cors')
app.use(cors())

app.get('/login', function (req, res) {
  let state = 'my_state'
  let scope = 'user-read-private user-read-email'

  const query = queryString.stringify({
    client_id: `${process.env.SPOTIFY_CLIENTID}`,
    response_type: 'code',
    scope: scope,
    redirect_uri: 'http://localhost:3030/callback',
    state
  })

  res.redirect(`https://accounts.spotify.com/authorize?${query}`)
})

app.get('/callback', function (req, res) {
  let code = req.query.code
  let options = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: 'http://localhost:3030/callback',
      grant_type: 'authorization_code'
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        new Buffer.from(`${process.env.SPOTIFY_CLIENTID}` + ':' + `${process.env.SPOTIFY_SECRET}`).toString('base64')
    },
    json: true
  }
  request.post(options, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      const options = queryString.stringify({ access_token: body.access_token, refresh_token: body.refresh_token })
      res.redirect(`https://api.spotify.com/v1/me?${options}`)
    }
  })
})

const port = 3030
app.listen(port, () => {
  console.log(`Spotmefy app listening on port ${port}`)
})