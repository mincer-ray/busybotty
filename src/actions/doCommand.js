const sendMessage = require('./sendMessage');

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
      database.ref(`storage/${process.env.BOT_ENV}/${command.args[0]}`).set(`${command.args[1]}`);
      sendMessage(event.channel, `storing ${command.args[1]} as ${command.args[0]}`);
      break;
    case 'get':
      database.ref(`storage/${process.env.BOT_ENV}/${command.args[0]}`)
      .once('value')
      .then((snapshot) => {
        console.log(snapshot);
        sendMessage(event.channel, `${snapshot.val()}`)
      });
      break;
    default:
      sendMessage(event.channel, `command ${command.type} is somehow valid and also not?`);
  }
};

module.exports = doCommand;
