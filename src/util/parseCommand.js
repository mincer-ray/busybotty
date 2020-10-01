const cache = require('memory-cache');
const commands = require('../commands');

const isValidCommand = (command) => {
  const types = Object.keys(commands);
  types.push('help');
  return types.includes(command);
};

const parseCommand = (event) => {
  let command = null;
  const { text } = event;
  const botName = `<@${cache.get('botname')}>`;
  const args = text.split(' ');
  const [first, second] = args;

  if (first === botName) {
    command = second;
  }

  if (isValidCommand(command)) {
    const commandArgs = args.slice(2);
    return {
      type: command,
      args: commandArgs,
    };
  }

  return null;
};

module.exports = parseCommand;
