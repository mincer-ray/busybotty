const sendMessage = require('./sendMessage');
const commands = require('../commands');

const doCommand = (command, event, database) => {
  if (commands[command.type]) {
    commands[command.type].do(command.args, event, database);
  } else if (command.type === 'help') {
    const types = Object.keys(commands);
    const helpSpam = types.map((type) => {
      const cmd = commands[type];
      return `${type}: ${cmd.help}`;
    });
    sendMessage(event.channel, helpSpam.join('\n'));
  } else {
    sendMessage(event.channel, `command ${command.type} is somehow valid and also not?`);
  }
};

module.exports = doCommand;
