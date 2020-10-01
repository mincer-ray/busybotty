const sendMessage = require('../actions/sendMessage');

const set = {
  do: (args, event, database) => {
    const key = args[0];
    const dataArgs = args.slice(1);
    database.ref(`storage/${process.env.BOT_ENV}/${key}`).set(`${dataArgs.join(' ')}`);
    sendMessage(event.channel, `storing ${dataArgs.join(' ')} as ${key}`);
  },
  help: 'sets data to firebase for retrieval with the GET command',
}

module.exports = set;