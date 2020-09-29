const commands = [
  'ping',
  'salute',
]

const isValidCommand = (command) => {
  return commands.includes(command);
}

const parseCommand = (event) => {
  let command = null;
  const text = event.text;
  const botName = '<@U01BF0S1YAH>';
  const args = event.text.split(' ');
  
  if (args[0] === botName) {
    command = args[1];
  }

  if (isValidCommand(command)) {
    const commandArgs = args.slice(2);
    return {
      type: command,
      args: commandArgs,
    }
  }

  return null;
}

module.exports = parseCommand;