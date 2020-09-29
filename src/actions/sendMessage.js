const axios = require('axios');

const sendMessage = (channel, text) => axios.post('https://slack.com/api/chat.postMessage',
  {
    channel,
    text,
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
})
.catch(function (error) {
  console.log(error);
});

module.exports = sendMessage