const sendMessage = require('../actions/sendMessage');

const get = {
  do: (args, event, database) => {
    database.ref(`${process.env.BOT_ENV}/storage/${args[0]}`)
      .once('value')
      .then((snapshot) => {
        sendMessage(event.channel, `${snapshot.val()}`);
      });
  },
  help: 'gets your data you set with the SET command',
};

module.exports = get;
