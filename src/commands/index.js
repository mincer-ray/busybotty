const get = require('./get');
const set = require('./set');
const mode = require('./mode');
const salute = require('./salute');
const standup = require('./standup');
const givepoint = require('./givepoint');
const losepoint = require('./losepoint');
const leaderboard = require('./leaderboard');

module.exports = {
  get,
  set,
  mode,
  salute,
  '++': givepoint,
  '--': losepoint,
  leaderboard,
  standup,
};
