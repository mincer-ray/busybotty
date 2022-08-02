const sendMessage = require('../actions/sendMessage');

const members = [
  'pete',
  'george',
  'jose',
  'gui',
  'vanessa',
  'alla',
  'adam',
  'megan',
];

const standup = {
  do: (args, event) => {
    const rando = Math.floor(Math.random() * 8);
    const picked = members[rando];

    sendMessage(event.channel, `today ${picked} will run standup!`);
  },
  help: 'randomly pick someone to run standup',
};

module.exports = standup;
