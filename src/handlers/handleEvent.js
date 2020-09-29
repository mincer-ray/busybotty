const sendMessage = require('../actions/sendMessage');
const translateUser = require('../util/translateUser');

const handleEvent = (event) => {
  if (event.text && event.text.startsWith('<@U01BF0S1YAH>')) {
    sendMessage(event.channel, `I hear you ${translateUser(event.user)}`);
  }
};

module.exports = handleEvent;
