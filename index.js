const { App } = require('@slack/bolt');

const secrets = require('./secrets');

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
app.use('/my/path', slackEvents.requestListener());

// Example: If you're using a body parser, always put it after the event adapter in the middleware stack
app.use(bodyParser.json());

// Initialize a server for the express app - you can skip this and the rest if you prefer to use app.listen()
const server = createServer(app);
const io = require('socket.io')(server);
io.on('connection', () => { console.log('connection') });
server.listen(port, () => {
  // Log a message when the server is ready
  console.log(`Listening for events on ${server.address().port}`);
});

// const app = new App({
//   signingSecret: secrets.SLACK_SIGNING_SECRET,
//   token: secrets.SLACK_BOT_TOKEN,
// });

// app.event('message', () => {
//   console.log(...args);
// });

// (async () => {
//   // Start the app
//   await app.start(process.env.PORT || 3000);

//   console.log('⚡️ BusyBotty on the job!');
// })();