const Sentiment = require('sentiment');
const sendMessage = require('./sendMessage');

const feelingsMatrix = {
  positive: [
    '٩(◕‿◕｡)۶',
    '\\(★ω★)/',
    '(๑˃ᴗ˂)ﻭ',
    'ヽ(♡‿♡)ノ',
    '(◕‿◕)♡',
  ],
  negative: [
    '(⌒_⌒;)',
    '(￣ヘ￣)',
    '(×﹏×)',
    '｡ﾟ･ (>﹏<) ･ﾟ｡',
    '(╬ Ò﹏Ó)',
  ],
  neutral: [
    'ヽ(ー_ー )ノ',
    '┬┴┬┴┤(･_├┬┴┬┴',
    '┐(￣ヘ￣)┌',
    '(・_・;)',
    'ლ(ಠ_ಠ ლ)',
  ],
}

const randomFeel = (emotion) => {
  const feelArray = feelingsMatrix[emotion];
  return feelArray[Math.floor(Math.random() * feelArray.length)]
}

const respondEmotionally = (event) => {
  const sentiment = new Sentiment();
  const result = sentiment.analyze(event.text);
  let emotion = 'neutral';
  
  if (result.comparative >= 1) {
    emotion = 'positive';
  } else if (result.comparative <= -1) { 
    emotion = 'negative';
  }

  sendMessage(event.channel, randomFeel(emotion));
}

module.exports = respondEmotionally;