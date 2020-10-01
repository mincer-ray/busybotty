const sendMessage = require('../actions/sendMessage');

const get = {
  do: (args, event, database) => {
    database.ref(`storage/${process.env.BOT_ENV}/${args[0]}`)
      .once('value')
      .then((snapshot) => {
        console.log(snapshot);
        sendMessage(event.channel, `${snapshot.val()}`);
      });
  },
  help: 'gets your data you set with the SET command',
};

module.exports = get;
