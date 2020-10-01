const sendMessage = require('../actions/sendMessage');

const leaderboard = {
  do: (args, event, database) => {
    database.ref(`${process.env.BOT_ENV}/points`)
      .once('value')
      .then((snapshot) => {
        const allPoints = snapshot.val();
        const usersByPoints = {};
        const pointValues = new Set();

        Object.keys(allPoints).forEach((user) => {
          const pointTotal = allPoints[user];
          pointValues.add(pointTotal);
          if (usersByPoints[pointTotal]) {
            usersByPoints[pointTotal].push(user);
          } else {
            usersByPoints[pointTotal] = [user];
          }
        });

        const sortedPoints = Array.from(pointValues).sort((a, b) => b - a).slice(0, 10);
        const topList = sortedPoints.map((pointKey, index) => `${index + 1}: ${usersByPoints[pointKey].join(', ')}`);

        sendMessage(event.channel, `${topList.join('\n')}`);
      });
  },
  help: 'give someone a point to be nice',
};

module.exports = leaderboard;
