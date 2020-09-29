const axios = require('axios');
const cache = require('memory-cache');

const getChannelList = () => new Promise((resolve, reject) => {
  axios.get('https://slack.com/api/conversations.list',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
      },
    })
    .then((response) => {
      const niceData = {};
      response.data.channels.forEach((channel) => { niceData[channel.id] = channel.name; });
      cache.put('channels', niceData);
      resolve();
    })
    .catch((error) => {
      reject(error);
    });
});

module.exports = getChannelList;
