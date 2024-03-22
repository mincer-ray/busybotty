const fs = require('fs');

// Do secrets for dev mode
if (process.env.BOT_ENV === 'DEVELOPMENT') {
  console.log('Loading secrets');
  // eslint-disable-next-line
  const secrets = require('./secrets-local');
  process.env.SLACK_APP_TOKEN = secrets.SLACK_APP_TOKEN;
  process.env.SLACK_SIGNING_SECRET = secrets.SLACK_SIGNING_SECRET;
  process.env.SLACK_BOT_TOKEN = secrets.SLACK_BOT_TOKEN;
  process.env.DB_URL = secrets.DB_URL;
  process.env.GOOGLE = JSON.stringify(secrets.GOOGLE);
  process.env.LOCAL_DEV_TOKEN = secrets.LOCAL_DEV_TOKEN;
  process.env.LOCAL_DEV_URL = secrets.LOCAL_DEV_URL;
}

// write json file for piiiicky google
fs.writeFileSync('./service-account.json', process.env.GOOGLE);
process.env.GOOGLE_APPLICATION_CREDENTIALS = './service-account.json';

// require junk
const { createServer } = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const { createEventAdapter } = require('@slack/events-api');
const { SocketModeClient } = require('@slack/socket-mode');
const firebaseAdmin = require('firebase-admin');
const cache = require('memory-cache');

// require our cool stuff (not junk)
const handleEvent = require('./src/handlers/handleEvent');
const testAuth = require('./src/util/testAuth');
const getUserList = require('./src/util/getUserList');
const getChannelList = require('./src/util/getChannelList');

const port = process.env.PORT || 3000;

// Init firebase service account
const firebaseConfig = {
  databaseURL: process.env.DB_URL,
};
firebaseAdmin.initializeApp(firebaseConfig);

// DB test code
const database = firebaseAdmin.database();
database.ref(`${process.env.BOT_ENV}/ping`).set(new Date(Date.now()).toString());

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
  handleEvent(event, database);
  const channelName = cache.get('channels')[event.channel];
  console.log(`Received a message event: user ${event.user} in channel ${channelName} says ${event.text}`);
});

// always put bodyParser after the slackEvents.requestListener in the middleware stack
// docs say if you dont do the right order everything breaks
app.use(bodyParser.json());

// Init server
const server = createServer(app);

// Init data into memory so we don't have to do this all the time
Promise.all([
  testAuth(),
  getUserList(),
  getChannelList(),
]).then(() => {
  if (process.env.BOT_ENV === 'PRODUCTION') {
    server.listen(port, () => {
      // Log a message when the server is ready
      console.log(`Listening for events on ${server.address().port}`);
    });
  } else {
    // If we are in dev we don't bother starting the server
    // Instead we use socket mode
    const appToken = process.env.SLACK_APP_TOKEN;
    const socketModeClient = new SocketModeClient({ appToken });

    socketModeClient.on('message', async ({ event, ack }) => {
      ack();
      handleEvent(event, database);
    });

    (async () => {
      await socketModeClient.start();
    })();
  }
});
