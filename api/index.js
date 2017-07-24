#!/usr/bin/env node

const http = require('http');
const axios = require('axios');
const config = require('./config');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(jsonResponse));
}).listen(process.env.PORT || config.LISTENING_PORT, function () {
  console.log('App listening on port %d in env %s', process.env.PORT || config.LISTENING_PORT, process.env.NODE_ENV);
});

const requestHeaders = {
  'Accept': 'application/vnd.twitchtv.v5+json',
  'Client-ID': config.API_KEY
};

let jsonResponse = {};

function requestTwitch() {
  axios.get('https://api.twitch.tv/kraken/streams/?channel=77452537', {headers: requestHeaders})
    .then(response => response.data)
    .then(data => {
      if (data['_total'] === 0) {
        jsonResponse = {streaming: false}
      } else {
        const stream = data['streams'][0];

        jsonResponse = {
          streaming: true,
          title: stream['channel']['status'].trim(),
          game: stream['game'],
        }
      }
    })
    .catch(error => {
      if (error.response) {
        console.error("Error after receive response:");
        console.error(error.response.data);
        console.error(error.response.status);
        console.error(error.response.headers);
      } else if (error.request) {
        console.error("Error during request:");
        console.error(error.request);
      } else {
        console.error("Unknown error:", error.message);
      }
    })
}

requestTwitch();
setInterval(requestTwitch, 61 * 1000);
