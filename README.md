# BusyBotty
All-purpose extendable slack bot with a focus on easy of developer use.

## Requirements to Run
You need `secrets-local.json` in the root folder. I can give you this or you can create your own bot with a new firebase account and slack api key set.

## Local Dev
Once you have the secrets json running is as simple as:
`npm install` && `npm run dev`

While running in `DEVELOPMENT` mode, BusyBotty will only work in the #busybotty-dev channel.
While running in `PRODUCTION` mode, BustBotty will ignore the #busybotty-dev channel.

## Adding commands
To add a command you can just clone the `__blank.js` file in `src/commands`. Use the `do` function for your event logic and the `help` key to describe the feature for the help command. Be sure to add your command to the `index.js` file in `src/commands` or else it won't get picked up.

### Important
Whatever the key is set to in `index.js` is what the command will be recognized as in slack.