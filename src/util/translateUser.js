const axios = require('axios');
const cache = require('memory-cache');

const getUserList = () => axios.get('https://slack.com/api/users.list',
  {
    id,
  },
  {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`,
    }
  }
)
.then(function (response) {
  console.log(response.data);
  return response.data;
})
.catch(function (error) {
  console.log(error);
});

module.exports = sendMessage