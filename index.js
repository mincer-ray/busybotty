// Do secrets for dev mode
if (process.env.BOT_ENV !== 'PRODUCTION') {
  console.log('DOIND SECRET');
  // eslint-disable-next-line
  const secrets = require('./secrets');
  process.env.SLACK_SIGNING_SECRET = secrets.SLACK_SIGNING_SECRET;
  process.env.SLACK_BOT_TOKEN = secrets.SLACK_BOT_TOKEN;
}

// require junk
const { createServer } = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const { createEventAdapter } = require('@slack/events-api');
const ioServer = require('socket.io');
const ioClient = require('socket.io-client');

// require our cool stuff (not junk)
const handleEvent = require('./src/handlers/handleEvent');
const getUserList = require('./src/util/getUserList');
const getChannelList = require('./src/util/getChannelList');

const port = process.env.PORT || 3000;

// Init the slack events api listener
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackEvents = createEventAdapter(slackSigningSecret);

// Create an express application
const app = express();

// Plug the adapter in as a middleware
// Slack is using this route to HTTP POST events
app.use('/bot/listen', slackEvents.requestListener());

// event type that slackEvents.requestListener is waiting for
// on the '/bot/listen' route
slackEvents.on('message', (event) => {
  handleEvent(event);
  console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
});

// always put bodyParser after the slackEvents.requestListener in the middleware stack
// docs say if you dont do the right order everything breaks
app.use(bodyParser.json());

// Init socket.io server
const server = createServer(app);
const io = ioServer(server);

// Init data into memory so we don't have to do this all the time
Promise.all([getUserList(), getChannelList()]).then(() => {
  // Slack only allows you to add ONE SINGLE URL for a bot to get events
  // This is a TURBO BUMMER if you want to do local dev
  // We are doing a workaround here where the production app forwards events
  if (process.env.BOT_ENV === 'PRODUCTION') {
    // If this is the production app we want to start up the server
    // AND we want to set up socket.io to send events it recieves
    // to the client for local dev
    io.on('connection', () => {
      console.log('new connection');
      io.send('!!location confirmed, sending supplies!!');
    });
    slackEvents.on('message', (event) => {
      io.send(event);
    });
    server.listen(port, () => {
      // Log a message when the server is ready
      console.log(`Listening for events on ${server.address().port}`);
    });
  } else {
    // If we are in dev we don't bother starting the server
    // Instead we listen to the live version for events with
    // the socket.io client
    // Init socket.io client
    const socket = ioClient('https://busybotty.herokuapp.com');

    socket.on('connect', () => {
      console.log('*hacker voice* I\'m in');
    });
    socket.on('message', (event) => {
      handleEvent(event);
      console.log(event);
    });
  }
})
