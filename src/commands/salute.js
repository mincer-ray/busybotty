const sendMessage = require('../actions/sendMessage');

const salute = {
  do: (args, event, database) => {
    sendMessage(event.channel, 'o7');
  },
  help: 'gives a salute',
}

module.exports = salute;