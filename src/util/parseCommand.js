const commands = require('../commands');

const isValidCommand = (command) => {
  const types = Object.keys(commands);
  types.push('help');
  return types.includes(command);
};

const parseCommand = (event) => {
  let command = null;
  const { text } = event;
  const botName = '<@U01BF0S1YAH>';
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
