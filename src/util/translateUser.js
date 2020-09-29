const cache = require('memory-cache');

const translateUser = (id) => cache.get('users')[id];

module.exports = translateUser;
