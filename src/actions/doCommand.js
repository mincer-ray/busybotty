const sendMessage = require('./sendMessage');

const doCommand = (command, event) => {
  switch (command.type) {
    case 'ping':
      sendMessage(event.channel, 'whaddup');
      break;
    case 'salute':
      sendMessage(event.channel, 'o7');
      break;
    default:
      sendMessage(event.channel, `command ${command.type} is somehow valid and also not?`);
  }
}

module.exports = doCommand;