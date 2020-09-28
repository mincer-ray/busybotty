const { App } = require('@slack/bolt');
const WebSocket = require('ws');

const secrets = require('./secrets');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});

const app = new App({
  signingSecret: secrets.SLACK_SIGNING_SECRET,
  token: secrets.SLACK_BOT_TOKEN,
});

app.event('message', () => {
  console.log(...args);
});

(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ BusyBotty on the job!');
})();