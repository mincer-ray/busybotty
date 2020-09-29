const sendMessage = require('../actions/sendMessage');

const handleEvent = (event) => {
  if (event.text && event.text.startsWith('<@U01BF0S1YAH>')) {
    sendMessage(event.channel, `I hear you ${event.user}`);
  }
}

module.exports = handleEvent;