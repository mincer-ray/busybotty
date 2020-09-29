const axios = require('axios');
const cache = require('memory-cache');

const getUserList = () => axios.get('https://slack.com/api/users.list',
  {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
    },
  })
  .then((response) => {
    const niceData = {};
    response.data.members.forEach((user) => { niceData[user.id] = user.profile.display_name; });
    console.log(niceData);
    cache.put('users', niceData);
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = getUserList;
