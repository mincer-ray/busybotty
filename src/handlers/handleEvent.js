const cache = require('memory-cache');
const doCommand = require('../actions/doCommand');
const respondEmotionally = require('../actions/respondEmotionally');
const parseCommand = require('../util/parseCommand');

const handleEvent = (event, database) => {
  if (event.text && event.text.startsWith(`<@${cache.get('botname')}>`)) {
    const isDevChannel = cache.get('channels')[event.channel] === 'busybotty-dev';
    if (process.env.BOT_ENV === 'PRODUCTION' && isDevChannel) {
      return;
    }
    if (process.env.BOT_ENV === 'DEVELOPMENT' && !isDevChannel) {
      return;
    }

    console.log('event heard: ', event);

    const command = parseCommand(event);
    if (command) {
      doCommand(command, event, database);
    } else {
      respondEmotionally(event);
    }
  }
};

module.exports = handleEvent;
