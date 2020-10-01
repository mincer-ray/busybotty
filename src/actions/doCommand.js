const sendMessage = require('./sendMessage');
const commands = require('../commands');

const doCommand = (command, event, database) => {
  switch (command.type) {
    case 'ping':
      sendMessage(event.channel, 'whaddup');
      break;
    case 'salute':
      sendMessage(event.channel, 'o7');
      break;
    case 'mode':
      sendMessage(event.channel, `running in ${process.env.BOT_ENV} mode`);
      break;
    case 'synctime':
      database.ref(`ping/${process.env.BOT_ENV}`).set(new Date(Date.now()).toString());
      sendMessage(event.channel, 'syncing db ping time');
      break;
    case 'set':
    case 'get':
      commands[command.type].do(command.args, event, database);
      break;
    default:
      sendMessage(event.channel, `command ${command.type} is somehow valid and also not?`);
  }
};

module.exports = doCommand;
