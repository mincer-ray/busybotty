const sendMessage = require('../actions/sendMessage');
const doCommand = require('../actions/doCommand');
const translateUser = require('../util/translateUser');
const parseCommand = require('../util/parseCommand');
const cache = require('memory-cache');

const handleEvent = (event) => {
  if (event.text && event.text.startsWith('<@U01BF0S1YAH>')) {
    const isDevChannel = cache.get('channels')[event.channel] === 'busybotty-dev';
    if (process.env.BOT_ENV === 'PRODUCTION' && isDevChannel) {
      return;
    }
    if (process.env.BOT_ENV === 'DEVELOPMENT' && !isDevChannel) {
      return;
    }

    const command = parseCommand(event);
    if (command) {
      doCommand(command, event);
    } else {
      sendMessage(event.channel, `I hear you ${translateUser(event.user)}`);
    }
  }
};

module.exports = handleEvent;
