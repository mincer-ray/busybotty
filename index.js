let secrets = null;
if (process.env.BOT_ENV === 'PRODUCTION') {
  secrets = {
    SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
    SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
  };
} else {
  // eslint-disable-next-line
  secrets = require('./secrets');
}

const { createServer } = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const { createEventAdapter } = require('@slack/events-api');

const slackSigningSecret = secrets.SLACK_SIGNING_SECRET;
const port = process.env.PORT || 3000;
const slackEvents = createEventAdapter(slackSigningSecret);

// Create an express application
const app = express();

// Plug the adapter in as a middleware
app.use('/bot/listen', slackEvents.requestListener());

slackEvents.on('message', (event) => {
  console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
});

// always put bodyParser it after the event adapter in the middleware stack
app.use(bodyParser.json());

const server = createServer(app);
const io = require('socket.io')(server);

const client = require('socket.io-client');

const socket = client('https://busybotty.herokuapp.com');

// if (true) {
if (process.env.BOT_ENV === 'PRODUCTION') {
  io.on('connection', () => {
    console.log('connection');
    io.send('lets do this');
  });
  slackEvents.on('message', (event) => {
    io.send(event);
  });
  server.listen(port, () => {
    // Log a message when the server is ready
    console.log(`Listening for events on ${server.address().port}`);
  });
} else {
  socket.on('connect', () => {
    console.log('we in boys');
  });
  socket.on('message', (data) => {
    console.log(data);
  });
}
